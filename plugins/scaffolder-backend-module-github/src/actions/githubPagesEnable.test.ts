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

import { TemplateAction } from '@backstage/plugin-scaffolder-node';
import { createMockActionContext } from '@backstage/plugin-scaffolder-node-test-utils';
import { ConfigReader } from '@backstage/config';
import {
  DefaultGithubCredentialsProvider,
  GithubCredentialsProvider,
  ScmIntegrations,
} from '@backstage/integration';
import { createGithubPagesEnableAction } from './githubPagesEnable';

const mockOctokit = {
  request: jest.fn(),
};

jest.mock('octokit', () => ({
  Octokit: class {
    constructor() {
      return mockOctokit;
    }
  },
}));

describe('github:pages', () => {
  const config = new ConfigReader({
    integrations: {
      github: [
        { host: 'github.com', token: 'mock-token' },
        { host: 'ghe.github.com' },
      ],
    },
  });

  const integrations = ScmIntegrations.fromConfig(config);
  let githubCredentialsProvider: GithubCredentialsProvider;
  let action: TemplateAction<any>;

  const mockContext = createMockActionContext({
    input: {
      repoUrl: 'github.com?repo=repo&owner=owner',
      buildType: 'workflow',
      sourceBranch: 'main',
      sourcePath: '/',
      token: 'gph_YourGitHubToken',
    },
  });

  beforeEach(() => {
    githubCredentialsProvider =
      DefaultGithubCredentialsProvider.fromIntegrations(integrations);
    action = createGithubPagesEnableAction({
      integrations,
      githubCredentialsProvider,
    });
  });

  afterEach(jest.resetAllMocks);

  it('should work happy path', async () => {
    await action.handler(mockContext);

    expect(mockOctokit.request).toHaveBeenCalledWith(
      'POST /repos/{owner}/{repo}/pages',
      {
        owner: 'owner',
        repo: 'repo',
        build_type: 'workflow',
        source: {
          branch: 'main',
          path: '/',
        },
        headers: {
          'X-GitHub-Api-Version': '2022-11-28',
        },
      },
    );
  });
});
