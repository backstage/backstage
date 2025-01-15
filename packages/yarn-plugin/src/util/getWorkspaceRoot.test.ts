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

import { findPaths, Paths } from '@backstage/cli-common';

const setPlatform = (platform: string) => {
  Object.defineProperty(process, `platform`, {
    configurable: true,
    value: platform,
  });
};

describe('getWorkspaceRoot', () => {
  /**
   * Yarn uses a PortablePath type which uses the posix separator
   * regardless of platform and prefixes absolute paths with a separator.
   *
   * https://yarnpkg.com/api/yarnpkg-fslib#type-safe-paths
   */
  describe.each`
    platform    | native                     | portable
    ${'darwin'} | ${'/test/workspace/'}      | ${'/test/workspace/'}
    ${'win32'}  | ${'C:\\test\\workspace\\'} | ${'/C:/test/workspace/'}
  `('platform: $platform', ({ platform, native, portable }) => {
    let realPlatform: string;
    let getWorkspaceRoot: () => string;
    let mockFindPaths: jest.MockedFunction<typeof findPaths>;

    beforeEach(() => {
      realPlatform = process.platform;
      setPlatform(platform);

      jest.resetModules();

      mockFindPaths = jest.fn();

      jest.doMock('@backstage/cli-common', () => ({
        ...jest.requireActual('@backstage/cli-common'),
        findPaths: mockFindPaths,
      }));

      getWorkspaceRoot = require('./getWorkspaceRoot').getWorkspaceRoot;
    });

    afterEach(() => {
      setPlatform(realPlatform);
    });

    it('returns an appropriately-formatted workspace root path', () => {
      mockFindPaths.mockReturnValue({
        targetRoot: native,
      } as Paths);

      expect(getWorkspaceRoot()).toEqual(portable);
    });
  });
});
