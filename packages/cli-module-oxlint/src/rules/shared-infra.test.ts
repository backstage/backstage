/*
 * Copyright 2025 The Backstage Authors
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

import { spawnSync } from 'node:child_process';
import {
  cpSync,
  existsSync,
  mkdtempSync,
  mkdirSync,
  readFileSync,
  readdirSync,
  rmSync,
  symlinkSync,
  writeFileSync,
} from 'node:fs';
import os from 'node:os';
import path from 'node:path';

const FIXTURE = path.resolve(__dirname, '../__fixtures__/monorepo');

function createYarnRecorder(tempRoot: string) {
  const fakeYarnPath = path.join(tempRoot, 'fake-yarn.cjs');
  const preloadPath = path.join(tempRoot, 'fake-yarn-preload.cjs');
  const tracePath = path.join(tempRoot, 'yarn-trace.jsonl');
  writeFileSync(
    fakeYarnPath,
    `const fs = require('node:fs');
const path = require('node:path');
const args = process.argv.slice(2);
fs.appendFileSync(process.env.YARN_TRACE, JSON.stringify({ args, cwd: process.cwd() }) + '\\n');
const packageJsonPath = path.join(process.cwd(), 'package.json');
const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
const action = args.shift();
if (action === 'add') {
  const field = args.includes('--peer') ? 'peerDependencies' : args.includes('--dev') ? 'devDependencies' : 'dependencies';
  packageJson[field] ||= {};
  for (const spec of args.filter(arg => !arg.startsWith('-'))) {
    const at = spec.lastIndexOf('@');
    const slash = spec.indexOf('/');
    const hasVersion = at > slash;
    packageJson[field][hasVersion ? spec.slice(0, at) : spec] = hasVersion ? spec.slice(at + 1) : '*';
  }
} else if (action === 'remove') {
  for (const name of args) {
    for (const field of ['dependencies', 'devDependencies', 'peerDependencies']) {
      delete packageJson[field]?.[name];
    }
  }
} else {
  throw new Error('Unexpected fake yarn action: ' + action);
}
fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2) + '\\n');
`,
  );

  writeFileSync(
    preloadPath,
    `const childProcess = require('node:child_process');
const execFileSync = childProcess.execFileSync;
childProcess.execFileSync = function(file, args, options) {
  if (file === 'yarn') {
    if (!process.env.FAKE_YARN_SCRIPT) {
      throw new Error('Yarn execution is blocked in Oxlint tests');
    }
    return execFileSync.call(this, process.execPath, [process.env.FAKE_YARN_SCRIPT, ...args], options);
  }
  return execFileSync.call(this, file, args, options);
};
`,
  );

  return {
    tracePath,
    env: {
      ...process.env,
      NODE_OPTIONS: [
        process.env.NODE_OPTIONS,
        `--require="${preloadPath.replace(/\\/g, '/')}"`,
      ]
        .filter(Boolean)
        .join(' '),
      FAKE_YARN_SCRIPT: fakeYarnPath,
      YARN_TRACE: tracePath,
    },
  };
}

function readYarnCalls(tracePath: string) {
  return existsSync(tracePath)
    ? readFileSync(tracePath, 'utf8')
        .trim()
        .split(/\r?\n/)
        .map(line => JSON.parse(line))
    : [];
}

describe('Oxlint JavaScript plugin lifecycle', () => {
  it('loads only native createOnce rules without ESLint or its plugin', () => {
    const pluginPath = path.resolve(__dirname, '../../config/index.js');
    const result = spawnSync(
      process.execPath,
      [
        '-e',
        `
      const Module = require('node:module');
      const load = Module._load;
      Module._load = function(request, ...args) {
        if (request === 'eslint' || request === '@backstage/eslint-plugin') {
          throw new Error('Unexpected ESLint runtime dependency: ' + request);
        }
        return load.call(this, request, ...args);
      };
      const plugin = require(process.argv[1]);
      for (const rule of Object.values(plugin.rules)) {
        require('node:assert/strict').equal(typeof rule.createOnce, 'function');
      }
    `,
        pluginPath,
      ],
      { encoding: 'utf8' },
    );
    expect(result.error).toBeUndefined();
    expect(result.stderr).toBe('');
    expect(result.status).toBe(0);
  });

  it('matches absolute file scopes in normal and hidden workspaces', () => {
    const tempRoot = mkdtempSync(path.join(os.tmpdir(), 'oxlint-lifecycle-'));
    const workspace = path.join(tempRoot, 'monorepo');
    const hiddenWorkspace = path.join(tempRoot, '.paseo/monorepo');
    mkdirSync(path.dirname(hiddenWorkspace), { recursive: true });
    cpSync(FIXTURE, workspace, { recursive: true });
    cpSync(FIXTURE, hiddenWorkspace, { recursive: true });
    const packageDir = path.join(workspace, 'packages/bar');
    const tempDir = mkdtempSync(path.join(packageDir, 'lifecycle-'));
    const sourceDir = path.join(tempDir, 'src');
    const hiddenFile = path.join(packageDir, '.hidden/src/hidden.js');
    const ignoredFile = path.join(sourceDir, 'ignored.js');
    const reportedFile = path.join(sourceDir, 'reported.js');
    const includedFile = path.join(sourceDir, 'included.js');
    const excludedFile = path.join(sourceDir, 'excluded.js');
    const hiddenCheckoutFile = path.join(
      hiddenWorkspace,
      'packages/bar/src/hidden-checkout.js',
    );
    const absoluteSourcePattern = '**/monorepo/packages/bar/**/src/**';
    const configFile = path.join(tempRoot, 'config.json');
    const oxlintBin = path.resolve(
      path.dirname(require.resolve('oxlint/package.json')),
      'bin/oxlint',
    );

    mkdirSync(sourceDir, { recursive: true });
    mkdirSync(path.dirname(hiddenFile), { recursive: true });
    mkdirSync(path.dirname(hiddenCheckoutFile), { recursive: true });
    writeFileSync(ignoredFile, `import '@internal/foo';\n`);
    writeFileSync(reportedFile, `import '@internal/foo';\n`);
    writeFileSync(includedFile, `import '@internal/foo';\n`);
    writeFileSync(excludedFile, `import '@internal/foo';\n`);
    writeFileSync(hiddenFile, `import '@internal/foo';\n`);
    writeFileSync(hiddenCheckoutFile, `import '@internal/foo';\n`);
    writeFileSync(
      configFile,
      JSON.stringify({
        jsPlugins: [path.resolve(__dirname, '../../config/index.js')],
        rules: { 'backstage/no-mixed-plugin-imports': 'error' },
        overrides: [
          {
            files: ['**/ignored.js'],
            rules: {
              'backstage/no-mixed-plugin-imports': [
                'error',
                { excludedTargetPackages: ['@internal/foo'] },
              ],
            },
          },
          {
            files: ['**/included.js'],
            rules: {
              'backstage/no-mixed-plugin-imports': [
                'error',
                { includedFiles: [absoluteSourcePattern] },
              ],
            },
          },
          {
            files: ['**/excluded.js'],
            rules: {
              'backstage/no-mixed-plugin-imports': [
                'error',
                { excludedFiles: [absoluteSourcePattern] },
              ],
            },
          },
        ],
      }),
    );

    try {
      const printedConfig = spawnSync(
        process.execPath,
        [oxlintBin, '--config', configFile, '--print-config', reportedFile],
        { cwd: workspace, encoding: 'utf8' },
      );
      expect(printedConfig.status).toBe(0);
      expect(printedConfig.stdout).toContain(
        'backstage/no-mixed-plugin-imports',
      );

      const result = spawnSync(
        process.execPath,
        [
          oxlintBin,
          '--config',
          configFile,
          '--disable-nested-config',
          '--format',
          'json',
          ignoredFile,
          reportedFile,
          includedFile,
          excludedFile,
          hiddenFile,
        ],
        { cwd: workspace, encoding: 'utf8' },
      );

      expect(result.error).toBeUndefined();
      expect(
        (JSON.parse(result.stdout) as { number_of_files: number })
          .number_of_files,
      ).toBe(5);
      expect(result.stdout).toContain('backstage(no-mixed-plugin-imports)');
      expect(result.stdout).toContain('reported.js');
      expect(result.stdout).toContain('included.js');
      expect(result.status).toBe(1);
      expect(result.stdout).not.toContain('ignored.js');
      expect(result.stdout).not.toContain('excluded.js');
      expect(result.stdout).not.toContain('hidden.js');
      expect(
        result.stdout.match(/backstage\(no-mixed-plugin-imports\)/g),
      ).toHaveLength(2);

      const hiddenResult = spawnSync(
        process.execPath,
        [
          oxlintBin,
          '--config',
          configFile,
          '--disable-nested-config',
          '--format',
          'json',
          hiddenCheckoutFile,
        ],
        { cwd: hiddenWorkspace, encoding: 'utf8' },
      );
      expect(hiddenResult.error).toBeUndefined();
      expect(hiddenResult.status).toBe(0);
      const hiddenReport = JSON.parse(hiddenResult.stdout) as {
        number_of_files: number;
        diagnostics: unknown[];
      };
      expect(hiddenReport.number_of_files).toBe(1);
      expect(hiddenReport.diagnostics).toEqual([]);
    } finally {
      rmSync(tempRoot, { recursive: true, force: true });
    }
  });

  it('keeps forbidden relative imports unchanged under --fix', () => {
    const tempRoot = mkdtempSync(
      path.join(os.tmpdir(), 'oxlint-relative-fix-'),
    );
    const workspace = path.join(tempRoot, 'workspace');
    const packagesDir = path.join(workspace, 'packages');
    const barDir = path.join(packagesDir, 'bar');
    const fooDir = path.join(packagesDir, 'foo');
    const barSourceDir = path.join(barDir, 'src');
    const fooSourceDir = path.join(fooDir, 'src');
    const sourceFile = path.join(barSourceDir, 'index.js');
    const configFile = path.join(tempRoot, 'config.json');
    const source = `import { value } from '../../foo/src/index.js';\n`;
    const oxlintBin = path.resolve(
      path.dirname(require.resolve('oxlint/package.json')),
      'bin/oxlint',
    );

    mkdirSync(barSourceDir, { recursive: true });
    mkdirSync(fooSourceDir, { recursive: true });
    writeFileSync(
      path.join(workspace, 'package.json'),
      JSON.stringify({
        name: 'root',
        private: true,
        workspaces: ['packages/*'],
      }),
    );
    writeFileSync(
      path.join(barDir, 'package.json'),
      JSON.stringify({
        name: '@probe/bar',
        backstage: { role: 'common-library' },
      }),
    );
    writeFileSync(
      path.join(fooDir, 'package.json'),
      JSON.stringify({
        name: '@probe/foo',
        backstage: { role: 'common-library' },
      }),
    );
    writeFileSync(sourceFile, source);
    writeFileSync(
      path.join(fooSourceDir, 'index.js'),
      'export const value = 1;\n',
    );
    writeFileSync(
      configFile,
      JSON.stringify({
        jsPlugins: [path.resolve(__dirname, '../../config/index.js')],
        rules: { 'backstage/no-relative-monorepo-imports': 'error' },
      }),
    );

    try {
      const oxlintResult = spawnSync(
        process.execPath,
        [
          oxlintBin,
          '--config',
          configFile,
          '--disable-nested-config',
          '--fix',
          '--format',
          'json',
          sourceFile,
        ],
        { cwd: workspace, encoding: 'utf8' },
      );
      expect(oxlintResult.error).toBeUndefined();
      expect(oxlintResult.status).toBe(1);
      expect(oxlintResult.stdout).toContain(
        'backstage(no-relative-monorepo-imports)',
      );
      expect(readFileSync(sourceFile, 'utf8')).toBe(source);
    } finally {
      rmSync(tempRoot, { recursive: true, force: true });
    }
  });

  it('keeps dependency diagnostics non-fixing while preserving explicit directives', () => {
    const tempRoot = mkdtempSync(path.join(os.tmpdir(), 'oxlint-undeclared-'));
    const workspace = path.join(tempRoot, 'workspace');
    const appDir = path.join(workspace, 'packages/app');
    const providerDir = path.join(workspace, 'packages/provider');
    const sourceDir = path.join(appDir, 'src');
    const sourceFile = path.join(sourceDir, 'index.js');
    const configFile = path.join(tempRoot, 'config.json');
    const source =
      "import lodash from 'lodash';\nimport React from 'react';\nvoid lodash;\nvoid React;\n";
    const oxlintBin = path.resolve(
      path.dirname(require.resolve('oxlint/package.json')),
      'bin/oxlint',
    );
    const yarn = createYarnRecorder(tempRoot);

    mkdirSync(sourceDir, { recursive: true });
    mkdirSync(path.join(providerDir), { recursive: true });
    mkdirSync(path.join(workspace, 'node_modules/lodash'), { recursive: true });
    mkdirSync(path.join(workspace, 'node_modules/react'), { recursive: true });
    writeFileSync(
      path.join(workspace, 'package.json'),
      JSON.stringify({
        name: 'root',
        private: true,
        workspaces: ['packages/*'],
      }),
    );
    writeFileSync(
      path.join(appDir, 'package.json'),
      JSON.stringify({
        name: '@probe/app',
        backstage: { role: 'node-library' },
        dependencies: { react: '18.0.0' },
      }),
    );
    writeFileSync(
      path.join(providerDir, 'package.json'),
      JSON.stringify({
        name: '@probe/provider',
        dependencies: { lodash: '4.17.21' },
      }),
    );
    writeFileSync(
      path.join(workspace, 'node_modules/lodash/index.js'),
      'module.exports = {}\n',
    );
    writeFileSync(
      path.join(workspace, 'node_modules/react/index.js'),
      'module.exports = {}\n',
    );
    writeFileSync(sourceFile, source);
    writeFileSync(
      configFile,
      JSON.stringify({
        jsPlugins: [path.resolve(__dirname, '../../config/index.js')],
        rules: { 'backstage/no-undeclared-imports': 'error' },
      }),
    );

    try {
      const noFix = spawnSync(
        process.execPath,
        [
          oxlintBin,
          '--config',
          configFile,
          '--disable-nested-config',
          '--format',
          'json',
          sourceFile,
        ],
        { cwd: workspace, encoding: 'utf8', env: yarn.env },
      );
      expect(noFix.status).toBe(1);
      if (!noFix.stdout) throw new Error(noFix.stderr);
      expect(noFix.stdout).toContain('backstage(no-undeclared-imports)');
      expect(noFix.stdout).toContain(
        'react is declared in dependencies, but should be moved to peerDependencies',
      );
      expect(readYarnCalls(yarn.tracePath)).toEqual([]);
      expect(readFileSync(sourceFile, 'utf8')).toBe(source);

      const fixed = spawnSync(
        process.execPath,
        [
          oxlintBin,
          '--config',
          configFile,
          '--disable-nested-config',
          '--fix',
          '--format',
          'json',
          sourceFile,
        ],
        { cwd: workspace, encoding: 'utf8', env: yarn.env },
      );
      expect(fixed.error).toBeUndefined();
      expect(fixed.status).toBe(1);
      expect(fixed.stdout).toContain('backstage(no-undeclared-imports)');
      expect(fixed.stdout).toContain(
        'react is declared in dependencies, but should be moved to peerDependencies',
      );
      expect(readFileSync(sourceFile, 'utf8')).toBe(source);
      expect(readYarnCalls(yarn.tracePath)).toEqual([]);
      expect(
        JSON.parse(readFileSync(path.join(appDir, 'package.json'), 'utf8'))
          .dependencies,
      ).toEqual({ react: '18.0.0' });

      const directiveSource =
        "import lodash from 'directive:add-import:dependencies:lodash';\nvoid lodash;\n";
      writeFileSync(sourceFile, directiveSource);
      const explicitDirective = spawnSync(
        process.execPath,
        [
          oxlintBin,
          '--config',
          configFile,
          '--disable-nested-config',
          '--format',
          'json',
          sourceFile,
        ],
        { cwd: workspace, encoding: 'utf8', env: yarn.env },
      );
      expect(explicitDirective.error).toBeUndefined();
      expect(explicitDirective.status).toBe(1);
      expect(explicitDirective.stdout).toContain(
        'backstage(no-undeclared-imports)',
      );
      expect(readFileSync(sourceFile, 'utf8')).toBe(directiveSource);
      expect(readYarnCalls(yarn.tracePath)).toEqual([
        { args: ['add', 'lodash@4.17.21'], cwd: appDir },
      ]);
      expect(
        JSON.parse(readFileSync(path.join(appDir, 'package.json'), 'utf8'))
          .dependencies,
      ).toEqual({ react: '18.0.0', lodash: '4.17.21' });
    } finally {
      rmSync(tempRoot, { recursive: true, force: true });
    }
  });

  it('keeps inline dependency diagnostics non-fixing without package actions', () => {
    const tempRoot = mkdtempSync(path.join(os.tmpdir(), 'oxlint-inline-'));
    const workspace = path.join(tempRoot, 'workspace');
    const directDir = path.join(workspace, 'packages/app-direct');
    const missingDir = path.join(workspace, 'packages/app-missing');
    const inlineDir = path.join(workspace, 'packages/inline');
    const directFile = path.join(directDir, 'src/index.js');
    const missingFile = path.join(missingDir, 'src/index.js');
    const configFile = path.join(tempRoot, 'config.json');
    const source = "import '@probe/inline';\n";
    const oxlintBin = path.resolve(
      path.dirname(require.resolve('oxlint/package.json')),
      'bin/oxlint',
    );
    const yarn = createYarnRecorder(tempRoot);

    for (const dir of [directDir, missingDir, inlineDir]) {
      mkdirSync(dir, { recursive: true });
    }
    mkdirSync(path.dirname(directFile), { recursive: true });
    mkdirSync(path.dirname(missingFile), { recursive: true });
    writeFileSync(
      path.join(workspace, 'package.json'),
      JSON.stringify({
        name: 'root',
        private: true,
        workspaces: ['packages/*'],
      }),
    );
    writeFileSync(
      path.join(directDir, 'package.json'),
      JSON.stringify({
        name: '@probe/app-direct',
        backstage: { role: 'common-library' },
        dependencies: { '@probe/inline': '1.0.0' },
      }),
    );
    writeFileSync(
      path.join(missingDir, 'package.json'),
      JSON.stringify({
        name: '@probe/app-missing',
        backstage: { role: 'common-library' },
      }),
    );
    writeFileSync(
      path.join(inlineDir, 'package.json'),
      JSON.stringify({
        name: '@probe/inline',
        backstage: { inline: true },
        dependencies: { 'left-pad': '1.3.0' },
        peerDependencies: { react: '18.3.1' },
      }),
    );
    writeFileSync(directFile, source);
    writeFileSync(missingFile, source);
    writeFileSync(
      configFile,
      JSON.stringify({
        jsPlugins: [path.resolve(__dirname, '../../config/index.js')],
        rules: { 'backstage/no-undeclared-imports': 'error' },
      }),
    );

    try {
      const noFix = spawnSync(
        process.execPath,
        [
          oxlintBin,
          '--config',
          configFile,
          '--disable-nested-config',
          '--format',
          'json',
          directFile,
          missingFile,
        ],
        { cwd: workspace, encoding: 'utf8', env: yarn.env },
      );
      expect(noFix.status).toBe(1);
      expect(noFix.stdout).toContain('backstage(no-undeclared-imports)');
      expect(readYarnCalls(yarn.tracePath)).toEqual([]);

      const fixed = spawnSync(
        process.execPath,
        [
          oxlintBin,
          '--config',
          configFile,
          '--disable-nested-config',
          '--fix',
          '--format',
          'json',
          directFile,
          missingFile,
        ],
        { cwd: workspace, encoding: 'utf8', env: yarn.env },
      );
      expect(fixed.error).toBeUndefined();
      expect(fixed.status).toBe(1);
      expect(fixed.stdout).toContain('backstage(no-undeclared-imports)');
      expect(readFileSync(directFile, 'utf8')).toBe(source);
      expect(readFileSync(missingFile, 'utf8')).toBe(source);
      expect(readYarnCalls(yarn.tracePath)).toEqual([]);
      expect(
        JSON.parse(readFileSync(path.join(directDir, 'package.json'), 'utf8'))
          .dependencies,
      ).toEqual({ '@probe/inline': '1.0.0' });
      expect(
        JSON.parse(readFileSync(path.join(missingDir, 'package.json'), 'utf8'))
          .dependencies,
      ).toBeUndefined();
    } finally {
      rmSync(tempRoot, { recursive: true, force: true });
    }
  });

  it('collects every nonignored suppression target despite native disables', () => {
    const tempDir = mkdtempSync(
      path.join(os.tmpdir(), 'oxlint-suppression-policy-'),
    );
    const auditDir = path.join(tempDir, 'audit');
    const configFile = path.join(tempDir, '.oxlintrc.js');
    const blanketFile = path.join(tempDir, 'blanket.js');
    const missingExplanationFile = path.join(tempDir, 'missing-explanation.js');
    const validFile = path.join(tempDir, 'valid.js');
    const staleFile = path.join(tempDir, 'stale.js');
    const ignoredFile = path.join(tempDir, 'dist/ignored.js');
    const previousAuditDir = process.env.BACKSTAGE_OXLINT_AUDIT_DIR;
    const oxlintBin = path.resolve(
      path.dirname(require.resolve('oxlint/package.json')),
      'bin/oxlint',
    );

    mkdirSync(path.dirname(ignoredFile), { recursive: true });
    writeFileSync(blanketFile, '/* eslint-disable */\ndebugger;\n');
    writeFileSync(
      missingExplanationFile,
      '// eslint-disable-next-line no-debugger\ndebugger;\n',
    );
    writeFileSync(
      validFile,
      '// eslint-disable-next-line no-debugger -- https://github.com/backstage/backstage/issues/123\ndebugger;\n',
    );
    writeFileSync(
      staleFile,
      '// eslint-disable-next-line no-debugger -- Keep startup output visible to operators\nconst value = 1; void value;\n',
    );
    writeFileSync(ignoredFile, '/* eslint-disable */\nconsole.log("x");\n');
    writeFileSync(
      path.join(tempDir, 'package.json'),
      JSON.stringify({
        name: '@internal/oxlint-suppression-policy',
        backstage: { role: 'node-library' },
      }),
    );
    symlinkSync(
      path.resolve(__dirname, '../../../../node_modules'),
      path.join(tempDir, 'node_modules'),
      process.platform === 'win32' ? 'junction' : 'dir',
    );
    writeFileSync(
      configFile,
      "module.exports = require('@backstage/cli-module-oxlint/config/oxlint-factory')(__dirname, { preset: 'agentic', ignorePatterns: ['**/dist/**'] });\n",
    );

    try {
      process.env.BACKSTAGE_OXLINT_AUDIT_DIR = auditDir;
      const result = spawnSync(
        process.execPath,
        [
          oxlintBin,
          '--config',
          configFile,
          '--disable-nested-config',
          '--format',
          'json',
          blanketFile,
          missingExplanationFile,
          validFile,
          staleFile,
          ignoredFile,
        ],
        {
          cwd: tempDir,
          encoding: 'utf8',
          env: { ...process.env },
        },
      );
      const receipts = readdirSync(auditDir)
        .filter(name => name.startsWith('file-'))
        .map(name =>
          JSON.parse(readFileSync(path.join(auditDir, name), 'utf8')),
        );

      expect(result.error).toBeUndefined();
      expect(result.status).toBe(1);
      expect(result.stdout).not.toContain(
        'backstage(no-unexplained-suppressions)',
      );
      expect(result.stdout).not.toContain('blanket.js');
      expect(result.stdout).not.toContain('missing-explanation.js');
      expect(result.stdout).not.toContain('valid.js');
      expect(result.stdout).toContain('stale.js');
      expect(result.stdout).toMatch(/unused.*directive/i);
      expect(receipts.map(receipt => receipt.filePath).sort()).toEqual(
        [blanketFile, missingExplanationFile, staleFile, validFile].sort(),
      );
    } finally {
      if (previousAuditDir === undefined) {
        delete process.env.BACKSTAGE_OXLINT_AUDIT_DIR;
      } else {
        process.env.BACKSTAGE_OXLINT_AUDIT_DIR = previousAuditDir;
      }
      rmSync(tempDir, { recursive: true, force: true });
    }
  });

  it('re-reads self-import options for each file in one multi-file Oxlint run', () => {
    const tempRoot = mkdtempSync(path.join(os.tmpdir(), 'oxlint-self-import-'));
    const workspace = path.join(tempRoot, 'monorepo');
    cpSync(FIXTURE, workspace, { recursive: true });
    const packageDir = mkdtempSync(
      path.join(workspace, 'packages/lifecycle-self-'),
    );
    const sourceDir = path.join(packageDir, 'src');
    const reportedFile = path.join(sourceDir, 'index.js');
    const ignoredFile = path.join(sourceDir, 'ignored.js');
    const configFile = path.join(tempRoot, 'config.json');
    const packageName = `@internal/${path.basename(packageDir)}`;
    const oxlintBin = path.resolve(
      path.dirname(require.resolve('oxlint/package.json')),
      'bin/oxlint',
    );

    mkdirSync(sourceDir, { recursive: true });
    writeFileSync(
      path.join(packageDir, 'package.json'),
      JSON.stringify({
        name: packageName,
        backstage: { role: 'node-library' },
        exports: {
          '.': './src/index.js',
          './ignored': './src/ignored.js',
        },
      }),
    );
    const deprecatedToken = ['--bui-bg', '-solid'].join('');
    writeFileSync(
      reportedFile,
      `import '${packageName}/ignored';\nconst token = '${deprecatedToken}';\n`,
    );
    writeFileSync(ignoredFile, `import '${packageName}';\n`);
    writeFileSync(
      configFile,
      JSON.stringify({
        jsPlugins: [path.resolve(__dirname, '../../config/index.js')],
        rules: {
          'backstage/no-self-package-imports': [
            'error',
            { allowCrossEntry: false },
          ],
          'backstage/no-deprecated-bui-tokens': 'warn',
        },
        overrides: [
          {
            files: ['**/ignored.js'],
            rules: {
              'backstage/no-self-package-imports': [
                'error',
                { allowCrossEntry: true },
              ],
            },
          },
        ],
      }),
    );

    try {
      const result = spawnSync(
        process.execPath,
        [
          oxlintBin,
          '--config',
          configFile,
          '--disable-nested-config',
          '--format',
          'json',
          ignoredFile,
          reportedFile,
        ],
        { cwd: workspace, encoding: 'utf8' },
      );

      expect(result.error).toBeUndefined();
      expect(result.status).toBe(1);
      expect(result.stdout).toContain('index.js');
      expect(result.stdout).not.toContain('ignored.js');
      expect(
        result.stdout.match(/backstage\(no-self-package-imports\)/g),
      ).toHaveLength(1);
      expect(
        result.stdout.match(/backstage\(no-deprecated-bui-tokens\)/g),
      ).toHaveLength(1);
    } finally {
      rmSync(tempRoot, { recursive: true, force: true });
    }
  });
});

