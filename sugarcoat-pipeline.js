#!/usr/bin/env node

import { exec } from 'child_process';
import { promises as fs, constants as constants } from 'fs';
import argparseLib from 'argparse';
import * as path from 'path';
import { promisify } from 'util';
import globby from 'globby';
import unusedFilename from 'unused-filename';

const execAsync = promisify(exec);
const defaultCrawlSecs = 30;
const defaultPolicyJson = 'policy.json';
const genDir = path.resolve('gen');
const graphsDir = genDir + '/graphs';
const outputDir = genDir + '/output';
const sugarcoatedScriptsDir = genDir + '/sugarcoated_scripts';
const massagedConfigJson = genDir + '/config.json';
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
const url = args.url;
const policyJsonFile = args.policy;
const filterlist = args.filter_list;
const debug = args.debug;
const secs = args.secs;
const keep = args.keep;
const graphsDirOverride = args.graphs_dir_override ? path.resolve(args.graphs_dir_override) : null;
let scriptNameToUrl = {};

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
  if (!binary || !url) {
    console.error(
      'ERROR: Must provide path to PageGraph-enabled browser binary (via --binary)' +
        ' and url (via --url) in order to record graphs'
    );
    process.exit(1);
  }
  const retryFn = err => {
    console.err(err);
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
    url +
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
      const pagegraphCmdBase = './pagegraph-cli' + ' -f ' + graphs + '/' + graphFile;
      // Get edges via adblock_rules
      let pagegraphCmd = pagegraphCmdBase + ' adblock_rules' + ' -l ' + filterlist;
      debug && console.debug(pagegraphCmd);
      let cmdOutput = await execAsync(pagegraphCmd);
      let jsonOutput = JSON.parse(cmdOutput.stdout);
      const edges = jsonOutput.flatMap(edge =>
        edge.requests.map(requestAndEdgeTuple => requestAndEdgeTuple[1])
      );
      // For each edge that corresponds to script, get downstream requests
      const requests = (
        await Promise.all(
          edges.flatMap(async edge => {
            pagegraphCmd = pagegraphCmdBase + ' downstream_requests ' + edge + ' --requests';
            debug && console.debug(pagegraphCmd);
            cmdOutput = await execAsync(pagegraphCmd);
            jsonOutput = JSON.parse(cmdOutput.stdout);
            return jsonOutput;
          })
        )
      ).flat();
      const uniqueRequests = [...new Set(requests)];
      // For each request id, get the source and put into outputDir
      await Promise.all(
        uniqueRequests.map(async requestId => {
          pagegraphCmd = pagegraphCmdBase + ' request_id_info ' + requestId;
          debug && console.debug(pagegraphCmd);
          try {
            cmdOutput = await execAsync(pagegraphCmd);
          } catch (err) {
            return; // if request ID is not related to script, the rust binary returns error code
          }
          jsonOutput = JSON.parse(cmdOutput.stdout);
          let url = jsonOutput.url;
          let scriptName = path.posix.basename(url, '.js');
          let source = jsonOutput.source;
          const scriptFilePath = outputDir + '/' + scriptName + '.js';
          let unusedScriptFilename = await unusedFilename(scriptFilePath, {
            incrementer: unusedFilename.separatorIncrementer('-'),
          });
          scriptNameToUrl[path.posix.basename(unusedScriptFilename, '.js')] = url;
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
  config.graphs = [graphs + '/*.graphml'];
  config.code = outputDir;
  config.trace = genDir + '/trace.json';
  config.report = genDir + '/report.html';
  const bundle = {
    rules: genDir + '/rules.txt',
    resources: genDir + '/resources.json',
  };
  config.bundle = bundle;
  config.targets = {};
  delete config.policy;
  const files = await fs.readdir(outputDir);
  files.forEach(file => {
    const targetKey = file.split('.js')[0];
    let newObj = {};
    newObj.patterns = [scriptNameToUrl[targetKey]];
    newObj.policy = policy;
    config.targets[targetKey] = newObj;
  });
  debug && console.debug('Writing massaged config.json...');
  await fs.writeFile(massagedConfigJson, JSON.stringify(config), { recursive: true });
};

const runSugarCoat = async () => {
  const cmd =
    'node node_modules/sugarcoat/cli.js --config ' +
    massagedConfigJson +
    ' --ingest --report --rewrite --bundle';
  debug && console.debug('Running sugarcoat with command: ' + cmd);
  await execAsync(cmd);
  debug && console.debug('Sugarcoat command finished running!');
};

const postCleanup = async () => {
  // Move generated scripts out of output/ and into sugarcoatedScriptsDir
  const sugarcoatedScripts = await globby(outputDir + '/sugarcoat-*.js');
  await fs.mkdir(sugarcoatedScriptsDir);
  await Promise.all(
    sugarcoatedScripts.map(async sugarcoatedScript => {
      const scriptName = path.posix.basename(sugarcoatedScript);
      fs.rename(sugarcoatedScript, sugarcoatedScriptsDir + '/' + scriptName);
    })
  );
  // Keep only essential files: rules.txt and sugarcoatedScriptsDir unless --keep
  if (!keep) {
    const filesToDelete = await globby(genDir + '/**/*', {
      ignore: [genDir + '/rules.txt', sugarcoatedScriptsDir],
    });
    await Promise.all(
      filesToDelete.map(async file => {
        fs.unlink(file, { force: true });
      })
    );
    fs.rmdir(outputDir);
    if (!graphsDirOverride) fs.rmdir(graphsDir);
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
