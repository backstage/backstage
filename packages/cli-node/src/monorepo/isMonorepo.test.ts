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

import { isMonoRepo } from './isMonoRepo';
import { createMockDirectory } from '@backstage/backend-test-utils';

const mockDir = createMockDirectory();

jest.mock('../util', () => ({
  paths: { resolveTargetRoot: (...args: string[]) => mockDir.resolve(...args) },
}));

describe('isMonoRepo', () => {
  it('should detect a monorepo', async () => {
    mockDir.setContent({
      'package.json': JSON.stringify({
        name: 'foo',
        workspaces: {
          packages: ['packages/*'],
        },
      }),
    });
    await expect(isMonoRepo()).resolves.toBe(true);
  });

  it('should detect a non- monorepo', async () => {
    mockDir.setContent({
      'package.json': JSON.stringify({
        name: 'foo',
      }),
    });
    await expect(isMonoRepo()).resolves.toBe(false);
  });

  it('should return false if package.json is missing', async () => {
    mockDir.setContent({});
    await expect(isMonoRepo()).resolves.toBe(false);
  });
});