describe('getPackages', () => {
  // eslint-disable-next-line @backstage/no-relative-monorepo-imports
  const getPackages = require('../../config/lib/getPackages');

  afterEach(() => {
    // Clear cache between tests to avoid stale data
    const pkgs = getPackages(FIXTURE);
    pkgs?.clearCache();
  });

  it('loads packages from a monorepo directory', () => {
    const pkgs = getPackages(FIXTURE);
    expect(pkgs).toBeDefined();
    expect(pkgs!.list.length).toBeGreaterThan(0);
    expect(pkgs!.map.get('@internal/foo')).toBeDefined();
    expect(pkgs!.map.get('@internal/bar')).toBeDefined();
    expect(pkgs!.root.packageJson.name).toBe('root');
  });

  it('caches results across calls', () => {
    const first = getPackages(FIXTURE);
    const second = getPackages(FIXTURE);
    expect(first).toBe(second);
  });

  it('byPath resolves the correct package', () => {
    const pkgs = getPackages(FIXTURE);
    const fooDir = path.join(FIXTURE, 'packages/foo/src/index.ts');
    const found = pkgs!.byPath(fooDir);
    expect(found).toBeDefined();
    expect(found!.packageJson.name).toBe('@internal/foo');
  });

  it('byPath returns undefined for files outside any package', () => {
    const pkgs = getPackages(FIXTURE);
    const outsidePath = path.resolve(FIXTURE, '../../some-other-dir/file.ts');
    const found = pkgs!.byPath(outsidePath);
    expect(found).toBeUndefined();
  });

  it('clearCache forces a reload on next call', () => {
    const first = getPackages(FIXTURE);
    first!.clearCache();
    const second = getPackages(FIXTURE);
    // After clearCache, a new object is returned
    expect(first).not.toBe(second);
    expect(second!.map.get('@internal/foo')).toBeDefined();
  });
});

