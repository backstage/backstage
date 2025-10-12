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

import yaml from 'yaml';
import { ConfigReader } from '@backstage/config';
import { createAzureDevopsPullRequestAction } from './azurePullRequest';
import { ScmIntegrations } from '@backstage/integration';
import { WebApi } from 'azure-devops-node-api';
import { examples } from './azurePullRequest.examples';
import { createMockActionContext } from '@backstage/plugin-scaffolder-node-test-utils';

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

describe('publish:azure:pull-request examples', () => {
  const config = new ConfigReader({
    integrations: {
      azure: [
        {
          host: 'dev.azure.com',
          credentials: [{ personalAccessToken: 'tokenlols' }],
        },
      ],
    },
  });

  const integrations = ScmIntegrations.fromConfig(config);
  const action = createAzureDevopsPullRequestAction({ integrations, config });
  const mockContext = createMockActionContext();

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

    mockGitClient.createPush.mockResolvedValue({});

    mockGitClient.createPullRequest.mockResolvedValue({
      pullRequestId: 123,
      url: 'https://dev.azure.com/my-org/my-project/_git/my-repo/pullrequest/123',
    });
  });

  it(`should ${examples[0].description}`, async () => {
    let input;
    try {
      input = yaml.parse(examples[0].example).steps[0].input;
    } catch (error) {
      console.error('Failed to parse YAML:', error);
    }

    await action.handler({
      ...mockContext,
      input: {
        ...mockContext.input,
        ...input,
      },
    });

    expect(mockGitClient.createPullRequest).toHaveBeenCalledWith(
      expect.objectContaining({
        sourceRefName: `refs/heads/${input.branchName}`,
        targetRefName: 'refs/heads/main',
        title: input.title,
        description: input.description,
      }),
      expect.any(String),
      expect.any(String),
    );

    expect(mockContext.output).toHaveBeenCalledWith('pullRequestId', 123);
  });

  it(`should ${examples[1].description}`, async () => {
    let input;
    try {
      input = yaml.parse(examples[1].example).steps[0].input;
    } catch (error) {
      console.error('Failed to parse YAML:', error);
    }

    await action.handler({
      ...mockContext,
      input: {
        ...mockContext.input,
        ...input,
      },
    });

    expect(mockGitClient.createPullRequest).toHaveBeenCalledWith(
      expect.objectContaining({
        sourceRefName: `refs/heads/${input.branchName}`,
        targetRefName: `refs/heads/${input.targetBranchName}`,
        title: input.title,
        description: input.description,
        isDraft: true,
        reviewers: [
          { uniqueName: 'user1@example.com' },
          { uniqueName: 'user2@example.com' },
        ],
      }),
      expect.any(String),
      expect.any(String),
    );

    expect(mockContext.output).toHaveBeenCalledWith('pullRequestId', 123);
  });

  it(`should ${examples[2].description}`, async () => {
    mockGitClient.getBranch.mockImplementation((_, branch) => {
      if (branch === 'feature/new-stuff') {
        throw new Error('Branch not found');
      }
      return Promise.resolve({ commit: { commitId: 'commit-id' } });
    });

    let input;
    try {
      input = yaml.parse(examples[2].example).steps[0].input;
    } catch (error) {
      console.error('Failed to parse YAML:', error);
    }

    await action.handler({
      ...mockContext,
      input: {
        ...mockContext.input,
        ...input,
      },
    });

    expect(mockGitClient.createPush).toHaveBeenCalled();
    expect(mockGitClient.createPullRequest).toHaveBeenCalledWith(
      expect.objectContaining({
        sourceRefName: `refs/heads/${input.branchName}`,
        title: input.title,
        description: input.description,
      }),
      expect.any(String),
      expect.any(String),
    );

    expect(mockContext.output).toHaveBeenCalledWith('pullRequestId', 123);
  });

  it(`should ${examples[3].description}`, async () => {
    let input;
    try {
      input = yaml.parse(examples[3].example).steps[0].input;
    } catch (error) {
      console.error('Failed to parse YAML:', error);
    }

    await action.handler({
      ...mockContext,
      input: {
        ...mockContext.input,
        ...input,
      },
    });

    expect(mockGitClient.createPullRequest).toHaveBeenCalledWith(
      expect.objectContaining({
        sourceRefName: `refs/heads/${input.branchName}`,
        title: input.title,
        description: input.description,
        reviewers: [
          { uniqueName: 'user1@example.com' },
          { uniqueName: 'user2@example.com' },
        ],
      }),
      expect.any(String),
      expect.any(String),
    );

    expect(mockContext.output).toHaveBeenCalledWith('pullRequestId', 123);
  });

  it(`should ${examples[4].description}`, async () => {
    let input;
    try {
      input = yaml.parse(examples[4].example).steps[0].input;
    } catch (error) {
      console.error('Failed to parse YAML:', error);
    }

    await action.handler({
      ...mockContext,
      input: {
        ...mockContext.input,
        ...input,
      },
    });

    expect(mockGitClient.createPush).toHaveBeenCalledWith(
      expect.objectContaining({
        commits: expect.arrayContaining([
          expect.objectContaining({
            changes: expect.arrayContaining([
              expect.objectContaining({
                changeType: 16,
                item: { path: '/file1.txt' },
              }),
              expect.objectContaining({
                changeType: 16,
                item: { path: '/folder/file2.txt' },
              }),
            ]),
          }),
        ]),
      }),
      expect.any(String),
      expect.any(String),
    );

    expect(mockGitClient.createPullRequest).toHaveBeenCalled();
    expect(mockContext.output).toHaveBeenCalledWith('pullRequestId', 123);
  });

  it(`should ${examples[5].description}`, async () => {
    let input;
    try {
      input = yaml.parse(examples[5].example).steps[0].input;
    } catch (error) {
      console.error('Failed to parse YAML:', error);
    }

    await action.handler({
      ...mockContext,
      input: {
        ...mockContext.input,
        ...input,
      },
    });

    expect(mockGitClient.createPush).toHaveBeenCalledWith(
      expect.objectContaining({
        commits: expect.arrayContaining([
          expect.objectContaining({
            author: {
              name: input.gitAuthorName,
              email: input.gitAuthorEmail,
            },
          }),
        ]),
      }),
      expect.any(String),
      expect.any(String),
    );

    expect(mockGitClient.createPullRequest).toHaveBeenCalled();
    expect(mockContext.output).toHaveBeenCalledWith('pullRequestId', 123);
  });
});
