#!/usr/bin/env node

import { exec, execFile } from 'child_process';
import { promises as fs, constants } from 'fs';
import argparseLib from 'argparse';
import * as path from 'path';
import { promisify } from 'util';
import globby from 'globby';
import unusedFilename from 'unused-filename';

const execAsync = promisify(exec);
const execFileAsync = promisify(execFile);
const defaultCrawlSecs = 30;
const defaultPolicyJson = 'policy.json';
const genDir = path.resolve('gen');
const graphsDir = path.join(genDir, '/graphs');
const outputDir = path.join(genDir, '/output');
const sugarcoatedScriptsDir = path.join(genDir, '/sugarcoated_scripts');
const massagedConfigJson = path.join(genDir, '/config.json');
const maxRetries = 3;

// Parser options
const parser = new argparseLib.ArgumentParser({
  add_help: true,
  description: 'SugarCoat pipeline CLI',
});
parser.add_argument('-b', '--binary', {
  help: 'Path to the PageGraph-enabled build of Brave',
});
parser.add_argument('-u', '--url', {
  help: 'The URL to record.',
});
parser.add_argument('-t', '--secs', {
  help: `The dwell time in seconds. Defaults: ${defaultCrawlSecs} seconds`,
  type: 'int',
  default: defaultCrawlSecs,
});
parser.add_argument('-d', '--debug', {
  help: `Print debugging information`,
  action: 'store_true',
  default: false,
});
parser.add_argument('-l', '--filter-list', {
  help: 'Filter list to use',
  required: true,
});
parser.add_argument('-p', '--policy', {
  help: 'Path to policy file. Default: policy.json',
  default: defaultPolicyJson,
});
parser.add_argument('-g', '--graphs-dir-override', {
  help: 'Path to graphs directory. If set, skips PageGraph generation',
});
parser.add_argument('-k', '--keep', {
  help: 'Do not erase intermediary files generated in gen/ for sugarcoat',
  action: 'store_true',
  default: false,
});

const args = parser.parse_args();
const binary = args.binary;
const crawlUrl = args.url;
const policyJsonFile = args.policy;
const filterlist = args.filter_list;
const debug = args.debug;
const secs = args.secs;
const keep = args.keep;
const graphsDirOverride = args.graphs_dir_override ? path.resolve(args.graphs_dir_override) : null;
let scriptNameToUrl = {}; // Used to get 'patterns' URL for each script

// Always clean up at start
const preCleanup = async () => {
  debug && console.debug('Cleaning up generated directories...');
  // Remove generated directory if it exists and create new, or just create new
  await fs
    .mkdir(genDir)
    .catch(_ => fs.rmdir(genDir, { recursive: true }).then(_ => fs.mkdir(genDir)));
  // Check if policy JSON file exists
  await fs.access(policyJsonFile, constants.F_OK).catch(() => {
    console.error('ERROR: ' + policyJsonFile + ' not found!');
    process.exit(1);
  });
  fs.mkdir(outputDir);
  if (!graphsDirOverride) fs.mkdir(graphsDir);
};

const generateGraphs = async retry => {
  if (!binary || !crawlUrl) {
    console.error(
      'ERROR: Must provide path to PageGraph-enabled browser binary (via --binary)' +
        ' and url (via --url) in order to record graphs'
    );
    process.exit(1);
  }
  const retryFn = err => {
    console.error(err);
    const newRetry = retry - 1;
    generateGraphs(newRetry);
  };
  if (retry == 0) {
    console.error(
      'ERROR: Tried generating graphs using pagegraph-crawl ' + maxRetries + 'x but failed!'
    );
    process.exit(1);
  }
  const cmd =
    'node node_modules/pagegraph-crawl/built/run.js --binary "' +
    binary +
    '" --secs ' +
    secs +
    ' --url ' +
    crawlUrl +
    ' --output ' +
    graphsDir;
  debug && console.debug('Running pagegraph-crawl with command: ' + cmd);
  try {
    await execAsync(cmd).catch(err => retryFn(err));
  } catch (err) {
    retryFn(err);
  }
  debug && console.debug('Pagegraph-crawl finished running!');
};

