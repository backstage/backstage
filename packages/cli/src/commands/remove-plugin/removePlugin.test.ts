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
import mockFs from 'mock-fs';

const BACKSTAGE = `@backstage`;
const testPluginName = 'yarn-test-package';
const testPluginPackage = `${BACKSTAGE}/plugin-${testPluginName}`;
const tempDir = path.join(os.tmpdir(), 'remove-plugin-test');

const removeEmptyLines = (file: string): string =>
  file.split(/\r?\n/).filter(Boolean).join('\n');

const createTestPackageFile = async (
  testFilePath: string,
  packageFile: string,
) => {
  // Copy contents of package file for test
  const packageFileContent = JSON.parse(fse.readFileSync(packageFile, 'utf8'));

  const testFileContent = {
    ...packageFileContent,
    dependencies: {
      ...packageFileContent.dependencies,
      [testPluginPackage]: '0.1.0',
    },
  };

  mockFs({
    '/packages': {
      app: {
        'package.json': `${JSON.stringify(packageFileContent, null, 2)}\n`,
      },
    },
    '/remove-plugin-test': {
      [testFilePath]: `${JSON.stringify(testFileContent, null, 2)}\n`,
    },
  });
  return;
};

const createTestPluginFile = async (
  testFilePath: string,
  pluginsFilePath: string,
) => {
  // Copy contents of package file for test
  const pluginsFileContent = fse.readFileSync(pluginsFilePath);

  mockFs({
    '/remove-plugin-test': {
      [testFilePath]: `${pluginsFileContent}\n`,
      [pluginsFilePath]: `${pluginsFileContent}\n`,
    },
    '/packages': {
      app: {
        src: {
          'plugin.ts': `${pluginsFileContent}\n`,
        },
      },
    },
  });

  const pluginNameCapitalized = testPluginName
    .split('-')
    .map(name => capitalize(name))
    .join('');
  const exportStatement = `export { default as ${pluginNameCapitalized}} from @backstage/plugin-${testPluginName}`;
  addExportStatement(`/remove-plugin-test/${testFilePath}`, exportStatement);
};

const mkTestPluginDir = (testDirPath: string) => {
  const dirPath = `/${testDirPath}`;

  const pluginFiles: { [index: number]: string } = {};
  for (let i = 0; i < 50; i++) {
    pluginFiles[i] = '';
  }

  mockFs({
    [dirPath]: pluginFiles,
  });
};

afterEach(() => {
  mockFs.restore();
});

describe('removePlugin', () => {
  beforeAll(() => {
    // Create temporary directory for all tests
    createTemporaryPluginFolder(tempDir);
  });

  afterAll(() => {
    // Remove temporary directory
    fse.removeSync(tempDir);
  });

  describe('Remove Plugin Dependencies', () => {
    const appPath = paths.resolveTargetRoot('packages', 'app');
    const githubDir = paths.resolveTargetRoot('.github');

    it('removes plugin references from /packages/app/package.json', async () => {
      // Set up test
      const packageFilePath = path.join(appPath, 'package.json');
      const testFilePath = 'test.json';
      createTestPackageFile(testFilePath, packageFilePath);
      await removeReferencesFromAppPackage(
        '/remove-plugin-test/test.json',
        testPluginName,
      );
      const testFileContent = removeEmptyLines(
        fse.readFileSync(`/remove-plugin-test/${testFilePath}`, 'utf8'),
      );

      const packageFileContent = removeEmptyLines(
        fse.readFileSync('/packages/app/package.json', 'utf8'),
      );
      expect(testFileContent).toBe(packageFileContent);
    });
    it('removes plugin exports from /packages/app/src/packacge.json', async () => {
      const testFilePath = 'test.ts';
      const pluginsFilePaths = path.join(appPath, 'src', 'plugins.ts');
      createTestPluginFile(testFilePath, pluginsFilePaths);
      await removeReferencesFromPluginsFile(
        `/remove-plugin-test/${testFilePath}`,
        testPluginName,
      );
      const testFileContent = removeEmptyLines(
        fse.readFileSync(`/remove-plugin-test/${testFilePath}`, 'utf8'),
      );
      const pluginsFileContent = removeEmptyLines(
        fse.readFileSync('/packages/app/src/plugin.ts', 'utf8'),
      );
      expect(testFileContent).toBe(pluginsFileContent);
    });

    it('removes codeOwners references', async () => {
      const testFileName = 'test';
      const testFilePath = `/remove-plugin-test/${testFileName}`;
      const codeownersPath = path.join(githubDir, 'CODEOWNERS');
      const mockedCodeownersPath = '/.github/CODEOWNERS';

      mockFs({
        '/remove-plugin-test': {
          [testFileName]: '',
        },
        '/.github': {
          CODEOWNERS: fse.readFileSync(codeownersPath),
        },
      });
      fse.copySync(mockedCodeownersPath, testFilePath);
      const testFileContent = removeEmptyLines(
        fse.readFileSync(testFilePath, 'utf8'),
      );
      const codeOwnersFileContent = removeEmptyLines(
        fse.readFileSync(mockedCodeownersPath, 'utf8'),
      );
      await addCodeownersEntry(testFilePath!, `/plugins/${testPluginName}`, [
        '@thisIsAtestTeam',
        'test@gmail.com',
      ]);
      await removePluginFromCodeOwners(testFilePath, testPluginName);
      expect(testFileContent).toBe(codeOwnersFileContent);
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
