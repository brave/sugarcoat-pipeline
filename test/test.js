import { execSync } from 'child_process';
import * as fs from 'fs';
import { expect } from 'chai';
import * as path from 'path';
import os from 'os';

const testCasesDirBase = path.resolve(path.join('test', 'cases'));
const outputDir = path.resolve(path.join('test', 'output'));
const rules = path.join(outputDir, '/sugarcoat_rules.txt');
const trace = path.join(outputDir, '/sugarcoat_trace.json');
const scripts = path.join(outputDir, '/scripts');
const sugarcoat_scripts = path.join(outputDir, '/sugarcoat_scripts');
const DEBUG = process.env.DEBUG;

beforeEach('Test set up', () => {
  fs.mkdirSync(outputDir, { recursive: true });
});

afterEach('Clean up output', () => {
  if (!DEBUG) {
    fs.rmSync(outputDir, { recursive: true, force: true });
  }
});

describe('SugarCoat Pipeline CLI', () => {
  it('sugarcoats for simple case', () => {
    const testDir = path.join(testCasesDirBase, '/simple');
    const listPath = path.join(testDir, 'list.txt');
    execSync(
      `npm run sugarcoat-pipeline -- -d -u http://localhost -s -o ${outputDir} -g ${testDir} -l ${listPath} -k`,
      {
        stdio: 'inherit',
      }
    );
    // Check output/
    expect(fs.existsSync(rules)).to.be.true;
    expect(fs.existsSync(path.join(sugarcoat_scripts, '/sugarcoat-script1.js'))).to.be.true;
    const rulesString = `||localhost:8000/script1.js$script,important,domain=localhost,redirect-url=https://pcdn.brave.com/sugarcoat/sugarcoat-script1${os.EOL}`;
    expect(fs.readFileSync(rules, 'UTF-8')).to.equal(rulesString);
  });

  it('sugarcoats for script pulling in script case', () => {
    const testDir = path.join(testCasesDirBase, '/test-script-calls-script-calls-script');
    let listPath = path.join(testDir, 'list.txt');
    execSync(
      `npm run sugarcoat-pipeline -- -u http://localhost -s -o ${outputDir} -g ${testDir} -l ${listPath} -k`,
      {
        stdio: 'inherit',
      }
    );
    expect(fs.existsSync(path.join(scripts, '/script1.js'))).to.be.true;
    expect(fs.existsSync(path.join(scripts, '/script2.js'))).to.be.true;
    expect(fs.existsSync(path.join(scripts, '/scevent.min.js'))).to.be.true;
    expect(fs.existsSync(rules)).to.be.true;
    expect(fs.existsSync(path.join(sugarcoat_scripts, '/sugarcoat-script1.js'))).to.be.true;
    let rulesString =
      `||localhost:8080/script1.js$script,important,domain=localhost,redirect-url=https://pcdn.brave.com/sugarcoat/sugarcoat-script1${os.EOL}` +
      `||localhost:8080/script2.js$script,important,domain=localhost,redirect-url=https://pcdn.brave.com/sugarcoat/sugarcoat-script2${os.EOL}`;
    DEBUG && console.log(fs.readFileSync(trace, 'UTF-8'));
    expect(fs.readFileSync(rules, 'UTF-8')).to.equal(rulesString);
  });

  it('handles exceptions in filter list', () => {
    const testDir = testCasesDirBase + '/exceptions';
    let listPath = path.join(testDir, 'list_without_exception.txt');
    // check without exception
    execSync(
      `npm run sugarcoat-pipeline -- -u http://localhost -s -o ${outputDir} -g ${testDir} -l ${listPath} -k`,
      {
        stdio: 'inherit',
      }
    );
    // Check output/
    expect(fs.existsSync(rules)).to.be.true;
    expect(fs.existsSync(path.join(sugarcoat_scripts, '/sugarcoat-script1.js'))).to.not.be.true;

    // check with exception
    listPath = path.join(testDir, 'list.txt');
    execSync(
      `npm run sugarcoat-pipeline -- -u http://localhost -s -o ${outputDir} -g ${testDir} -l ${listPath} -k`,
      {
        stdio: 'inherit',
      }
    );
    // Check output/
    expect(fs.existsSync(rules)).to.be.true;
    expect(fs.existsSync(path.join(sugarcoat_scripts, '/sugarcoat-script1.js'))).to.be.true;
    const rulesString = `||localhost:8000/script1.js$script,important,domain=localhost,redirect-url=https://pcdn.brave.com/sugarcoat/sugarcoat-script1${os.EOL}`;
    expect(fs.readFileSync(rules, 'UTF-8')).to.equal(rulesString);
  });

  it('soundcloud.com', () => {
    const testDir = testCasesDirBase + '/soundcloud.com';
    let listPath = path.join(testDir, 'easylist.txt');
    execSync(
      `npm run sugarcoat-pipeline -- -u http://localhost -s -o ${outputDir} -g ${testDir} -l ${listPath} -k`,
      {
        stdio: 'inherit',
      }
    );
    // Check output/
    expect(fs.existsSync(rules)).to.be.true;
    expect(fs.readFileSync(rules, 'UTF-8')).to.equal('');
  });
});
