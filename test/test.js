import { execSync } from 'child_process';
import * as fs from 'fs';
import { expect } from 'chai';
import * as path from 'path';

const testDirBase = path.resolve(path.join('test', 'cases'));
const outputDir = 'output';
const rules = path.join(outputDir, '/sugarcoat_rules.txt');
const scripts = path.join(outputDir, '/scripts');
const sugarcoat_scripts = path.join(outputDir, '/sugarcoat_scripts');
const DEBUG = process.env.DEBUG;

afterEach('Clean up output', () => {
  if (!DEBUG) {
    fs.rmdirSync(outputDir, { recursive: true, force: true });
  }
});

describe('SugarCoat Pipeline CLI', () => {
  it('sugarcoats for simple case', () => {
    const testDir = path.join(testDirBase, '/simple');
    const listPath = path.join(testDir, 'list.txt');
    execSync(`npm run sugarcoat-pipeline -- -g ${testDir} -l ${listPath} -k`, {
      stdio: 'inherit',
    });
    // Check output/
    expect(fs.existsSync(rules)).to.be.true;
    expect(fs.existsSync(path.join(sugarcoat_scripts, '/sugarcoat-script1.js'))).to.be.true;
    const rulesString =
      'https://localhost:8000/script1.js$script,important,redirect=sugarcoat-script1';
    expect(fs.readFileSync(rules, 'UTF-8')).to.equal(rulesString);
  });

  it('sugarcoats for script pulling in script case', () => {
    const testDir = path.join(testDirBase, '/test-script-calls-script-calls-script');
    let listPath = path.join(testDir, 'list.txt');
    execSync(`npm run sugarcoat-pipeline -- -g ${testDir} -l ${listPath} -k`, {
      stdio: 'inherit',
    });
    expect(fs.existsSync(path.join(scripts, '/script1.js'))).to.be.true;
    expect(fs.existsSync(path.join(scripts, '/script2.js'))).to.be.true;
    expect(fs.existsSync(path.join(scripts, '/scevent.min.js'))).to.be.true;
    expect(fs.existsSync(rules)).to.be.true;
    expect(fs.existsSync(path.join(sugarcoat_scripts, '/sugarcoat-script1.js'))).to.be.true;
    let rulesString =
      'https://localhost:8080/script1.js$script,important,redirect=sugarcoat-script1\n' +
      'https://localhost:8080/script2.js$script,important,redirect=sugarcoat-script2';
    expect(fs.readFileSync(rules, 'UTF-8')).to.equal(rulesString);
  });

  it('handles exceptions in filter list', () => {
    const testDir = testDirBase + '/exceptions';
    let listPath = path.join(testDir, 'list_without_exception.txt');
    // check without exception
    execSync(`npm run sugarcoat-pipeline -- -g ${testDir} -l ${listPath} -k`, {
      stdio: 'inherit',
    });
    // Check output/
    expect(fs.existsSync(rules)).to.be.true;
    expect(fs.existsSync(path.join(sugarcoat_scripts, '/sugarcoat-script1.js'))).to.not.be.true;

    // check with exception
    listPath = path.join(testDir, 'list.txt');
    execSync(`npm run sugarcoat-pipeline -- -g ${testDir} -l ${listPath} -k`, {
      stdio: 'inherit',
    });
    // Check output/
    expect(fs.existsSync(rules)).to.be.true;
    expect(fs.existsSync(path.join(sugarcoat_scripts, '/sugarcoat-script1.js'))).to.be.true;
    const rulesString =
      'https://localhost:8000/script1.js$script,important,redirect=sugarcoat-script1';
    expect(fs.readFileSync(rules, 'UTF-8')).to.equal(rulesString);
  });

  it('soundcloud.com', () => {
    const testDir = testDirBase + '/soundcloud.com';
    let listPath = path.join(testDir, 'easylist.txt');
    execSync(`npm run sugarcoat-pipeline -- -g ${testDir} -l ${listPath} -k`, {
      stdio: 'inherit',
    });
    // Check output/
    expect(fs.existsSync(rules)).to.be.true;
    expect(fs.readFileSync(rules, 'UTF-8')).to.equal('');
  });
});
