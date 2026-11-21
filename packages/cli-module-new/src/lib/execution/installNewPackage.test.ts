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

import fs from 'fs-extra';
import { createMockDirectory } from '@backstage/backend-test-utils';
import { overrideTargetPaths } from '@backstage/cli-common/testUtils';
import { installNewPackage } from './installNewPackage';

const mockDir = createMockDirectory();

describe('installNewPackage', () => {
  const originalCwd = process.cwd();

  beforeEach(() => {
    mockDir.setContent({
      'packages/backend/package.json': JSON.stringify({
        name: 'backend',
        dependencies: { existing: '^1.0.0' },
      }),
      'plugins/.keep': '',
    });
    overrideTargetPaths({
      dir: mockDir.resolve('plugins'),
      workspaceRootDir: mockDir.path,
      installationRootDir: mockDir.path,
    });
  });

  afterEach(() => {
    process.chdir(originalCwd);
  });

  it('should add the dependency to the backend of the installation from any directory', async () => {
    // The command can run from a directory below the installation root
    process.chdir(mockDir.resolve('plugins'));

    await installNewPackage({
      roleParams: { role: 'backend-plugin', pluginId: 'foo' },
      license: 'Apache-2.0',
      version: '0.1.0',
      private: true,
      packageName: '@internal/plugin-foo-backend',
      packagePath: 'plugins/foo-backend',
    });

    await expect(
      fs.readJson(mockDir.resolve('packages/backend/package.json')),
    ).resolves.toEqual({
      name: 'backend',
      dependencies: {
        existing: '^1.0.0',
        '@internal/plugin-foo-backend': 'workspace:^',
      },
    });
    await expect(
      fs.pathExists(mockDir.resolve('plugins/packages/backend/package.json')),
    ).resolves.toBe(false);
  });
});
