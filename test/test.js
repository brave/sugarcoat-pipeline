import { execSync } from 'child_process';
import * as fs from 'fs';
import { expect } from 'chai';
import * as path from 'path';

const testDirBase = path.resolve('test/cases');
const genDir = 'gen';
const rules = `${genDir}/rules.txt`;
const scripts = `${genDir}/sugarcoated_scripts`;

afterEach('Clean up gen/', () => {
  fs.rmdirSync(genDir, { recursive: true, force: true });
});

describe('SugarCoat Pipeline CLI', () => {
  it('sugarcoats for simple case', () => {
    const testDir = testDirBase + '/simple';
    execSync(`npm run sugarcoat-pipeline -- -g ${testDir} -l ${testDir}/list.txt`, {
      stdio: 'inherit',
    });
    // Check gen/
    expect(fs.existsSync(rules)).to.be.true;
    expect(fs.existsSync(scripts + '/sugarcoat-script1.js')).to.be.true;
    const rulesString =
      'https://localhost:8000/script1.js$script,important,redirect=sugarcoat-script1';
    expect(fs.readFileSync(rules, 'UTF-8')).to.equal(rulesString);
  });

  it('handles exceptions in filter list', () => {
    const testDir = testDirBase + '/exceptions';
    // check without exception
    execSync(
      `npm run sugarcoat-pipeline -- -g ${testDir} -l ${testDir}/list_without_exception.txt`,
      {
        stdio: 'inherit',
      }
    );
    // Check gen/
    expect(fs.existsSync(rules)).to.be.true;
    expect(fs.existsSync(scripts + '/sugarcoat-script1.js')).to.be.true;
    const rulesString =
      'https://localhost:8000/script1.js$script,important,redirect=sugarcoat-script1';
    expect(fs.readFileSync(rules, 'UTF-8')).to.equal(rulesString);
    // check with exception
    execSync(`npm run sugarcoat-pipeline -- -g ${testDir} -l ${testDir}/list.txt`, {
      stdio: 'inherit',
    });
    // Check gen/
    expect(fs.existsSync(rules)).to.be.true;
    expect(fs.existsSync(scripts + '/sugarcoat-script1.js')).to.not.be.true;
    expect(fs.readFileSync(rules, 'UTF-8')).to.equal('');
  });
});
