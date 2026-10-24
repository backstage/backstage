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
const { execFileSync } = require('node:child_process');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { test } = require('node:test');

function writeJson(filePath, value) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, `${JSON.stringify(value, null, 2)}\n`);
}

function git(repoDir, ...args) {
  execFileSync('git', args, { cwd: repoDir, stdio: 'ignore' });
}

test('adds a changelog entry when advancing past a patch release', t => {
  const tempDir = fs.mkdtempSync(
    path.join(os.tmpdir(), 'backstage-prepare-release-'),
  );
  t.after(() => fs.rmSync(tempDir, { recursive: true, force: true }));

  const repoDir = path.join(tempDir, 'repo');
  const remoteDir = path.join(tempDir, 'remote.git');
  const packageDir = path.join(repoDir, 'packages/example');
  const changesetDir = path.join(repoDir, '.changeset');

  fs.mkdirSync(repoDir);
  git(repoDir, 'init', '--initial-branch=master');
  git(repoDir, 'config', 'user.name', 'Test');
  git(repoDir, 'config', 'user.email', 'test@example.com');
  git(repoDir, 'init', '--bare', remoteDir);
  git(repoDir, 'remote', 'add', 'origin', remoteDir);

  writeJson(path.join(repoDir, 'package.json'), {
    name: 'backstage',
    private: true,
    version: '1.0.0',
    workspaces: ['packages/*'],
  });
  writeJson(path.join(packageDir, 'package.json'), {
    name: '@backstage/example',
    version: '1.0.0',
  });
  fs.writeFileSync(
    path.join(packageDir, 'CHANGELOG.md'),
    '# @backstage/example\n\n## 1.0.0\n\n### Patch Changes\n\n- Initial release\n',
  );
  git(repoDir, 'add', '.');
  git(repoDir, 'commit', '-m', 'baseline');
  git(repoDir, 'tag', 'v1.0.0');

  git(repoDir, 'switch', '-c', 'patch/v1.0.0');
  writeJson(path.join(packageDir, 'package.json'), {
    name: '@backstage/example',
    version: '1.0.1',
  });
  git(repoDir, 'add', '.');
  git(repoDir, 'commit', '-m', 'patch release');
  git(repoDir, 'push', 'origin', 'patch/v1.0.0');

  git(repoDir, 'switch', 'master');
  writeJson(path.join(repoDir, 'package.json'), {
    name: 'backstage',
    private: true,
    version: '1.1.0-next.0',
    workspaces: ['packages/*'],
  });
  writeJson(path.join(packageDir, 'package.json'), {
    name: '@backstage/example',
    version: '1.0.1-next.0',
  });
  writeJson(path.join(changesetDir, 'pre.json'), {
    mode: 'pre',
    tag: 'next',
    initialVersions: {
      '@backstage/example': '1.0.0',
    },
    changesets: [],
  });
  fs.mkdirSync(path.join(repoDir, 'scripts'));
  fs.copyFileSync(
    path.resolve(__dirname, 'prepare-release.js'),
    path.join(repoDir, 'scripts/prepare-release.js'),
  );
  git(repoDir, 'add', '.');
  git(repoDir, 'commit', '-m', 'start prerelease');

  execFileSync(
    process.execPath,
    [path.join(repoDir, 'scripts/prepare-release.js')],
    {
      cwd: repoDir,
      env: {
        ...process.env,
        NODE_PATH: path.resolve(__dirname, '../node_modules'),
      },
      stdio: 'inherit',
    },
  );

  assert.equal(
    JSON.parse(fs.readFileSync(path.join(packageDir, 'package.json'), 'utf8'))
      .version,
    '1.0.2-next.0',
  );
  assert.match(
    fs.readFileSync(path.join(packageDir, 'CHANGELOG.md'), 'utf8'),
    /## 1\.0\.2-next\.0\n\n### Patch Changes\n\n- Bumped version to account for a patch release\./,
  );
});
