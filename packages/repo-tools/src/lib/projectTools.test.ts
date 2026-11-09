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

import { createMockDirectory } from '@backstage/backend-test-utils';
import { overrideTargetPaths } from '@backstage/cli-common/testUtils';
import { realpathSync } from 'node:fs';
import { join as joinPath } from 'node:path';
import { findProjectTool, requireProjectTool } from './projectTools';

describe('projectTools', () => {
  const mockDir = createMockDirectory();

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('resolves tools from the project root and reports missing ones', () => {
    const warn = jest.spyOn(console, 'warn').mockImplementation(() => {});
    mockDir.setContent({
      'package.json': JSON.stringify({ name: 'root' }),
      node_modules: {
        typescript: {
          'package.json': JSON.stringify({
            name: 'typescript',
            version: '5.9.3',
            main: 'index.js',
            bin: { tsc: './bin/tsc' },
          }),
          'index.js': 'module.exports = { fromProject: true };',
        },
        prettier: {
          'package.json': JSON.stringify({
            name: 'prettier',
            version: '3.0.0',
            bin: './bin/prettier.cjs',
          }),
        },
      },
    });
    overrideTargetPaths(mockDir.path);
    // Module resolution returns real paths, which differ from the mock
    // directory path on systems where the temporary directory is a symlink
    const resolveReal = (path: string) =>
      joinPath(realpathSync(mockDir.path), path);

    const typescript = requireProjectTool('typescript');
    expect(typescript.version).toBe('5.9.3');
    expect(typescript.packageDir).toBe(resolveReal('node_modules/typescript'));
    expect(typescript.binPath('tsc')).toBe(
      resolveReal('node_modules/typescript/bin/tsc'),
    );
    expect(typescript.require('typescript')).toEqual({ fromProject: true });
    expect(() => typescript.binPath('tsserver')).toThrow(
      /does not provide a 'tsserver' executable/,
    );
    expect(warn).not.toHaveBeenCalled();

    const prettier = findProjectTool('prettier');
    expect(prettier?.binPath('prettier')).toBe(
      resolveReal('node_modules/prettier/bin/prettier.cjs'),
    );
    expect(warn).toHaveBeenCalledTimes(1);
    expect(warn).toHaveBeenCalledWith(
      expect.stringContaining(
        'the project uses prettier@3.0.0, but @backstage/repo-tools supports prettier ^2.8.1 || ^3.8.1',
      ),
    );
    findProjectTool('prettier');
    expect(warn).toHaveBeenCalledTimes(1);

    expect(findProjectTool('typedoc')).toBeUndefined();
    expect(() => requireProjectTool('typedoc')).toThrow(
      `Could not find the 'typedoc' package in the project at ${mockDir.path}. ` +
        `@backstage/repo-tools uses the project's own typedoc installation, ` +
        `add 'typedoc' (^0.28.0) to the devDependencies of the root package.json and run 'yarn install'.`,
    );
  });
});
