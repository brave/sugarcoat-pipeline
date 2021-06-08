# SugarCoat Pipeline

CLI that implements the SugarCoat pipeline. It uses [sugarcoat](https://github.com/brave-experiments/sugarcoat).

`pagegraph-cli` is a Rust binary that uses [pagegraph-rust](https://github.com/brave-experiments/pagegraph-rust).

## Usage
```bash
$ npm run sugarcoat-pipeline  -- -b <PATH_TO_PAGEGRAPH_BINARY> -u <URL> -t <SECS_TO_RUN_PAGEGRAPH> -l <FILTERLIST>
```
### Example:
```bash
npm run sugarcoat-pipeline  -- -b ~/pagegraph-brave/src/out/Component/Brave\ Browser\ Development.app/Contents/MacOS/Brave\ Browser\ Development -u http://localhost:8000/test-script-calls-script.html  -t 1 -l easylist.txt
```

### Help
```bash
$ npm run sugarcoat-pipeline -- -h

> sugarcoat-pipeline@0.1.0 sugarcoat-pipeline /Users/shivan/work/sugarcoat-experiments/sugarcoat-pipeline
> ./run.js "-h"

usage: run.js [-h] [-v] -b BINARY [-o OUTPUT] -u URL [-t SECS]
              [--debug {none,debug}] [-l FILTER_LIST] [-c CONFIG]


CLI tool for crawling and recording websites with PageGraph

Optional arguments:
  -h, --help            Show this help message and exit.
  -v, --version         Show program's version number and exit.
  -b BINARY, --binary BINARY
                        Path to the PageGraph enabled build of Brave.
  -o OUTPUT, --output OUTPUT
                        Path (directory) to write scripts to.
  -u URL, --url URL     The URL to record.
  -t SECS, --secs SECS  The dwell time in seconds. Defaults: 30 sec.
  --debug {none,debug}  Print debugging information. Default: none.
  -l FILTER_LIST, --filter-list FILTER_LIST
                        Filter list to use
  -c CONFIG, --config CONFIG
                        Path to sugarcoat config file
```
