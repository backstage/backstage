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
import path from 'path';
import os from 'os';
import del from 'del';
import { createTemporaryPluginFolder, movePlugin } from './createPlugin';

describe('createPlugin', () => {
  describe('createPluginFolder', () => {
    it('should create a temporary plugin directory in the correct place', async () => {
      const id = 'testPlugin';
      const tempDir = path.join(os.tmpdir(), id);
      try {
        await createTemporaryPluginFolder(tempDir);
        await expect(fs.pathExists(tempDir)).resolves.toBe(true);
        expect(tempDir).toMatch(id);
      } finally {
        await del(tempDir, { force: true });
      }
    });

    it('should not create a temporary plugin directory if it already exists', async () => {
      const id = 'testPlugin';
      const tempDir = path.join(os.tmpdir(), id);
      try {
        await createTemporaryPluginFolder(tempDir);
        await expect(fs.pathExists(tempDir)).resolves.toBe(true);
        await expect(createTemporaryPluginFolder(tempDir)).rejects.toThrow(
          /Failed to create temporary plugin directory/,
        );
      } finally {
        await del(tempDir, { force: true });
      }
    });
  });

  describe('movePlugin', () => {
    it('should move the temporary plugin directory to its final place', async () => {
      const id = 'testPlugin';
      const tempDir = path.join(os.tmpdir(), id);
      const rootDir = await fs.mkdtemp(path.join(os.tmpdir(), 'test-'));
      const pluginDir = path.join(rootDir, 'plugins', id);
      try {
        await createTemporaryPluginFolder(tempDir);
        await movePlugin(tempDir, pluginDir, id);
        await expect(fs.pathExists(pluginDir)).resolves.toBe(true);
        expect(pluginDir).toMatch(`/plugins\/${id}`);
      } finally {
        await del(tempDir, { force: true });
        await del(rootDir, { force: true });
      }
    });
  });
});
