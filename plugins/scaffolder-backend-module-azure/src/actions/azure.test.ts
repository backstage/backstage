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

jest.mock('azure-devops-node-api', () => ({
  WebApi: jest.fn(),
  getPersonalAccessTokenHandler: jest.fn().mockReturnValue(() => {}),
}));

jest.mock('@backstage/plugin-scaffolder-node', () => {
  return {
    ...jest.requireActual('@backstage/plugin-scaffolder-node'),
    initRepoAndPush: jest.fn().mockResolvedValue({
      commitHash: '220f19cc36b551763d157f1b5e4a4b446165dbd6',
    }),
    commitAndPushRepo: jest.fn().mockResolvedValue({
      commitHash: '220f19cc36b551763d157f1b5e4a4b446165dbd6',
    }),
  };
});

import { createPublishAzureAction } from './azure';
import { ScmIntegrations } from '@backstage/integration';
import { ConfigReader } from '@backstage/config';
import { WebApi } from 'azure-devops-node-api';
import { initRepoAndPush } from '@backstage/plugin-scaffolder-node';
import { createMockActionContext } from '@backstage/plugin-scaffolder-node-test-utils';

describe('publish:azure', () => {
  const config = new ConfigReader({
    integrations: {
      azure: [
        {
          host: 'dev.azure.com',
          credentials: [{ personalAccessToken: 'tokenlols' }],
        },
        { host: 'myazurehostnotoken.com' },
      ],
    },
  });

  const integrations = ScmIntegrations.fromConfig(config);
  const action = createPublishAzureAction({ integrations, config });

  const mockContext = createMockActionContext({
    input: {
      repoUrl: 'dev.azure.com?repo=repo&project=project&organization=org',
    },
  });

  const mockGitClient = {
    createRepository: jest.fn(),
  };
  const mockGitApi = {
    getGitApi: jest.fn().mockReturnValue(mockGitClient),
  };

  (WebApi as unknown as jest.Mock).mockImplementation(() => mockGitApi);

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should throw an error when the repoUrl is not well formed', async () => {
    await expect(
      action.handler({
        ...mockContext,
        input: { repoUrl: 'dev.azure.com?repo=bob' },
      }),
    ).rejects.toThrow(/missing project/);

    await expect(
      action.handler({
        ...mockContext,
        input: { repoUrl: 'dev.azure.com?project=project' },
      }),
    ).rejects.toThrow(/missing repo/);

    await expect(
      action.handler({
        ...mockContext,
        input: { repoUrl: 'dev.azure.com?project=project&repo=repo' },
      }),
    ).rejects.toThrow(/missing organization/);
  });

  it('should throw if there is no integration config provided', async () => {
    await expect(
      action.handler({
        ...mockContext,
        input: {
          repoUrl: 'azure.com?repo=bob&project=project&organization=org',
        },
      }),
    ).rejects.toThrow(/No matching integration configuration/);
  });

  it('should throw if there is no token in the integration config that is returned', async () => {
    await expect(
      action.handler({
        ...mockContext,
        input: {
          repoUrl:
            'myazurehostnotoken.com?repo=bob&project=project&organization=org',
        },
      }),
    ).rejects.toThrow(
      /No credentials provided https:\/\/myazurehostnotoken.com\/org, please check your integrations config/,
    );
  });

  it('should throw when no repo is returned', async () => {
    await expect(
      action.handler({
        ...mockContext,
        input: {
          repoUrl: 'dev.azure.com?repo=bob&project=project&organization=org',
        },
      }),
    ).rejects.toThrow(/Unable to create the repository/);
  });

  it('should not throw if there is a token provided through ctx.input', async () => {
    mockGitClient.createRepository.mockImplementation(() => ({
      remoteUrl: 'http://google.com',
      webUrl: 'http://google.com',
      id: '709e891c-dee7-4f91-b963-534713c0737f',
    }));

    await action.handler({
      ...mockContext,
      input: {
        repoUrl:
          'myazurehostnotoken.com?repo=bob&project=project&organization=org',
        token: 'lols',
      },
    });

    expect(WebApi).toHaveBeenCalledWith(
      'https://myazurehostnotoken.com/org',
      expect.any(Function),
    );

    expect(mockGitClient.createRepository).toHaveBeenCalledWith(
      {
        name: 'bob',
      },
      'project',
    );
  });

  it('should throw if there is no remoteUrl returned', async () => {
    mockGitClient.createRepository.mockImplementation(() => ({
      remoteUrl: null,
      webUrl: 'http://google.com',
      id: '709e891c-dee7-4f91-b963-534713c0737f',
    }));
    await expect(
      action.handler({
        ...mockContext,
        input: {
          repoUrl: 'dev.azure.com?repo=bob&project=project&organization=org',
        },
      }),
    ).rejects.toThrow(/No remote URL returned/);
  });

  it('should throw if there is no repositoryId returned', async () => {
    mockGitClient.createRepository.mockImplementation(() => ({
      remoteUrl: 'http://google.com',
      webUrl: 'http://google.com',
      id: null,
    }));
    await expect(
      action.handler({
        ...mockContext,
        input: {
          repoUrl: 'dev.azure.com?repo=bob&project=project&organization=org',
        },
      }),
    ).rejects.toThrow(/No Id returned/);
  });

  it('should throw if there is no repoContentsUrl returned', async () => {
    mockGitClient.createRepository.mockImplementation(() => ({
      remoteUrl: 'http://google.com',
      webUrl: null,
      id: '709e891c-dee7-4f91-b963-534713c0737f',
    }));
    await expect(
      action.handler({
        ...mockContext,
        input: {
          repoUrl: 'dev.azure.com?repo=bob&project=project&organization=org',
        },
      }),
    ).rejects.toThrow(/No web URL returned/);
  });

  it('should call the azureApis with the correct values', async () => {
    mockGitClient.createRepository.mockImplementation(() => ({
      remoteUrl: 'http://google.com',
      webUrl: 'http://google.com',
      id: '709e891c-dee7-4f91-b963-534713c0737f',
    }));

    await action.handler({
      ...mockContext,
      input: {
        repoUrl: 'dev.azure.com?repo=bob&project=project&organization=org',
      },
    });

    expect(WebApi).toHaveBeenCalledWith(
      'https://dev.azure.com/org',
      expect.any(Function),
    );

    expect(mockGitClient.createRepository).toHaveBeenCalledWith(
      {
        name: 'bob',
      },
      'project',
    );
  });

  it('should call initRepoAndPush with the correct values', async () => {
    mockGitClient.createRepository.mockImplementation(() => ({
      remoteUrl: 'https://dev.azure.com/organization/project/_git/repo',
      webUrl: 'https://dev.azure.com/organization/project/_git/repo',
      id: '709e891c-dee7-4f91-b963-534713c0737f',
    }));

    await action.handler(mockContext);

    expect(initRepoAndPush).toHaveBeenCalledWith({
      dir: mockContext.workspacePath,
      remoteUrl: 'https://dev.azure.com/organization/project/_git/repo',
      defaultBranch: 'master',
      auth: { username: 'notempty', password: 'tokenlols' },
      logger: mockContext.logger,
      commitMessage: 'initial commit',
      gitAuthorInfo: {},
    });
  });

  it('should call initRepoAndPush with the correct default branch', async () => {
    mockGitClient.createRepository.mockImplementation(() => ({
      remoteUrl: 'https://dev.azure.com/organization/project/_git/repo',
      webUrl: 'https://dev.azure.com/organization/project/_git/repo',
      id: '709e891c-dee7-4f91-b963-534713c0737f',
    }));

    await action.handler({
      ...mockContext,
      input: {
        ...mockContext.input,
        defaultBranch: 'main',
      },
    });

    expect(initRepoAndPush).toHaveBeenCalledWith({
      dir: mockContext.workspacePath,
      remoteUrl: 'https://dev.azure.com/organization/project/_git/repo',
      defaultBranch: 'main',
      auth: { username: 'notempty', password: 'tokenlols' },
      logger: mockContext.logger,
      commitMessage: 'initial commit',
      gitAuthorInfo: {},
    });
  });

  it('should call initRepoAndPush with the configured defaultAuthor', async () => {
    const customAuthorConfig = new ConfigReader({
      integrations: {
        azure: [
          {
            host: 'dev.azure.com',
            credentials: [{ personalAccessToken: 'tokenlols' }],
          },
          { host: 'myazurehostnotoken.com' },
        ],
      },
      scaffolder: {
        defaultAuthor: {
          name: 'Test',
          email: 'example@example.com',
        },
      },
    });

    const customAuthorIntegrations =
      ScmIntegrations.fromConfig(customAuthorConfig);
    const customAuthorAction = createPublishAzureAction({
      integrations: customAuthorIntegrations,
      config: customAuthorConfig,
    });

    mockGitClient.createRepository.mockImplementation(() => ({
      remoteUrl: 'https://dev.azure.com/organization/project/_git/repo',
      webUrl: 'https://dev.azure.com/organization/project/_git/repo',
      id: '709e891c-dee7-4f91-b963-534713c0737f',
    }));

    await customAuthorAction.handler(mockContext);

    expect(initRepoAndPush).toHaveBeenCalledWith({
      dir: mockContext.workspacePath,
      remoteUrl: 'https://dev.azure.com/organization/project/_git/repo',
      auth: { username: 'notempty', password: 'tokenlols' },
      logger: mockContext.logger,
      defaultBranch: 'master',
      commitMessage: 'initial commit',
      gitAuthorInfo: { name: 'Test', email: 'example@example.com' },
    });
  });

  it('should call initRepoAndPush with the configured defaultCommitMessage', async () => {
    const customAuthorConfig = new ConfigReader({
      integrations: {
        azure: [
          {
            host: 'dev.azure.com',
            credentials: [{ personalAccessToken: 'tokenlols' }],
          },
          { host: 'myazurehostnotoken.com' },
        ],
      },
      scaffolder: {
        defaultCommitMessage: 'Test commit message',
      },
    });

    const customAuthorIntegrations =
      ScmIntegrations.fromConfig(customAuthorConfig);
    const customAuthorAction = createPublishAzureAction({
      integrations: customAuthorIntegrations,
      config: customAuthorConfig,
    });

    mockGitClient.createRepository.mockImplementation(() => ({
      remoteUrl: 'https://dev.azure.com/organization/project/_git/repo',
      webUrl: 'https://dev.azure.com/organization/project/_git/repo',
      id: '709e891c-dee7-4f91-b963-534713c0737f',
    }));

    await customAuthorAction.handler(mockContext);

    expect(initRepoAndPush).toHaveBeenCalledWith({
      dir: mockContext.workspacePath,
      remoteUrl: 'https://dev.azure.com/organization/project/_git/repo',
      auth: { username: 'notempty', password: 'tokenlols' },
      logger: mockContext.logger,
      defaultBranch: 'master',
      commitMessage: 'initial commit',
      gitAuthorInfo: { email: undefined, name: undefined },
    });
  });

  it('should call output with the remoteUrl the repoContentsUrl and the repositoryId', async () => {
    mockGitClient.createRepository.mockImplementation(() => ({
      remoteUrl: 'https://dev.azure.com/organization/project/_git/repo',
      webUrl: 'https://dev.azure.com/organization/project/_git/repo',
      id: '709e891c-dee7-4f91-b963-534713c0737f',
    }));

    await action.handler(mockContext);

    expect(mockContext.output).toHaveBeenCalledWith(
      'remoteUrl',
      'https://dev.azure.com/organization/project/_git/repo',
    );
    expect(mockContext.output).toHaveBeenCalledWith(
      'repoContentsUrl',
      'https://dev.azure.com/organization/project/_git/repo',
    );
    expect(mockContext.output).toHaveBeenCalledWith(
      'repositoryId',
      '709e891c-dee7-4f91-b963-534713c0737f',
    );
  });
});
