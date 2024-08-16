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

import yaml from 'yaml';
import { ConfigReader } from '@backstage/config';
import { createPublishAzureAction } from './azure';
import { ScmIntegrations } from '@backstage/integration';
import { WebApi } from 'azure-devops-node-api';
import {
  getRepoSourceDirectory,
  initRepoAndPush,
} from '@backstage/plugin-scaffolder-node';
import { examples } from './azure.examples';
import { createMockActionContext } from '@backstage/plugin-scaffolder-node-test-utils';

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

describe('publish:azure examples', () => {
  const config = new ConfigReader({
    integrations: {
      azure: [
        {
          host: 'dev.azure.com',
          credentials: [{ personalAccessToken: 'tokenlols' }],
        },
        {
          host: 'test.azure.com',
          credentials: [{ personalAccessToken: 'tokenlols' }],
        },
      ],
    },
  });

  const integrations = ScmIntegrations.fromConfig(config);
  const action = createPublishAzureAction({ integrations, config });
  const mockContext = createMockActionContext();

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

  it('should call initRepoAndPush with the correct values', async () => {
    mockGitClient.createRepository.mockResolvedValue({
      remoteUrl: 'https://dev.azure.com/organization/project/_git/repo',
      webUrl: 'https://dev.azure.com/organization/project/_git/repo',
      id: '709e891c-dee7-4f91-b963-534713c0737f',
    });

    await action.handler({
      ...mockContext,
      input: yaml.parse(examples[0].example).steps[0].input,
    });

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

  it('should call initRepoAndPush with a changed default branch', async () => {
    mockGitClient.createRepository.mockResolvedValue({
      remoteUrl: 'https://dev.azure.com/organization/project/_git/repo',
      webUrl: 'https://dev.azure.com/organization/project/_git/repo',
      id: '709e891c-dee7-4f91-b963-534713c0737f',
    });

    await action.handler({
      ...mockContext,
      input: yaml.parse(examples[2].example).steps[0].input,
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

  it(`should ${examples[3].description}`, async () => {
    mockGitClient.createRepository.mockResolvedValue({
      remoteUrl: 'https://dev.azure.com/organization/project/_git/repo',
      webUrl: 'https://dev.azure.com/organization/project/_git/repo',
      id: '709e891c-dee7-4f91-b963-534713c0737f',
    });

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

    expect(initRepoAndPush).toHaveBeenCalledWith({
      dir: mockContext.workspacePath,
      remoteUrl: 'https://dev.azure.com/organization/project/_git/repo',
      defaultBranch: 'master',
      auth: { username: 'notempty', password: 'tokenlols' },
      logger: mockContext.logger,
      commitMessage: input.gitCommitMessage,
      gitAuthorInfo: {},
    });
  });

  it(`should ${examples[4].description}`, async () => {
    mockGitClient.createRepository.mockResolvedValue({
      remoteUrl: 'https://dev.azure.com/organization/project/_git/repo',
      webUrl: 'https://dev.azure.com/organization/project/_git/repo',
      id: '709e891c-dee7-4f91-b963-534713c0737f',
    });

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

    expect(initRepoAndPush).toHaveBeenCalledWith({
      dir: mockContext.workspacePath,
      remoteUrl: 'https://dev.azure.com/organization/project/_git/repo',
      defaultBranch: 'master',
      auth: { username: 'notempty', password: 'tokenlols' },
      logger: mockContext.logger,
      commitMessage: 'initial commit',
      gitAuthorInfo: {
        name: input.gitAuthorName,
        email: input.gitAuthorEmail,
      },
    });
  });

  it(`should ${examples[5].description}`, async () => {
    mockGitClient.createRepository.mockResolvedValue({
      remoteUrl: 'https://dev.azure.com/organization/project/_git/repo',
      webUrl: 'https://dev.azure.com/organization/project/_git/repo',
      id: '709e891c-dee7-4f91-b963-534713c0737f',
    });

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

    expect(initRepoAndPush).toHaveBeenCalledWith({
      dir: getRepoSourceDirectory(mockContext.workspacePath, input.sourcePath),
      remoteUrl: 'https://dev.azure.com/organization/project/_git/repo',
      defaultBranch: 'master',
      auth: { username: 'notempty', password: 'tokenlols' },
      logger: mockContext.logger,
      commitMessage: 'initial commit',
      gitAuthorInfo: {},
    });
  });

  it(`should ${examples[6].description}`, async () => {
    mockGitClient.createRepository.mockResolvedValue({
      remoteUrl: 'https://dev.azure.com/organization/project/_git/repo',
      webUrl: 'https://dev.azure.com/organization/project/_git/repo',
      id: '709e891c-dee7-4f91-b963-534713c0737f',
    });

    let input;
    try {
      input = yaml.parse(examples[6].example).steps[0].input;
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

    expect(initRepoAndPush).toHaveBeenCalledWith({
      dir: mockContext.workspacePath,
      remoteUrl: 'https://dev.azure.com/organization/project/_git/repo',
      defaultBranch: 'master',
      auth: { username: 'notempty', password: input.token },
      logger: mockContext.logger,
      commitMessage: 'initial commit',
      gitAuthorInfo: {},
    });
  });

  it(`should ${examples[7].description}`, async () => {
    mockGitClient.createRepository.mockResolvedValue({
      remoteUrl: 'https://test.azure.com/organization/project/_git/repo',
      webUrl: 'https://test.azure.com/organization/project/_git/repo',
      id: '709e891c-dee7-4f91-b963-534713c0737f',
    });

    let input;
    try {
      input = yaml.parse(examples[7].example).steps[0].input;
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

    expect(initRepoAndPush).toHaveBeenCalledWith({
      dir: mockContext.workspacePath,
      remoteUrl: 'https://test.azure.com/organization/project/_git/repo',
      defaultBranch: 'master',
      auth: { username: 'notempty', password: 'tokenlols' },
      logger: mockContext.logger,
      commitMessage: 'initial commit',
      gitAuthorInfo: {},
    });
  });
});
