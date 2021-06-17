import * as shell from 'shelljs';

const shelljs = shell.default;
const pagegraphBinaryName = process.platform === 'win32' ? 'pagegraph-cli.exe' : 'pagegraph-cli';
shelljs.rm('-rf', 'pagegraph-rust/');
shelljs.exec('git clone https://github.com/brave-experiments/pagegraph-rust.git');
shelljs.cd('pagegraph-rust');
shelljs.exec('cargo build --bin pagegraph-cli --release');
shelljs.cp(`target/release/${pagegraphBinaryName}`, '../');
shelljs.cd('..');
