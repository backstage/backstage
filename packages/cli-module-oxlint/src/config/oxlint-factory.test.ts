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

import { spawnSync } from 'node:child_process';
import {
  mkdirSync,
  mkdtempSync,
  readFileSync,
  readdirSync,
  rmSync,
  symlinkSync,
  writeFileSync,
} from 'node:fs';
import os from 'node:os';
import path from 'node:path';

type OxlintOverride = {
  files: string[];
  plugins?: string[];
  rules?: Record<string, unknown>;
};
const rootDir = path.resolve(__dirname, '../../../..');
type OxlintConfig = {
  categories: Record<string, string | number>;
  ignorePatterns: string[];
  jsPlugins: string[];
  options: Record<string, unknown>;
  overrides: OxlintOverride[];
  plugins: string[];
  rules: Record<string, unknown>;
};
type OxlintFactory = {
  (dir: string, extraConfig?: Record<string, unknown>): OxlintConfig;
  createConfig(
    dir: string,
    extraConfig?: Record<string, unknown>,
  ): OxlintConfig;
  createConfigForRole(
    dir: string,
    role: string,
    extraConfig?: Record<string, unknown>,
  ): OxlintConfig;
  createPackageConfig(
    dir: string,
    extraConfig?: Record<string, unknown>,
  ): OxlintConfig;
};
type OxlintReport = {
  diagnostics: Array<{ code: string; filename: string }>;
  number_of_files: number;
};

const PACKAGE_DIR = path.resolve(__dirname, '../..');
const BASE_PLUGINS = [
  'eslint',
  'typescript',
  'unicorn',
  'oxc',
  'import',
  'promise',
];
const factory = require('../../config/oxlint-factory') as OxlintFactory;
const backstageRules = require('../../config').rules as Record<
  string,
  { createOnce?: unknown }
>;

function expectRegisteredBackstageRules(config: OxlintConfig, count: number) {
  const ruleIds = [
    ...Object.keys(config.rules),
    ...config.overrides.flatMap(override => Object.keys(override.rules ?? {})),
  ].filter(ruleId => ruleId.startsWith('backstage/'));
  expect(ruleIds).toHaveLength(count);
  for (const ruleId of ruleIds) {
    expect(backstageRules[ruleId.slice('backstage/'.length)]).toEqual(
      expect.objectContaining({ createOnce: expect.any(Function) }),
    );
  }
}

function runOxlint(
  configFile: string,
  cwd: string,
  files: string[],
  extraArgs: string[] = [],
): { status: number | null; report: OxlintReport; stderr: string } {
  const bin = path.resolve(
    path.dirname(require.resolve('oxlint/package.json')),
    'bin/oxlint',
  );
  const result = spawnSync(
    process.execPath,
    [
      bin,
      '--config',
      configFile,
      '--disable-nested-config',
      '--format',
      'json',
      ...extraArgs,
      ...files,
    ],
    {
      cwd,
      encoding: 'utf8',
      env: {
        ...process.env,
        // Oxlint resolves the tsgolint executable from the working
        // directory or PATH; fixture directories have neither.
        PATH: [
          path.resolve(rootDir, 'node_modules/.bin'),
          process.env.PATH,
        ].join(path.delimiter),
      },
    },
  );
  if (result.error) {
    throw result.error;
  }
  let report: OxlintReport;
  try {
    report = JSON.parse(result.stdout) as OxlintReport;
  } catch (error) {
    throw new Error(
      `Oxlint did not return JSON. stdout: ${result.stdout}\nstderr: ${result.stderr}`,
      { cause: error },
    );
  }
  return { status: result.status, report, stderr: result.stderr };
}

function codesFor(report: OxlintReport, basename: string): string[] {
  return report.diagnostics
    .filter(item => path.basename(item.filename) === basename)
    .map(item => item.code);
}

