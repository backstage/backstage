/*
 * Copyright 2022 The Backstage Authors
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

import mockFs from 'mock-fs';
import { resolve as resolvePath } from 'path';
import { resolvePackagePath, paths, findPackageDirs } from './paths';

describe('paths', () => {
  jest.spyOn(paths, 'targetRoot', 'get').mockReturnValue('/root');
  jest.spyOn(paths, 'resolveTargetRoot').mockImplementation((...path) => {
    return resolvePath('/root', ...path);
  });

  beforeEach(() => {
    mockFs({
      [paths.targetRoot]: {
        'package.json': JSON.stringify({ name: 'test' }),
        packages: {
          'package-a': {
            'package.json': '{}',
          },
          'package-b': {
            'package.json': '{}',
          },
          'package-c': {},
          'README.md': 'Hello World',
        },
        plugins: {
          'plugin-a': {
            'package.json': '{}',
          },
          'plugin-b': {
            'package.json': '{}',
          },
        },
      },
    });
  });

  afterEach(() => {
    mockFs.restore();
  });

  describe('resolvePackagePath', () => {
    it('should return undefined if the package does not exist or does not contain a package.json', async () => {
      expect(await resolvePackagePath('packages/package-d')).toBeUndefined();
      expect(await resolvePackagePath('packages/package-c')).toBeUndefined();
    });
    it('should return the path to the package if it exists and has a package.json', async () => {
      expect(await resolvePackagePath('packages/package-a')).toBe(
        'packages/package-a',
      );
      expect(await resolvePackagePath('packages/package-b')).toBe(
        'packages/package-b',
      );
    });
    it('should work with absolute paths', async () => {
      expect(await resolvePackagePath('/root/packages/package-a')).toBe(
        'packages/package-a',
      );
    });
    it('should return undefined if the pat is not a directory', async () => {
      expect(await resolvePackagePath('packages/README.md')).toBeUndefined();
    });
  });
  describe('findPackageDirs', () => {
    it('should return only the given packages', async () => {
      expect(await findPackageDirs(['packages/package-a'])).toEqual([
        'packages/package-a',
      ]);
    });
    it('should return only the given packages when using glob patterns', async () => {
      expect(await findPackageDirs(['packages/*'])).toEqual([
        'packages/package-a',
        'packages/package-b',
      ]);
      expect(await findPackageDirs(['packages/*', 'plugins/*'])).toEqual([
        'packages/package-a',
        'packages/package-b',
        'plugins/plugin-a',
        'plugins/plugin-b',
      ]);
    });
    it('should return only the given packages when using absolute paths', async () => {
      expect(
        await findPackageDirs([
          '/root/packages/package-a',
          '/root/plugins/plugin-b',
        ]),
      ).toEqual(['packages/package-a', 'plugins/plugin-b']);
    });
    it('should return only the given packages when using absolute paths with glob patterns', async () => {
      expect(
        await findPackageDirs(['/root/packages/*', '/root/plugins/*-a']),
      ).toEqual([
        'packages/package-a',
        'packages/package-b',
        'plugins/plugin-a',
      ]);
    });
  });
});
