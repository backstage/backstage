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

import { PassThrough } from 'stream';
import { createGitlabGroupEnsureExistsAction } from './createGitlabGroupEnsureExistsAction';
import { getVoidLogger } from '@backstage/backend-common';
import { ConfigReader } from '@backstage/core-app-api';
import { ScmIntegrations } from '@backstage/integration';

const mockGitlabClient = {
  Groups: {
    search: jest.fn(),
    create: jest.fn(),
  },
};
jest.mock('@gitbeaker/node', () => ({
  Gitlab: class {
    constructor() {
      return mockGitlabClient;
    }
  },
}));

describe('gitlab:group:ensureExists', () => {
  const mockContext = {
    workspacePath: 'lol',
    logger: getVoidLogger(),
    logStream: new PassThrough(),
    output: jest.fn(),
    createTemporaryDirectory: jest.fn(),
  };

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should create a new group if it does not exists', async () => {
    mockGitlabClient.Groups.search.mockResolvedValue([
      {
        id: 1,
        full_path: 'repos/bar',
      },
      {
        id: 2,
        full_path: 'repos/foo',
      },
    ]);

    mockGitlabClient.Groups.create.mockResolvedValue({
      id: 3,
      full_path: 'repos/foo/bar',
    });

    const config = new ConfigReader({
      integrations: {
        gitlab: [
          {
            host: 'gitlab.com',
            token: 'tokenlols',
            apiBaseUrl: 'https://api.gitlab.com',
          },
        ],
      },
    });
    const integrations = ScmIntegrations.fromConfig(config);

    const action = createGitlabGroupEnsureExistsAction({ integrations });

    await action.handler({
      ...mockContext,
      input: {
        repoUrl: 'gitlab.com',
        path: ['foo', 'bar'],
      },
    });

    expect(mockGitlabClient.Groups.create).toHaveBeenCalledWith('bar', 'bar', {
      parent_id: 2,
    });

    expect(mockContext.output).toHaveBeenCalledWith('groupId', 3);
  });

  it('should return existing group if it does exists', async () => {
    mockGitlabClient.Groups.search.mockResolvedValue([
      {
        id: 1,
        full_path: 'repos/bar',
      },
      {
        id: 2,
        full_path: 'repos/foo',
      },
      {
        id: 42,
        full_path: 'repos/foo/bar',
      },
    ]);

    const config = new ConfigReader({
      integrations: {
        gitlab: [
          {
            host: 'gitlab.com',
            token: 'tokenlols',
            apiBaseUrl: 'https://api.gitlab.com',
          },
        ],
      },
    });
    const integrations = ScmIntegrations.fromConfig(config);

    const action = createGitlabGroupEnsureExistsAction({ integrations });

    await action.handler({
      ...mockContext,
      input: {
        repoUrl: 'gitlab.com',
        path: ['foo', 'bar'],
      },
    });

    expect(mockGitlabClient.Groups.create).not.toHaveBeenCalled();

    expect(mockContext.output).toHaveBeenCalledWith('groupId', 42);
  });

  it('should not call API on dryRun', async () => {
    const config = new ConfigReader({
      integrations: {
        gitlab: [
          {
            host: 'gitlab.com',
            token: 'tokenlols',
            apiBaseUrl: 'https://api.gitlab.com',
          },
        ],
      },
    });
    const integrations = ScmIntegrations.fromConfig(config);

    const action = createGitlabGroupEnsureExistsAction({ integrations });

    await action.handler({
      ...mockContext,
      isDryRun: true,
      input: {
        repoUrl: 'gitlab.com',
        path: ['foo', 'bar'],
      },
    });

    expect(mockGitlabClient.Groups.search).not.toHaveBeenCalled();
    expect(mockGitlabClient.Groups.create).not.toHaveBeenCalled();

    expect(mockContext.output).toHaveBeenCalledWith('groupId', 42);
  });
});
