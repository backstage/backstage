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

import fs from 'fs-extra';
import { resolve as resolvePath } from 'path';
import os from 'os';
import del from 'del';
import { templatingTask } from './tasks';

describe('templatingTask', () => {
  it('should template a directory with mix of regular files and templates', async () => {
    // Set up a testing template directory
    const tmplDir = await fs.mkdtemp(resolvePath(os.tmpdir(), 'test-'));
    await fs.ensureDir(resolvePath(tmplDir, 'sub'));
    await fs.writeFile(resolvePath(tmplDir, 'test.txt'), 'testing');
    await fs.writeFile(
      resolvePath(tmplDir, 'sub/version.txt.hbs'),
      'version: {{version}}',
    );

    // Set up a temporary dest dir to write the template to
    const destDir = await fs.mkdtemp(resolvePath(os.tmpdir(), 'test-'));

    try {
      await templatingTask(tmplDir, destDir, {
        version: '0.0.0',
      });

      await expect(
        fs.readFile(resolvePath(destDir, 'test.txt'), 'utf8'),
      ).resolves.toBe('testing');
      await expect(
        fs.readFile(resolvePath(destDir, 'sub/version.txt'), 'utf8'),
      ).resolves.toBe('version: 0.0.0');
    } finally {
      await del(tmplDir, { force: true });
      await del(destDir, { force: true });
    }
  });
});