describe('Oxlint configuration factory', () => {
  it('uses export mounts supported by the package builder', () => {
    const {
      exports,
      files,
      publishConfig,
      typesVersions,
    } = require('../../package.json');
    expect(typesVersions['*']).toEqual({ 'package.json': ['package.json'] });
    expect(exports['./oxlint-factory']).toBe('./config/oxlint-factory.cjs');
    expect(publishConfig.exports['./oxlint-factory']).toBe(
      exports['./oxlint-factory'],
    );
    expect(files).toContain('config');
    for (const [mount, source] of Object.entries(exports)) {
      if (/\.[jt]sx?$/.test(source as string)) {
        expect(mount.slice(2)).not.toContain('/');
      }
    }
  });

  it('exports the CommonJS package factory and named factory methods', () => {
    const publicFactory =
      require('@backstage/cli-module-oxlint/oxlint-factory') as OxlintFactory;
    expect(publicFactory).toBe(factory);
    expect(publicFactory === publicFactory.createPackageConfig).toBe(true);
    expect(typeof publicFactory.createConfig).toBe('function');
    expect(typeof publicFactory.createConfigForRole).toBe('function');
    expect(factory.createConfig(PACKAGE_DIR).plugins).toEqual(BASE_PLUGINS);

    const config = publicFactory(PACKAGE_DIR, {
      ignorePatterns: ['templates/**'],
      plugins: ['jest'],
      rules: { 'import/no-duplicates': 'off', 'custom/rule': 'error' },
    });
    expect(config.plugins).toEqual([...BASE_PLUGINS, 'node', 'jest']);
    expect(config.rules).toMatchObject({
      'backstage/no-undeclared-imports': 'error',
      'no-var': 'off',
      'import/no-duplicates': 'off',
      'custom/rule': 'error',
    });
    expect(config.ignorePatterns).toContain('templates/**');
    expect(config).not.toHaveProperty('preset');
    expectRegisteredBackstageRules(config, 7);
    for (const preset of ['agentic', 'compatibility']) {
      expect(() => factory(PACKAGE_DIR, { preset })).toThrow(
        `Unknown Oxlint preset: ${preset}`,
      );
    }
    expect(config.overrides).toHaveLength(2);
    expect(config.overrides[0].plugins).toEqual([
      ...BASE_PLUGINS,
      'node',
      'jest',
    ]);
    const generatedFiles = ['ts', 'tsx', 'mts', 'cts'].map(
      extension => `**/src/**/generated/**/*.${extension}`,
    );
    const generatedUnusedVars = {
      vars: 'all',
      varsIgnorePattern: '^_',
      args: 'none',
      argsIgnorePattern: '^_',
      fix: { imports: 'safe-fix' },
    };
    expect(config.overrides[1]).toEqual({
      files: generatedFiles,
      rules: {
        'no-unused-vars': ['error', generatedUnusedVars],
        'import/newline-after-import': 'error',
      },
    });
    // Generated files follow the package's own rule settings, and come after
    // package overrides so that broader globs keep the generator fixes.
    const packageOverride = {
      files: ['src/**'],
      rules: { 'no-unused-vars': ['error', { args: 'all' }] },
    };
    expect(
      factory
        .createConfigForRole(PACKAGE_DIR, 'node-library', {
          rules: {
            'no-unused-vars': ['warn', { varsIgnorePattern: '^unused' }],
            'import/newline-after-import': 'off',
          },
          overrides: [packageOverride],
        })
        .overrides.slice(1),
    ).toEqual([
      packageOverride,
      {
        files: generatedFiles,
        rules: {
          'no-unused-vars': [
            'warn',
            { ...generatedUnusedVars, varsIgnorePattern: '^unused' },
          ],
        },
      },
    ]);
    expect(
      factory.createConfigForRole(PACKAGE_DIR, 'node-library', {
        categories: { correctness: 'warn' },
      }).overrides[1].rules?.['no-unused-vars'],
    ).toEqual(['warn', generatedUnusedVars]);
    expect(
      factory.createConfigForRole(PACKAGE_DIR, 'node-library', {
        categories: { correctness: 'off' },
      }).overrides[1].rules,
    ).toEqual({ 'import/newline-after-import': 'error' });
    for (const name of ['eslint/no-unused-vars', 'typescript/no-unused-vars']) {
      expect(
        factory.createConfigForRole(PACKAGE_DIR, 'node-library', {
          rules: { [name]: 'off' },
        }).overrides[1].rules,
      ).toEqual({ 'import/newline-after-import': 'error' });
    }
    expect(
      factory.createConfigForRole(PACKAGE_DIR, 'node-library', {
        rules: {
          'no-unused-vars': 'off',
          'import/newline-after-import': 'off',
        },
      }).overrides,
    ).toHaveLength(1);
  });

  it('uses a package role and rejects packages without one', () => {
    const tempDir = mkdtempSync(path.join(os.tmpdir(), 'oxlint-factory-role-'));
    try {
      writeFileSync(
        path.join(tempDir, 'package.json'),
        JSON.stringify({
          name: 'frontend',
          backstage: { role: 'frontend-plugin' },
        }),
      );
      const config = factory.createPackageConfig(tempDir);
      expect(config.plugins).toEqual([...BASE_PLUGINS, 'react', 'jsx-a11y']);
      expect(config.rules).toMatchObject({
        'react/rules-of-hooks': 'error',
        'react/jsx-key': 'error',
        'jsx-a11y/alt-text': 'error',
      });
      expect(config.overrides).toHaveLength(2);
      expect(config.overrides[0].plugins).toEqual([
        ...BASE_PLUGINS,
        'react',
        'jsx-a11y',
        'jest',
      ]);

      writeFileSync(
        path.join(tempDir, 'package.json'),
        JSON.stringify({ name: 'no-role' }),
      );
      expect(() => factory.createPackageConfig(tempDir)).toThrow(
        'does not have a backstage.role',
      );
    } finally {
      rmSync(tempDir, { recursive: true, force: true });
    }
  });

  it('enables native restrictions in the strict preset and stays side-effect free', () => {
    const auditDir = mkdtempSync(
      path.join(os.tmpdir(), 'oxlint-factory-audit-'),
    );
    const inputOverrideRules = Object.freeze({ 'custom/test': 'warn' });
    const inputOverride = Object.freeze({
      files: ['**/*.test.js'],
      rules: inputOverrideRules,
    });
    const inputOverrides = Object.freeze([inputOverride]);
    try {
      const config = factory.createConfig(PACKAGE_DIR, {
        preset: 'strict',
        categories: { style: 'warn' },
        rules: {
          'custom/rule': 'warn',
          'no-restricted-imports': ['warn', { paths: ['lodash'] }],
          'no-restricted-properties': ['warn', { property: 'trim' }],
        },
        overrides: inputOverrides,
      });

      // Loading the config must not touch the audit directory; editors and
      // raw Oxlint invocations load it without CLI-provided environment.
      expect(readdirSync(auditDir)).toEqual([]);
      expect(config).not.toHaveProperty('preset');
      expectRegisteredBackstageRules(config, 9);
      expect(config.options).toMatchObject({
        typeAware: true,
        typeCheck: true,
        reportUnusedDisableDirectives: 'error',
      });
      expect(config.categories).toMatchObject({ style: 'error' });
      expect(config.rules).toMatchObject({
        'backstage/no-unexplained-suppressions': 'error',
        'backstage/no-dirname-in-src': 'error',
        'custom/rule': 'error',
      });
      expect(config.rules['no-restricted-imports']).toEqual([
        'error',
        {
          paths: [
            'lodash',
            expect.objectContaining({
              name: 'react',
              importNames: ['default'],
            }),
            expect.objectContaining({
              name: 'winston',
              importNames: ['default'],
            }),
          ],
        },
      ]);
      expect(config.rules['no-restricted-properties']).toEqual([
        'error',
        { property: 'trim' },
        expect.objectContaining({ property: 'toLowerCase' }),
        expect.objectContaining({ property: 'toUpperCase' }),
      ]);
      expect(config.overrides.at(-2)?.rules).toEqual({
        'custom/test': 'error',
      });
      expect(inputOverride.rules).toBe(inputOverrideRules);
      expect(inputOverrideRules).toEqual({ 'custom/test': 'warn' });
      expect(Object.isFrozen(inputOverrideRules)).toBe(true);
      for (const severity of ['off', 0, 'allow']) {
        expect(() =>
          factory.createConfig(PACKAGE_DIR, {
            preset: 'strict',
            categories: { correctness: severity },
          }),
        ).toThrow('The strict preset cannot disable the correctness category');
      }
      expect(
        factory.createConfig(PACKAGE_DIR, {
          preset: 'strict',
          categories: { style: 'off' },
        }).categories.style,
      ).toBe('off');
      expect(() =>
        factory.createConfig(PACKAGE_DIR, {
          preset: 'strict',
          rules: { 'jest/no-focused-tests': 'off' },
        }),
      ).toThrow('The strict preset cannot disable jest/no-focused-tests');
      expect(() =>
        factory.createConfig(PACKAGE_DIR, {
          preset: 'strict',
          overrides: [
            {
              files: ['**/*.test.js'],
              rules: { 'jest/no-focused-tests': 'off' },
            },
          ],
        }),
      ).toThrow(
        'The strict preset cannot disable jest/no-focused-tests in an override',
      );
    } finally {
      rmSync(auditDir, { recursive: true, force: true });
    }
  });

  it('enforces strict import and property restrictions with native Oxlint rules', () => {
    const dir = mkdtempSync(path.join(os.tmpdir(), 'oxlint-strict-native-'));
    const priorAuditDir = process.env.BACKSTAGE_OXLINT_AUDIT_DIR;
    try {
      process.env.BACKSTAGE_OXLINT_AUDIT_DIR = path.join(dir, 'audit');
      const source = path.join(dir, 'input.js');
      writeFileSync(
        source,
        "import React from 'react'; import * as winston from 'winston'; const value = 'A'.toLowerCase('en-US'); void React; void winston; void value;\n",
      );
      const configs = ['backstage', 'strict'].map(preset => {
        const file = path.join(dir, `${preset}.json`);
        writeFileSync(
          file,
          JSON.stringify(factory.createConfig(dir, { preset })),
        );
        return runOxlint(file, dir, [source]);
      });
      expect(codesFor(configs[0].report, 'input.js')).not.toContain(
        'eslint(no-restricted-imports)',
      );
      expect(codesFor(configs[1].report, 'input.js')).toEqual(
        expect.arrayContaining([
          'eslint(no-restricted-imports)',
          'eslint(no-restricted-properties)',
        ]),
      );
      expect(
        codesFor(configs[1].report, 'input.js').filter(
          code => code === 'eslint(no-restricted-imports)',
        ),
      ).toHaveLength(2);
    } finally {
      if (priorAuditDir === undefined) {
        delete process.env.BACKSTAGE_OXLINT_AUDIT_DIR;
      } else {
        process.env.BACKSTAGE_OXLINT_AUDIT_DIR = priorAuditDir;
      }
      rmSync(dir, { recursive: true, force: true });
    }
  });

  it('activates native rules only in intended role and test intersections', () => {
    const workspace = mkdtempSync(
      path.join(os.tmpdir(), 'oxlint-factory-native-'),
    );
    const packageDirs = {
      frontend: path.join(workspace, 'packages/frontend'),
      backend: path.join(workspace, 'packages/backend'),
    };
    const nodeModules = path.resolve(__dirname, '../../../../node_modules');
    const factoryUsage =
      "module.exports = require('@backstage/cli-module-oxlint/oxlint-factory')(__dirname, {});\n";

    try {
      writeFileSync(
        path.join(workspace, 'package.json'),
        JSON.stringify({
          name: 'oxlint-factory-workspace',
          private: true,
          workspaces: ['packages/*'],
        }),
      );
      writeFileSync(path.join(workspace, 'yarn.lock'), '');
      symlinkSync(
        nodeModules,
        path.join(workspace, 'node_modules'),
        process.platform === 'win32' ? 'junction' : 'dir',
      );
      for (const [name, packageDir] of Object.entries(packageDirs)) {
        const role = name === 'frontend' ? 'frontend-plugin' : 'backend-plugin';
        mkdirSync(path.join(packageDir, 'src'), { recursive: true });
        writeFileSync(
          path.join(packageDir, 'package.json'),
          JSON.stringify({
            name: `@internal/${name}`,
            backstage: { role },
            dependencies: { react: '^18.0.0' },
          }),
        );
        writeFileSync(path.join(packageDir, '.oxlintrc.js'), factoryUsage);
      }

      const frontendDir = packageDirs.frontend;
      const frontendSrc = path.join(frontendDir, 'src');
      const frontendFiles = [
        'app.jsx',
        'app.test.jsx',
        'not-test.js',
        'node-only.js',
        'imports.js',
        'promise.js',
        'unicorn.js',
        'async-promise.js',
        'base.js',
        'types.ts',
        'hook.js',
        'hook.ts',
      ].map(file => path.join(frontendSrc, file));
      writeFileSync(
        frontendFiles[0],
        'const items = [1, 2]; export const App = () => <>{items.map(item => <img src="x" />)}</>;\n',
      );
      writeFileSync(
        frontendFiles[1],
        'const items = [1, 2]; describe.only("focused", () => {}); export const App = () => <>{items.map(item => <img src="x" />)}</>;\n',
      );
      writeFileSync(
        frontendFiles[2],
        'describe.only("not a test", () => {});\n',
      );
      writeFileSync(
        frontendFiles[3],
        'const value = __dirname + "/file"; export { value };\n',
      );
      writeFileSync(
        frontendFiles[4],
        "import one from './module.js'; import two from './module.js'; export { one, two };\n",
      );
      writeFileSync(
        frontendFiles[5],
        'Promise.resolve(1).then(value => Promise.resolve(value)).catch(() => {});\n',
      );
      writeFileSync(
        frontendFiles[6],
        'const values = new Array(1); export { values };\n',
      );
      writeFileSync(
        frontendFiles[7],
        'new Promise(async resolve => resolve(1));\n',
      );
      writeFileSync(
        frontendFiles[8],
        'function unreachable() { return 1; debugger; } export { unreachable };\n',
      );
      writeFileSync(
        frontendFiles[9],
        'const enum Color { Red } const value: any = Color.Red; export { value };\n',
      );
      for (const file of frontendFiles.slice(10)) {
        writeFileSync(
          file,
          "import { useEffect, useState } from 'react';\nexport function useWidget(flag) { if (flag) useState(0); useEffect(() => { console.log(flag); }, []); }\n",
        );
      }

      const backendDir = packageDirs.backend;
      const backendSrc = path.join(backendDir, 'src');
      const backendFiles = ['app.jsx', 'app.test.jsx', 'path.js'].map(file =>
        path.join(backendSrc, file),
      );
      writeFileSync(
        backendFiles[0],
        'import { useState } from \'react\'; export function App(active) { if (active) useState(0); return <img src="x" />; }\n',
      );
      writeFileSync(
        backendFiles[1],
        'describe.only("focused", () => {}); const value = __dirname + "/file"; export const App = () => <img src="x" />; export { value };\n',
      );
      writeFileSync(
        backendFiles[2],
        'const value = __dirname + "/file"; export { value };\n',
      );

      const frontendConfig = path.join(frontendDir, '.oxlintrc.js');
      const backendConfig = path.join(backendDir, '.oxlintrc.js');
      const frontend = runOxlint(frontendConfig, frontendDir, frontendFiles);
      const frontendOffConfig = path.join(frontendDir, 'frontend-off.json');
      writeFileSync(
        frontendOffConfig,
        JSON.stringify(
          factory.createConfigForRole(frontendDir, 'frontend-plugin', {
            rules: { 'jsx-a11y/alt-text': 'off' },
          }),
        ),
      );
      const frontendOff = runOxlint(frontendOffConfig, frontendDir, [
        frontendFiles[0],
      ]);
      const backend = runOxlint(backendConfig, backendDir, backendFiles);
      expect(frontend.status).toBe(1);
      expect(frontend.report.number_of_files).toBe(frontendFiles.length);
      expect(frontend.stderr).toBe('');
      expect(codesFor(frontend.report, 'app.jsx')).toEqual(
        expect.arrayContaining(['react(jsx-key)', 'jsx-a11y(alt-text)']),
      );
      expect(codesFor(frontend.report, 'app.test.jsx')).toEqual(
        expect.arrayContaining([
          'react(jsx-key)',
          'jsx-a11y(alt-text)',
          'jest(no-focused-tests)',
        ]),
      );
      expect(codesFor(frontend.report, 'not-test.js')).not.toContain(
        'jest(no-focused-tests)',
      );
      expect(codesFor(frontend.report, 'node-only.js')).not.toContain(
        'node(no-path-concat)',
      );
      expect(codesFor(frontend.report, 'imports.js')).toContain(
        'import(no-duplicates)',
      );
      expect(codesFor(frontend.report, 'promise.js')).toContain(
        'promise(no-return-wrap)',
      );
      expect(codesFor(frontend.report, 'unicorn.js')).toContain(
        'unicorn(no-new-array)',
      );
      expect(codesFor(frontend.report, 'async-promise.js')).toContain(
        'eslint(no-async-promise-executor)',
      );
      expect(codesFor(frontend.report, 'base.js')).toContain(
        'eslint(no-unreachable)',
      );
      expect(codesFor(frontend.report, 'types.ts')).toEqual(
        expect.arrayContaining([
          'oxc(no-const-enum)',
          'typescript(no-explicit-any)',
        ]),
      );
      for (const file of ['hook.js', 'hook.ts']) {
        expect(codesFor(frontend.report, file)).toEqual(
          expect.arrayContaining([
            'react-hooks(rules-of-hooks)',
            'react-hooks(exhaustive-deps)',
          ]),
        );
      }
      expect(frontendOff.report.number_of_files).toBe(1);
      expect(codesFor(frontendOff.report, 'app.jsx')).not.toContain(
        'jsx-a11y(alt-text)',
      );
      expect(codesFor(frontendOff.report, 'app.jsx')).toContain(
        'react(jsx-key)',
      );

      expect(backend.status).toBe(1);
      expect(backend.report.number_of_files).toBe(backendFiles.length);
      expect(backend.stderr).toBe('');
      expect(codesFor(backend.report, 'path.js')).toContain(
        'node(no-path-concat)',
      );
      expect(codesFor(backend.report, 'app.jsx')).not.toContain(
        'jsx-a11y(alt-text)',
      );
      expect(
        codesFor(backend.report, 'app.jsx').filter(code =>
          code.startsWith('react-hooks('),
        ),
      ).toEqual([]);
      expect(codesFor(backend.report, 'app.test.jsx')).toEqual(
        expect.arrayContaining([
          'node(no-path-concat)',
          'jest(no-focused-tests)',
        ]),
      );
      expect(codesFor(backend.report, 'app.test.jsx')).not.toContain(
        'jsx-a11y(alt-text)',
      );
    } finally {
      rmSync(workspace, { recursive: true, force: true });
    }
  });
  it('fixes unused imports and import spacing only in generated files', () => {
    const packageDir = mkdtempSync(
      path.join(os.tmpdir(), 'oxlint-factory-generated-'),
    );
    // Generated code may leave arguments and `_` prefixed variables unused.
    const source =
      "import { unused } from './unused';\nimport { used } from './used';\nexport const value = (request: string) => {\n  const _ignored = used;\n  return used;\n};\n";
    const files = [
      'src/schema/generated/models/Model.ts',
      'src/handwritten.ts',
    ];
    try {
      for (const file of files) {
        mkdirSync(path.dirname(path.join(packageDir, file)), {
          recursive: true,
        });
        writeFileSync(path.join(packageDir, file), source);
      }
      writeFileSync(
        path.join(packageDir, 'package.json'),
        JSON.stringify({ name: 'generated-fixture' }),
      );
      const configFile = path.join(packageDir, 'oxlintrc.json');
      writeFileSync(
        configFile,
        JSON.stringify(
          factory.createConfigForRole(packageDir, 'backend-plugin'),
        ),
      );

      const { report, stderr } = runOxlint(configFile, packageDir, files, [
        '--fix',
      ]);

      expect(stderr).toBe('');
      expect(readFileSync(path.join(packageDir, files[0]), 'utf8')).toBe(
        source
          .replace("import { unused } from './unused';\n", '')
          .replace("'./used';\n", "'./used';\n\n"),
      );
      expect(codesFor(report, 'Model.ts')).toEqual([]);
      expect(readFileSync(path.join(packageDir, files[1]), 'utf8')).toBe(
        source,
      );
      expect(new Set(codesFor(report, 'handwritten.ts'))).toEqual(
        new Set(['eslint(no-unused-vars)']),
      );
    } finally {
      rmSync(packageDir, { recursive: true, force: true });
    }
  });
});
