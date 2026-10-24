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

const { isNextReleaseVersion } = require('./create-release-changelog');

const scriptPath = path.resolve(__dirname, 'create-release-changelog.js');

function writeJson(filePath, value) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, `${JSON.stringify(value, null, 2)}\n`);
}

function writePackage(repoDir, directory, packageJson, changelog) {
  writeJson(path.join(repoDir, directory, 'package.json'), packageJson);
  fs.writeFileSync(path.join(repoDir, directory, 'CHANGELOG.md'), changelog);
}

test('identifies only next-line release versions', () => {
  assert.equal(isNextReleaseVersion('1.55.0-next.1'), true);
  assert.equal(isNextReleaseVersion('1.55.0'), false);
  assert.equal(isNextReleaseVersion('1.55.1'), false);
});

test('creates a sorted aggregate changelog for changed packages', t => {
  const repoDir = fs.mkdtempSync(
    path.join(os.tmpdir(), 'backstage-release-changelog-'),
  );
  t.after(() => fs.rmSync(repoDir, { recursive: true, force: true }));

  writeJson(path.join(repoDir, 'package.json'), {
    name: 'backstage',
    private: true,
    version: '1.2.2',
    workspaces: ['packages/*'],
  });
  writePackage(
    repoDir,
    'packages/minor',
    { name: '@backstage/minor', version: '1.0.0' },
    '# @backstage/minor\n',
  );
  writePackage(
    repoDir,
    'packages/patch',
    { name: '@backstage/patch', version: '1.0.0' },
    '# @backstage/patch\n',
  );
  writePackage(
    repoDir,
    'packages/private',
    { name: '@backstage/private', private: true, version: '1.0.0' },
    '# @backstage/private\n',
  );
  writePackage(
    repoDir,
    'packages/unchanged',
    { name: '@backstage/unchanged', version: '1.0.0' },
    '# @backstage/unchanged\n',
  );

  execFileSync('git', ['init'], { cwd: repoDir });
  execFileSync('git', ['add', '.'], { cwd: repoDir });
  execFileSync(
    'git',
    [
      '-c',
      'user.name=Test',
      '-c',
      'user.email=test@example.com',
      'commit',
      '-m',
      'baseline',
    ],
    { cwd: repoDir },
  );

  writeJson(path.join(repoDir, 'package.json'), {
    name: 'backstage',
    private: true,
    version: '1.2.3',
    workspaces: ['packages/*'],
  });
  writePackage(
    repoDir,
    'packages/minor',
    { name: '@backstage/minor', version: '1.1.0' },
    '# @backstage/minor\n\n## 1.1.0\n\n### Minor Changes\n\n- Add a feature\n\n## 1.0.0\n\n- Old entry\n',
  );
  writePackage(
    repoDir,
    'packages/patch',
    { name: '@backstage/patch', version: '1.0.1' },
    '# @backstage/patch\n\n## 1.0.1\n\n### Patch Changes\n\n- Fix a bug\n',
  );
  writePackage(
    repoDir,
    'packages/private',
    { name: '@backstage/private', private: true, version: '2.0.0' },
    '# @backstage/private\n\n## 2.0.0\n\n### Major Changes\n\n- Internal rewrite\n',
  );
  writePackage(
    repoDir,
    'packages/new',
    { name: '@backstage/new', version: '1.0.0' },
    '# @backstage/new\n\n## 1.0.0\n\n### Patch Changes\n\n- Initial release\n',
  );

  execFileSync(process.execPath, [scriptPath], {
    cwd: repoDir,
    stdio: 'inherit',
  });

  const output = fs.readFileSync(
    path.join(repoDir, 'docs/releases/v1.2.3-changelog.md'),
    'utf8',
  );

  assert.match(output, /^# Release v1\.2\.3/m);
  assert.match(
    output,
    /https:\/\/backstage\.github\.io\/upgrade-helper\/\?to=1\.2\.3/,
  );
  assert.ok(
    output.indexOf('## @backstage/minor@1.1.0') <
      output.indexOf('## @backstage/patch@1.0.1'),
  );
  assert.ok(
    output.indexOf('## @backstage/patch@1.0.1') <
      output.indexOf('## @backstage/private@2.0.0'),
  );
  assert.doesNotMatch(output, /@backstage\/unchanged/);
  assert.doesNotMatch(output, /Old entry/);
  assert.match(output, /## @backstage\/new@1\.0\.0/);
});
