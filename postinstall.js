import * as shell from 'shelljs';
const shelljs = shell.default;
shelljs.rm('-rf', 'pagegraph-rust/');
shelljs.exec('git clone https://github.com/brave-experiments/pagegraph-rust.git');
shelljs.cd('pagegraph-rust');
shelljs.exec('cargo build --bin pagegraph-cli --release');
shelljs.cp('target/release/pagegraph-cli', '../');
shelljs.cd('..');
