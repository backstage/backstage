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
import { resolveSafeChildPath, resolvePackageAssets } from './paths';
import { resolve as resolvePath } from 'path';

describe('paths', () => {
  describe('resolvePackageAssets', () => {
    const mockDir = createMockDirectory();

    beforeEach(() => {
      mockDir.setContent({
        'package.json': JSON.stringify({ name: 'test-package' }),
        'migrations/001_initial.sql': 'CREATE TABLE test;',
        'dist/database/migrations.js': 'module.exports = {}',
        'dist/migrations/001_initial.sql': 'CREATE TABLE test;',
        'src/database/migrations.ts': 'export function migrate() {}',
      });
    });

    it('should resolve assets from dist directory when called from built module', () => {
      const moduleDir = mockDir.resolve('dist/database');
      const result = resolvePackageAssets(moduleDir, 'migrations');
      
      // Should find the assets copied to dist/migrations
      expect(result).toBe(mockDir.resolve('dist/migrations'));
    });

    it('should fallback to package root when called from src during development', () => {
      const moduleDir = mockDir.resolve('src/database');
      const result = resolvePackageAssets(moduleDir, 'migrations');
      
      // Should find the assets in the package root
      expect(result).toBe(mockDir.resolve('migrations'));
    });

    it('should handle non-existent assets gracefully', () => {
      const moduleDir = mockDir.resolve('src/database');
      const result = resolvePackageAssets(moduleDir, 'nonexistent');
      
      // Should return a path even if it doesn't exist (for better error messages)
      expect(result).toBe(mockDir.resolve('src/nonexistent'));
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
  });
});
