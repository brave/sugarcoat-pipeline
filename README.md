# SugarCoat Pipeline

SugarCoat is a tool that allows filterlist authors to automatically patch JavaScript scripts to restrict their access to sensitive data according to a custom privacy policy. Check out the [blog post!](TODO).

This repo is an implementation of the SugarCoat pipeline. It uses [pagegraph-crawl](https://github.com/brave-experiments/pagegraph-crawl) to crawl a given website and generate PageGraph graphs, [pagegraph-rust-cli](https://github.com/brave-experiments/pagegraph-rust/tree/main/pagegraph-cli) to get JavaScript script sources that match adblock rules from the generated graphs, and [sugarcoat](https://github.com/brave-experiments/sugarcoat) for the actual patching of JavaScript scripts. 

You can specify which sensitive Web APIs to block access to in `policy.json` ([example](https://github.com/brave-experiments/sugarcoat-pipeline/blob/main/policy.json)). All SugarCoat pipeline output is generated in `output/` by default (can be changed via CLI argument). Patched scripts go in `output/sugarcoated_scripts` and the generated EasyList-style filter rules in `output/sugarcoat_rules.txt`.

## Setup

1. Git clone this repo:

```bash
git clone https://github.com/brave-experiments/sugarcoat-pipeline
cd sugarcoat-pipeline
```

2. You need the [Rust and Cargo toolchain](https://doc.rust-lang.org/cargo/getting-started/installation.html) setup in order to use the SugarCoat pipeline. The `pagegraph-rust-cli` Rust binary is built using Cargo as part of the post-installation phase. 

3. To install the NPM dependencies:

```bash
npm install
```

4. You will also need a working PageGraph binary (an instrumented version of the Brave browser) to crawl the website you want to sugarcoat and generate `.graphml` files that are then analyzed for scripts. You can [build a binary following the wiki instructions](https://github.com/brave/brave-browser/wiki/PageGraph), or you can download one for Intel Macs or Linux amd64 from the [Release page here](https://github.com/brave-experiments/sugarcoat-pipeline/releases/latest). Remember to unzip it! Alternatively, on the command line:

#### For Mac
```bash
# Download the latest Mac Intel zip (and follow redirect)
curl -L https://github.com/brave-experiments/sugarcoat-pipeline/releases/latest/download/pagegraph-mac-intel.zip -o pagegraph-mac-intel.zip
unzip pagegraph-mac-intel.zip
rm pagegraph-mac-intel.zip
```

#### For Linux
```bash
# Download the latest Linux amd64 zip (and follow redirect)
curl -L https://github.com/brave-experiments/sugarcoat-pipeline/releases/latest/download/pagegraph-linux-amd64.zip -o pagegraph-linux-amd64.zip
unzip pagegraph-linux-amd64.zip -d pagegraph-linux-amd64
rm pagegraph-linux-amd64.zip
```

You'll also need `xvfb` on Linux to run `pagegraph`. 
```bash
sudo apt install xvfb
```

5. (optional) You can get the latest copy of the easylist filterlist [here](https://easylist.to/easylist/easylist.txt). Alternatively, there's one in the repo (current as of 23 June 2021). 

```bash
curl -s https://easylist.to/easylist/easylist.txt -o easylist.txt
```

## Usage
```bash
npm run sugarcoat-pipeline  -- -b <PATH_TO_PAGEGRAPH_BINARY> -u <URL> -t <SECS_TO_RUN_PAGEGRAPH> -l <FILTERLIST>
```


### Example:

#### For Mac
```bash
npm run sugarcoat-pipeline  -- -b pagegraph-mac-intel.app/Contents/MacOS/Brave\ Browser\ Development -u https://microsoft.com  -t 5 -l easylist.txt
```
(note that on macOS the binary has to be the executable under the `.app`).

#### For Linux
```bash
npm run sugarcoat-pipeline  -- -b pagegraph-linux-amd64/brave -u https://microsoft.com  -t 5 -l easylist.txt
```

### Help
```bash
$ npm run sugarcoat-pipeline -- -h

> sugarcoat-pipeline@0.1.0 sugarcoat-pipeline /Users/shivan/work/sugarcoat-experiments/sugarcoat-pipeline
> node sugarcoat-pipeline.js "-h"

usage: sugarcoat-pipeline.js [-h] [-b BINARY] [-u URL] [-t SECS] [-d] -l FILTER_LIST [-p POLICY] [-o OUTPUT]
                             [-g GRAPHS_DIR_OVERRIDE] [-k]

SugarCoat pipeline CLI

optional arguments:
  -h, --help            show this help message and exit
  -b BINARY, --binary BINARY
                        Path to the PageGraph-enabled build of Brave
  -u URL, --url URL     The URL to record.
  -t SECS, --secs SECS  The dwell time in seconds. Default: 30 seconds
  -d, --debug           Print debugging information
  -l FILTER_LIST, --filter-list FILTER_LIST
                        Filter list to use
  -p POLICY, --policy POLICY
                        Path to policy file. Default: policy.json
  -o OUTPUT, --output OUTPUT
                        Path to output directory. All generated files go here. Default: output
  -g GRAPHS_DIR_OVERRIDE, --graphs-dir-override GRAPHS_DIR_OVERRIDE
                        Path to graphs directory. If set, skips PageGraph generation
  -k, --keep            Do not erase intermediary files generated in output for sugarcoat
```

## Feedback

Something not working? Please [raise an issue](https://github.com/brave-experiments/sugarcoat-pipeline/issues).
