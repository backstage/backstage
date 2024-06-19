/*
 * Copyright 2023 The Backstage Authors
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

import { ConfigReader } from '@backstage/config';
import { ScmIntegrations } from '@backstage/integration';
import { createMockActionContext } from '@backstage/plugin-scaffolder-node-test-utils';
import yaml from 'yaml';
import { createGitlabProjectDeployTokenAction } from './gitlabProjectDeployTokenCreate';
import { examples } from './gitlabProjectDeployTokenCreate.examples';

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
  const action = createGitlabProjectDeployTokenAction({ integrations });
  const mockContext = createMockActionContext({
    input: {
      repoUrl: 'gitlab.com?repo=repo&owner=owner',
      projectId: '123',
      name: 'tokenname',
      username: 'tokenuser',
      scopes: ['read_repository'],
    },
  });

  beforeEach(() => {
    jest.resetAllMocks();
  });

  it(`Should ${examples[0].description}`, async () => {
    mockGitlabClient.ProjectDeployTokens.add.mockResolvedValue({
      token: 'TOKEN',
      username: 'User',
    });

    await action.handler({
      ...mockContext,
      input: yaml.parse(examples[0].example).steps[0].input,
    });

    expect(mockGitlabClient.ProjectDeployTokens.add).toHaveBeenCalledWith(
      '456',
      'tokenname',
      undefined,
      { username: undefined },
    );

    expect(mockContext.output).toHaveBeenCalledWith('deploy_token', 'TOKEN');
    expect(mockContext.output).toHaveBeenCalledWith('user', 'User');
  });

  it(`Should ${examples[1].description}`, async () => {
    mockGitlabClient.ProjectDeployTokens.add.mockResolvedValue({
      token: 'TOKEN',
      username: 'User',
    });

    await action.handler({
      ...mockContext,
      input: yaml.parse(examples[1].example).steps[0].input,
    });

    expect(mockGitlabClient.ProjectDeployTokens.add).toHaveBeenCalledWith(
      '789',
      'tokenname',
      ['read_registry', 'write_repository'],
      { username: undefined },
    );

    expect(mockContext.output).toHaveBeenCalledWith('deploy_token', 'TOKEN');
    expect(mockContext.output).toHaveBeenCalledWith('user', 'User');
  });

  it(`Should ${examples[2].description}`, async () => {
    mockGitlabClient.ProjectDeployTokens.add.mockResolvedValue({
      token: 'TOKEN',
      username: 'User',
    });

    await action.handler({
      ...mockContext,
      input: yaml.parse(examples[2].example).steps[0].input,
    });

    expect(mockGitlabClient.ProjectDeployTokens.add).toHaveBeenCalledWith(
      '101112',
      'my-custom-token',
      undefined,
      { username: undefined },
    );

    expect(mockContext.output).toHaveBeenCalledWith('deploy_token', 'TOKEN');
    expect(mockContext.output).toHaveBeenCalledWith('user', 'User');
  });

  it(`Should ${examples[3].description}`, async () => {
    mockGitlabClient.ProjectDeployTokens.add.mockResolvedValue({
      token: 'TOKEN',
      username: 'User',
    });

    await action.handler({
      ...mockContext,
      input: yaml.parse(examples[3].example).steps[0].input,
    });

    expect(mockGitlabClient.ProjectDeployTokens.add).toHaveBeenCalledWith(
      42,
      'tokenname',
      undefined,
      { username: undefined },
    );

    expect(mockContext.output).toHaveBeenCalledWith('deploy_token', 'TOKEN');
    expect(mockContext.output).toHaveBeenCalledWith('user', 'User');
  });

  it(`Should ${examples[4].description}`, async () => {
    mockGitlabClient.ProjectDeployTokens.add.mockResolvedValue({
      token: 'TOKEN',
      username: 'User',
    });

    await action.handler({
      ...mockContext,
      input: yaml.parse(examples[4].example).steps[0].input,
    });

    expect(mockGitlabClient.ProjectDeployTokens.add).toHaveBeenCalledWith(
      42,
      'tokenname',
      undefined,
      { username: 'tokenuser' },
    );

    expect(mockContext.output).toHaveBeenCalledWith('deploy_token', 'TOKEN');
    expect(mockContext.output).toHaveBeenCalledWith('user', 'User');
  });
});
