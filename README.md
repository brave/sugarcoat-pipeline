# SugarCoat Pipeline

CLI that implements the SugarCoat pipeline. It uses [pagegraph-crawl](https://github.com/brave-experiments/pagegraph-crawl) for the graph generation, [pagegraph-rust-cli](https://github.com/brave-experiments/pagegraph-rust/tree/main/pagegraph-cli) to get JS sources related to adblock rules from generated graphs, and [sugarcoat](https://github.com/brave-experiments/sugarcoat) for the actual sugarcoating of JS sources. 

All output is generated in `gen/`. Sugarcoated scripts go in `gen/sugarcoated_scripts` and the rules file in `gen/rules.txt`. You can specify which APIs to sugarcoat in `policy.json`.  

## Install

NOTE! You need the [Rust and Cargo toolchain](https://doc.rust-lang.org/cargo/getting-started/installation.html) setup in order to use the SugarCoat pipeline. The `pagegraph-rust-cli` Rust binary is built as part of the post-installation phase. 

```bash
$ npm install
```

## Usage
```bash
$ npm run sugarcoat-pipeline  -- -b <PATH_TO_PAGEGRAPH_BINARY> -u <URL> -t <SECS_TO_RUN_PAGEGRAPH> -l <FILTERLIST>
```

You can get the easylist filterlist [here](https://easylist.to/easylist/easylist.txt).

```bash
curl -s https://easylist.to/easylist/easylist.txt -o easylist.txt
```

### Example:
```bash
$ npm run sugarcoat-pipeline  -- -b ~/pagegraph-brave/src/out/Component/Brave\ Browser\ Development.app/Contents/MacOS/Brave\ Browser\ Development -u http://localhost:8000/index.html  -t 10 -l easylist.txt
```

### Help
```bash
$ npm run sugarcoat-pipeline -- -h

> ./sugarcoat-pipeline.js "-h"

usage: sugarcoat-pipeline.js [-h] [-b BINARY] [-u URL] [-t SECS] [-d] -l FILTER_LIST [-p POLICY] [-g GRAPHS_DIR_OVERRIDE] [-k]

SugarCoat pipeline CLI

optional arguments:
  -h, --help            show this help message and exit
  -b BINARY, --binary BINARY
                        Path to the PageGraph-enabled build of Brave
  -u URL, --url URL     The URL to record.
  -t SECS, --secs SECS  The dwell time in seconds. Defaults: 30 seconds
  -d, --debug           Print debugging information
  -l FILTER_LIST, --filter-list FILTER_LIST
                        Filter list to use
  -p POLICY, --policy POLICY
                        Path to policy file. Default: policy.json
  -g GRAPHS_DIR_OVERRIDE, --graphs-dir-override GRAPHS_DIR_OVERRIDE
                        Path to graphs directory. If set, skips PageGraph generation
  -k, --keep            Do not erase intermediary files generated in gen/ for sugarcoat
```
