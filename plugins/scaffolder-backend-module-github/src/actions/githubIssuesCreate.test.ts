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

import { createGithubIssuesCreateAction } from './githubIssuesCreate';
import {
  ScmIntegrations,
  DefaultGithubCredentialsProvider,
  GithubCredentialsProvider,
} from '@backstage/integration';
import { createMockActionContext } from '@backstage/plugin-scaffolder-node-test-utils';
import { ConfigReader } from '@backstage/config';
import { TemplateAction } from '@backstage/plugin-scaffolder-node';
import { getOctokitOptions } from '../util';

jest.mock('../util', () => {
  return {
    getOctokitOptions: jest.fn(),
  };
});

import { Octokit } from 'octokit';

const octokitMock = Octokit as unknown as jest.Mock;
const mockOctokit = {
  rest: {
    issues: {
      create: jest.fn(),
    },
  },
};
jest.mock('octokit', () => ({
  Octokit: jest.fn(),
}));

describe('github:issues:create', () => {
  const config = new ConfigReader({
    integrations: {
      github: [
        { host: 'github.com', token: 'tokenlols' },
        { host: 'ghe.github.com' },
      ],
    },
  });

  const getOctokitOptionsMock = getOctokitOptions as jest.Mock;
  const integrations = ScmIntegrations.fromConfig(config);
  let githubCredentialsProvider: GithubCredentialsProvider;
  let action: TemplateAction<any, any, any>;

  const mockContext = createMockActionContext({
    input: {
      repoUrl: 'github.com?repo=repo&owner=owner',
      title: 'Test Issue',
      body: 'This is a test issue',
      labels: ['bug', 'test'],
      assignees: ['octocat'],
      milestone: 1,
    },
  });

  beforeEach(() => {
    jest.resetAllMocks();
    octokitMock.mockImplementation(() => mockOctokit);
    mockOctokit.rest.issues.create.mockResolvedValue({
      data: {
        html_url: 'https://github.com/owner/repo/issues/1',
        number: 1,
      },
    });
    githubCredentialsProvider =
      DefaultGithubCredentialsProvider.fromIntegrations(integrations);
    action = createGithubIssuesCreateAction({
      integrations,
      githubCredentialsProvider,
    });
  });

  it('should pass context logger to Octokit client', async () => {
    await action.handler(mockContext);

    expect(octokitMock).toHaveBeenCalledWith(
      expect.objectContaining({ log: mockContext.logger }),
    );
  });

  it('should call the githubApi for creating issue', async () => {
    await action.handler(mockContext);
    expect(mockOctokit.rest.issues.create).toHaveBeenCalledWith({
      owner: 'owner',
      repo: 'repo',
      title: 'Test Issue',
      body: 'This is a test issue',
      labels: ['bug', 'test'],
      assignees: ['octocat'],
      milestone: 1,
    });
    expect(getOctokitOptionsMock.mock.calls[0][0].token).toBeUndefined();
  });

  it('should call the githubApi for creating issue with token', async () => {
    await action.handler({
      ...mockContext,
      input: { ...mockContext.input, token: 'gph_YourGitHubToken' },
    });
    expect(mockOctokit.rest.issues.create).toHaveBeenCalledWith({
      owner: 'owner',
      repo: 'repo',
      title: 'Test Issue',
      body: 'This is a test issue',
      labels: ['bug', 'test'],
      assignees: ['octocat'],
      milestone: 1,
    });
    expect(getOctokitOptionsMock.mock.calls[0][0].token).toEqual(
      'gph_YourGitHubToken',
    );
  });

  it('should output issue URL and number', async () => {
    await action.handler(mockContext);
    expect(mockContext.output).toHaveBeenCalledWith(
      'issueUrl',
      'https://github.com/owner/repo/issues/1',
    );
    expect(mockContext.output).toHaveBeenCalledWith('issueNumber', 1);
  });

  it('should create issue with minimal input', async () => {
    const minimalContext = createMockActionContext({
      input: {
        repoUrl: 'github.com?repo=repo&owner=owner',
        title: 'Simple Issue',
      },
    });

    await action.handler(minimalContext);
    expect(mockOctokit.rest.issues.create).toHaveBeenCalledWith({
      owner: 'owner',
      repo: 'repo',
      title: 'Simple Issue',
      body: undefined,
      labels: undefined,
      assignees: undefined,
      milestone: undefined,
    });
  });
});
