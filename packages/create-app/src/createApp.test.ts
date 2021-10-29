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
import { Command } from 'commander';
import * as tasks from './lib/tasks';
import createApp from './createApp';

jest.mock('./lib/tasks');

const promptMock = jest.spyOn(inquirer, 'prompt');
const checkPathExistsMock = jest.spyOn(tasks, 'checkPathExistsTask');
const templatingMock = jest.spyOn(tasks, 'templatingTask');
const checkAppExistsMock = jest.spyOn(tasks, 'checkAppExistsTask');
const createTemporaryAppFolderMock = jest.spyOn(
  tasks,
  'createTemporaryAppFolderTask',
);
const moveAppMock = jest.spyOn(tasks, 'moveAppTask');
const buildAppMock = jest.spyOn(tasks, 'buildAppTask');

describe('command entrypoint', () => {
  beforeEach(() => {
    promptMock.mockResolvedValueOnce({
      name: 'MyApp',
      dbType: 'PostgreSQL',
    });
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  test('should call expected tasks with no path option', async () => {
    const cmd = {} as unknown as Command;
    await createApp(cmd);
    expect(checkAppExistsMock).toHaveBeenCalled();
    expect(createTemporaryAppFolderMock).toHaveBeenCalled();
    expect(templatingMock).toHaveBeenCalled();
    expect(moveAppMock).toHaveBeenCalled();
    expect(buildAppMock).toHaveBeenCalled();
  });

  it('should call expected tasks with path option', async () => {
    const cmd = { path: 'myDirectory' } as unknown as Command;
    await createApp(cmd);
    expect(checkPathExistsMock).toHaveBeenCalled();
    expect(templatingMock).toHaveBeenCalled();
    expect(buildAppMock).toHaveBeenCalled();
  });

  it('should not call `buildAppTask` when `skipInstall` is supplied', async () => {
    const cmd = { skipInstall: true } as unknown as Command;
    await createApp(cmd);
    expect(buildAppMock).not.toHaveBeenCalled();
  });
});
