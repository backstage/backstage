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
import { removePluginDependencyFromApp } from './removePlugin';

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

    const packageFileContents = JSON.parse(
      fse.readFileSync(packageFile, 'utf8'),
    );
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
// Still to implement
// test remove plugin dependency from app
// remove plugin from directory
// remove symlink from lerna scope
