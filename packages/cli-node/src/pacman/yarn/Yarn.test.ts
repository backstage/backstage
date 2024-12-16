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
import { Yarn } from './Yarn';

const mockDir = createMockDirectory();

jest.mock('../../util', () => ({
  ...jest.requireActual('../../util'),
  paths: { resolveTargetRoot: (...args: string[]) => mockDir.resolve(...args) },
}));

const yarnClassic = new Yarn({ version: '1.0.0', codename: 'classic' });
const yarnBerry = new Yarn({ version: '3.0.0', codename: 'berry' });
const allYarnVersions = [yarnClassic, yarnBerry];

describe('Yarn', () => {
  describe.each(allYarnVersions)('%s.getMonorepoPackages', yarn => {
    it('should detect a monorepo', async () => {
      mockDir.setContent({
        'package.json': JSON.stringify({
          name: 'foo',
          workspaces: {
            packages: ['packages/*'],
          },
        }),
      });
      await expect(yarn.getMonorepoPackages()).resolves.toEqual(['packages/*']);
    });

    it('should detect a non-monorepo', async () => {
      mockDir.setContent({
        'package.json': JSON.stringify({
          name: 'foo',
        }),
      });
      await expect(yarn.getMonorepoPackages()).resolves.toEqual([]);
    });

    it('should return false if package.json is missing', async () => {
      mockDir.setContent({});
      await expect(yarn.getMonorepoPackages()).resolves.toEqual([]);
    });
  });
});
