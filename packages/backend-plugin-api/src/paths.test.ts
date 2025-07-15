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
import { resolveSafeChildPath, resolveFromFile } from './paths';
import { resolve as resolvePath } from 'path';
import { pathToFileURL } from 'url';

describe('paths', () => {
  describe('resolveFromFile', () => {
    it('should resolve paths from file URL (import.meta.url)', () => {
      const testDir = '/some/module/path';
      const fileUrl = pathToFileURL(resolvePath(testDir, 'index.js')).href;
      
      const result = resolveFromFile(fileUrl, '../assets', 'config.json');
      expect(result).toBe(resolvePath(testDir, '../assets', 'config.json'));
    });

    it('should resolve paths from directory path (__dirname)', () => {
      const testDir = '/some/module/path';
      
      const result = resolveFromFile(testDir, '../assets', 'config.json');
      expect(result).toBe(resolvePath(testDir, '../assets', 'config.json'));
    });

    it('should handle single path segment', () => {
      const testDir = '/some/module/path';
      const fileUrl = pathToFileURL(resolvePath(testDir, 'index.js')).href;
      
      const result = resolveFromFile(fileUrl, 'migrations');
      expect(result).toBe(resolvePath(testDir, 'migrations'));
    });

    it('should handle no additional path segments', () => {
      const testDir = '/some/module/path';
      const fileUrl = pathToFileURL(resolvePath(testDir, 'index.js')).href;
      
      const result = resolveFromFile(fileUrl);
      expect(result).toBe(testDir);
    });

    it('should handle relative paths going up directories', () => {
      const testDir = '/some/module/src/database';
      
      const result = resolveFromFile(testDir, '../../assets');
      expect(result).toBe(resolvePath(testDir, '../../assets'));
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
