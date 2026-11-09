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

import { ConfigReader } from '@backstage/config';
import { ScmIntegrations } from '@backstage/integration';
import { createMockActionContext } from '@backstage/plugin-scaffolder-node-test-utils';
import { createGitlabProjectDeployTokenAction } from './gitlabProjectDeployTokenCreate';

const mockGitlabClient = {
  DeployTokens: {
    create: jest.fn(),
    remove: jest.fn(),
  },
  ProjectVariables: {
    create: jest.fn(),
  },
};
jest.mock('@gitbeaker/rest', () => ({
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

  it('should work when there is a token provided through ctx.input', async () => {
    mockGitlabClient.DeployTokens.create.mockResolvedValue({
      token: 'TOKEN',
      username: 'User',
    });
    mockContext.logger.warn = jest.fn();

    await action.handler({
      ...mockContext,
      input: {
        repoUrl: 'hosted.gitlab.com?repo=bob&owner=owner',
        projectId: '123',
        name: 'tokenname',
        username: 'tokenuser',
        scopes: ['read_repository'],
        token: 'oidctoken',
      },
    });

    expect(mockGitlabClient.DeployTokens.create).toHaveBeenCalledWith(
      'tokenname',
      ['read_repository'],
      {
        projectId: '123',
        username: 'tokenuser',
      },
    );

    expect(mockContext.output).toHaveBeenCalledWith('deploy_token', 'TOKEN');
    expect(mockContext.output).toHaveBeenCalledWith('user', 'User');
    expect(mockContext.logger.warn).toHaveBeenCalledWith(
      expect.stringContaining('deploy_token output is deprecated'),
    );
  });

  it('should work when there is not a token provided through ctx.input e.g. integration token', async () => {
    mockGitlabClient.DeployTokens.create.mockResolvedValue({
      token: 'TOKEN',
      username: 'User',
    });

    await action.handler({
      ...mockContext,
      input: {
        repoUrl: 'gitlab.com?repo=bob&owner=owner',
        projectId: '123',
        name: 'tokenname',
        username: 'tokenuser',
        scopes: ['read_repository'],
      },
    });

    expect(mockGitlabClient.DeployTokens.create).toHaveBeenCalledWith(
      'tokenname',
      ['read_repository'],
      {
        projectId: '123',
        username: 'tokenuser',
      },
    );

    expect(mockContext.output).toHaveBeenCalledWith('deploy_token', 'TOKEN');
    expect(mockContext.output).toHaveBeenCalledWith('user', 'User');
  });

  it('should create a token and store it as a CI/CD variable when variableKey is provided', async () => {
    mockGitlabClient.DeployTokens.create.mockResolvedValue({
      id: 1,
      token: 'deploy-secret',
      username: 'deploy-user',
    });
    mockGitlabClient.ProjectVariables.create.mockResolvedValue({});
    mockContext.logger.warn = jest.fn();

    await action.handler({
      ...mockContext,
      input: {
        repoUrl: 'gitlab.com?repo=bob&owner=owner',
        projectId: '123',
        name: 'tokenname',
        username: 'tokenuser',
        scopes: ['read_repository'],
        variableKey: 'DEPLOY_TOKEN',
      },
    });

    expect(mockGitlabClient.DeployTokens.create).toHaveBeenCalledWith(
      'tokenname',
      ['read_repository'],
      {
        projectId: '123',
        username: 'tokenuser',
      },
    );

    expect(mockGitlabClient.ProjectVariables.create).toHaveBeenCalledWith(
      '123',
      'DEPLOY_TOKEN',
      'deploy-secret',
      {
        variableType: 'env_var',
        protected: false,
        masked: true,
        masked_and_hidden: false,
        raw: true,
        environmentScope: '*',
      },
    );

    expect(mockContext.output).toHaveBeenCalledWith(
      'variableKey',
      'DEPLOY_TOKEN',
    );
    expect(mockContext.output).toHaveBeenCalledWith('user', 'deploy-user');
    expect(mockContext.output).not.toHaveBeenCalledWith(
      'deploy_token',
      expect.anything(),
    );
    expect(mockContext.logger.warn).not.toHaveBeenCalled();
  });

  it('should create a token and store it as a CI/CD variable with custom options', async () => {
    mockGitlabClient.DeployTokens.create.mockResolvedValue({
      id: 1,
      token: 'deploy-secret',
      username: 'deploy-user',
    });
    mockGitlabClient.ProjectVariables.create.mockResolvedValue({});

    await action.handler({
      ...mockContext,
      input: {
        repoUrl: 'gitlab.com?repo=bob&owner=owner',
        projectId: '123',
        name: 'tokenname',
        username: 'tokenuser',
        scopes: ['read_repository'],
        variableKey: 'DEPLOY_TOKEN',
        variableProtected: true,
        maskedAndHidden: true,
        environmentScope: 'production',
      },
    });

    expect(mockGitlabClient.ProjectVariables.create).toHaveBeenCalledWith(
      '123',
      'DEPLOY_TOKEN',
      'deploy-secret',
      {
        variableType: 'env_var',
        protected: true,
        masked: true,
        masked_and_hidden: true,
        raw: true,
        environmentScope: 'production',
      },
    );

    expect(mockContext.output).toHaveBeenCalledWith(
      'variableKey',
      'DEPLOY_TOKEN',
    );
    expect(mockContext.output).toHaveBeenCalledWith('user', 'deploy-user');
  });

  it('should remove the deploy token when variable creation fails', async () => {
    mockGitlabClient.DeployTokens.create.mockResolvedValue({
      id: 1,
      token: 'deploy-secret',
      username: 'deploy-user',
    });
    mockGitlabClient.ProjectVariables.create.mockRejectedValue(
      new Error('variable creation failed'),
    );
    mockGitlabClient.DeployTokens.remove.mockResolvedValue({});

    await expect(
      action.handler({
        ...mockContext,
        input: {
          repoUrl: 'gitlab.com?repo=bob&owner=owner',
          projectId: '123',
          name: 'tokenname',
          username: 'tokenuser',
          scopes: ['read_repository'],
          variableKey: 'DEPLOY_TOKEN',
        },
      }),
    ).rejects.toThrow('variable creation failed');

    expect(mockGitlabClient.DeployTokens.remove).toHaveBeenCalledWith(1, {
      projectId: '123',
    });
  });

  it('should propagate the original error when remove fails during cleanup', async () => {
    mockGitlabClient.DeployTokens.create.mockResolvedValue({
      id: 1,
      token: 'deploy-secret',
      username: 'deploy-user',
    });
    mockGitlabClient.ProjectVariables.create.mockRejectedValue(
      new Error('variable creation failed'),
    );
    mockGitlabClient.DeployTokens.remove.mockRejectedValue(
      new Error('remove failed'),
    );
    mockContext.logger.error = jest.fn();

    await expect(
      action.handler({
        ...mockContext,
        input: {
          repoUrl: 'gitlab.com?repo=bob&owner=owner',
          projectId: '123',
          name: 'tokenname',
          username: 'tokenuser',
          scopes: ['read_repository'],
          variableKey: 'DEPLOY_TOKEN',
        },
      }),
    ).rejects.toThrow('variable creation failed');

    expect(mockContext.logger.error).toHaveBeenCalledWith(
      expect.stringContaining('Failed to revoke project deploy token 1'),
    );
  });
});
