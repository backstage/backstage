/*
 * Copyright 2024 The Backstage Authors
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
import { createGitlabProjectAccessTokenAction } from './gitlabProjectAccessTokenCreate'; // Adjust the import based on your project structure
import { DateTime } from 'luxon';

const mockGitlabClient = {
  ProjectAccessTokens: {
    create: jest.fn(),
    revoke: jest.fn(),
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

describe('gitlab:projectAccessToken:create examples', () => {
  const config = new ConfigReader({
    integrations: {
      gitlab: [
        {
          host: 'gitlab.com',
          token: 'gitlab-token',
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
  const action = createGitlabProjectAccessTokenAction({ integrations });

  const mockContext = createMockActionContext({
    input: {
      repoUrl: 'gitlab.com?repo=repo&owner=owner',
    },
  });

  beforeEach(() => {
    jest.resetAllMocks();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('requires a variable key and exposes only variable metadata', () => {
    expect(action.schema?.input).toHaveProperty(
      'required',
      expect.arrayContaining(['variableKey']),
    );
    expect(action.schema?.output).toHaveProperty(
      'required',
      expect.arrayContaining(['variableKey']),
    );
    expect(Object.keys(action.schema!.output!.properties!)).toEqual([
      'variableKey',
    ]);
  });

  it('should create a GitLab project access token with minimal options.', async () => {
    mockGitlabClient.ProjectAccessTokens.create.mockResolvedValue({
      token: 'gitlab-token',
      username: 'gitlab-user',
    });
    const checkpointSpy = jest.spyOn(mockContext, 'checkpoint');

    await action.handler({
      ...mockContext,
      input: {
        repoUrl: 'gitlab.com?repo=repo&owner=owner',
        projectId: '987',
        variableKey: 'MY_TOKEN',
      },
    });

    expect(mockGitlabClient.ProjectAccessTokens.create).toHaveBeenCalledWith(
      '987',
      'tokenname',
      ['read_repository'],
      DateTime.now().plus({ days: 365 }).toISODate()!,
      {
        accessLevel: 40,
      },
    );

    expect(mockGitlabClient.ProjectVariables.create).toHaveBeenCalledWith(
      '987',
      'MY_TOKEN',
      'gitlab-token',
      {
        variableType: 'env_var',
        protected: false,
        masked: true,
        masked_and_hidden: false,
        raw: true,
        environmentScope: '*',
      },
    );
    expect(checkpointSpy).toHaveBeenCalledWith({
      key: 'project.access.token.variable.987.tokenname.MY_TOKEN.*',
      fn: expect.any(Function),
    });
    expect(await checkpointSpy.mock.results[0].value).toBeUndefined();
    expect(mockContext.output).toHaveBeenCalledTimes(1);
    expect(mockContext.output).toHaveBeenCalledWith('variableKey', 'MY_TOKEN');
  });

  it('should create a GitLab project access token with custom scopes.', async () => {
    mockGitlabClient.ProjectAccessTokens.create.mockResolvedValue({
      token: 'gitlab-token',
      username: 'gitlab-user',
    });

    await action.handler({
      ...mockContext,
      input: {
        repoUrl: 'gitlab.com?repo=repo&owner=owner',
        projectId: '987',
        variableKey: 'MY_TOKEN',
        scopes: ['read_registry', 'write_repository'],
      },
    });

    expect(mockGitlabClient.ProjectAccessTokens.create).toHaveBeenCalledWith(
      '987',
      'tokenname',
      ['read_registry', 'write_repository'],
      DateTime.now().plus({ days: 365 }).toISODate()!,
      {
        accessLevel: 40,
      },
    );

    expect(mockContext.output).toHaveBeenCalledWith('variableKey', 'MY_TOKEN');
  });

  it('should create a GitLab project access token with a specified name.', async () => {
    mockGitlabClient.ProjectAccessTokens.create.mockResolvedValue({
      token: 'gitlab-token',
      username: 'gitlab-user',
    });

    await action.handler({
      ...mockContext,
      input: {
        repoUrl: 'gitlab.com?repo=repo&owner=owner',
        projectId: '2110',
        variableKey: 'MY_TOKEN',
        name: 'token',
      },
    });

    expect(mockGitlabClient.ProjectAccessTokens.create).toHaveBeenCalledWith(
      '2110',
      'token',
      ['read_repository'],
      DateTime.now().plus({ days: 365 }).toISODate()!,
      {
        accessLevel: 40,
      },
    );

    expect(mockContext.output).toHaveBeenCalledWith('variableKey', 'MY_TOKEN');
  });

  it('should create a GitLab project access token with a numeric project ID.', async () => {
    mockGitlabClient.ProjectAccessTokens.create.mockResolvedValue({
      token: 'gitlab-token',
      username: 'gitlab-user',
    });

    await action.handler({
      ...mockContext,
      input: {
        repoUrl: 'gitlab.com?repo=repo&owner=owner',
        projectId: 23,
        variableKey: 'MY_TOKEN',
      },
    });

    expect(mockGitlabClient.ProjectAccessTokens.create).toHaveBeenCalledWith(
      23,
      'tokenname',
      ['read_repository'],
      DateTime.now().plus({ days: 365 }).toISODate()!,
      {
        accessLevel: 40,
      },
    );

    expect(mockContext.output).toHaveBeenCalledWith('variableKey', 'MY_TOKEN');
  });

  it('should create a GitLab project access token with a specified expired Date.', async () => {
    mockGitlabClient.ProjectAccessTokens.create.mockResolvedValue({
      token: 'gitlab-token',
      username: 'gitlab-user',
    });

    await action.handler({
      ...mockContext,
      input: {
        repoUrl: 'gitlab.com?repo=repo&owner=owner',
        projectId: '123',
        variableKey: 'MY_TOKEN',
        expiresAt: '1999-07-14',
      },
    });

    expect(mockGitlabClient.ProjectAccessTokens.create).toHaveBeenCalledWith(
      '123',
      'tokenname',
      ['read_repository'],
      '1999-07-14',
      {
        accessLevel: 40,
      },
    );

    expect(mockContext.output).toHaveBeenCalledWith('variableKey', 'MY_TOKEN');
  });

  it('should create a token and store it as a CI/CD variable with custom options', async () => {
    mockGitlabClient.ProjectAccessTokens.create.mockResolvedValue({
      id: 1,
      token: 'secret-token',
    });
    mockGitlabClient.ProjectVariables.create.mockResolvedValue({});

    await action.handler({
      ...mockContext,
      input: {
        repoUrl: 'gitlab.com?repo=repo&owner=owner',
        projectId: '987',
        name: 'backstage-token',
        variableKey: 'BACKSTAGE_ACCESS_TOKEN',
        variableProtected: true,
        maskedAndHidden: true,
        environmentScope: 'production',
      },
    });

    expect(mockGitlabClient.ProjectVariables.create).toHaveBeenCalledWith(
      '987',
      'BACKSTAGE_ACCESS_TOKEN',
      'secret-token',
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
      'BACKSTAGE_ACCESS_TOKEN',
    );
  });

  it('should revoke the access token when variable creation fails', async () => {
    mockGitlabClient.ProjectAccessTokens.create.mockResolvedValue({
      id: 42,
      token: 'secret-token',
    });
    mockGitlabClient.ProjectVariables.create.mockRejectedValue(
      new Error('variable creation failed'),
    );
    mockGitlabClient.ProjectAccessTokens.revoke.mockResolvedValue({});

    await expect(
      action.handler({
        ...mockContext,
        input: {
          repoUrl: 'gitlab.com?repo=repo&owner=owner',
          projectId: '987',
          variableKey: 'MY_TOKEN',
        },
      }),
    ).rejects.toThrow('variable creation failed');

    expect(mockGitlabClient.ProjectAccessTokens.revoke).toHaveBeenCalledWith(
      '987',
      42,
    );
    expect(mockContext.output).not.toHaveBeenCalled();
  });

  it('should propagate the original error when revoke fails during cleanup', async () => {
    mockGitlabClient.ProjectAccessTokens.create.mockResolvedValue({
      id: 42,
      token: 'secret-token',
    });
    mockGitlabClient.ProjectVariables.create.mockRejectedValue(
      new Error('variable creation failed'),
    );
    mockGitlabClient.ProjectAccessTokens.revoke.mockRejectedValue(
      new Error('revoke failed'),
    );
    mockContext.logger.error = jest.fn();

    await expect(
      action.handler({
        ...mockContext,
        input: {
          repoUrl: 'gitlab.com?repo=repo&owner=owner',
          projectId: '987',
          variableKey: 'MY_TOKEN',
        },
      }),
    ).rejects.toThrow('variable creation failed');

    expect(mockContext.logger.error).toHaveBeenCalledWith(
      expect.stringContaining('Failed to revoke project access token 42'),
    );
  });
});
