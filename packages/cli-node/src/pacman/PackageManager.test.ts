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
import { detectPackageManager } from './PackageManager';
import { Yarn } from './yarn';
import { withLogCollector } from '@backstage/test-utils';

const mockDir = createMockDirectory();

jest.mock('../paths', () => ({
  paths: { resolveTargetRoot: (...args: string[]) => mockDir.resolve(...args) },
}));

const mockYarnCreate = jest.spyOn(Yarn, 'create');

describe('PackageManager', () => {
  describe('detectPackageManager', () => {
    describe('yarn', () => {
      afterEach(() => {
        jest.resetAllMocks();
      });

      it('should detect via yarn.lock', async () => {
        mockDir.setContent({
          'yarn.lock': 'just needs to exist',
        });
        await detectPackageManager();
        expect(mockYarnCreate).toHaveBeenCalled();
      });

      it('should detect via root package.json workspaces', async () => {
        mockDir.setContent({
          'package.json': JSON.stringify({
            name: 'foo',
            workspaces: {
              packages: [],
            },
          }),
        });
        await detectPackageManager();
        expect(mockYarnCreate).toHaveBeenCalled();
      });

      it('should detect via root package.json packageManager', async () => {
        mockDir.setContent({
          'package.json': JSON.stringify({
            name: 'foo',
            packageManager: 'yarn@1.0.0',
          }),
        });
        await detectPackageManager();
        expect(mockYarnCreate).toHaveBeenCalled();
      });

      it('should fall back to yarn when root package.json packageManager field is unrecognized', async () => {
        mockDir.setContent({
          'package.json': JSON.stringify({
            name: 'foo',
            packageManager: 'something-else@1.0.0',
          }),
        });

        const { log } = await withLogCollector(async () => {
          await detectPackageManager();
        });

        expect(mockYarnCreate).toHaveBeenCalledTimes(1);
        expect(log).toHaveLength(1);
      });

      it('should fall back to yarn with available detection methods', async () => {
        mockDir.setContent({
          'package.json': JSON.stringify({
            name: 'foo',
          }),
        });

        const { log } = await withLogCollector(async () => {
          await detectPackageManager();
        });

        expect(mockYarnCreate).toHaveBeenCalledTimes(1);
        expect(log).toHaveLength(1);
      });

      it('should fall back to yarn with no package.json at all', async () => {
        mockDir.setContent({});

        const { log } = await withLogCollector(async () => {
          await detectPackageManager();
        });

        expect(mockYarnCreate).toHaveBeenCalledTimes(1);
        // extra log for the error reading package.json
        expect(log).toHaveLength(2);
      });
    });
  });
});
