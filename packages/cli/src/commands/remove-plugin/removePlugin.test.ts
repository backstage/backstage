/*
 * Copyright 2020 Spotify AB
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import fse from 'fs-extra';
import path from 'path';
import os from 'os';
import { paths } from '../../lib/paths';
import {
  addExportStatement,
  capitalize,
  createTemporaryPluginFolder,
} from '../create-plugin/createPlugin';
import { addCodeownersEntry } from '../../lib/codeowners';
import {
  removeReferencesFromAppPackage,
  removeReferencesFromPluginsFile,
  removePluginDirectory,
  removeSymLink,
  removePluginFromCodeOwners,
} from './removePlugin';

// Some constant variables
const BACKSTAGE = `@backstage`;
const testPluginName = 'yarn-test-package';
const testPluginPackage = `${BACKSTAGE}/plugin-${testPluginName}`;
const tempDir = path.join(os.tmpdir(), 'remove-plugin-test');

const removeEmptyLines = (file: string): string =>
  file.split('\n').filter(Boolean).join('\n');

const createTestPackageFile = async (
  testFilePath: string,
  packageFile: string,
) => {
  // Copy contents of package file for test
  const packageFileContent = JSON.parse(fse.readFileSync(packageFile, 'utf8'));

  packageFileContent.dependencies[testPluginPackage] = '0.1.0';
  fse.createFileSync(testFilePath);
  fse.writeFileSync(
    testFilePath,
    `${JSON.stringify(packageFileContent, null, 2)}\n`,
    'utf8',
  );
  return;
};

const createTestPluginFile = async (
  testFilePath: string,
  pluginsFilePath: string,
) => {
  // Copy contents of package file for test
  fse.copyFileSync(pluginsFilePath, testFilePath);
  const pluginNameCapitalized = testPluginName
    .split('-')
    .map((name) => capitalize(name))
    .join('');
  const exportStatement = `export { default as ${pluginNameCapitalized}} from @backstage/plugin-${testPluginName}`;
  addExportStatement(testFilePath, exportStatement);
};

const mkTestPluginDir = (testDirPath: string) => {
  fse.mkdirSync(testDirPath);
  for (let i = 0; i < 50; i++)
    fse.createFileSync(path.join(testDirPath, `testFile${i}.ts`));
};

beforeAll(() => {
  // Create temporary directory for all tests
  createTemporaryPluginFolder(tempDir);
});

describe('removePlugin', () => {
  describe('Remove Plugin Dependencies', () => {
    const appPath = paths.resolveTargetRoot('packages', 'app');
    const githubDir = paths.resolveTargetRoot('.github');
    it('removes plugin references from /packages/app/package.json', async () => {
      // Set up test
      const packageFilePath = path.join(appPath, 'package.json');
      const testFilePath = path.join(tempDir, 'test.json');
      createTestPackageFile(testFilePath, packageFilePath);
      try {
        await removeReferencesFromAppPackage(testFilePath, testPluginName);
        const testFileContent = removeEmptyLines(
          fse.readFileSync(testFilePath, 'utf8'),
        );
        const packageFileContent = removeEmptyLines(
          fse.readFileSync(packageFilePath, 'utf8'),
        );
        expect(testFileContent === packageFileContent).toBe(true);
      } finally {
        fse.removeSync(testFilePath);
      }
    });
    it('removes plugin exports from /packages/app/src/packacge.json', async () => {
      const testFilePath = path.join(tempDir, 'test.ts');
      const pluginsFilePaths = path.join(appPath, 'src', 'plugins.ts');
      createTestPluginFile(testFilePath, pluginsFilePaths);
      try {
        await removeReferencesFromPluginsFile(testFilePath, testPluginName);
        const testFileContent = removeEmptyLines(
          fse.readFileSync(testFilePath, 'utf8'),
        );
        const pluginsFileContent = removeEmptyLines(
          fse.readFileSync(pluginsFilePaths, 'utf8'),
        );
        expect(testFileContent === pluginsFileContent).toBe(true);
      } finally {
        fse.removeSync(testFilePath);
      }
    });
    it('removes codeOwners references', async () => {
      const testFilePath = path.join(tempDir, 'test');
      const codeownersPath = path.join(githubDir, 'CODEOWNERS');
      try {
        fse.copySync(codeownersPath, testFilePath);
        const testFileContent = removeEmptyLines(
          fse.readFileSync(testFilePath, 'utf8'),
        );
        const codeOwnersFileContent = removeEmptyLines(
          fse.readFileSync(codeownersPath, 'utf8'),
        );
        await addCodeownersEntry(testFilePath!, `/plugins/${testPluginName}`, [
          '@thisIsAtestTeam',
          'test@gmail.com',
        ]);
        await removePluginFromCodeOwners(testFilePath, testPluginName);
        expect(testFileContent === codeOwnersFileContent).toBeTruthy();
      } finally {
        if (fse.existsSync(testFilePath)) fse.removeSync(testFilePath);
      }
    });
  });
  describe('Remove files', () => {
    const testDirPath = path.join(
      paths.resolveTargetRoot(),
      'plugins',
      testPluginName,
    );
    describe('Removes Plugin Directory', () => {
      it('removes plugin directory from /plugins', async () => {
        try {
          mkTestPluginDir(testDirPath);
          expect(fse.existsSync(testDirPath)).toBeTruthy();
          await removePluginDirectory(testDirPath);
          expect(fse.existsSync(testDirPath)).toBeFalsy();
        } finally {
          if (fse.existsSync(testDirPath)) fse.removeSync(testDirPath);
        }
      });
    });
    describe('Removes System Link', () => {
      it('removes system link from @backstage', async () => {
        const scopedDir = paths.resolveTargetRoot('node_modules', '@backstage');
        const testSymLinkPath = path.join(
          scopedDir,
          `plugin-${testPluginName}`,
        );
        try {
          mkTestPluginDir(testDirPath);
          fse.ensureSymlinkSync(testSymLinkPath, testDirPath);

          await removeSymLink(testSymLinkPath);
          expect(fse.existsSync(testSymLinkPath)).toBeFalsy();
        } finally {
          if (fse.existsSync(testDirPath)) fse.removeSync(testDirPath);
          if (fse.existsSync(testSymLinkPath)) fse.removeSync(testSymLinkPath);
        }
      });
    });
  });
});

afterAll(() => {
  // Remove temporary directory
  fse.removeSync(tempDir);
});
