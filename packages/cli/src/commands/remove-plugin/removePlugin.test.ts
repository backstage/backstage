// Test Suite for removePlugin command.

import fse from 'fs-extra';
import path from 'path';
import {
  // removeExportStatementFromPlugins,
  removePluginDependencyFromApp,
  //removePluginDirectory,
} from './removePlugin';

const rootDir = fse.realpathSync(process.cwd().replace('/cli', ''));
const BACKSTAGE = `@backstage`;

// test remove export statement
describe('removePlugin', () => {
  describe('Remove Plugin Dependencies', () => {
    // Set up test
    // Copy contents of package file for test
    const packageFile = path.join(rootDir, 'app', 'package.json');
    const testFilePath = path.join(rootDir, 'app', 'test.json');
    const testPluginName = 'yarn-test-package';
    const testPluginPackage = `${BACKSTAGE}/plugin-${testPluginName}`;

    let packageFileContents = JSON.parse(fse.readFileSync(packageFile, 'utf8'));
    packageFileContents.dependencies[testPluginPackage] = '0.1.0';

    it('should remove plugin dependency from /packages/app/package.json', async () => {
      fse.createFileSync(testFilePath);
      fse.writeFileSync(
        testFilePath,
        `${JSON.stringify(packageFileContents, null, 2)}\n`,
        'utf8',
      );
      console.log(JSON.parse(fse.readFileSync(testFilePath, 'utf8')));
      try {
        await removePluginDependencyFromApp(testFilePath, testPluginName);
        expect(
          JSON.parse(fse.readFileSync(testFilePath, 'utf8')).hasOwnProperty(
            testPluginPackage,
          ),
        ).toBe(false);
      } finally {
        fse.removeSync(testFilePath);
      }
    });
  });
});

// test remove plugin dependency from app

// remove plugin from directory

// remove symlink from lerna scope
