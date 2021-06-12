# SugarCoat Pipeline

CLI that implements the SugarCoat pipeline. It uses [pagegraph-crawl](https://github.com/brave-experiments/pagegraph-crawl) for the graph generation, [pagegraph-rust-cli](https://github.com/brave-experiments/pagegraph-rust/tree/main/pagegraph-cli) as a Rust binary to get JS sources related to adblock rules from generated graphs, and [sugarcoat](https://github.com/brave-experiments/sugarcoat) for the actual sugarcoating of JS sources. 

All output is generated in `gen/`. Because `sugarcoat` expects the config to be in a certain format, the user-provided `policy.json` (detailing rewrite policies) is modified on-the-fly and `config.json` is generated in `gen/config.json`. 

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
> ./sugarcoat-pipeline.js "-h"

usage: sugarcoat-pipeline.js [-h] [-v] -b BINARY -u URL [-t SECS]
                             [--debug {none,debug}] [-l FILTER_LIST]
                             [-p POLICY]


CLI that implements the SugarCoat pipeline

Optional arguments:
  -h, --help            Show this help message and exit.
  -v, --version         Show program's version number and exit.
  -b BINARY, --binary BINARY
                        Path to the PageGraph enabled build of Brave.
  -u URL, --url URL     The URL to record.
  -t SECS, --secs SECS  The dwell time in seconds. Defaults: 30 sec.
  --debug {none,debug}  Print debugging information. Default: none.
  -l FILTER_LIST, --filter-list FILTER_LIST
                        Filter list to use
  -p POLICY, --policy POLICY
                        Path to policy file. Default: policy.json
```
