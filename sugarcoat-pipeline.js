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
const defaultOutputDir = 'output';
const defaultSamples = 3;

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
  help: `The dwell time in seconds. Default: ${defaultCrawlSecs} seconds`,
  type: 'int',
  default: defaultCrawlSecs,
});
parser.add_argument('-d', '--debug', {
  help: `Print debugging information`,
  action: 'store_true',
  default: false,
});
parser.add_argument('-l', '--filter-lists', {
  help: 'Filter lists to use',
  required: true,
  nargs: '+',
});
parser.add_argument('-p', '--policy', {
  help: `Path to policy file. Default: ${defaultPolicyJson}`,
  default: defaultPolicyJson,
});
parser.add_argument('-o', '--output', {
  help: `Path to output directory. All generated files go here. Default: ${defaultOutputDir}`,
  default: defaultOutputDir,
});
parser.add_argument('-g', '--graphs-dir-override', {
  help: 'Path to graphs directory. If set, skips PageGraph generation',
  default: null,
});
parser.add_argument('-k', '--keep', {
  help: `Do not erase intermediary files generated in ${defaultOutputDir} for sugarcoat`,
  action: 'store_true',
  default: false,
});
parser.add_argument('-s', '--samples', {
  help: `Number of times a URL is attempted to be crawled. Default: ${defaultSamples}`,
  type: 'int',
  default: defaultSamples,
});

const args = parser.parse_args();
const binary = args.binary;
const crawlUrl = args.url;
const policyJsonFile = args.policy;
const filterlists = args.filter_lists;
const debug = args.debug;
const secs = args.secs;
const keep = args.keep;
const samples = args.samples;
const graphsDirOverride = args.graphs_dir_override ? path.resolve(args.graphs_dir_override) : null;
// Directory paths
const outputDir = path.resolve(args.output);
const graphsDir = path.join(outputDir, '/graphs');
const scriptsDir = path.join(outputDir, '/scripts');
const sugarcoatedScriptsDir = path.join(outputDir, '/sugarcoat_scripts');
// Generated SugarCoat files paths
const massagedConfigJsonFile = path.join(outputDir, '/config.json');
const traceFile = path.join(outputDir, '/sugarcoat_trace.json');
const reportFile = path.join(outputDir, '/sugarcoat_report.html');
const rulesFile = path.join(outputDir, '/sugarcoat_rules.txt');
const resourcesFile = path.join(outputDir, '/sugarcoat_resources.json');

let scriptNameToUrl = {}; // Used to get 'patterns' URL for each script
let urlsSeen = new Set(); // We don't want to store duplicate scripts

/**
 * Helper functions
 */
const checkFileExistence = async file => {
  return fs.access(file, constants.F_OK);
};
const readGraphFiles = async graphsDir => {
  const files = await fs.readdir(graphsDir);
  return files.filter(file => path.extname(file).toLowerCase() === '.graphml');
};

/**
 * Pipeline functions
 */

// Always clean up at start
const preCheckAndClean = async () => {
  // Check if policy + filterlist files exist
  await Promise.all(
    [...filterlists, policyJsonFile].map(async file => checkFileExistence(file))
  ).catch(err => {
    const errMsg = err.path + ' not found!';
    throw new Error(errMsg);
  });
  debug && console.debug('Cleaning up generated directories...');
  // clean sugarcoated_scripts, scripts, config.json, report, resources, rules, trace
  await Promise.all([
    ...[traceFile, reportFile, resourcesFile, massagedConfigJsonFile, rulesFile].map(
      async file => {
        fs.unlink(file).catch(_ => {
          return;
        });
      }
    ),
    ...[sugarcoatedScriptsDir, scriptsDir].map(async dir =>
      fs.rmdir(dir, { force: true, recursive: true })
    ),
  ]);
  // and if not graphs dir override then graphs too
  if (graphsDirOverride !== graphsDir) {
    await fs.rmdir(graphsDir, { force: true, recursive: true });
  }
  // Check if outputDir exists. If yes, then leave it be. If no, create it.
  await checkFileExistence(outputDir).catch(_ => fs.mkdir(outputDir, { recursive: true }));
  // Create scripts and graphs dir
  fs.mkdir(scriptsDir, { recursive: true });
  if (!graphsDirOverride) fs.mkdir(graphsDir, { recursive: true });
};

const generateGraphs = async (retriesLeft, graphsDir, readLocal) => {
  let errorMsg;
  if (readLocal || retriesLeft == 0) {
    // Graph files should exist at this point. If not, then error.
    const graphFiles = await readGraphFiles(graphsDir);
    if (graphFiles.length == 0) {
      errorMsg = 'No files found in ' + graphsDir + ' that end with .graphml';
      throw new Error(errorMsg);
    }
    debug && console.debug(graphFiles);
    debug && console.debug('Pagegraph-crawl done!');
    return graphFiles;
  }

  if (!binary || !crawlUrl) {
    errorMsg =
      'Must provide path to PageGraph-enabled browser binary (via --binary)' +
      ' and url (via --url) in order to record graphs';
    throw new Error(errorMsg);
  }
  const cmd =
    'node node_modules/pagegraph-crawl/built/run.js  --binary "' +
    binary +
    '" --secs ' +
    secs +
    ' --shields down' +
    ' --url ' +
    crawlUrl +
    ' --output ' +
    graphsDir;
  debug && console.debug('Running pagegraph-crawl with command: ' + cmd);
  await execAsync(cmd);
  const newRetriesLeft = retriesLeft - 1;
  return generateGraphs(newRetriesLeft, graphsDir, readLocal);
};

