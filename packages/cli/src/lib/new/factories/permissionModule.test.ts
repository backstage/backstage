/*
 * Copyright 2021 The Backstage Authors
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
import { sep } from 'path';
import { Task } from '../../tasks';
import { FactoryRegistry } from '../FactoryRegistry';
import {
  createMockOutputStream,
  expectLogsToMatch,
  mockPaths,
} from './common/testUtils';
import { permissionModule } from './permissionModule';
import { createMockDirectory } from '@backstage/backend-test-utils';

describe('permissionModule factory', () => {
  const mockDir = createMockDirectory();

  beforeEach(() => {
    mockPaths({
      targetRoot: mockDir.path,
    });
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should create a permission backend module package', async () => {
    mockDir.setContent({
      plugins: {},
    });

    const options = await FactoryRegistry.populateOptions(permissionModule, {
      id: 'test',
    });

    let modified = false;

    const [output, mockStream] = createMockOutputStream();
    jest.spyOn(process, 'stderr', 'get').mockReturnValue(mockStream);
    jest.spyOn(Task, 'forCommand').mockResolvedValue();

    await permissionModule.create(options, {
      private: true,
      isMonoRepo: true,
      defaultVersion: '1.0.0',
      markAsModified: () => {
        modified = true;
      },
      createTemporaryDirectory: (name: string) => fs.mkdtemp(name),
      license: 'Apache-2.0',
    });

    expect(modified).toBe(true);

    expectLogsToMatch(output, [
      'Creating module backstage-plugin-permission-backend-module-test',
      'Checking Prerequisites:',
      `availability  plugins${sep}permission-backend-module-test`,
      'creating      temp dir',
      'Executing Template:',
      'copying       customPermissionPolicy.ts',
      'templating    README.md.hbs',
      'templating    package.json.hbs',
      'templating    index.ts.hbs',
      'templating    .eslintrc.js.hbs',
      'copying       module.ts',
      'Installing:',
      `moving        plugins${sep}permission-backend-module-test`,
    ]);

    await expect(
      fs.readJson(
        mockDir.resolve('plugins/permission-backend-module-test/package.json'),
      ),
    ).resolves.toEqual(
      expect.objectContaining({
        name: 'backstage-plugin-permission-backend-module-test',
        description: 'The test module for @backstage/plugin-permission-backend',
        private: true,
        version: '1.0.0',
      }),
    );

    expect(Task.forCommand).toHaveBeenCalledTimes(2);
    expect(Task.forCommand).toHaveBeenCalledWith('yarn install', {
      cwd: mockDir.resolve('plugins/permission-backend-module-test'),
      optional: true,
    });
    expect(Task.forCommand).toHaveBeenCalledWith('yarn lint --fix', {
      cwd: mockDir.resolve('plugins/permission-backend-module-test'),
      optional: true,
    });
  });
});
