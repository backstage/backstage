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
import { resolveSafeChildPath, resolveFromFile, resolvePackageAssets } from './paths';
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
      const fileUrl = pathToFileURL(resolvePath(testDir, 'index.js')).href;
      
      const result = resolveFromFile(fileUrl, '../../assets');
      expect(result).toBe(resolvePath(testDir, '../../assets'));
    });

    it('should throw error for non-file URLs (e.g., __dirname)', () => {
      const testDir = '/some/module/path';
      
      expect(() => resolveFromFile(testDir, '../assets')).toThrow(
        'resolveFromFile() expects import.meta.url as the first argument'
      );
    });
  });

  describe('resolvePackageAssets', () => {
    it('should resolve package assets using require.resolve', () => {
      // Mock require.resolve to simulate package resolution
      const originalRequire = require;
      const mockRequire = {
        resolve: jest.fn((pkg: string) => {
          if (pkg === 'test-package/package.json') {
            return '/node_modules/test-package/package.json';
          }
          throw new Error('Cannot resolve module');
        }),
      };
      
      // @ts-ignore
      global.require = mockRequire;
      
      try {
        const result = resolvePackageAssets('test-package', 'migrations');
        expect(result).toBe('/node_modules/test-package/migrations');
        expect(mockRequire.resolve).toHaveBeenCalledWith('test-package/package.json');
      } finally {
        global.require = originalRequire;
      }
    });

    it('should fallback to main entry resolution when package.json not found', () => {
      const originalRequire = require;
      const mockRequire = {
        resolve: jest.fn((pkg: string) => {
          if (pkg === 'test-package/package.json') {
            throw new Error('Cannot find package.json');
          }
          if (pkg === 'test-package') {
            return '/node_modules/test-package/dist/index.js';
          }
          throw new Error('Cannot resolve module');
        }),
      };
      
      // @ts-ignore
      global.require = mockRequire;
      
      try {
        const result = resolvePackageAssets('test-package', 'migrations');
        expect(result).toBe('/node_modules/test-package/migrations');
        expect(mockRequire.resolve).toHaveBeenCalledWith('test-package/package.json');
        expect(mockRequire.resolve).toHaveBeenCalledWith('test-package');
      } finally {
        global.require = originalRequire;
      }
    });

    it('should throw error when package cannot be resolved', () => {
      const originalRequire = require;
      const mockRequire = {
        resolve: jest.fn(() => {
          throw new Error('Cannot resolve module');
        }),
      };
      
      // @ts-ignore
      global.require = mockRequire;
      
      try {
        expect(() => resolvePackageAssets('non-existent-package', 'migrations')).toThrow(
          'Cannot resolve package assets for \'non-existent-package\''
        );
      } finally {
        global.require = originalRequire;
      }
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
