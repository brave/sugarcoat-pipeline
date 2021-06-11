#!/usr/bin/env node

import { execSync } from 'child_process';
import { promises as fs } from 'fs';
import argparseLib from 'argparse';
import { writeGraphsForCrawl } from 'pagegraph-crawl/built/brave/crawl.js';
import { validate } from 'pagegraph-crawl/built/brave/validate.js';
import * as path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { promisify } from 'util';

const defaultCrawlSecs = 30;
const defaultDebugSetting = 'none';
const defaultConfigJson = 'config.json';
const genDir = path.resolve('gen');
const defaultScriptOutput = genDir + '/output';

// Parser options
const parser = new argparseLib.ArgumentParser({
  version: 0.1,
  addHelp: true,
  description: 'CLI that implements the SugarCoat pipeline',
});
parser.addArgument(['-b', '--binary'], {
  required: true,
  help: 'Path to the PageGraph enabled build of Brave.',
});
parser.addArgument(['-o', '--output'], {
  help: 'Path (directory) to write scripts to.',
  defaultValue: defaultScriptOutput,
});
parser.addArgument(['-u', '--url'], {
  help: 'The URL to record.',
  required: true,
});
parser.addArgument(['-t', '--secs'], {
  help: `The dwell time in seconds. Defaults: ${defaultCrawlSecs} sec.`,
  type: 'int',
  defaultValue: defaultCrawlSecs,
});
parser.addArgument(['--debug'], {
  help: `Print debugging information. Default: ${defaultDebugSetting}.`,
  choices: ['none', 'debug'],
  defaultValue: defaultDebugSetting,
});
parser.addArgument(['-l', '--filter-list'], {
  help: 'Filter list to use',
});
parser.addArgument(['-c', '--config'], {
  help: 'Path to sugarcoat config file. Default: config.json',
  defaultValue: defaultConfigJson,
});

const debugLevel = debug => debug !== 'none';

const crawlArgs = parser.parseArgs();
const outputDir = crawlArgs.output;
const configJsonFile = crawlArgs.config;
const filterlist = crawlArgs.filter_list;
const debug = crawlArgs.debug;
const url = crawlArgs.url;
const graphsDir = genDir + '/graphs';
const argsClone = JSON.parse(JSON.stringify(crawlArgs));
const massagedConfigJson = genDir + '/config.json';

argsClone.output = graphsDir;
let scriptNameToUrl = {};

// Always clean up at start
const cleanup = async () => {
  debugLevel(debug) && console.log('Cleanup');
  await fs
    .mkdir(genDir)
    .catch(_ => fs.rmdir(genDir, { recursive: true }).then(_ => fs.mkdir(genDir)));
  fs.mkdir(outputDir);
  fs.mkdir(graphsDir);
};

const generateGraphs = async () => {
  debugLevel(debug) && console.log('Generating graph files for URLs...');
  argsClone.url = [url];
  const [isValid, errorOrArgs] = validate(argsClone);
  if (!isValid) {
    throw errorOrArgs;
  }
  // Generate graph files
  await writeGraphsForCrawl(errorOrArgs);
};

const getSources = async () => {
  debugLevel(debug) && console.log('Getting sources');
  const files = await fs.readdir(graphsDir);
  if (files.length == 0) {
    process.exit(1);
  }
  debugLevel(debug) && console.log('Done generating graph files! Running pagegraph-cli...');
  // For each graph file in graphsDir (can be run independently)
  files.forEach(graphFile => {
    const pagegraphCmdBase = './pagegraph-cli' + ' -f ' + graphsDir + '/' + graphFile;
    // Get edges via adblock_rules
    let pagegraphCmd = pagegraphCmdBase + ' adblock_rules' + ' -l ' + filterlist;
    let cmdOutput = execSync(pagegraphCmd);
    let jsonOutput = JSON.parse(cmdOutput);
    const edges = jsonOutput.flatMap(edge =>
      edge.requests.map(requestAndEdgeTuple => requestAndEdgeTuple[1])
    );
    debugLevel(debug) && console.dir(edges, { depth: null });
    // For each edge that corresponds to script, get downstream requests
    const requests = edges.flatMap(edge => {
      pagegraphCmd = pagegraphCmdBase + ' downstream_requests ' + edge + ' --requests';
      cmdOutput = execSync(pagegraphCmd);
      jsonOutput = JSON.parse(cmdOutput);
      return jsonOutput;
    });
    debugLevel(debug) && console.log(requests);
    // For each request id, get the source and put into outputDir
    requests.forEach(requestId => {
      pagegraphCmd = pagegraphCmdBase + ' request_id_info ' + requestId;
      try {
        cmdOutput = execSync(pagegraphCmd);
      } catch {
        return; // if request ID is not related to script, the rust binary returns error code
      }
      jsonOutput = JSON.parse(cmdOutput);
      let url = jsonOutput.url;
      let scriptName = path.posix.basename(url, '.js') + '-' + uuidv4();
      let source = jsonOutput.source;
      scriptNameToUrl[scriptName] = url;
      fs.writeFile(outputDir + '/' + scriptName + '.js', source, { recursive: true });
    });
  });
};

const massageConfig = async () => {
  debugLevel(debug) && console.log('Creating config.json');
  const output = await fs.readFile(configJsonFile, 'UTF-8');
  let config = JSON.parse(output);
  const policy = config.policy;
  config.targets = {};
  delete config.policy;
  const files = await fs.readdir(outputDir);
  files.forEach(file => {
    const targetKey = file.split('.js')[0];
    let newObj = {};
    newObj.patterns = [scriptNameToUrl[targetKey]];
    newObj.policy = policy;
    config.targets[targetKey] = newObj;
    debugLevel(debug) && console.log(config);
  });
  debugLevel(debug) && console.log('writing massaged config.json');
  await fs.writeFile(massagedConfigJson, JSON.stringify(config), { recursive: true });
};

const runSugarCoat = async () => {
  debugLevel(debug) && console.log('Running sugarcoat');
  const cmd =
    'npm run sugarcoat  -- --config ' +
    massagedConfigJson +
    ' --ingest --report --rewrite --bundle';
  debugLevel(debug) && console.log(cmd);
  execSync(cmd);
  debugLevel(debug) && console.log('Sugarcoat command finished running!');
};

(async () => {
  await cleanup();
  await generateGraphs();
  await getSources();
  await massageConfig();
  await runSugarCoat();
})();