const getSources = async (graphFiles, graphsDir) => {
  debug && console.debug('Running pagegraph-cli...');
  // For each graph file in graphs (can be run independently)
  await Promise.all(
    graphFiles.map(async graphFile => {
      const pagegraphBinary = path.resolve(
        process.platform === 'win32' ? 'pagegraph-cli.exe' : 'pagegraph-cli'
      );
      const pagegraphBinaryArgs = ['-f', path.join(graphsDir, graphFile)];
      const options = { windowsHide: true };
      await Promise.all(
        filterlists.map(async filterlist => {
          const adblockArgs = [...pagegraphBinaryArgs, 'adblock_rules', '-l', filterlist];
          let cmdOutput;
          try {
            cmdOutput = await execFileAsync(pagegraphBinary, adblockArgs, options);
          } catch (err) {
            return; // if there is a weirdly-shaped domain, don't error out
          }
          let jsonOutput = JSON.parse(cmdOutput.stdout);
          const edges = jsonOutput
            .flatMap(edge =>
              edge.requests.map(request => {
                if (request.blocking_filter && request.exception_filter) {
                  return request.edge_id;
                }
              })
            )
            .filter(x => x); // to filter out nulls
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
                debug &&
                  console.log(
                    'requests ' +
                      jsonOutput +
                      ' for edge ' +
                      edge +
                      ' for graph ' +
                      graphFile +
                      ' for list ' +
                      filterlist
                  );
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
              if (urlsSeen.has(origUrl)) {
                return;
              }
              const parsedUrl = new URL(origUrl);
              let scriptName = path.basename(parsedUrl.pathname, '.js');
              let source = jsonOutput.source;
              const scriptFilePath = path.join(scriptsDir, scriptName + '.js');
              let unusedScriptFilename = await unusedFilename(scriptFilePath, {
                incrementer: unusedFilename.separatorIncrementer('_'),
              });
              scriptNameToUrl[path.basename(unusedScriptFilename, '.js')] = origUrl;
              fs.writeFile(unusedScriptFilename, source, { recursive: true });
              urlsSeen.add(origUrl);
            })
          );
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
  config.code = scriptsDir;
  config.trace = traceFile;
  config.report = reportFile;
  const bundle = {
    rules: rulesFile,
    resources: resourcesFile,
  };
  config.bundle = bundle;
  config.targets = {};
  delete config.policy;
  const files = await fs.readdir(scriptsDir);
  files.forEach(file => {
    const targetKey = path.basename(file, '.js');
    let newObj = {};
    newObj.patterns = [scriptNameToUrl[targetKey]];
    newObj.policy = policy;
    config.targets[targetKey] = newObj;
  });
  debug && console.debug('Writing massaged config.json... ');
  await fs.writeFile(massagedConfigJsonFile, JSON.stringify(config), { recursive: true });
};

const runSugarCoat = async () => {
  const cmd =
    'node ' +
    path.join('node_modules', 'sugarcoat', 'cli.js') +
    ' --config ' +
    massagedConfigJsonFile +
    ' --ingest --report --rewrite --bundle';
  debug && console.debug('Running sugarcoat with command: ' + cmd);
  await execAsync(cmd);
  debug && console.debug('Sugarcoat command finished running!');
};

const postCleanup = async () => {
  // Move generated scripts out of output/ and into sugarcoatedScriptsDir
  const sugarcoatedScripts = await globby(path.join(scriptsDir, '/sugarcoat-*.js'));
  await fs.mkdir(sugarcoatedScriptsDir, { recursive: true });
  await Promise.all(
    sugarcoatedScripts.map(async sugarcoatedScript => {
      const scriptName = path.basename(sugarcoatedScript);
      fs.rename(sugarcoatedScript, path.join(sugarcoatedScriptsDir, scriptName));
    })
  );
  // Keep only essential files: rules.txt and sugarcoatedScriptsDir unless --keep
  if (!keep) {
    await fs.rmdir(scriptsDir, { recursive: true, force: true });
    const filesToDelete = await globby(path.join(outputDir, '/**/*'), {
      ignore: [path.join(outputDir, '/sugarcoat_rules.txt'), sugarcoatedScriptsDir],
    });
    await Promise.all(
      filesToDelete.map(async file => {
        fs.unlink(file);
      })
    );
    if (!graphsDirOverride) fs.rmdir(graphsDir, { recursive: true, force: true });
  }
};

/**
 * Run pipeline
 */
(async () => {
  await preCheckAndClean();
  const graphsDirToUse = graphsDirOverride ? graphsDirOverride : graphsDir;
  const readLocal = !!graphsDirOverride;
  const graphFiles = await generateGraphs(samples, graphsDirToUse, readLocal);
  await getSources(graphFiles, graphsDirToUse);
  await massageConfig(graphsDirToUse);
  await runSugarCoat();
  await postCleanup();
})().catch(err => {
  console.error(err.message);
  if (!keep) {
    fs.rmdir(outputDir, { force: true, recursive: true });
  }
});
