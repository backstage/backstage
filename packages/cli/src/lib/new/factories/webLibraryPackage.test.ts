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

import fs from 'fs-extra';
import { join as joinPath } from 'path';
import { Task } from '../../tasks';
import { FactoryRegistry } from '../FactoryRegistry';
import {
  createMockOutputStream,
  expectLogsToMatch,
  mockPaths,
} from './common/testUtils';
import { webLibraryPackage } from './webLibraryPackage';
import { createMockDirectory } from '@backstage/backend-test-utils';

describe('webLibraryPackage factory', () => {
  const mockDir = createMockDirectory();

  beforeEach(() => {
    mockPaths({
      targetRoot: mockDir.path,
    });
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should create a web library package', async () => {
    const expectedwebLibraryPackageName = 'test';

    mockDir.setContent({
      packages: {},
    });

    const options = await FactoryRegistry.populateOptions(webLibraryPackage, {
      id: 'test', // name of web library package
    });

    let modified = false;

    const [output, mockStream] = createMockOutputStream();
    jest.spyOn(process, 'stderr', 'get').mockReturnValue(mockStream);
    jest.spyOn(Task, 'forCommand').mockResolvedValue();

    await webLibraryPackage.create(options, {
      private: true,
      isMonoRepo: true,
      defaultVersion: '1.0.0',
      markAsModified: () => {
        modified = true;
      },
      createTemporaryDirectory: () => fs.mkdtemp('test'),
      license: 'Apache-2.0',
    });

    expect(modified).toBe(true);

    expectLogsToMatch(output, [
      `Creating web-library package ${expectedwebLibraryPackageName}`,
      'Checking Prerequisites:',
      `availability  ${joinPath('packages', expectedwebLibraryPackageName)}`,
      'creating      temp dir',
      'Executing Template:',
      'copying       .eslintrc.js',
      'templating    README.md.hbs',
      'templating    package.json.hbs',
      'templating    index.ts.hbs',
      'copying       setupTests.ts',
      'Installing:',
      `moving        ${joinPath('packages', expectedwebLibraryPackageName)}`,
    ]);

    await expect(
      fs.readJson(
        mockDir.resolve(
          'packages',
          expectedwebLibraryPackageName,
          'package.json',
        ),
      ),
    ).resolves.toEqual(
      expect.objectContaining({
        name: expectedwebLibraryPackageName,
        private: true,
        version: '1.0.0',
      }),
    );

    expect(Task.forCommand).toHaveBeenCalledTimes(2);
    expect(Task.forCommand).toHaveBeenCalledWith('yarn install', {
      cwd: mockDir.resolve('packages', expectedwebLibraryPackageName),
      optional: true,
    });
    expect(Task.forCommand).toHaveBeenCalledWith('yarn lint --fix', {
      cwd: mockDir.resolve('packages', expectedwebLibraryPackageName),
      optional: true,
    });
  });

  it('should create a web library plugin with options and codeowners', async () => {
    const expectedwebLibraryPackageName = 'test';

    mockDir.setContent({
      CODEOWNERS: '',
      packages: {},
    });

    const options = await FactoryRegistry.populateOptions(webLibraryPackage, {
      id: 'test',
      owner: '@backstage/test-owners',
    });

    const [, mockStream] = createMockOutputStream();
    jest.spyOn(process, 'stderr', 'get').mockReturnValue(mockStream);
    jest.spyOn(Task, 'forCommand').mockResolvedValue();

    await webLibraryPackage.create(options, {
      scope: 'internal',
      private: true,
      isMonoRepo: false,
      defaultVersion: '1.0.0',
      markAsModified: () => {},
      createTemporaryDirectory: () => fs.mkdtemp('test'),
      license: 'Apache-2.0',
    });

    expect(Task.forCommand).toHaveBeenCalledTimes(2);
    expect(Task.forCommand).toHaveBeenCalledWith('yarn install', {
      cwd: mockDir.resolve(expectedwebLibraryPackageName),
      optional: true,
    });
    expect(Task.forCommand).toHaveBeenCalledWith('yarn lint --fix', {
      cwd: mockDir.resolve(expectedwebLibraryPackageName),
      optional: true,
    });
  });
});
