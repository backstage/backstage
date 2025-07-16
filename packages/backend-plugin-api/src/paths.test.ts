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

describe('paths', () => {
  describe('resolvePackageAssets', () => {
    const mockDir = createMockDirectory();
    
    beforeEach(() => {
      mockDir.setContent({
        // Create a mock package structure
        'package.json': JSON.stringify({ name: 'test-package' }),
        'migrations/001_initial.sql': 'CREATE TABLE test;',
        'dist/migrations/001_initial.sql': 'CREATE TABLE test;',
        'assets/static.txt': 'static content',
        // Create a fake source file that will call our function
        'src/database/migrations.ts': 'import { resolvePackageAssets } from "@backstage/backend-plugin-api";',
      });
    });

    it('should resolve assets relative to package root automatically', () => {
      // Mock the Error constructor to simulate stack trace
      const originalError = Error;
      const mockError = jest.fn().mockImplementation(function(this: any) {
        this.stack = [
          { getFileName: () => null }, // This function
          { getFileName: () => mockDir.resolve('src/database/migrations.ts') }, // Caller
        ];
      });
      mockError.prepareStackTrace = originalError.prepareStackTrace;
      global.Error = mockError as any;

      const result = resolvePackageAssets('migrations');
      
      // Should find the assets in dist first, then package root
      expect(result).toBe(mockDir.resolve('dist/migrations'));
      
      global.Error = originalError;
    });

    it('should fallback to package root when dist assets not available', () => {
      // Remove dist assets
      mockDir.removeContent(['dist/migrations']);
      
      const originalError = Error;
      const mockError = jest.fn().mockImplementation(function(this: any) {
        this.stack = [
          { getFileName: () => null },
          { getFileName: () => mockDir.resolve('src/database/migrations.ts') },
        ];
      });
      mockError.prepareStackTrace = originalError.prepareStackTrace;
      global.Error = mockError as any;

      const result = resolvePackageAssets('migrations');
      
      // Should find the assets in the package root
      expect(result).toBe(mockDir.resolve('migrations'));
      
      global.Error = originalError;
    });

    it('should handle cases where package.json is not found', () => {
      // Remove package.json to simulate a scenario where package root cannot be found
      mockDir.removeContent(['package.json']);
      
      const originalError = Error;
      const mockError = jest.fn().mockImplementation(function(this: any) {
        this.stack = [
          { getFileName: () => null },
          { getFileName: () => mockDir.resolve('src/database/migrations.ts') },
        ];
      });
      mockError.prepareStackTrace = originalError.prepareStackTrace;
      global.Error = mockError as any;

      const result = resolvePackageAssets('migrations');
      
      // Should fallback to relative to caller file
      expect(result).toBe(require('path').resolve(require('path').dirname(mockDir.resolve('src/database/migrations.ts')), 'migrations'));
      
      global.Error = originalError;
    });

    it('should throw error when caller cannot be determined', () => {
      const originalError = Error;
      const mockError = jest.fn().mockImplementation(function(this: any) {
        this.stack = []; // Empty stack
      });
      mockError.prepareStackTrace = originalError.prepareStackTrace;
      global.Error = mockError as any;

      expect(() => {
        resolvePackageAssets('migrations');
      }).toThrow('Unable to determine calling file for asset resolution');
      
      global.Error = originalError;
    });

    it('should return path even for non-existent assets for better error messages', () => {
      const originalError = Error;
      const mockError = jest.fn().mockImplementation(function(this: any) {
        this.stack = [
          { getFileName: () => null },
          { getFileName: () => mockDir.resolve('src/database/migrations.ts') },
        ];
      });
      mockError.prepareStackTrace = originalError.prepareStackTrace;
      global.Error = mockError as any;

      const result = resolvePackageAssets('nonexistent');
      
      // Should return a valid path for better error messages
      expect(result).toBe(mockDir.resolve('nonexistent'));
      
      global.Error = originalError;
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
