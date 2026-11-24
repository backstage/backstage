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

import fs from 'node:fs';
import os from 'node:os';
import { join as joinPath } from 'node:path';
import typeDeps from './type-deps';

describe('type-deps', () => {
  const originalCwd = process.cwd();
  let tmpDir: string;

  beforeEach(() => {
    tmpDir = fs.mkdtempSync(joinPath(os.tmpdir(), 'type-deps-'));
    fs.writeFileSync(
      joinPath(tmpDir, 'package.json'),
      JSON.stringify({ name: 'root', private: true }),
    );
    process.chdir(tmpDir);
  });

  afterEach(() => {
    jest.restoreAllMocks();
    process.chdir(originalCwd);
    fs.rmSync(tmpDir, { recursive: true, force: true });
  });

  it('fails if there are no built packages to check, and passes otherwise', async () => {
    const exit = jest
      .spyOn(process, 'exit')
      .mockImplementation((() => {}) as () => never);
    const error = jest.spyOn(console, 'error').mockImplementation(() => {});

    await typeDeps();

    expect(exit).toHaveBeenCalledWith(1);
    expect(error).toHaveBeenCalledWith(
      expect.stringContaining('No packages with built type declarations'),
    );

    exit.mockClear();
    error.mockClear();
    tmpDir = fs.mkdtempSync(joinPath(os.tmpdir(), 'type-deps-'));
    process.chdir(tmpDir);
    fs.writeFileSync(
      joinPath(tmpDir, 'package.json'),
      JSON.stringify({ name: 'root', private: true, workspaces: ['pkg'] }),
    );
    fs.writeFileSync(joinPath(tmpDir, 'yarn.lock'), '');
    fs.mkdirSync(joinPath(tmpDir, 'pkg/dist'), { recursive: true });
    fs.writeFileSync(
      joinPath(tmpDir, 'pkg/package.json'),
      JSON.stringify({
        name: 'pkg',
        version: '1.0.0',
        main: 'dist/index.js',
        types: 'dist/index.d.ts',
      }),
    );
    fs.writeFileSync(joinPath(tmpDir, 'pkg/dist/index.d.ts'), 'export {};\n');

    await typeDeps();

    expect(error).not.toHaveBeenCalled();
    expect(exit).not.toHaveBeenCalled();
  });

  it('accepts ESM-only dependencies whose exports lack a require condition', async () => {
    const exit = jest
      .spyOn(process, 'exit')
      .mockImplementation((() => {}) as () => never);
    const error = jest.spyOn(console, 'error').mockImplementation(() => {});

    fs.writeFileSync(
      joinPath(tmpDir, 'package.json'),
      JSON.stringify({ name: 'root', private: true, workspaces: ['pkg'] }),
    );
    fs.writeFileSync(joinPath(tmpDir, 'yarn.lock'), '');
    fs.mkdirSync(joinPath(tmpDir, 'pkg/dist'), { recursive: true });
    fs.writeFileSync(
      joinPath(tmpDir, 'pkg/package.json'),
      JSON.stringify({
        name: 'pkg',
        version: '1.0.0',
        main: 'dist/index.js',
        types: 'dist/index.d.ts',
        dependencies: {
          '@fake/esm-only': '1.0.0',
        },
      }),
    );
    fs.writeFileSync(
      joinPath(tmpDir, 'pkg/dist/index.d.ts'),
      "import type { Ctx } from '@fake/esm-only/context';\nexport type { Ctx };\n",
    );
    // Installed, but ESM-only: no "require" or "default" export condition,
    // so require.resolve cannot see it and only the node_modules lookup finds it.
    fs.mkdirSync(joinPath(tmpDir, 'node_modules/@fake/esm-only/dist'), {
      recursive: true,
    });
    fs.writeFileSync(
      joinPath(tmpDir, 'node_modules/@fake/esm-only/package.json'),
      JSON.stringify({
        name: '@fake/esm-only',
        version: '1.0.0',
        type: 'module',
        exports: {
          '.': { types: './dist/index.d.ts', import: './dist/index.js' },
          './context': {
            types: './dist/context.d.ts',
            import: './dist/context.js',
          },
        },
      }),
    );
    fs.writeFileSync(
      joinPath(tmpDir, 'node_modules/@fake/esm-only/dist/index.d.ts'),
      'export type Ctx = { a: number };\n',
    );
    fs.writeFileSync(
      joinPath(tmpDir, 'node_modules/@fake/esm-only/dist/context.d.ts'),
      'export type Ctx = { a: number };\n',
    );

    await typeDeps();

    expect(error).not.toHaveBeenCalled();
    expect(exit).not.toHaveBeenCalled();

    // The fallback is not a blanket pass: if the dependency is not actually
    // installed anywhere Node would look for it, it is still an error.
    fs.rmSync(joinPath(tmpDir, 'node_modules/@fake'), {
      recursive: true,
      force: true,
    });

    exit.mockClear();
    error.mockClear();

    await typeDeps();

    expect(error).toHaveBeenCalledWith(
      expect.stringContaining('Missing a type dependency: @fake/esm-only'),
    );
    expect(exit).toHaveBeenCalledWith(2);
  });

  it('resolves scoped subpath specifiers through the package root', async () => {
    const exit = jest
      .spyOn(process, 'exit')
      .mockImplementation((() => {}) as () => never);
    const error = jest.spyOn(console, 'error').mockImplementation(() => {});

    fs.writeFileSync(
      joinPath(tmpDir, 'package.json'),
      JSON.stringify({ name: 'root', private: true, workspaces: ['pkg'] }),
    );
    fs.writeFileSync(joinPath(tmpDir, 'yarn.lock'), '');
    fs.mkdirSync(joinPath(tmpDir, 'pkg/dist'), { recursive: true });
    fs.writeFileSync(
      joinPath(tmpDir, 'pkg/package.json'),
      JSON.stringify({
        name: 'pkg',
        version: '1.0.0',
        main: 'dist/index.js',
        types: 'dist/index.d.ts',
        dependencies: {
          '@fake/esm-only': '1.0.0',
        },
      }),
    );
    fs.writeFileSync(
      joinPath(tmpDir, 'pkg/dist/index.d.ts'),
      "import type { Ctx } from '@fake/esm-only/sub';\nexport type { Ctx };\n",
    );
    fs.mkdirSync(joinPath(tmpDir, 'node_modules/@fake/esm-only/dist'), {
      recursive: true,
    });
    fs.writeFileSync(
      joinPath(tmpDir, 'node_modules/@fake/esm-only/package.json'),
      JSON.stringify({
        name: '@fake/esm-only',
        version: '1.0.0',
        type: 'module',
        exports: {
          '.': { types: './dist/index.d.ts', import: './dist/index.js' },
          './sub': { types: './dist/sub.d.ts', import: './dist/sub.js' },
        },
      }),
    );
    fs.writeFileSync(
      joinPath(tmpDir, 'node_modules/@fake/esm-only/dist/sub.d.ts'),
      'export type Ctx = { a: number };\n',
    );

    // Scoped subpath specifier: the fallback must find the package via its
    // root name, @fake/esm-only, rather than the full specifier
    await typeDeps();

    expect(error).not.toHaveBeenCalled();
    expect(exit).not.toHaveBeenCalled();
  });

  it('still errors for subpaths the installed package does not export', async () => {
    const exit = jest
      .spyOn(process, 'exit')
      .mockImplementation((() => {}) as () => never);
    const error = jest.spyOn(console, 'error').mockImplementation(() => {});

    fs.writeFileSync(
      joinPath(tmpDir, 'package.json'),
      JSON.stringify({ name: 'root', private: true, workspaces: ['pkg'] }),
    );
    fs.writeFileSync(joinPath(tmpDir, 'yarn.lock'), '');
    fs.mkdirSync(joinPath(tmpDir, 'pkg/dist'), { recursive: true });
    fs.writeFileSync(
      joinPath(tmpDir, 'pkg/package.json'),
      JSON.stringify({
        name: 'pkg',
        version: '1.0.0',
        main: 'dist/index.js',
        types: 'dist/index.d.ts',
        dependencies: {
          '@fake/esm-only': '1.0.0',
        },
      }),
    );
    // A typo'd or stale import: the package is installed and ships types,
    // but this subpath is not one of its exports
    fs.writeFileSync(
      joinPath(tmpDir, 'pkg/dist/index.d.ts'),
      "import type { Ctx } from '@fake/esm-only/doesNotExist';\nexport type { Ctx };\n",
    );
    fs.mkdirSync(joinPath(tmpDir, 'node_modules/@fake/esm-only'), {
      recursive: true,
    });
    fs.writeFileSync(
      joinPath(tmpDir, 'node_modules/@fake/esm-only/package.json'),
      JSON.stringify({
        name: '@fake/esm-only',
        version: '1.0.0',
        type: 'module',
        exports: {
          '.': { types: './dist/index.d.ts', import: './dist/index.js' },
          './context': {
            types: './dist/context.d.ts',
            import: './dist/context.js',
          },
        },
      }),
    );

    await typeDeps();

    expect(error).toHaveBeenCalledWith(
      expect.stringContaining(
        'Missing a type dependency: @fake/esm-only/doesNotExist',
      ),
    );
    expect(exit).toHaveBeenCalledWith(2);
  });

  it('still errors for ESM-only dependencies that ship no types', async () => {
    const exit = jest
      .spyOn(process, 'exit')
      .mockImplementation((() => {}) as () => never);
    const error = jest.spyOn(console, 'error').mockImplementation(() => {});

    fs.writeFileSync(
      joinPath(tmpDir, 'package.json'),
      JSON.stringify({ name: 'root', private: true, workspaces: ['pkg'] }),
    );
    fs.writeFileSync(joinPath(tmpDir, 'yarn.lock'), '');
    fs.mkdirSync(joinPath(tmpDir, 'pkg/dist'), { recursive: true });
    fs.writeFileSync(
      joinPath(tmpDir, 'pkg/package.json'),
      JSON.stringify({
        name: 'pkg',
        version: '1.0.0',
        main: 'dist/index.js',
        types: 'dist/index.d.ts',
        dependencies: {
          '@fake/esm-only': '1.0.0',
        },
      }),
    );
    fs.writeFileSync(
      joinPath(tmpDir, 'pkg/dist/index.d.ts'),
      "import type { Ctx } from '@fake/esm-only/notypes';\nexport type { Ctx };\n",
    );
    // Installed and ESM-only, but it declares no types for the subpath:
    // neither a "types" field nor a "types" export condition
    fs.mkdirSync(joinPath(tmpDir, 'node_modules/@fake/esm-only'), {
      recursive: true,
    });
    fs.writeFileSync(
      joinPath(tmpDir, 'node_modules/@fake/esm-only/package.json'),
      JSON.stringify({
        name: '@fake/esm-only',
        version: '1.0.0',
        type: 'module',
        exports: {
          '.': { import: './dist/index.js' },
          './notypes': { import: './dist/notypes.js' },
        },
      }),
    );

    await typeDeps();

    expect(error).toHaveBeenCalledWith(
      expect.stringContaining(
        'Missing a type dependency: @fake/esm-only/notypes',
      ),
    );
    expect(exit).toHaveBeenCalledWith(2);
  });

  it('accepts wildcard and versioned types export conditions', async () => {
    const exit = jest
      .spyOn(process, 'exit')
      .mockImplementation((() => {}) as () => never);
    const error = jest.spyOn(console, 'error').mockImplementation(() => {});

    fs.writeFileSync(
      joinPath(tmpDir, 'package.json'),
      JSON.stringify({ name: 'root', private: true, workspaces: ['pkg'] }),
    );
    fs.writeFileSync(joinPath(tmpDir, 'yarn.lock'), '');
    fs.mkdirSync(joinPath(tmpDir, 'pkg/dist'), { recursive: true });
    fs.writeFileSync(
      joinPath(tmpDir, 'pkg/package.json'),
      JSON.stringify({
        name: 'pkg',
        version: '1.0.0',
        main: 'dist/index.js',
        types: 'dist/index.d.ts',
        dependencies: {
          '@fake/esm-only': '1.0.0',
        },
      }),
    );
    // A root import resolved through a versioned "types@" condition, and a
    // subpath import resolved through a wildcard export pattern
    fs.writeFileSync(
      joinPath(tmpDir, 'pkg/dist/index.d.ts'),
      "import type { Ctx } from '@fake/esm-only';\n" +
        "import type { Sub } from '@fake/esm-only/helpers/util.js';\n" +
        'export type { Ctx, Sub };\n',
    );
    fs.mkdirSync(joinPath(tmpDir, 'node_modules/@fake/esm-only/dist/helpers'), {
      recursive: true,
    });
    fs.writeFileSync(
      joinPath(tmpDir, 'node_modules/@fake/esm-only/package.json'),
      JSON.stringify({
        name: '@fake/esm-only',
        version: '1.0.0',
        type: 'module',
        exports: {
          '.': {
            'types@>=5.0': './dist/index.d.ts',
            import: './dist/index.js',
          },
          './helpers/*.js': {
            types: './dist/helpers/*.d.ts',
            import: './dist/helpers/*.js',
          },
        },
      }),
    );
    fs.writeFileSync(
      joinPath(tmpDir, 'node_modules/@fake/esm-only/dist/index.d.ts'),
      'export type Ctx = { a: number };\n',
    );
    fs.writeFileSync(
      joinPath(tmpDir, 'node_modules/@fake/esm-only/dist/helpers/util.d.ts'),
      'export type Sub = { b: number };\n',
    );

    await typeDeps();

    expect(error).not.toHaveBeenCalled();
    expect(exit).not.toHaveBeenCalled();
  });

  it('applies typesVersions and null export targets like TypeScript', async () => {
    const exit = jest
      .spyOn(process, 'exit')
      .mockImplementation((() => {}) as () => never);
    const error = jest.spyOn(console, 'error').mockImplementation(() => {});

    fs.writeFileSync(
      joinPath(tmpDir, 'package.json'),
      JSON.stringify({ name: 'root', private: true, workspaces: ['pkg'] }),
    );
    fs.writeFileSync(joinPath(tmpDir, 'yarn.lock'), '');
    fs.mkdirSync(joinPath(tmpDir, 'pkg/dist'), { recursive: true });
    fs.writeFileSync(
      joinPath(tmpDir, 'pkg/package.json'),
      JSON.stringify({
        name: 'pkg',
        version: '1.0.0',
        main: 'dist/index.js',
        types: 'dist/index.d.ts',
        dependencies: {
          '@fake/typed': '1.0.0',
        },
      }),
    );
    fs.writeFileSync(
      joinPath(tmpDir, 'pkg/dist/index.d.ts'),
      "import type { H } from '@fake/typed/helpers/util';\nexport type { H };\n",
    );
    // Subpath types are only reachable through typesVersions, and the
    // package hides its internal subpath with a null export target
    fs.mkdirSync(joinPath(tmpDir, 'node_modules/@fake/typed/dist/helpers'), {
      recursive: true,
    });
    fs.writeFileSync(
      joinPath(tmpDir, 'node_modules/@fake/typed/package.json'),
      JSON.stringify({
        name: '@fake/typed',
        version: '1.0.0',
        type: 'module',
        types: './dist/index.d.ts',
        typesVersions: { '*': { 'helpers/*': ['./dist/helpers/*'] } },
        exports: {
          '.': { types: './dist/index.d.ts', import: './dist/index.js' },
          './helpers/*': { import: './dist/helpers/*.js' },
          './internal/*': null,
        },
      }),
    );
    fs.writeFileSync(
      joinPath(tmpDir, 'node_modules/@fake/typed/dist/helpers/util.d.ts'),
      'export type H = { a: number };\n',
    );

    await typeDeps();

    expect(error).not.toHaveBeenCalled();
    expect(exit).not.toHaveBeenCalled();

    // A subpath excluded with a null export target is still an error
    fs.writeFileSync(
      joinPath(tmpDir, 'pkg/dist/index.d.ts'),
      "import type { H } from '@fake/typed/internal/secret';\nexport type { H };\n",
    );

    exit.mockClear();
    error.mockClear();

    await typeDeps();

    expect(error).toHaveBeenCalledWith(
      expect.stringContaining(
        'Missing a type dependency: @fake/typed/internal/secret',
      ),
    );
    expect(exit).toHaveBeenCalledWith(2);
  });
});
