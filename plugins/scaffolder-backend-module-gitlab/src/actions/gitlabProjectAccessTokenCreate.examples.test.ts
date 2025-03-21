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
import { createGitlabProjectAccessTokenAction } from './gitlabProjectAccessTokenCreate'; // Adjust the import based on your project structure
import { examples } from './gitlabProjectAccessTokenCreate.examples';
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
          token: 'tokenlols',
          apiBaseUrl: 'https://api.gitlab.com',
        },
        {
          host: 'hosted.gitlab.com',
          apiBaseUrl: 'https://api.hosted.gitlab.com',
        },
        {
          host: 'gitlab.example.com',
          apiBaseUrl: 'https://api.gitlab.example.com',
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

  it('Create a GitLab project access token with minimal options.', async () => {
    mockGitlabClient.ProjectAccessTokens.create.mockResolvedValue({
      token: 'TOKEN',
      username: 'User',
    });

    const input = yaml.parse(examples[0].example).steps[0].input;
    await action.handler({
      ...mockContext,
      input,
    });

    expect(mockGitlabClient.ProjectAccessTokens.create).toHaveBeenCalledWith(
      '456',
      'tokenname',
      ['read_repository'],
      DateTime.now().plus({ days: 365 }).toISODate()!,
      {
        accessLevel: 40,
      },
    );

    expect(mockContext.output).toHaveBeenCalledWith('access_token', 'TOKEN');
  });

  it('Create a GitLab project access token with custom scopes.', async () => {
    mockGitlabClient.ProjectAccessTokens.create.mockResolvedValue({
      token: 'TOKEN',
      username: 'User',
    });

    const input = yaml.parse(examples[1].example).steps[0].input;
    await action.handler({
      ...mockContext,
      input,
    });

    expect(mockGitlabClient.ProjectAccessTokens.create).toHaveBeenCalledWith(
      '789',
      'tokenname',
      ['read_registry', 'write_repository'],
      DateTime.now().plus({ days: 365 }).toISODate()!,
      {
        accessLevel: 40,
      },
    );

    expect(mockContext.output).toHaveBeenCalledWith('access_token', 'TOKEN');
  });

  it('Create a GitLab project access token with a specified name.', async () => {
    mockGitlabClient.ProjectAccessTokens.create.mockResolvedValue({
      token: 'TOKEN',
      username: 'User',
    });

    const input = yaml.parse(examples[2].example).steps[0].input;
    await action.handler({
      ...mockContext,
      input,
    });

    expect(mockGitlabClient.ProjectAccessTokens.create).toHaveBeenCalledWith(
      '101112',
      'my-custom-token',
      ['read_repository'],
      DateTime.now().plus({ days: 365 }).toISODate()!,
      {
        accessLevel: 40,
      },
    );

    expect(mockContext.output).toHaveBeenCalledWith('access_token', 'TOKEN');
  });

  it('Create a GitLab project access token with a numeric project ID.', async () => {
    mockGitlabClient.ProjectAccessTokens.create.mockResolvedValue({
      token: 'TOKEN',
      username: 'User',
    });

    const input = yaml.parse(examples[3].example).steps[0].input;
    await action.handler({
      ...mockContext,
      input,
    });

    expect(mockGitlabClient.ProjectAccessTokens.create).toHaveBeenCalledWith(
      42,
      'tokenname',
      ['read_repository'],
      DateTime.now().plus({ days: 365 }).toISODate()!,
      {
        accessLevel: 40,
      },
    );

    expect(mockContext.output).toHaveBeenCalledWith('access_token', 'TOKEN');
  });

  it('Create a GitLab project access token with a specified expired Date.', async () => {
    mockGitlabClient.ProjectAccessTokens.create.mockResolvedValue({
      token: 'TOKEN',
      username: 'User',
    });

    const input = yaml.parse(examples[4].example).steps[0].input;
    await action.handler({
      ...mockContext,
      input,
    });

    expect(mockGitlabClient.ProjectAccessTokens.create).toHaveBeenCalledWith(
      '123',
      'tokenname',
      ['read_repository'],
      '2024-06-25',
      {
        accessLevel: 40,
      },
    );

    expect(mockContext.output).toHaveBeenCalledWith('access_token', 'TOKEN');
  });

  it(`should ${examples[5].description}`, async () => {
    mockGitlabClient.ProjectAccessTokens.create.mockResolvedValue({
      token: 'personal-access-token',
      username: 'gitlab-user',
    });

    const input = yaml.parse(examples[5].example).steps[0].input;
    await action.handler({
      ...mockContext,
      input,
    });

    expect(mockGitlabClient.ProjectAccessTokens.create).toHaveBeenCalledWith(
      '456',
      'tokenname',
      ['read_repository'],
      DateTime.now().plus({ days: 365 }).toISODate()!,
      {
        accessLevel: 30,
      },
    );

    expect(mockContext.output).toHaveBeenCalledWith(
      'access_token',
      'personal-access-token',
    );
  });

  it(`should ${examples[6].description}`, async () => {
    mockGitlabClient.ProjectAccessTokens.create.mockResolvedValue({
      token: 'personal-access-token',
      username: 'gitlab-user',
    });

    const input = yaml.parse(examples[6].example).steps[0].input;
    await action.handler({
      ...mockContext,
      input,
    });

    expect(mockGitlabClient.ProjectAccessTokens.create).toHaveBeenCalledWith(
      '456',
      'full-access-token',
      ['read_repository'],
      '2024-12-31',
      {
        accessLevel: 40,
      },
    );

    expect(mockContext.output).toHaveBeenCalledWith(
      'access_token',
      'personal-access-token',
    );
  });

  it(`should ${examples[7].description}`, async () => {
    mockGitlabClient.ProjectAccessTokens.create.mockResolvedValue({
      token: 'personal-access-token',
      username: 'gitlab-user',
    });

    const input = yaml.parse(examples[7].example).steps[0].input;
    await action.handler({
      ...mockContext,
      input,
    });

    expect(mockGitlabClient.ProjectAccessTokens.create).toHaveBeenCalledWith(
      '101112',
      'tokenname',
      ['read_repository'],
      DateTime.now().plus({ days: 365 }).toISODate()!,
      {
        accessLevel: 40,
      },
    );

    expect(mockContext.output).toHaveBeenCalledWith(
      'access_token',
      'personal-access-token',
    );
  });

  it(`should ${examples[8].description}`, async () => {
    mockGitlabClient.ProjectAccessTokens.create.mockResolvedValue({
      token: 'personal-access-token',
      username: 'gitlab-user',
    });

    const input = yaml.parse(examples[8].example).steps[0].input;
    await action.handler({
      ...mockContext,
      input,
    });

    expect(mockGitlabClient.ProjectAccessTokens.create).toHaveBeenCalledWith(
      '101112',
      'tokenname',
      ['read_repository', 'read_api'],
      DateTime.now().plus({ days: 365 }).toISODate()!,
      {
        accessLevel: 40,
      },
    );

    expect(mockContext.output).toHaveBeenCalledWith(
      'access_token',
      'personal-access-token',
    );
  });

  it(`should ${examples[9].description}`, async () => {
    mockGitlabClient.ProjectAccessTokens.create.mockResolvedValue({
      token: 'personal-access-token',
      username: 'gitlab-user',
    });

    const input = yaml.parse(examples[9].example).steps[0].input;
    await action.handler({
      ...mockContext,
      input,
    });

    expect(mockGitlabClient.ProjectAccessTokens.create).toHaveBeenCalledWith(
      '101112',
      'tokenname',
      ['read_repository'],
      DateTime.now().plus({ days: 365 }).toISODate()!,
      {
        accessLevel: 10,
      },
    );

    expect(mockContext.output).toHaveBeenCalledWith(
      'access_token',
      'personal-access-token',
    );
  });

  it(`should ${examples[10].description}`, async () => {
    mockGitlabClient.ProjectAccessTokens.create.mockResolvedValue({
      token: 'personal-access-token',
      username: 'gitlab-user',
    });

    const input = yaml.parse(examples[10].example).steps[0].input;
    await action.handler({
      ...mockContext,
      input,
    });

    expect(mockGitlabClient.ProjectAccessTokens.create).toHaveBeenCalledWith(
      '101112',
      'tokenname',
      ['read_repository'],
      DateTime.now().plus({ days: 365 }).toISODate()!,
      {
        accessLevel: 40,
      },
    );

    expect(mockContext.output).toHaveBeenCalledWith(
      'access_token',
      'personal-access-token',
    );
  });

  it(`should ${examples[11].description}`, async () => {
    mockGitlabClient.ProjectAccessTokens.create.mockResolvedValue({
      token: 'personal-access-token',
      username: 'gitlab-user',
    });

    const input = yaml.parse(examples[11].example).steps[0].input;
    await action.handler({
      ...mockContext,
      input,
    });

    expect(mockGitlabClient.ProjectAccessTokens.create).toHaveBeenCalledWith(
      '101112',
      'tokenname',
      ['read_repository'],
      DateTime.now().plus({ days: 365 }).toISODate()!,
      {
        accessLevel: 50,
      },
    );

    expect(mockContext.output).toHaveBeenCalledWith(
      'access_token',
      'personal-access-token',
    );
  });

  it(`should ${examples[12].description}`, async () => {
    mockGitlabClient.ProjectAccessTokens.create.mockResolvedValue({
      token: 'personal-access-token',
      username: 'gitlab-user',
    });

    const input = yaml.parse(examples[12].example).steps[0].input;
    await action.handler({
      ...mockContext,
      input,
    });

    expect(mockGitlabClient.ProjectAccessTokens.create).toHaveBeenCalledWith(
      '101112',
      'no-expiry-token',
      ['read_repository'],
      DateTime.now().plus({ days: 365 }).toISODate()!,
      {
        accessLevel: 40,
      },
    );

    expect(mockContext.output).toHaveBeenCalledWith(
      'access_token',
      'personal-access-token',
    );
  });

  it(`should ${examples[13].description}`, async () => {
    mockGitlabClient.ProjectAccessTokens.create.mockResolvedValue({
      token: 'personal-access-token',
      username: 'gitlab-user',
    });

    const input = yaml.parse(examples[13].example).steps[0].input;
    await action.handler({
      ...mockContext,
      input,
    });

    expect(mockGitlabClient.ProjectAccessTokens.create).toHaveBeenCalledWith(
      '101112',
      'tokenname',
      ['read_repository'],
      DateTime.now().plus({ days: 365 }).toISODate()!,
      {
        accessLevel: 40,
      },
    );

    expect(mockContext.output).toHaveBeenCalledWith(
      'access_token',
      'personal-access-token',
    );
  });
});
