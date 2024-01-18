/*
 * Copyright 2020 The Backstage Authors
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

import fs from 'fs-extra';
import { templatingTask } from './tasks';
import { createMockDirectory } from '@backstage/backend-test-utils';

describe('templatingTask', () => {
  const mockDir = createMockDirectory();

  it('should template a directory with mix of regular files and templates', async () => {
    // Testing template directory
    const tmplDir = 'test-tmpl';

    // Temporary dest dir to write the template to
    const destDir = 'test-dest';

    // Files content
    const testFileContent = 'testing';
    const testVersionFileContent =
      "version: {{pluginVersion}} {{versionQuery 'mock-pkg'}}";

    mockDir.setContent({
      [tmplDir]: {
        sub: {
          'version.txt.hbs': testVersionFileContent,
        },
        'test.txt': testFileContent,
      },
      [destDir]: {},
    });

    await templatingTask(
      mockDir.resolve(tmplDir),
      mockDir.resolve(destDir),
      {
        pluginVersion: '0.0.0',
      },
      () => '^0.1.2',
      true,
    );

    await expect(
      fs.readFile(mockDir.resolve(destDir, 'test.txt'), 'utf8'),
    ).resolves.toBe(testFileContent);
    await expect(
      fs.readFile(mockDir.resolve(destDir, 'sub/version.txt'), 'utf8'),
    ).resolves.toBe('version: 0.0.0 ^0.1.2');
  });
});
