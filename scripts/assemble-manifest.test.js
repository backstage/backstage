/*
 * Copyright 2026 The Backstage Authors
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

const assert = require('node:assert/strict');
const { execFile } = require('node:child_process');
const fs = require('node:fs/promises');
const os = require('node:os');
const path = require('node:path');
const { promisify } = require('node:util');
const { test } = require('node:test');

const execFileAsync = promisify(execFile);

test('publishes root package engines as release requirements', async () => {
  const fixture = await fs.mkdtemp(
    path.join(os.tmpdir(), 'backstage-manifest-'),
  );
  try {
    await fs.mkdir(path.join(fixture, 'packages', 'example'), {
      recursive: true,
    });
    await fs.writeFile(
      path.join(fixture, 'package.json'),
      JSON.stringify({
        name: 'root',
        private: true,
        version: '1.55.2',
        workspaces: ['packages/*'],
        engines: { node: '22 || 24' },
      }),
    );
    await fs.writeFile(path.join(fixture, 'yarn.lock'), '');
    await fs.writeFile(
      path.join(fixture, 'packages', 'example', 'package.json'),
      JSON.stringify({ name: '@backstage/example', version: '1.0.0' }),
    );

    await execFileAsync(
      process.execPath,
      [path.resolve(__dirname, 'assemble-manifest.js'), '1.55.2'],
      { cwd: fixture },
    );

    const manifest = JSON.parse(
      await fs.readFile(
        path.join(fixture, 'versions/v1/releases/1.55.2/manifest.json'),
        'utf8',
      ),
    );
    assert.deepEqual(manifest, {
      releaseVersion: '1.55.2',
      requirements: { node: '22 || 24' },
      packages: [{ name: '@backstage/example', version: '1.0.0' }],
    });
  } finally {
    await fs.rm(fixture, { recursive: true, force: true });
  }
});
