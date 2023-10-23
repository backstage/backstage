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

import inquirer from 'inquirer';
import path from 'path';
import { Command } from 'commander';
import * as tasks from './lib/tasks';
import createApp from './createApp';
import { findPaths } from '@backstage/cli-common';
import { tmpdir } from 'os';
import { createMockDirectory } from '@backstage/backend-test-utils';

jest.mock('./lib/tasks');

// By mocking this the filesystem mocks won't mess with reading all of the package.jsons
jest.mock('./lib/versions', () => ({
  packageVersions: { root: '1.0.0' },
}));

const promptMock = jest.spyOn(inquirer, 'prompt');
const checkPathExistsMock = jest.spyOn(tasks, 'checkPathExistsTask');
const templatingMock = jest.spyOn(tasks, 'templatingTask');
const checkAppExistsMock = jest.spyOn(tasks, 'checkAppExistsTask');
const tryInitGitRepositoryMock = jest.spyOn(tasks, 'tryInitGitRepository');
const readGitConfig = jest.spyOn(tasks, 'readGitConfig');
const moveAppMock = jest.spyOn(tasks, 'moveAppTask');
const buildAppMock = jest.spyOn(tasks, 'buildAppTask');

describe('command entrypoint', () => {
  const mockDir = createMockDirectory({ mockOsTmpDir: true });

  beforeEach(() => {
    promptMock.mockResolvedValueOnce({
      name: 'MyApp',
      dbType: 'PostgreSQL',
    });
    readGitConfig.mockResolvedValue({
      defaultBranch: 'git-default-branch',
    });
  });

  afterEach(() => {
    mockDir.clear();
    jest.resetAllMocks();
  });

  test('should call expected tasks with no path option', async () => {
    const cmd = {} as unknown as Command;
    await createApp(cmd);
    expect(checkAppExistsMock).toHaveBeenCalled();
    expect(tryInitGitRepositoryMock).toHaveBeenCalled();
    expect(templatingMock).toHaveBeenCalled();
    expect(templatingMock.mock.lastCall?.[0]).toEqual(
      findPaths(__dirname).resolveTarget(
        'packages',
        'create-app',
        'templates',
        'default-app',
      ),
    );
    expect(templatingMock.mock.lastCall?.[1]).toContain(
      path.join(tmpdir(), 'MyApp'),
    );
    expect(moveAppMock).toHaveBeenCalled();
    expect(buildAppMock).toHaveBeenCalled();
  });

  it('should call expected tasks with path option', async () => {
    const cmd = { path: 'myDirectory' } as unknown as Command;
    await createApp(cmd);
    expect(checkPathExistsMock).toHaveBeenCalled();
    expect(tryInitGitRepositoryMock).toHaveBeenCalled();
    expect(templatingMock).toHaveBeenCalled();
    expect(templatingMock.mock.lastCall?.[0]).toEqual(
      findPaths(__dirname).resolveTarget(
        'packages',
        'create-app',
        'templates',
        'default-app',
      ),
    );
    expect(templatingMock.mock.lastCall?.[1]).toEqual('myDirectory');
    expect(buildAppMock).toHaveBeenCalled();
  });

  it('should call expected tasks with relative --template-path option', async () => {
    const cmd = {
      path: 'myDirectory',
      templatePath: 'templateDirectory',
    } as unknown as Command;
    await createApp(cmd);
    expect(checkPathExistsMock).toHaveBeenCalled();
    expect(tryInitGitRepositoryMock).toHaveBeenCalled();
    expect(templatingMock).toHaveBeenCalled();
    expect(templatingMock.mock.lastCall?.[0]).toEqual(
      findPaths(__dirname).resolveTarget('templateDirectory'),
    );
    expect(templatingMock.mock.lastCall?.[1]).toEqual('myDirectory');
    expect(buildAppMock).toHaveBeenCalled();
  });

  it('should call expected tasks with absolute --template-path option', async () => {
    const cmd = {
      path: 'myDirectory',
      templatePath: path.resolve('somewhere', 'templateDirectory'),
    } as unknown as Command;
    await createApp(cmd);
    expect(checkPathExistsMock).toHaveBeenCalled();
    expect(tryInitGitRepositoryMock).toHaveBeenCalled();
    expect(templatingMock).toHaveBeenCalled();
    expect(templatingMock.mock.lastCall?.[0]).toEqual(
      path.resolve('somewhere', 'templateDirectory'),
    );
    expect(templatingMock.mock.lastCall?.[1]).toEqual('myDirectory');
    expect(buildAppMock).toHaveBeenCalled();
  });

  it('should not call `buildAppTask` when `skipInstall` is supplied', async () => {
    const cmd = { skipInstall: true } as unknown as Command;
    await createApp(cmd);
    expect(buildAppMock).not.toHaveBeenCalled();
  });

  it('should not call `initGitRepository` when `gitConfig` is undefined', async () => {
    const cmd = {} as unknown as Command;
    readGitConfig.mockResolvedValue(undefined);
    await createApp(cmd);
    expect(tryInitGitRepositoryMock).not.toHaveBeenCalled();
  });
});
