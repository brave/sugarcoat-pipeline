#!/usr/bin/env node

import url from "url";
import { execSync } from 'child_process';
import fs from 'fs';
import argparseLib from 'argparse';
import { writeGraphsForCrawl } from 'pagegraph-crawl/built/brave/crawl.js';
import { validate } from 'pagegraph-crawl/built/brave/validate.js';
const defaultCrawlSecs = 30;
const defaultShieldsSetting = 'down';
const defaultDebugSetting = 'none';

// Parser options
const parser = new argparseLib.ArgumentParser({
    version: 0.1,
    addHelp: true,
    description: 'CLI tool for crawling and recording websites with PageGraph'
});
parser.addArgument(['-b', '--binary'], {
    required: true,
    help: 'Path to the PageGraph enabled build of Brave.'
});
parser.addArgument(['-o', '--output'], {
    help: 'Path (directory) to write scripts to.',
    required: true
});
parser.addArgument(['-u', '--url'], {
    help: 'The URL to record. Can also pass in a file with list of URLs',
    required: true,
    nargs: '+'
});
parser.addArgument(['-e', '--existing-profile'], {
    help: 'The chromium profile to use when crawling. Cannot ' +
        'be used with "--persist-profile"'
});
parser.addArgument(['-p', '--persist-profile'], {
    help: 'If provided, the user profile will be saved at this path. Cannot ' +
        'be used with "--existing-profile"'
});
parser.addArgument(['-s', '--shields'], {
    help: 'Whether to measure with shields up or down. Ignored when using ' +
        `"--existing-profile".  Default: ${defaultShieldsSetting}`,
    choices: ['up', 'down'],
    defaultValue: defaultShieldsSetting
});
parser.addArgument(['-t', '--secs'], {
    help: `The dwell time in seconds. Defaults: ${defaultCrawlSecs} sec.`,
    type: 'int',
    defaultValue: defaultCrawlSecs
});
parser.addArgument(['--debug'], {
    help: `Print debugging information. Default: ${defaultDebugSetting}.`,
    choices: ['none', 'debug', 'verbose'],
    defaultValue: defaultDebugSetting
});
parser.addArgument(['-i', '--interactive'], {
    help: 'Suppress use of Xvfb to allow interaction with spawned browser instance',
    action: 'storeTrue',
    defaultValue: false
});
parser.addArgument(['-a', '--user-agent'], {
    help: 'Override the browser\'s UserAgent string to USER_AGENT',
    metavar: 'USER_AGENT'
});
parser.addArgument(['--proxy-server'], {
    help: 'Use an HTTP/SOCKS proxy at URL for all navigations',
    metavar: 'URL'
});
parser.addArgument(['-x', '--extra-args'], {
    help: 'Pass JSON_ARRAY as extra CLI argument to the browser instance launched',
    metavar: 'JSON_ARRAY'
});
parser.addArgument(['-l', '--filter-list'], {
    help: 'Filter list to use',
});
parser.addArgument(['-c', '--config'], {
    help: 'Path to config file',
});
const rawArgs = parser.parseArgs();
const outputForSources = rawArgs.output;
const filterlist = rawArgs.filter_list;


// Always clean up 
if (fs.existsSync(outputForSources)) {
    fs.rmdirSync(outputForSources, {recursive: true})
}
fs.mkdirSync(outputForSources);
const crawlArgs = rawArgs;
// check if url is a valid URL. If yes, run it, else load in URL file
const checkURL = (s) => {
    try {
      new url.URL(s);
      return true;
    } catch (err) {
      return false;
    }
  };
let urls = crawlArgs.url;
if (!checkURL(urls[0])) {
    // load file full of URLs
    const data = fs.readFileSync(urls[0], 'UTF-8');
    // split the contents by new line
    urls = data.split(/\r?\n/);
    urls = urls.filter(url => checkURL(url));
}
const graphFilesOutput = "./graphs";
if (fs.existsSync(graphFilesOutput)) {
    fs.rmdirSync(graphFilesOutput, {recursive: true})
}    
fs.mkdirSync(graphFilesOutput);

const argsClone = JSON.parse(JSON.stringify(crawlArgs));
argsClone.output = graphFilesOutput;
(async () => {

    console.log("Generating pagegraph graph files for URLs...");
    await Promise.all(urls.map(async (url) => {
        argsClone.url = [url];
        const [isValid, errorOrArgs] = validate(argsClone);
        if (!isValid) { 
            throw errorOrArgs;
        }
        await writeGraphsForCrawl(errorOrArgs);
    }));
    // check number of graph files
    fs.readdir('./graphs', (err, files) => {
        if (files.length == 0) {
            process.exit(1);
        }
    });
    console.log("Done generating graph files! Running sugarcoat-pipeline-rust...");
    const sugarcoatCommand = "./sugarcoat-pipeline-cli" + " -f " +  graphFilesOutput + " -o " + outputForSources + " -l " + filterlist;
    execSync(sugarcoatCommand, {stdio: 'inherit'}, (error, stdout, stderr) => {
        if (error) {
            throw error;
        }
        console.log(stdout);
    });
    // read in config.json.example
    // add target for each script
    // change graphs and source location 
    // write out to config.json
    let config = JSON.parse(fs.readFileSync("./config.json", 'UTF-8'));
    const policy = config.policy;
    config.targets = {};
    delete config.policy;
    fs.readdirSync(outputForSources).forEach(file => {
        const targetKey = file.split('.')[0]; 
        console.log(targetKey)
        let newObj = {};
        newObj.patterns = "google.com"; // TODO get real url for script
        newObj.policy = policy;
        config.targets[targetKey] = newObj;
    });

    console.log("Running sugarcoat with config.json:");
    console.dir(config, { depth: null })




})();
