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

import fs from 'fs-extra';
import { createMockDirectory } from '@backstage/backend-test-utils';
import { PackageGraph } from '@backstage/cli-node';
import { buildBackend } from './buildBackend';
import { createDistWorkspace } from './packager';

jest.mock('./packager', () => ({ createDistWorkspace: jest.fn() }));

describe('buildBackend', () => {
  const mockDir = createMockDirectory();

  afterEach(() => {
    jest.restoreAllMocks();
    jest.clearAllMocks();
  });

  it.each([
    { exports: undefined, source: 'src/index.ts' },
    { exports: { '.': './src/server.ts' }, source: 'src/server.ts' },
  ])(
    'should build backend source with exports $exports',
    async ({ exports, source }) => {
      const packageJson = {
        name: 'test-backend',
        version: '1.0.0',
        backstage: { role: 'backend' },
        main: 'dist/index.cjs.js',
        module: 'dist/index.esm.js',
        exports,
      };
      mockDir.setContent({
        'package.json': JSON.stringify(packageJson),
        [source]: 'export const value: number = 42;',
        'dist/stale.js': 'stale build output',
      });
      jest.spyOn(PackageGraph, 'listTargetPackages').mockResolvedValue([]);
      jest
        .mocked(createDistWorkspace)
        .mockImplementation(async (_packages, options = {}) => {
          const { targetDir } = options;
          if (!targetDir) {
            throw new Error('Expected a target directory');
          }
          expect(
            await fs.readFile(mockDir.resolve('dist/index.cjs.js'), 'utf8'),
          ).toContain('42');
          expect(await fs.pathExists(mockDir.resolve('dist/stale.js'))).toBe(
            false,
          );
          expect(await fs.readJson(mockDir.resolve('package.json'))).toEqual(
            JSON.parse(JSON.stringify(packageJson)),
          );
          await fs.outputFile(`${targetDir}/skeleton.tar.gz`, 'test skeleton');
          return { targetDir, targets: [] };
        });

      await buildBackend({
        targetDir: mockDir.path,
        skipBuildDependencies: true,
      });

      expect(createDistWorkspace).toHaveBeenCalledWith(
        ['test-backend'],
        expect.objectContaining({
          buildDependencies: false,
          buildExcludes: ['test-backend'],
        }),
      );
      expect(await fs.pathExists(mockDir.resolve('dist/bundle.tar.gz'))).toBe(
        true,
      );
      expect(
        await fs.readFile(mockDir.resolve('dist/skeleton.tar.gz'), 'utf8'),
      ).toBe('test skeleton');
    },
  );
});
