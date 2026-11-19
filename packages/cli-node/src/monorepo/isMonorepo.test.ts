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
import { overrideTargetPaths } from '@backstage/cli-common/testUtils';

const mockDir = createMockDirectory();
overrideTargetPaths(mockDir.path);

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

  it('should detect a pnpm monorepo by the packages of pnpm-workspace.yaml', async () => {
    mockDir.setContent({
      'package.json': JSON.stringify({ name: 'foo' }),
      'pnpm-workspace.yaml': 'packages:\n  - packages/*\n',
    });
    await expect(isMonoRepo()).resolves.toBe(true);

    // A pnpm-workspace.yaml file with only settings belongs to a single package
    mockDir.setContent({
      'package.json': JSON.stringify({ name: 'foo' }),
      'pnpm-workspace.yaml': 'nodeLinker: hoisted\n',
    });
    await expect(isMonoRepo()).resolves.toBe(false);

    mockDir.setContent({
      'package.json': JSON.stringify({ name: 'foo' }),
      'pnpm-workspace.yaml': 'packages: [\n',
    });
    await expect(isMonoRepo()).resolves.toBe(true);

    // A pnpm-workspace.yaml in a Yarn project isn't read, broken or not
    mockDir.setContent({
      'package.json': JSON.stringify({
        name: 'foo',
        packageManager: 'yarn@4.18.1',
      }),
      'pnpm-workspace.yaml': 'packages:\n  - packages/*\n',
    });
    await expect(isMonoRepo()).resolves.toBe(false);
    mockDir.setContent({
      'package.json': JSON.stringify({ name: 'foo' }),
      'yarn.lock': '',
      'pnpm-workspace.yaml': 'packages: [\n',
    });
    await expect(isMonoRepo()).resolves.toBe(false);
    mockDir.setContent({
      'package.json': JSON.stringify({
        name: 'foo',
        devEngines: { packageManager: [{ name: 'yarn' }, { name: 'pnpm' }] },
      }),
      'pnpm-workspace.yaml': 'packages:\n  - packages/*\n',
    });
    await expect(isMonoRepo()).resolves.toBe(false);
    // pnpm-lock.yaml wins over a yarn.lock left behind after a migration
    mockDir.setContent({
      'package.json': JSON.stringify({ name: 'foo' }),
      'yarn.lock': '',
      'pnpm-lock.yaml': '',
      'pnpm-workspace.yaml': 'packages:\n  - packages/*\n',
    });
    await expect(isMonoRepo()).resolves.toBe(true);
    mockDir.setContent({
      'package.json': JSON.stringify({ name: 'foo' }),
      'pnpm-workspace.yaml': 'packages: [\n',
    });

    // Also when the roots come from the lookup rather than from an override
    overrideTargetPaths(mockDir.path).restore();
    const cwd = jest.spyOn(process, 'cwd').mockReturnValue(mockDir.path);
    try {
      await expect(isMonoRepo()).resolves.toBe(true);
    } finally {
      cwd.mockRestore();
      overrideTargetPaths(mockDir.path);
    }
  });
});
