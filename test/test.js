import { execSync } from 'child_process';
import * as fs from 'fs';
import { expect } from 'chai';
import * as path from 'path';

const testDirBase = path.resolve(path.join('test', 'cases'));
const outputDir = 'output';
const rules = path.join(outputDir, '/sugarcoat_rules.txt');
const scripts = path.join(outputDir, '/sugarcoated_scripts');

afterEach('Clean up gen/', () => {
  fs.rmdirSync(outputDir, { recursive: true, force: true });
});

describe('SugarCoat Pipeline CLI', () => {
  it('sugarcoats for simple case', () => {
    const testDir = path.join(testDirBase, '/simple');
    const listPath = path.join(testDir, 'list.txt');
    execSync(`npm run sugarcoat-pipeline -- -g ${testDir} -l ${listPath}`, {
      stdio: 'inherit',
    });
    // Check gen/
    expect(fs.existsSync(rules)).to.be.true;
    expect(fs.existsSync(path.join(scripts, '/sugarcoat-script1.js'))).to.be.true;
    const rulesString =
      'https://localhost:8000/script1.js$script,important,redirect=sugarcoat-script1';
    expect(fs.readFileSync(rules, 'UTF-8')).to.equal(rulesString);
  });

  it('handles exceptions in filter list', () => {
    const testDir = testDirBase + '/exceptions';
    let listPath = path.join(testDir, 'list_without_exception.txt');
    // check without exception
    execSync(`npm run sugarcoat-pipeline -- -g ${testDir} -l ${listPath}`, {
      stdio: 'inherit',
    });
    // Check gen/
    expect(fs.existsSync(rules)).to.be.true;
    expect(fs.existsSync(path.join(scripts, '/sugarcoat-script1.js'))).to.be.true;
    const rulesString =
      'https://localhost:8000/script1.js$script,important,redirect=sugarcoat-script1';
    expect(fs.readFileSync(rules, 'UTF-8')).to.equal(rulesString);
    // check with exception
    listPath = path.join(testDir, 'list.txt');
    execSync(`npm run sugarcoat-pipeline -- -g ${testDir} -l ${listPath}`, {
      stdio: 'inherit',
    });
    // Check gen/
    expect(fs.existsSync(rules)).to.be.true;
    expect(fs.existsSync(path.join(scripts, '/sugarcoat-script1.js'))).to.not.be.true;
    expect(fs.readFileSync(rules, 'UTF-8')).to.equal('');
  });

  it('soundcloud.com', () => {
    const testDir = testDirBase + '/soundcloud.com';
    let listPath = path.join(testDir, 'easylist.txt');
    execSync(`npm run sugarcoat-pipeline -- -g ${testDir} -l ${listPath}`, {
      stdio: 'inherit',
    });
    // Check gen/
    expect(fs.existsSync(rules)).to.be.true;
    expect(fs.readFileSync(rules, 'UTF-8')).to.equal('');
  });

  it('microsoft.com', () => {
    const testDir = testDirBase + '/microsoft.com';
    let listPath = path.join(testDir, 'easylist.txt');
    execSync(`npm run sugarcoat-pipeline -- -g ${testDir} -l ${listPath}`, {
      stdio: 'inherit',
    });
    // Check gen/
    expect(fs.existsSync(rules)).to.be.true;
    expect(fs.existsSync(path.join(scripts, '/sugarcoat-meversion.js'))).to.be.true;
    expect(fs.readFileSync(rules, 'UTF-8')).to.equal(
      'https://mem.gfx.ms/meversion?partner=MSHomePage&market=en-us&uhf=1$script,important,redirect=sugarcoat-meversion'
    );
  });
});
