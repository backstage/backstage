/*
 * Copyright 2026 The Backstage Authors
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
import { overrideTargetPaths } from '@backstage/cli-common/testUtils';
import { buildPackage } from './builder';
import { createDistWorkspace } from './packager/createDistWorkspace';
import { buildBackend } from './buildBackend';

jest.mock('./builder', () => ({
  ...jest.requireActual('./builder'),
  buildPackage: jest.fn(),
}));

jest.mock('./packager/createDistWorkspace', () => ({
  ...jest.requireActual('./packager/createDistWorkspace'),
  createDistWorkspace: jest.fn(),
}));

jest.mock('@backstage/cli-node/alpha', () => ({
  ...jest.requireActual('@backstage/cli-node/alpha'),
  detectPackageManager: async () => ({
    name: () => 'yarn',
    lockfileName: () => 'yarn.lock',
    getCommandHint: (args: string[]) => `yarn ${args.join(' ')}`,
  }),
}));

describe('buildBackend', () => {
  const mockDir = createMockDirectory();

  it('fails before it builds anything when the lockfile is missing', async () => {
    mockDir.setContent({
      'package.json': JSON.stringify({ workspaces: ['packages/*'] }),
      'packages/backend/package.json': JSON.stringify({ name: 'backend' }),
    });
    overrideTargetPaths({
      dir: mockDir.resolve('packages/backend'),
      workspaceRootDir: mockDir.path,
    });

    await expect(
      buildBackend({
        targetDir: mockDir.resolve('packages/backend'),
        skipBuildDependencies: true,
      }),
    ).rejects.toThrow(
      "There is no yarn.lock in the workspace root, which the dist workspace is installed from. Run 'yarn install' to create it.",
    );
    expect(buildPackage).not.toHaveBeenCalled();
    expect(createDistWorkspace).not.toHaveBeenCalled();
  });
});
