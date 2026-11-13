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
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { spawnSync } = require('node:child_process');
const { afterEach, test } = require('node:test');

const verifierPath = path.resolve(__dirname, 'verify-links.js');
const temporaryDirectories = [];

afterEach(() => {
  for (const directory of temporaryDirectories.splice(0)) {
    fs.rmSync(directory, { recursive: true, force: true });
  }
});

function runGit(projectRoot, ...args) {
  const result = spawnSync('git', args, {
    cwd: projectRoot,
    encoding: 'utf8',
  });
  assert.equal(result.status, 0, result.stderr);
}

function createPatchProject({ anchor = 'upgrade-notes' } = {}) {
  const projectRoot = fs.mkdtempSync(
    path.join(os.tmpdir(), 'verify-links-test-'),
  );
  temporaryDirectories.push(projectRoot);

  fs.mkdirSync(path.join(projectRoot, 'docs/features/example'), {
    recursive: true,
  });
  fs.mkdirSync(path.join(projectRoot, 'scripts'));
  fs.copyFileSync(
    verifierPath,
    path.join(projectRoot, 'scripts/verify-links.js'),
  );
  fs.writeFileSync(
    path.join(projectRoot, 'docs/features/example/index.md'),
    `[release notes](../../releases/v1.2.3.md#${anchor})\n`,
  );

  runGit(projectRoot, 'init', '--initial-branch=master');
  runGit(projectRoot, 'config', 'user.email', 'test@example.com');
  runGit(projectRoot, 'config', 'user.name', 'Test User');
  runGit(projectRoot, 'add', '.');
  runGit(projectRoot, 'commit', '-m', 'initial');

  fs.mkdirSync(path.join(projectRoot, 'docs/releases'));
  fs.writeFileSync(
    path.join(projectRoot, 'docs/releases/v1.2.3.md'),
    '# Upgrade notes\n',
  );
  runGit(projectRoot, 'add', '.');
  runGit(projectRoot, 'commit', '-m', 'add release notes');
  runGit(projectRoot, 'switch', '--detach', 'HEAD~1');

  return projectRoot;
}

function runVerifier(projectRoot, ...args) {
  return spawnSync(process.execPath, ['scripts/verify-links.js', ...args], {
    cwd: projectRoot,
    encoding: 'utf8',
  });
}

test('resolves missing release notes from a fallback Git ref', () => {
  const projectRoot = createPatchProject();

  const result = runVerifier(projectRoot, '--release-docs-ref=master');

  assert.equal(result.status, 0, result.stdout + result.stderr);
});

test('rejects missing anchors in fallback release notes', () => {
  const projectRoot = createPatchProject({ anchor: 'missing-anchor' });

  const result = runVerifier(projectRoot, '--release-docs-ref=master');

  assert.equal(result.status, 1, result.stdout + result.stderr);
  assert.match(result.stderr, /Anchor not found in target document/);
});

test('rejects release notes missing from both the checkout and fallback', () => {
  const projectRoot = createPatchProject();

  const result = runVerifier(projectRoot, '--release-docs-ref=missing-ref');

  assert.equal(result.status, 1, result.stdout + result.stderr);
  assert.match(result.stderr, /Unable to reach/);
});

test('validates local release notes instead of the fallback', () => {
  const projectRoot = createPatchProject();
  fs.mkdirSync(path.join(projectRoot, 'docs/releases'));
  fs.writeFileSync(
    path.join(projectRoot, 'docs/releases/v1.2.3.md'),
    '# Different local heading\n',
  );

  const result = runVerifier(projectRoot, '--release-docs-ref=master');

  assert.equal(result.status, 1, result.stdout + result.stderr);
  assert.match(result.stderr, /Anchor not found in target document/);
});

test('does not accept a directory from the fallback as a document', () => {
  const projectRoot = createPatchProject();
  runGit(projectRoot, 'switch', 'master');
  fs.mkdirSync(path.join(projectRoot, 'docs/releases/archive'));
  fs.writeFileSync(
    path.join(projectRoot, 'docs/releases/archive/index.md'),
    '# Archive\n',
  );
  runGit(projectRoot, 'add', '.');
  runGit(projectRoot, 'commit', '-m', 'add release archive');
  runGit(projectRoot, 'switch', '--detach', 'HEAD~2');
  fs.writeFileSync(
    path.join(projectRoot, 'docs/features/example/index.md'),
    '[release archive](../../releases/archive)\n',
  );

  const result = runVerifier(projectRoot, '--release-docs-ref=master');

  assert.equal(result.status, 1, result.stdout + result.stderr);
  assert.match(result.stderr, /Unable to reach/);
});
