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
const defaultDebugSetting = 'none';
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
  description: 'CLI that implements the SugarCoat pipeline',
});
parser.add_argument('-b', '--binary', {
  required: true,
  help: 'Path to the PageGraph enabled build of Brave.',
});
parser.add_argument('-u', '--url', {
  help: 'The URL to record.',
  required: true,
});
parser.add_argument('-t', '--secs', {
  help: `The dwell time in seconds. Defaults: ${defaultCrawlSecs} sec.`,
  type: 'int',
  default: defaultCrawlSecs,
});
parser.add_argument('--debug', {
  help: `Print debugging information. Default: ${defaultDebugSetting}.`,
  choices: ['none', 'debug'],
  default: defaultDebugSetting,
});
parser.add_argument('-l', '--filter-list', {
  help: 'Filter list to use',
});
parser.add_argument('-p', '--policy', {
  help: 'Path to policy file. Default: policy.json',
  default: defaultPolicyJson,
});
parser.add_argument('-k', '--keep', {
  help: 'Keep intermediary files generated for sugarcoat in gen/',
  action: 'store_true',
  default: false,
});

const debug = debugLevel => debugLevel !== 'none';

const args = parser.parse_args();
const policyJsonFile = args.policy;
const filterlist = args.filter_list;
const debugLevel = args.debug;
const binary = args.binary;
const secs = args.secs;
const url = args.url;
const keep = args.keep;
let scriptNameToUrl = {};

// Always clean up at start
const preCleanup = async () => {
  debug(debugLevel) && console.log('Cleaning up generated directories...');
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
  fs.mkdir(graphsDir);
};

const generateGraphs = async retry => {
  if (retry == 0) {
    console.error(
      'ERROR: Tried generating graphs using pagegraph-crawl ' + maxRetries + ' but failed!'
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
  debug(debugLevel) && console.log('Running pagegraph-crawl with command: ' + cmd);
  try {
    await execAsync(cmd).catch(err => {
      const newRetry = retry - 1;
      generateGraphs(newRetry);
    });
  } catch (err) {
    console.err(err); //TODO fix
  }
  debug(debugLevel) && console.log('Pagegraph-crawl finished running!');
};

const getSources = async () => {
  const files = await fs.readdir(graphsDir);
  if (files.length == 0) {
    process.exit(1);
  }
  debug(debugLevel) && console.log('Done generating graph files! Running pagegraph-cli...');
  // For each graph file in graphsDir (can be run independently)
  await Promise.all(
    files.map(async graphFile => {
      const pagegraphCmdBase = './pagegraph-cli' + ' -f ' + graphsDir + '/' + graphFile;
      // Get edges via adblock_rules
      let pagegraphCmd = pagegraphCmdBase + ' adblock_rules' + ' -l ' + filterlist;
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

const massageConfig = async () => {
  debug(debugLevel) && console.log('Creating config.json for sugarcoat...');
  const output = await fs.readFile(policyJsonFile, 'UTF-8');
  let config = JSON.parse(output);
  const policy = config.policy;
  config.graphs = [graphsDir + '/*.graphml'];
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
  debug(debugLevel) && console.log('Writing massaged config.json...');
  await fs.writeFile(massagedConfigJson, JSON.stringify(config), { recursive: true });
};

const runSugarCoat = async () => {
  const cmd =
    'node node_modules/sugarcoat/cli.js --config ' +
    massagedConfigJson +
    ' --ingest --report --rewrite --bundle';
  debug(debugLevel) && console.log('Running sugarcoat with command: ' + cmd);
  await execAsync(cmd);
  debug(debugLevel) && console.log('Sugarcoat command finished running!');
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
    fs.rmdir(graphsDir);
  }
};

(async () => {
  await preCleanup();
  await generateGraphs(maxRetries);
  await getSources();
  await massageConfig();
  await runSugarCoat();
  await postCleanup();
})();
