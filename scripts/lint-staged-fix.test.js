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
const { spawnSync } = require('node:child_process');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { afterEach, test } = require('node:test');

const dispatcher = path.resolve(__dirname, 'lint-staged-fix.js');
const temporaryDirectories = [];

afterEach(() => {
  for (const directory of temporaryDirectories.splice(0)) {
    fs.rmSync(directory, { recursive: true, force: true });
  }
});

function writePackage(directory, packageJson) {
  fs.mkdirSync(directory, { recursive: true });
  fs.writeFileSync(
    path.join(directory, 'package.json'),
    JSON.stringify(packageJson),
  );
}

function createWorkspace() {
  const temporaryDirectory = fs.mkdtempSync(
    path.join(os.tmpdir(), 'staged-lint-'),
  );
  temporaryDirectories.push(temporaryDirectory);
  const root = path.join(temporaryDirectory, '.hidden workspace');
  writePackage(root, {
    name: 'root',
    private: true,
    workspaces: ['packages/*', 'packages/*/nested'],
    scripts: { lint: 'do-not-run-repository-wide-lint' },
  });
  fs.mkdirSync(path.join(root, '.tools'));
  fs.writeFileSync(
    path.join(root, '.yarnrc.yml'),
    'yarnPath: ".tools/yarn entry.cjs"\n',
  );
  fs.writeFileSync(
    path.join(root, '.tools/yarn entry.cjs'),
    `const fs = require('node:fs');
const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));
const args = process.argv.slice(2);
fs.appendFileSync(process.env.LINT_TRACE, JSON.stringify({
  cwd: process.cwd(), args, script: args[0] === 'run' ? pkg.scripts.lint : null,
}) + '\\n');
if (pkg.fix) {
  for (const file of args.slice(args.indexOf('--fix') + 1)) {
    fs.writeFileSync(file, fs.readFileSync(file, 'utf8').replace("'staged'", "'fixed'"));
  }
}
process.exitCode = pkg.fail || 0;
`,
  );
  return root;
}

function addPackage(root, directory, options = {}) {
  const dir = path.join(root, 'packages', directory);
  writePackage(dir, { name: directory.replaceAll('/', '-'), ...options });
  return dir;
}

function run(root, files) {
  return spawnSync(process.execPath, [dispatcher, ...files], {
    cwd: root,
    encoding: 'utf8',
    env: { ...process.env, LINT_TRACE: path.join(root, 'trace.jsonl') },
  });
}

function calls(root) {
  const trace = path.join(root, 'trace.jsonl');
  return fs.existsSync(trace)
    ? fs
        .readFileSync(trace, 'utf8')
        .trim()
        .split(/\r?\n/)
        .map(line => JSON.parse(line))
    : [];
}

test('groups files by package and follows scripts without an engine map or config inference', () => {
  const root = createWorkspace();
  const eslint = addPackage(root, 'eslint', {
    scripts: { lint: 'backstage-cli package lint' },
  });
  const oxlint = addPackage(root, 'eslint-extra', {
    scripts: { lint: 'node bin/backstage-cli-module-oxlint package lint' },
  });
  const nested = addPackage(root, 'eslint/nested', {
    scripts: { lint: 'custom-linter' },
  });
  const fallback = addPackage(root, 'fallback');
  // Config presence must not select an engine.
  fs.writeFileSync(path.join(eslint, '.oxlintrc.js'), 'module.exports = {};');
  fs.writeFileSync(path.join(oxlint, '.eslintrc.js'), 'module.exports = {};');

  const result = run(root, [
    path.join(eslint, 'src/first.ts'),
    "packages/eslint-extra/src/space & apostrophe's.ts",
    path.join(eslint, '-flag.ts'),
    path.join(nested, 'src/nested.ts'),
    path.join(fallback, 'src/fallback.ts'),
    'scripts/root.ts',
    path.join(eslint, 'src/first.ts'),
  ]);
  assert.equal(result.status, 0, result.stderr);
  assert.deepEqual(calls(root), [
    {
      cwd: eslint,
      args: ['run', 'lint', '--fix', './src/first.ts', './-flag.ts'],
      script: 'backstage-cli package lint',
    },
    {
      cwd: oxlint,
      args: ['run', 'lint', '--fix', "./src/space & apostrophe's.ts"],
      script: 'node bin/backstage-cli-module-oxlint package lint',
    },
    {
      cwd: nested,
      args: ['run', 'lint', '--fix', './src/nested.ts'],
      script: 'custom-linter',
    },
    {
      cwd: fallback,
      args: [
        'exec',
        'backstage-cli',
        'package',
        'lint',
        '--fix',
        './src/fallback.ts',
      ],
      script: null,
    },
    {
      cwd: root,
      args: [
        'exec',
        'backstage-cli',
        'package',
        'lint',
        '--fix',
        './scripts/root.ts',
      ],
      script: null,
    },
  ]);

  writePackage(eslint, {
    name: 'eslint',
    scripts: { lint: 'a-new-native-linter' },
  });
  assert.equal(run(root, [path.join(eslint, 'src/first.ts')]).status, 0);
  assert.equal(calls(root).at(-1).script, 'a-new-native-linter');
});

