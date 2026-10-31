/*
 * Copyright 2024 The Backstage Authors
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
import { dirname, resolve as resolvePath } from 'node:path';
import { pathToFileURL } from 'node:url';
import { resolvePackagePath, resolveSafeChildPath } from './paths';
import { overridePackagePathResolution } from './testUtils';

describe('paths', () => {
  describe('resolvePackagePath', () => {
    const mockDir = createMockDirectory();
    const packageDir = mockDir.resolve('my package #1%');
    let override: ReturnType<typeof overridePackagePathResolution> | undefined;

    beforeEach(() => {
      mockDir.setContent({
        'package.json': JSON.stringify({ name: 'test-workspace' }),
        'my package #1%': {
          'package.json': JSON.stringify({ name: 'test-package' }),
          'src/lib/index.ts': '',
          'dist/index.cjs.js': '',
          'nested/package.json': '{}',
          'nested/index.js': '',
        },
      });
    });

    afterEach(() => {
      override?.restore();
      override = undefined;
    });

    it('resolves package names and retains path overrides', () => {
      const root = dirname(
        require.resolve('@backstage/backend-plugin-api/package.json'),
      );
      expect(resolvePackagePath('@backstage/backend-plugin-api')).toBe(root);
      expect(resolvePackagePath(import.meta.url)).toBe(root);
      expect(
        resolvePackagePath(
          '@backstage/backend-plugin-api',
          'assets',
          'test.txt',
        ),
      ).toBe(resolvePath(root, 'assets/test.txt'));

      override = overridePackagePathResolution({
        packageName: '@backstage/backend-plugin-api',
        paths: { 'assets/test.txt': mockDir.resolve('override.txt') },
      });
      expect(
        resolvePackagePath(
          '@backstage/backend-plugin-api',
          'assets',
          'test.txt',
        ),
      ).toBe(mockDir.resolve('override.txt'));
      expect(resolvePackagePath('@backstage/backend-plugin-api')).toBe(root);
      expect(() =>
        resolvePackagePath('nonexistent-package-for-path-test'),
      ).toThrow();
    });

    it('resolves file URLs relative to the nearest package root', () => {
      for (const modulePath of ['src/lib/index.ts', 'dist/index.cjs.js']) {
        const moduleUrl = pathToFileURL(
          resolvePath(packageDir, modulePath),
        ).href;
        expect(resolvePackagePath(moduleUrl)).toBe(packageDir);
        expect(resolvePackagePath(moduleUrl, 'migrations', 'new.js')).toBe(
          resolvePath(packageDir, 'migrations/new.js'),
        );
      }

      expect(
        resolvePackagePath(
          pathToFileURL(resolvePath(packageDir, 'nested/index.js')).href,
        ),
      ).toBe(resolvePath(packageDir, 'nested'));
      expect(() => resolvePackagePath('file:///%2F/index.js')).toThrow();
    });

    it('applies package-name overrides to file URLs and restores resolution', () => {
      const moduleUrl = pathToFileURL(
        resolvePath(packageDir, 'src/lib/index.ts'),
      ).href;
      override = overridePackagePathResolution({
        packageName: 'test-package',
        path: mockDir.resolve('replacement'),
        paths: { 'migrations/new.js': mockDir.resolve('override.js') },
      });

      expect(resolvePackagePath(moduleUrl)).toBe(
        mockDir.resolve('replacement'),
      );
      expect(resolvePackagePath(moduleUrl, 'migrations', 'new.js')).toBe(
        mockDir.resolve('override.js'),
      );
      expect(resolvePackagePath(moduleUrl, 'assets')).toBe(
        mockDir.resolve('replacement/assets'),
      );

      override.restore();
      expect(resolvePackagePath(moduleUrl, 'assets')).toBe(
        resolvePath(packageDir, 'assets'),
      );
    });
  });

  describe('resolveSafeChildPath', () => {
    const mockDir = createMockDirectory();
    const secondDirectory = createMockDirectory();

    const workspacePath = mockDir.resolve('workspace');

    beforeEach(() => {
      mockDir.setContent({
        [`${workspacePath}/README.md`]: '### README.md',
      });
      secondDirectory.setContent({
        [`index.md`]: '### index.md',
      });
    });

    it('should throw an error if the path is outside of the base path', () => {
      expect(() =>
        resolveSafeChildPath(workspacePath, secondDirectory.path),
      ).toThrow(
        'Relative path is not allowed to refer to a directory outside its parent',
      );
    });

    it('should resolve to the full path if the target is inside the directory', () => {
      expect(resolveSafeChildPath(workspacePath, './README.md')).toEqual(
        `${workspacePath}/README.md`,
      );
    });

    it('should throw an error if the path is a symlink to a directory outside of the base path', () => {
      mockDir.addContent({
        [`${workspacePath}/symlink`]: ({ symlink }) =>
          symlink(secondDirectory.path),
      });

      expect(() =>
        resolveSafeChildPath(workspacePath, './symlink/index.md'),
      ).toThrow(
        'Relative path is not allowed to refer to a directory outside its parent',
      );
    });

    it('should not throw an error when a folder is referenced that doesnt already exist', () => {
      expect(resolveSafeChildPath(workspacePath, 'template')).toEqual(
        `${workspacePath}/template`,
      );
    });

    it('should throw an error if the path is a symlink pointing to a non-existent target outside base', () => {
      // This tests the case where realpathSync would fail with ENOENT
      // but the symlink itself exists and points outside the base directory
      const nonExistentTarget = `${secondDirectory.path}/does-not-exist.txt`;
      mockDir.addContent({
        [`${workspacePath}/dangling-link`]: ({ symlink }) =>
          symlink(nonExistentTarget),
      });

      expect(() =>
        resolveSafeChildPath(workspacePath, './dangling-link'),
      ).toThrow(
        'Relative path is not allowed to refer to a directory outside its parent',
      );
    });

    it('should allow symlinks pointing to non-existent targets within base directory', () => {
      mockDir.addContent({
        [`${workspacePath}/internal-link`]: ({ symlink }) =>
          symlink('./future-file.txt'),
      });

      expect(resolveSafeChildPath(workspacePath, './internal-link')).toEqual(
        `${workspacePath}/internal-link`,
      );
    });

    it('should throw an error when writing through a symlink to a non-existent file outside base', () => {
      // Symlink in workspace points outside, target directory exists but file doesn't
      // e.g., /workspace/evil -> /etc, then write to evil/newfile.conf
      // The check should catch that evil/newfile.conf resolves to /etc/newfile.conf
      mockDir.addContent({
        [`${workspacePath}/escape-link`]: ({ symlink }) =>
          symlink(secondDirectory.path),
      });

      // This should throw because escape-link/new-file.txt would write to secondDirectory/new-file.txt
      expect(() =>
        resolveSafeChildPath(workspacePath, './escape-link/new-file.txt'),
      ).toThrow(
        'Relative path is not allowed to refer to a directory outside its parent',
      );
    });

    it('should throw an error for symlink chains pointing outside base', () => {
      // link1 -> link2 -> outside
      // Even if final target doesn't exist, should detect the escape
      const nonExistentOutside = `${secondDirectory.path}/does-not-exist`;
      mockDir.addContent({
        [`${workspacePath}/link2`]: ({ symlink }) =>
          symlink(nonExistentOutside),
        [`${workspacePath}/link1`]: ({ symlink }) => symlink('./link2'),
      });

      expect(() => resolveSafeChildPath(workspacePath, './link1')).toThrow(
        'Relative path is not allowed to refer to a directory outside its parent',
      );
    });

    it('should throw when deeply nested non-existent path has symlink ancestor pointing outside', () => {
      // Tests the recursive parent-walking behavior in resolveRealPath.
      // When given a/b/c/d/file.txt where none of b/c/d exist, the code walks up
      // the tree until finding 'a' (a symlink), resolves it, then rebuilds the path.
      mockDir.addContent({
        [`${workspacePath}/escape`]: ({ symlink }) =>
          symlink(secondDirectory.path),
      });

      // escape/deeply/nested/path/file.txt requires walking up 4 levels
      // before finding the symlink at 'escape'
      expect(() =>
        resolveSafeChildPath(
          workspacePath,
          './escape/deeply/nested/path/file.txt',
        ),
      ).toThrow(
        'Relative path is not allowed to refer to a directory outside its parent',
      );
    });
  });
});
