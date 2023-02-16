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

import { createGitlabProjectDeployToken } from './createProjectDeployToken';
import { ScmIntegrations } from '@backstage/integration';
import { ConfigReader } from '@backstage/config';
import { getVoidLogger } from '@backstage/backend-common';
import { PassThrough } from 'stream';

const mockGitlabClient = {
  ProjectDeployTokens: {
    add: jest.fn(),
  },
};
jest.mock('@gitbeaker/node', () => ({
  Gitlab: class {
    constructor() {
      return mockGitlabClient;
    }
  },
}));

describe('gitlab:create-deploy-token', () => {
  const config = new ConfigReader({
    integrations: {
      gitlab: [
        {
          host: 'gitlab.com',
          token: 'tokenlols',
          apiBaseUrl: 'https://api.gitlab.com',
        },
        {
          host: 'hosted.gitlab.com',
          apiBaseUrl: 'https://api.hosted.gitlab.com',
        },
      ],
    },
  });

  const integrations = ScmIntegrations.fromConfig(config);
  const action = createGitlabProjectDeployToken({ integrations });
  const mockContext = {
    input: {
      repoUrl: 'gitlab.com?repo=repo&owner=owner',
      projectId: '123',
      name: 'tokenname',
      username: 'tokenuser',
      scopes: ['read_repository'],
    },
    workspacePath: 'lol',
    logger: getVoidLogger(),
    logStream: new PassThrough(),
    output: jest.fn(),
    createTemporaryDirectory: jest.fn(),
  };

  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('should work when there is a token provided through ctx.input', async () => {
    mockGitlabClient.ProjectDeployTokens.add.mockResolvedValue({
      token: 'TOKEN',
      username: 'User',
    });

    await action.handler({
      ...mockContext,
      input: {
        repoUrl: 'hosted.gitlab.com?repo=bob&owner=owner',
        projectId: '123',
        name: 'tokenname',
        username: 'tokenuser',
        scopes: ['read_repository'],
      },
    });

    expect(mockGitlabClient.ProjectDeployTokens.add).toHaveBeenCalledWith(
      '123',
      'tokenname',
      ['read_repository'],
      { username: 'tokenuser' },
    );

    expect(mockContext.output).toHaveBeenCalledWith('deploy_token', 'TOKEN');
    expect(mockContext.output).toHaveBeenCalledWith('user', 'User');
  });
});