describe('visitImports', () => {
  // eslint-disable-next-line @backstage/no-relative-monorepo-imports
  const visitImports = require('../../config/lib/visitImports');
  // eslint-disable-next-line @backstage/no-relative-monorepo-imports
  const getPackages = require('../../config/lib/getPackages');

  afterEach(() => {
    const pkgs = getPackages(FIXTURE);
    pkgs?.clearCache();
  });

  function createMockContext(cwd: string) {
    return { cwd };
  }

  function createVisitors(context: { cwd: string }, visitor: Function) {
    const handlers = visitImports(context, visitor);
    handlers.Program();
    return handlers;
  }

  it('loads metadata once per file and refreshes it for the next file', () => {
    let cwdReads = 0;
    const context = {
      get cwd() {
        cwdReads += 1;
        return FIXTURE;
      },
    };
    const visitor = jest.fn();
    const handlers = visitImports(context, visitor);
    const node = {
      type: 'ImportDeclaration',
      source: { type: 'Literal', value: '@internal/foo' },
    };

    handlers.Program();
    handlers.ImportDeclaration(node);
    handlers.ImportDeclaration(node);
    expect(cwdReads).toBe(1);
    expect(visitor).toHaveBeenCalledTimes(2);

    handlers.Program();
    handlers.ImportDeclaration(node);
    expect(cwdReads).toBe(2);
    expect(visitor).toHaveBeenCalledTimes(3);
    expect(visitor.mock.calls[2][1].type).toBe('internal');
  });

  it('returns AST visitor handlers', () => {
    const context = createMockContext(FIXTURE);
    const visitor = jest.fn();
    const handlers = createVisitors(context, visitor);
    expect(handlers).toBeDefined();
    expect(handlers.ImportDeclaration).toBeInstanceOf(Function);
    expect(handlers.ExportAllDeclaration).toBeInstanceOf(Function);
    expect(handlers.ExportNamedDeclaration).toBeInstanceOf(Function);
    expect(handlers.ImportExpression).toBeInstanceOf(Function);
    expect(handlers.CallExpression).toBeInstanceOf(Function);
  });

  it('classifies local imports', () => {
    const context = createMockContext(FIXTURE);
    const results: any[] = [];
    const handlers = createVisitors(context, (_node: any, imp: any) => {
      results.push(imp);
    });

    // Simulate an ImportDeclaration with a local path
    const mockNode = {
      type: 'ImportDeclaration',
      source: { type: 'Literal', value: './foo' },
    };
    handlers.ImportDeclaration(mockNode);

    expect(results).toHaveLength(1);
    expect(results[0].type).toBe('local');
    expect(results[0].path).toBe('./foo');
  });

  it('classifies internal imports for known packages', () => {
    const context = createMockContext(FIXTURE);
    const results: any[] = [];
    const handlers = createVisitors(context, (_node: any, imp: any) => {
      results.push(imp);
    });

    const mockNode = {
      type: 'ImportDeclaration',
      source: { type: 'Literal', value: '@internal/foo' },
    };
    handlers.ImportDeclaration(mockNode);

    expect(results).toHaveLength(1);
    expect(results[0].type).toBe('internal');
    expect(results[0].packageName).toBe('@internal/foo');
    expect(results[0].path).toBe('');
  });

  it('classifies internal imports with subpaths', () => {
    const context = createMockContext(FIXTURE);
    const results: any[] = [];
    const handlers = createVisitors(context, (_node: any, imp: any) => {
      results.push(imp);
    });

    const mockNode = {
      type: 'ImportDeclaration',
      source: { type: 'Literal', value: '@internal/foo/type-utils' },
    };
    handlers.ImportDeclaration(mockNode);

    expect(results).toHaveLength(1);
    expect(results[0].type).toBe('internal');
    expect(results[0].packageName).toBe('@internal/foo');
    expect(results[0].path).toBe('type-utils');
  });

  it('classifies external imports', () => {
    const context = createMockContext(FIXTURE);
    const results: any[] = [];
    const handlers = createVisitors(context, (_node: any, imp: any) => {
      results.push(imp);
    });

    const mockNode = {
      type: 'ImportDeclaration',
      source: { type: 'Literal', value: 'lodash' },
    };
    handlers.ImportDeclaration(mockNode);

    expect(results).toHaveLength(1);
    expect(results[0].type).toBe('external');
    expect(results[0].packageName).toBe('lodash');
  });

  it('classifies builtin imports', () => {
    const context = createMockContext(FIXTURE);
    const results: any[] = [];
    const handlers = createVisitors(context, (_node: any, imp: any) => {
      results.push(imp);
    });

    const mockNode = {
      type: 'ImportDeclaration',
      source: { type: 'Literal', value: 'node:path' },
    };
    handlers.ImportDeclaration(mockNode);

    expect(results).toHaveLength(1);
    expect(results[0].type).toBe('builtin');
    expect(results[0].packageName).toBe('node:path');
  });

  it('classifies directive imports', () => {
    const context = createMockContext(FIXTURE);
    const results: any[] = [];
    const handlers = createVisitors(context, (_node: any, imp: any) => {
      results.push(imp);
    });

    const mockNode = {
      type: 'ImportDeclaration',
      source: { type: 'Literal', value: 'directive:foo' },
    };
    handlers.ImportDeclaration(mockNode);

    expect(results).toHaveLength(1);
    expect(results[0].type).toBe('directive');
  });

  it('classifies require() calls', () => {
    const context = createMockContext(FIXTURE);
    const results: any[] = [];
    const handlers = createVisitors(context, (_node: any, imp: any) => {
      results.push(imp);
    });

    const mockNode = {
      type: 'CallExpression',
      callee: { type: 'Identifier', name: 'require' },
      arguments: [{ type: 'Literal', value: '@internal/bar' }],
    };
    handlers.CallExpression(mockNode);

    expect(results).toHaveLength(1);
    expect(results[0].type).toBe('internal');
    expect(results[0].packageName).toBe('@internal/bar');
  });
});
