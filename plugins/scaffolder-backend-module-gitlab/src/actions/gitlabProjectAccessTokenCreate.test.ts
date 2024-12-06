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

  it('should create a GitLab project access token with minimal options.', async () => {
    mockGitlabClient.ProjectAccessTokens.create.mockResolvedValue({
      token: 'gitlab-token',
      username: 'gitlab-user',
    });

    await action.handler({
      ...mockContext,
      input: {
        repoUrl: 'gitlab.com?repo=repo&owner=owner',
        projectId: '987',
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

    expect(mockContext.output).toHaveBeenCalledWith(
      'access_token',
      'gitlab-token',
    );
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

    expect(mockContext.output).toHaveBeenCalledWith(
      'access_token',
      'gitlab-token',
    );
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

    expect(mockContext.output).toHaveBeenCalledWith(
      'access_token',
      'gitlab-token',
    );
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

    expect(mockContext.output).toHaveBeenCalledWith(
      'access_token',
      'gitlab-token',
    );
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

    expect(mockContext.output).toHaveBeenCalledWith(
      'access_token',
      'gitlab-token',
    );
  });
});
