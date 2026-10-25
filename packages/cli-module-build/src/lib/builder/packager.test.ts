/*
 * Copyright 2021 The Backstage Authors
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
import { createMockDirectory } from '@backstage/backend-test-utils';
import {
  buildPackage,
  formatErrorMessage,
  getEntryPointsForRole,
} from './packager';
import { Output } from './types';

describe('formatErrorMessage with esbuild plugin error', () => {
  it('given error with missing errors array then error message should be shown', () => {
    const msg = formatErrorMessage({
      code: 'PLUGIN_ERROR',
      plugin: 'esbuild',
      message: 'test',
    });
    expect(msg).toBe('test');
  });
  it('given error with errors array then error message should have new lines', () => {
    const msg = formatErrorMessage({
      code: 'PLUGIN_ERROR',
      plugin: 'esbuild',
      message: 'test',
      id: 'index.js',
      errors: [{ text: 'Sample', location: { line: 1, column: 1 } }],
    });
    expect(msg).toContain('test\n\n');
  });
});

describe('CLI build entry points', () => {
  const mockDir = createMockDirectory();

  it.each([
    { exports: undefined, source: 'src/index.ts' },
    { exports: { '.': './source/cli.tsx' }, source: 'source/cli.tsx' },
  ])(
    'should build CLI source with exports $exports',
    async ({ exports, source }) => {
      const packageJson = {
        name: 'test-cli',
        version: '1.0.0',
        backstage: { role: 'cli' as const },
        main: 'dist/index.cjs.js',
        module: 'dist/index.esm.js',
        exports,
      };
      mockDir.setContent({
        'package.json': JSON.stringify(packageJson),
        [source]: 'export const value: number = 42;',
        'dist/stale.js': 'stale build output',
      });
      await buildPackage({
        targetDir: mockDir.path,
        packageJson,
        entryPoints: getEntryPointsForRole('cli', packageJson),
        outputs: new Set([Output.cjs]),
        workspacePackages: [],
      });
      expect(
        await fs.readFile(mockDir.resolve('dist/index.cjs.js'), 'utf8'),
      ).toContain('42');
      expect(await fs.pathExists(mockDir.resolve('dist/stale.js'))).toBe(false);
      expect(await fs.readJson(mockDir.resolve('package.json'))).toEqual(
        JSON.parse(JSON.stringify(packageJson)),
      );
    },
  );

  it('should leave library entry points and explicit exports to the package resolver', () => {
    const pkg = {
      name: 'test-package',
      version: '1.0.0',
      main: 'source/plugin.tsx',
    };
    for (const role of [
      'cli-module',
      'node-library',
      'frontend-plugin',
      'backend-plugin',
    ]) {
      expect(getEntryPointsForRole(role, pkg)).toBeUndefined();
    }
    for (const role of ['cli', 'backend']) {
      expect(
        getEntryPointsForRole(role, { ...pkg, exports: {} }),
      ).toBeUndefined();
      expect(
        getEntryPointsForRole(role, { ...pkg, exports: './dist/index.js' }),
      ).toBeUndefined();
    }
  });
});
