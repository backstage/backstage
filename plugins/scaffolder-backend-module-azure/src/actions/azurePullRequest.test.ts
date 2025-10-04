/*
 * Copyright 2025 The Backstage Authors
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
    serializeDirectoryContents: jest.fn().mockResolvedValue([
      {
        path: 'file.txt',
        content: Buffer.from('file content'),
      },
    ]),
  };
});
jest.mock('@backstage/integration', () => {
  const actual = jest.requireActual('@backstage/integration');
  return {
    ...actual,
    ScmIntegrationRegistry: {
      fromConfig: jest.fn(() => ({
        getCredentials: jest.fn(({ url }) => {
          if (url.includes('no-credentials')) {
            return Promise.resolve(null);
          }
          return Promise.resolve({ type: 'pat', token: 'mock-token' });
        }),
      })),
    },
  };
});

import { createAzureDevopsPullRequestAction } from './azurePullRequest';
import { ScmIntegrations } from '@backstage/integration';
import { ConfigReader } from '@backstage/config';
import { WebApi } from 'azure-devops-node-api';
import { createMockActionContext } from '@backstage/plugin-scaffolder-node-test-utils';
import { InputError } from '@backstage/errors';

describe('publish:azure:pull-request', () => {
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
  const action = createAzureDevopsPullRequestAction({ integrations, config });

  const mockContext = createMockActionContext({
    input: {
      repoUrl: 'dev.azure.com?organization=org&project=project&repo=repo',
      sourceBranchName: 'feature-branch',
      title: 'Test PR',
      description: 'This is a test PR',
      createWhenEmpty: true,
    },
  });

  const mockGitClient = {
    getRepository: jest.fn(),
    getBranch: jest.fn(),
    createPush: jest.fn(),
    getPullRequests: jest.fn(),
    createPullRequest: jest.fn(),
    updateRefs: jest.fn(),
    updatePullRequest: jest.fn(),
  };

  const mockGitApi = {
    getGitApi: jest.fn().mockReturnValue(mockGitClient),
  };

  (WebApi as unknown as jest.Mock).mockImplementation(() => mockGitApi);

  beforeEach(() => {
    jest.clearAllMocks();

    mockGitClient.getRepository.mockResolvedValue({
      id: 'repo-id',
      defaultBranch: 'refs/heads/main',
    });

    mockGitClient.getBranch.mockResolvedValue({
      commit: { commitId: 'commit-id' },
    });

    mockGitClient.getPullRequests.mockResolvedValue([]);

    mockGitClient.createPullRequest.mockResolvedValue({
      pullRequestId: 123,
      url: 'https://dev.azure.com/org/project/_git/repo/pullrequest/123',
    });
  });

  it('should throw if no credentials or token are provided', async () => {
    mockGitClient.getRepository.mockImplementation(() => {
      throw new InputError(
        'No credentials provided for Azure DevOps. Please check your integrations config or provide a token.',
      );
    });

    await expect(
      action.handler({
        ...mockContext,
        input: {
          ...mockContext.input,
          repoUrl:
            'no-credentials.dev.azure.com?organization=org&project=project&repo=repo',
          token: undefined,
        },
      }),
    ).rejects.toThrow(/No matching integration configuration for host/);
  });

  it('should use token from input if provided', async () => {
    mockGitClient.createPush.mockResolvedValue({});

    await action.handler({
      ...mockContext,
      input: {
        ...mockContext.input,
        token: 'input-token',
      },
    });

    expect(WebApi).toHaveBeenCalledWith(
      'https://dev.azure.com/org',
      expect.any(Function),
    );

    expect(mockContext.output).toHaveBeenCalledWith(
      'remoteUrl',
      'https://dev.azure.com/org/project/repo/pullrequest/123',
    );
    expect(mockContext.output).toHaveBeenCalledWith('pullRequestId', 123);
  });

  it('should create authHandler for PAT', async () => {
    mockGitClient.getRepository.mockResolvedValue({
      id: 'repo-id',
      defaultBranch: 'refs/heads/main',
    });

    await action.handler({
      ...mockContext,
      input: {
        ...mockContext.input,
        token: 'input-token',
      },
    });

    expect(WebApi).toHaveBeenCalledWith(
      'https://dev.azure.com/org',
      expect.any(Function),
    );
  });

  it('should throw error if no target branch and no default branch', async () => {
    mockGitClient.getRepository.mockResolvedValue({
      id: 'repo-id',
      defaultBranch: undefined,
    });

    await expect(
      action.handler({
        ...mockContext,
        input: {
          ...mockContext.input,
          targetBranchName: undefined,
        },
      }),
    ).rejects.toThrow(/No target branch specified/);
  });

  it('should throw error if branch does not exist in getLatestCommit', async () => {
    mockGitClient.getBranch.mockResolvedValue(undefined);

    await expect(
      action.handler({
        ...mockContext,
        input: {
          ...mockContext.input,
          sourceBranchName: 'non-existent-branch',
        },
      }),
    ).rejects.toThrow(/Branch non-existent-branch not found/);
  });

  it('should create source branch if it does not exist', async () => {
    mockGitClient.getBranch.mockImplementation((_, branch) => {
      if (branch === 'feature-branch') {
        throw new Error('Branch not found');
      }
      return Promise.resolve({ commit: { commitId: 'commit-id' } });
    });

    await action.handler(mockContext);

    expect(mockGitClient.createPush).toHaveBeenCalled();
  });

  it('should throw error if no changes are detected', async () => {
    mockGitClient.createPush.mockImplementation(() => {
      throw new Error('No changes to push. The changes array is empty.');
    });

    await expect(
      action.handler({
        ...mockContext,
        input: {
          ...mockContext.input,
        },
      }),
    ).rejects.toThrow(/No changes to push/);
  });

  it('should create a pull request if no existing pull requests are found', async () => {
    mockGitClient.getPullRequests.mockResolvedValue([]);
    mockGitClient.createPush.mockResolvedValue({});
    mockGitClient.createPullRequest.mockResolvedValue({
      pullRequestId: 123,
      url: 'https://dev.azure.com/org/project/_git/repo/pullrequest/123',
    });

    await action.handler({
      ...mockContext,
      input: {
        ...mockContext.input,
      },
    });

    expect(mockContext.output).toHaveBeenCalledWith(
      'remoteUrl',
      'https://dev.azure.com/org/project/repo/pullrequest/123',
    );
    expect(mockContext.output).toHaveBeenCalledWith('pullRequestId', 123);
  });

  it('should throw error if pull request is created without an ID', async () => {
    mockGitClient.createPush.mockResolvedValue({});
    mockGitClient.createPullRequest.mockResolvedValue({});

    await expect(
      action.handler({
        ...mockContext,
        input: {
          ...mockContext.input,
        },
      }),
    ).rejects.toThrow(/Pull request created without an ID/);
  });

  it('should update an existing pull request if found', async () => {
    mockGitClient.getPullRequests.mockResolvedValue([
      {
        pullRequestId: 123,
        url: 'https://dev.azure.com/org/project/_git/repo/pullrequest/123',
      },
    ]);
    mockGitClient.createPush.mockResolvedValue({});

    await action.handler({
      ...mockContext,
      input: {
        ...mockContext.input,
        update: true,
      },
    });

    expect(mockContext.output).toHaveBeenCalledWith(
      'remoteUrl',
      'https://dev.azure.com/org/project/repo/pullrequest/123',
    );
    expect(mockContext.output).toHaveBeenCalledWith('pullRequestId', 123);
  });
});
