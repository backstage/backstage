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
import mockFs from 'mock-fs';
import { resolve as resolvePath, join as joinPath } from 'path';
import { paths } from '../../paths';
import { Task } from '../../tasks';
import { FactoryRegistry } from '../FactoryRegistry';
import { createMockOutputStream, mockPaths } from './common/testUtils';
import { nodeLibraryPackage } from './nodeLibraryPackage';

describe('nodeLibraryPackage factory', () => {
  beforeEach(() => {
    mockPaths({
      targetRoot: '/root',
    });
  });

  afterEach(() => {
    mockFs.restore();
    jest.resetAllMocks();
  });

  it('should create a node library package', async () => {
    const expectedNodeLibraryPackageName = 'test';

    mockFs({
      '/root': {
        packages: mockFs.directory(),
      },
      [paths.resolveOwn('templates')]: mockFs.load(
        paths.resolveOwn('templates'),
      ),
    });

    const options = await FactoryRegistry.populateOptions(nodeLibraryPackage, {
      id: 'test', // name of node library package
    });

    let modified = false;

    const [output, mockStream] = createMockOutputStream();
    jest.spyOn(process, 'stderr', 'get').mockReturnValue(mockStream);
    jest.spyOn(Task, 'forCommand').mockResolvedValue();

    await nodeLibraryPackage.create(options, {
      private: true,
      isMonoRepo: true,
      defaultVersion: '1.0.0',
      markAsModified: () => {
        modified = true;
      },
      createTemporaryDirectory: () => fs.mkdtemp('test'),
    });

    expect(modified).toBe(true);

    expect(output).toEqual([
      '',
      `Creating node-library package ${expectedNodeLibraryPackageName}`,
      'Checking Prerequisites:',
      `availability  ${joinPath('packages', expectedNodeLibraryPackageName)}`,
      'creating      temp dir',
      'Executing Template:',
      'copying       .eslintrc.js',
      'templating    README.md.hbs',
      'templating    package.json.hbs',
      'templating    index.ts.hbs',
      'copying       setupTests.ts',
      'Installing:',
      `moving        ${joinPath('packages', expectedNodeLibraryPackageName)}`,
    ]);

    await expect(
      fs.readJson(
        `/root/packages/${expectedNodeLibraryPackageName}/package.json`,
      ),
    ).resolves.toEqual(
      expect.objectContaining({
        name: expectedNodeLibraryPackageName,
        private: true,
        version: '1.0.0',
      }),
    );

    expect(Task.forCommand).toHaveBeenCalledTimes(2);
    expect(Task.forCommand).toHaveBeenCalledWith('yarn install', {
      cwd: resolvePath(`/root/packages/${expectedNodeLibraryPackageName}`),
      optional: true,
    });
    expect(Task.forCommand).toHaveBeenCalledWith('yarn lint --fix', {
      cwd: resolvePath(`/root/packages/${expectedNodeLibraryPackageName}`),
      optional: true,
    });
  });

  it('should create a node library plugin with options and codeowners', async () => {
    const expectedNodeLibraryPackageName = 'test';

    mockFs({
      '/root': {
        CODEOWNERS: '',
        packages: mockFs.directory(),
      },
      [paths.resolveOwn('templates')]: mockFs.load(
        paths.resolveOwn('templates'),
      ),
    });

    const options = await FactoryRegistry.populateOptions(nodeLibraryPackage, {
      id: 'test',
      owner: '@backstage/test-owners',
    });

    const [, mockStream] = createMockOutputStream();
    jest.spyOn(process, 'stderr', 'get').mockReturnValue(mockStream);
    jest.spyOn(Task, 'forCommand').mockResolvedValue();

    await nodeLibraryPackage.create(options, {
      scope: 'internal',
      private: true,
      isMonoRepo: false,
      defaultVersion: '1.0.0',
      markAsModified: () => {},
      createTemporaryDirectory: () => fs.mkdtemp('test'),
    });

    expect(Task.forCommand).toHaveBeenCalledTimes(2);
    expect(Task.forCommand).toHaveBeenCalledWith('yarn install', {
      cwd: resolvePath(`/root/${expectedNodeLibraryPackageName}`),
      optional: true,
    });
    expect(Task.forCommand).toHaveBeenCalledWith('yarn lint --fix', {
      cwd: resolvePath(`/root/${expectedNodeLibraryPackageName}`),
      optional: true,
    });
  });
});
