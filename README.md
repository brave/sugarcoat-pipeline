# SugarCoat Pipeline

CLI that implements the SugarCoat pipeline. It uses [pagegraph-crawl](https://github.com/brave-experiments/pagegraph-crawl) for the graph generation, [pagegraph-rust-cli](https://github.com/brave-experiments/pagegraph-rust/tree/main/pagegraph-cli) to get JS sources related to adblock rules from generated graphs, and [sugarcoat](https://github.com/brave-experiments/sugarcoat) for the actual sugarcoating of JS sources. 

All output is generated in `gen/`. Sugarcoated scripts go in `gen/sugarcoated_scripts` and the rules file in `gen/rules.txt`. You can specify which APIs to sugarcoat in `policy.json`.  

## Install

NOTE! You need the [Rust and Cargo toolchain](https://doc.rust-lang.org/cargo/getting-started/installation.html) setup in order to use the SugarCoat pipeline. The `pagegraph-rust-cli` Rust binary is built as part of the installation process.

```bash
$ npm install
```

## Usage
```bash
$ npm run sugarcoat-pipeline  -- -b <PATH_TO_PAGEGRAPH_BINARY> -u <URL> -t <SECS_TO_RUN_PAGEGRAPH> -l <FILTERLIST>
```
### Example:
```bash
$ npm run sugarcoat-pipeline  -- -b ~/pagegraph-brave/src/out/Component/Brave\ Browser\ Development.app/Contents/MacOS/Brave\ Browser\ Development -u http://localhost:8000/test-script-calls-script.html  -t 10 -l easylist.txt
```

### Help
```bash
$ npm run sugarcoat-pipeline -- --help

> sugarcoat-pipeline@0.1.0 sugarcoat-pipeline /Users/shivan/work/sugarcoat-experiments/sugarcoat-pipeline
> ./sugarcoat-pipeline.js "--help"

usage: sugarcoat-pipeline.js [-h] -b BINARY -u URL [-t SECS] [--debug {none,debug}] [-l FILTER_LIST]
                             [-p POLICY] [-k]

CLI that implements the SugarCoat pipeline

optional arguments:
  -h, --help            show this help message and exit
  -b BINARY, --binary BINARY
                        Path to the PageGraph enabled build of Brave.
  -u URL, --url URL     The URL to record.
  -t SECS, --secs SECS  The dwell time in seconds. Defaults: 30 sec.
  --debug {none,debug}  Print debugging information. Default: none.
  -l FILTER_LIST, --filter-list FILTER_LIST
                        Filter list to use
  -p POLICY, --policy POLICY
                        Path to policy file. Default: policy.json
  -k, --keep            Keep intermediary files generated for sugarcoat in gen/
```
