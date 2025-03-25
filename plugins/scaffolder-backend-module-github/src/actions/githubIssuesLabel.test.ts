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

import { createGithubIssuesLabelAction } from './githubIssuesLabel';
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

const mockOctokit = {
  rest: {
    issues: {
      addLabels: jest.fn(),
    },
  },
};
jest.mock('octokit', () => ({
  Octokit: class {
    constructor() {
      return mockOctokit;
    }
  },
}));

describe('github:issues:label', () => {
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
  let action: TemplateAction<any>;

  const mockContext = createMockActionContext({
    input: {
      repoUrl: 'github.com?repo=repo&owner=owner',
      number: '1',
      labels: ['label1', 'label2'],
    },
  });

  beforeEach(() => {
    jest.resetAllMocks();
    githubCredentialsProvider =
      DefaultGithubCredentialsProvider.fromIntegrations(integrations);
    action = createGithubIssuesLabelAction({
      integrations,
      githubCredentialsProvider,
    });
  });

  it('should call the githubApi for adding labels', async () => {
    await action.handler(mockContext);
    expect(mockOctokit.rest.issues.addLabels).toHaveBeenCalledWith({
      owner: 'owner',
      repo: 'repo',
      issue_number: '1',
      labels: ['label1', 'label2'],
    });
    expect(getOctokitOptionsMock.mock.calls[0][0].token).toBeUndefined();
  });

  it('should call the githubApi for adding labels with token', async () => {
    await action.handler({
      ...mockContext,
      input: { ...mockContext.input, token: 'gph_YourGitHubToken' },
    });
    expect(mockOctokit.rest.issues.addLabels).toHaveBeenCalledWith({
      owner: 'owner',
      repo: 'repo',
      issue_number: '1',
      labels: ['label1', 'label2'],
    });
    expect(getOctokitOptionsMock.mock.calls[0][0].token).toEqual(
      'gph_YourGitHubToken',
    );
  });
});
