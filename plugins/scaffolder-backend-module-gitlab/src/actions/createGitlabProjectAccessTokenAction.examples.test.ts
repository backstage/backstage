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
import yaml from 'yaml';
import { createGitlabProjectAccessTokenAction } from './createGitlabProjectAccessTokenAction'; // Adjust the import based on your project structure
import { ScmIntegrations } from '@backstage/integration';
import { ConfigReader } from '@backstage/config';
import { getVoidLogger } from '@backstage/backend-common';
import { PassThrough } from 'stream';
import { examples } from './createGitlabProjectAccessTokenAction.examples';

jest.mock('node-fetch');

const mockGitlabClient = {
  ProjectDeployTokens: {
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
      ],
    },
  });

  const integrations = ScmIntegrations.fromConfig(config);
  const action = createGitlabProjectAccessTokenAction({ integrations });

  const mockContext = {
    input: {
      repoUrl: 'gitlab.com?repo=repo&owner=owner',
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

  it('Create a GitLab project access token with minimal options.', async () => {
    const fetchMock = jest.spyOn(global, 'fetch');
    const mockResponse = {
      token: 'mock-access-token',
    };

    fetchMock.mockResolvedValue({
      json: async () => mockResponse,
    } as Response);

    jest.mock('../util', () => ({
      getToken: jest.fn().mockReturnValue({
        token: 'mock-api-token',
        integrationConfig: { config: { baseUrl: 'https://api.gitlab.com' } },
      }),
    }));

    const input = yaml.parse(examples[0].example).steps[0].input;

    await action.handler({
      ...mockContext,
      input,
    });

    expect(fetchMock).toHaveBeenCalledWith(
      'https://gitlab.com/api/v4/projects/456/access_tokens',
      {
        method: 'POST',
        headers: {
          'PRIVATE-TOKEN': 'tokenlols',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: undefined,
          scopes: undefined,
          access_level: undefined,
        }),
      },
    );
    expect(mockContext.output).toHaveBeenCalledWith(
      'access_token',
      'mock-access-token',
    );
  });

  it('Create a GitLab project access token with custom scopes.', async () => {
    const input = yaml.parse(examples[1].example).steps[0].input;

    const mockResponse = {
      token: 'mock-access-token',
    };

    const fetchMock = jest.spyOn(global, 'fetch');
    fetchMock.mockResolvedValue({
      json: async () => mockResponse,
    } as Response);

    jest.mock('../util', () => ({
      getToken: jest.fn().mockReturnValue({
        token: 'mock-api-token',
        integrationConfig: { config: { baseUrl: 'https://api.gitlab.com' } },
      }),
    }));

    await action.handler({
      ...mockContext,
      input,
    });

    expect(fetchMock).toHaveBeenCalledWith(
      'https://gitlab.com/api/v4/projects/789/access_tokens',
      {
        method: 'POST',
        headers: {
          'PRIVATE-TOKEN': 'tokenlols',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: undefined,
          scopes: ['read_registry', 'write_repository'],
          access_level: undefined,
        }),
      },
    );

    expect(mockContext.output).toHaveBeenCalledWith(
      'access_token',
      'mock-access-token',
    );
  });

  it('Create a GitLab project access token with a specified name.', async () => {
    const input = yaml.parse(examples[2].example).steps[0].input;

    const mockResponse = {
      token: 'mock-access-token',
    };

    const fetchMock = jest.spyOn(global, 'fetch');
    fetchMock.mockResolvedValue({
      json: async () => mockResponse,
    } as Response);

    jest.mock('../util', () => ({
      getToken: jest.fn().mockReturnValue({
        token: 'mock-api-token',
        integrationConfig: { config: { baseUrl: 'https://api.gitlab.com' } },
      }),
    }));

    await action.handler({
      ...mockContext,
      input,
    });

    expect(fetchMock).toHaveBeenCalledWith(
      'https://gitlab.com/api/v4/projects/101112/access_tokens',
      {
        method: 'POST',
        headers: {
          'PRIVATE-TOKEN': 'tokenlols',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: 'my-custom-token',
          scopes: undefined,
          access_level: undefined,
        }),
      },
    );

    expect(mockContext.output).toHaveBeenCalledWith(
      'access_token',
      'mock-access-token',
    );
  });

  it('Create a GitLab project access token with a numeric project ID.', async () => {
    const input = yaml.parse(examples[3].example).steps[0].input;

    const mockResponse = {
      token: 'mock-access-token',
    };

    const fetchMock = jest.spyOn(global, 'fetch');
    fetchMock.mockResolvedValue({
      json: async () => mockResponse,
    } as Response);

    jest.mock('../util', () => ({
      getToken: jest.fn().mockReturnValue({
        token: 'mock-api-token',
        integrationConfig: { config: { baseUrl: 'https://api.gitlab.com' } },
      }),
    }));

    await action.handler({
      ...mockContext,
      input,
    });

    expect(fetchMock).toHaveBeenCalledWith(
      'https://gitlab.com/api/v4/projects/42/access_tokens',
      {
        method: 'POST',
        headers: {
          'PRIVATE-TOKEN': 'tokenlols',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: undefined,
          scopes: undefined,
          access_level: undefined,
        }),
      },
    );

    expect(mockContext.output).toHaveBeenCalledWith(
      'access_token',
      'mock-access-token',
    );
  });

  it('Create a GitLab project access token using specific GitLab integrations.', async () => {
    const input = yaml.parse(examples[4].example).steps[0].input;

    const mockResponse = {
      token: 'mock-access-token',
    };

    const fetchMock = jest.spyOn(global, 'fetch');
    fetchMock.mockResolvedValue({
      json: async () => mockResponse,
    } as Response);

    jest.mock('../util', () => ({
      getToken: jest.fn().mockReturnValue({
        token: 'mock-api-token',
        integrationConfig: { config: { baseUrl: 'https://api.gitlab.com' } },
      }),
    }));

    await action.handler({
      ...mockContext,
      input,
    });

    expect(fetchMock).toHaveBeenCalledWith(
      'https://gitlab.com/api/v4/projects/123/access_tokens',
      {
        method: 'POST',
        headers: {
          'PRIVATE-TOKEN': 'tokenlols',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: undefined,
          scopes: undefined,
          access_level: undefined,
        }),
      },
    );

    expect(mockContext.output).toHaveBeenCalledWith(
      'access_token',
      'mock-access-token',
    );
  });
});