const getSources = async graphs => {
  debug && console.debug('Reading graphs from ' + graphs);
  const files = await fs.readdir(graphs);
  const graphFiles = files.filter(file => path.extname(file).toLowerCase() === '.graphml');
  if (graphFiles.length == 0) {
    console.error('ERROR: No files found in ' + graphs + ' that end with .graphml');
    process.exit(1);
  }
  debug && console.debug('Running pagegraph-cli...');
  // For each graph file in graphs (can be run independently)
  await Promise.all(
    graphFiles.map(async graphFile => {
      const pagegraphBinary = path.resolve(
        process.platform === 'win32' ? 'pagegraph-cli.exe' : 'pagegraph-cli'
      );
      const pagegraphBinaryArgs = ['-f', path.join(graphs, graphFile)];
      const options = { windowsHide: true };
      const adblockArgs = [...pagegraphBinaryArgs, 'adblock_rules', '-l', filterlist];

      let cmdOutput;

      try {
        cmdOutput = await execFileAsync(pagegraphBinary, adblockArgs, options);
      } catch (err) {
        return; // if there is a weirdly-shaped domain, don't error out
      }

      let jsonOutput = JSON.parse(cmdOutput.stdout);
      const edges = jsonOutput.flatMap(edge =>
        edge.requests.map(requestAndEdgeTuple => requestAndEdgeTuple[1])
      );
      // For each edge that corresponds to script, get downstream requests
      const requests = (
        await Promise.all(
          edges.flatMap(async edge => {
            const downstreamRequestsArgs = [
              ...pagegraphBinaryArgs,
              'downstream_requests',
              edge,
              '--requests',
            ];
            cmdOutput = await execFileAsync(pagegraphBinary, downstreamRequestsArgs, options);
            jsonOutput = JSON.parse(cmdOutput.stdout);
            return jsonOutput;
          })
        )
      ).flat();
      const uniqueRequests = [...new Set(requests)];
      // For each request id, get the source and put into outputDir
      await Promise.all(
        uniqueRequests.map(async requestId => {
          const requestIdInfoArgs = [...pagegraphBinaryArgs, 'request_id_info', requestId];
          try {
            cmdOutput = await execFileAsync(pagegraphBinary, requestIdInfoArgs, options);
          } catch (err) {
            return; // if request ID is not related to script, the rust binary returns error code
          }
          jsonOutput = JSON.parse(cmdOutput.stdout);
          const origUrl = jsonOutput.url;
          const parsedUrl = new URL(origUrl);
          let scriptName = path.basename(parsedUrl.pathname, '.js');
          let source = jsonOutput.source;
          const scriptFilePath = path.join(outputDir, scriptName + '.js');
          let unusedScriptFilename = await unusedFilename(scriptFilePath, {
            incrementer: unusedFilename.separatorIncrementer('-'),
          });
          scriptNameToUrl[path.basename(unusedScriptFilename, '.js')] = origUrl;
          fs.writeFile(unusedScriptFilename, source, { recursive: true });
        })
      );
    })
  );
};

const massageConfig = async graphs => {
  debug && console.debug('Creating config.json for sugarcoat...');
  const output = await fs.readFile(policyJsonFile, 'UTF-8');
  let config = JSON.parse(output);
  const policy = config.policy;
  config.graphs = [path.join(graphs, '/*.graphml')];
  config.code = outputDir;
  config.trace = path.join(genDir, '/sugarcoat_trace.json');
  config.report = path.join(genDir, '/sugarcoat_report.html');
  const bundle = {
    rules: path.join(genDir, '/sugarcoat_rules.txt'),
    resources: path.join(genDir, '/sugarcoat_resources.json'),
  };
  config.bundle = bundle;
  config.targets = {};
  delete config.policy;
  const files = await fs.readdir(outputDir);
  files.forEach(file => {
    const targetKey = path.basename(file, '.js');
    let newObj = {};
    newObj.patterns = [scriptNameToUrl[targetKey]];
    newObj.policy = policy;
    config.targets[targetKey] = newObj;
  });
  debug && console.debug('Writing massaged config.json... ');
  debug && console.dir(config, { depth: null });
  await fs.writeFile(massagedConfigJson, JSON.stringify(config), { recursive: true });
};

const runSugarCoat = async () => {
  const cmd =
    'node ' +
    path.join('node_modules', 'sugarcoat', 'cli.js') +
    ' --config ' +
    massagedConfigJson +
    ' --ingest --report --rewrite --bundle';
  debug && console.debug('Running sugarcoat with command: ' + cmd);
  await execAsync(cmd);
  debug && console.debug('Sugarcoat command finished running!');
};

const postCleanup = async () => {
  // Move generated scripts out of output/ and into sugarcoatedScriptsDir
  const sugarcoatedScripts = await globby(path.join(outputDir, '/sugarcoat-*.js'));
  await fs.mkdir(sugarcoatedScriptsDir);
  await Promise.all(
    sugarcoatedScripts.map(async sugarcoatedScript => {
      const scriptName = path.basename(sugarcoatedScript);
      fs.rename(sugarcoatedScript, path.join(sugarcoatedScriptsDir, scriptName));
    })
  );
  // Keep only essential files: rules.txt and sugarcoatedScriptsDir unless --keep
  if (!keep) {
    await fs.rmdir(outputDir, { recursive: true, force: true });
    const filesToDelete = await globby(path.join(genDir, '/**/*'), {
      ignore: [path.join(genDir, '/sugarcoat_rules.txt'), sugarcoatedScriptsDir],
    });
    await Promise.all(
      filesToDelete.map(async file => {
        fs.unlink(file);
      })
    );
    if (!graphsDirOverride) fs.rmdir(graphsDir, { recursive: true, force: true });
  }
};

(async () => {
  try {
    await preCleanup();
    const graphsDirToUse = graphsDirOverride ? graphsDirOverride : graphsDir;
    if (!graphsDirOverride) {
      // Only generate graphs if graphs override not given
      await generateGraphs(maxRetries);
    }
    await getSources(graphsDirToUse);
    await massageConfig(graphsDirToUse);
    await runSugarCoat();
    await postCleanup();
  } catch (err) {
    console.error('ERROR while running sugarcoat-pipeline: ' + err);
  }
})().catch(err => console.error('ERROR: while running sugarcoat-pipeline: ' + err));
