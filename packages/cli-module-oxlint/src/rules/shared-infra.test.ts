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

import path from 'node:path';

const FIXTURE = path.resolve(__dirname, '../__fixtures__/monorepo');

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

describe('resolveContext', () => {
  // eslint-disable-next-line @backstage/no-relative-monorepo-imports
  const {
    resolveCwd,
    resolveFilePath,
  } = require('../../config/lib/resolveContext');

  describe('resolveCwd', () => {
    it('returns context.cwd when it is a string', () => {
      expect(resolveCwd({ cwd: '/some/dir' })).toBe('/some/dir');
    });

    it('falls back to context.getCwd() when cwd is not a string', () => {
      expect(resolveCwd({ getCwd: () => '/from-method' })).toBe('/from-method');
    });

    it('falls back to process.cwd() when neither is available', () => {
      expect(resolveCwd({})).toBe(process.cwd());
    });

    it('prefers context.cwd over getCwd()', () => {
      expect(resolveCwd({ cwd: '/prop', getCwd: () => '/method' })).toBe(
        '/prop',
      );
    });
  });

  describe('resolveFilePath', () => {
    it('returns getPhysicalFilename() when available', () => {
      expect(resolveFilePath({ getPhysicalFilename: () => '/physical' })).toBe(
        '/physical',
      );
    });

    it('falls back to physicalFilename property', () => {
      expect(resolveFilePath({ physicalFilename: '/prop-physical' })).toBe(
        '/prop-physical',
      );
    });

    it('falls back to getFilename() method', () => {
      expect(resolveFilePath({ getFilename: () => '/method-file' })).toBe(
        '/method-file',
      );
    });

    it('falls back to filename property', () => {
      expect(resolveFilePath({ filename: '/prop-file' })).toBe('/prop-file');
    });

    it('returns <unknown> when nothing is available', () => {
      expect(resolveFilePath({})).toBe('<unknown>');
    });

    it('prefers getPhysicalFilename() over physicalFilename', () => {
      expect(
        resolveFilePath({
          getPhysicalFilename: () => '/method',
          physicalFilename: '/prop',
        }),
      ).toBe('/method');
    });
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

  it('returns AST visitor handlers', () => {
    const context = createMockContext(FIXTURE);
    const visitor = jest.fn();
    const handlers = visitImports(context, visitor);
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
    const handlers = visitImports(context, (_node: any, imp: any) => {
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
    const handlers = visitImports(context, (_node: any, imp: any) => {
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
    const handlers = visitImports(context, (_node: any, imp: any) => {
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
    const handlers = visitImports(context, (_node: any, imp: any) => {
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
    const handlers = visitImports(context, (_node: any, imp: any) => {
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
    const handlers = visitImports(context, (_node: any, imp: any) => {
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
    const handlers = visitImports(context, (_node: any, imp: any) => {
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

  it('falls back to getCwd() when context.cwd is not a string', () => {
    const context = { getCwd: () => FIXTURE };
    const visitor = jest.fn();
    const handlers = visitImports(context, visitor);
    expect(handlers).toBeDefined();

    const mockNode = {
      type: 'ImportDeclaration',
      source: { type: 'Literal', value: '@internal/foo' },
    };
    handlers.ImportDeclaration(mockNode);
    expect(visitor).toHaveBeenCalledTimes(1);
    expect(visitor.mock.calls[0][1].type).toBe('internal');
  });
});