test('fails closed for invalid paths and propagates lint failures without running later packages', () => {
  const root = createWorkspace();
  const first = addPackage(root, 'first', {
    scripts: { lint: 'first-linter' },
    fail: 7,
  });
  const second = addPackage(root, 'second', {
    scripts: { lint: 'second-linter' },
  });

  assert.equal(run(root, []).status, 0);
  assert.deepEqual(calls(root), []);
  const outside = run(root, [
    path.join(first, 'src/file.ts'),
    path.join(root, '../outside.ts'),
  ]);
  assert.equal(outside.status, 1);
  assert.match(outside.stderr, /outside the repository/);
  assert.deepEqual(calls(root), []);

  const failed = run(root, [
    path.join(first, 'src/file.ts'),
    path.join(second, 'src/file.ts'),
  ]);
  assert.equal(failed.status, 7);
  assert.equal(calls(root).length, 1);

  fs.writeFileSync(path.join(root, '.yarnrc.yml'), '{}');
  const missingYarn = run(root, [path.join(first, 'src/file.ts')]);
  assert.equal(missingYarn.status, 1);
  assert.match(missingYarn.stderr, /requires yarnPath/);
  assert.equal(calls(root).length, 1);
});

function git(root, ...args) {
  const result = spawnSync('git', args, { cwd: root, encoding: 'utf8' });
  assert.equal(result.status, 0, result.stderr);
  return result.stdout;
}

test('lint-staged fixes only selected files and preserves partial staging, including failure rollback', () => {
  const root = createWorkspace();
  const pkg = addPackage(root, 'native', {
    scripts: { lint: 'native-linter' },
    fix: true,
  });
  const staged = path.join(pkg, 'src/staged.ts');
  const unstaged = path.join(pkg, 'src/unstaged.ts');
  fs.mkdirSync(path.dirname(staged));
  fs.writeFileSync(staged, "export const value = 'baseline';\n");
  fs.writeFileSync(unstaged, "export const other = 'baseline';\n");
  const manifestPath = path.join(root, 'package.json');
  const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
  manifest['lint-staged'] = {
    '*.ts': `node "${dispatcher.replaceAll(path.sep, '/')}"`,
  };
  fs.writeFileSync(manifestPath, JSON.stringify(manifest));

  git(root, 'init', '--initial-branch=master');
  git(root, 'config', 'core.autocrlf', 'false');
  git(root, 'add', '.');
  git(
    root,
    '-c',
    'commit.gpgsign=false',
    '-c',
    'core.hooksPath=.no-hooks',
    '-c',
    'user.name=Test',
    '-c',
    'user.email=test@example.com',
    'commit',
    '-m',
    'initial',
  );
  fs.writeFileSync(staged, "export const value = 'staged';\n");
  git(root, 'add', 'packages/native/src/staged.ts');
  fs.appendFileSync(staged, '// keep unstaged\n');
  fs.writeFileSync(unstaged, "export const other = 'staged';\n");

  const lintStaged = path.resolve(
    path.dirname(require.resolve('lint-staged')),
    '../bin/lint-staged.js',
  );
  const runHook = () =>
    spawnSync(process.execPath, [lintStaged], {
      cwd: root,
      encoding: 'utf8',
      env: { ...process.env, LINT_TRACE: path.join(root, 'trace.jsonl') },
    });
  const result = runHook();
  assert.equal(result.status, 0, result.stdout + result.stderr);
  assert.equal(
    git(root, 'show', ':packages/native/src/staged.ts'),
    "export const value = 'fixed';\n",
  );
  assert.equal(
    fs.readFileSync(staged, 'utf8'),
    "export const value = 'fixed';\n// keep unstaged\n",
  );
  assert.equal(
    fs.readFileSync(unstaged, 'utf8'),
    "export const other = 'staged';\n",
  );
  assert.deepEqual(calls(root)[0].args, [
    'run',
    'lint',
    '--fix',
    './src/staged.ts',
  ]);

  writePackage(pkg, {
    name: 'native',
    scripts: { lint: 'native-linter' },
    fix: true,
    fail: 7,
  });
  fs.writeFileSync(staged, "export const value = 'staged';\n");
  git(root, 'add', 'packages/native/src/staged.ts');
  fs.appendFileSync(staged, '// keep unstaged\n');
  const failed = runHook();
  assert.notEqual(failed.status, 0);
  assert.equal(
    git(root, 'show', ':packages/native/src/staged.ts'),
    "export const value = 'staged';\n",
  );
  assert.equal(
    fs.readFileSync(staged, 'utf8'),
    "export const value = 'staged';\n// keep unstaged\n",
  );
  assert.equal(
    fs.readFileSync(unstaged, 'utf8'),
    "export const other = 'staged';\n",
  );
});
