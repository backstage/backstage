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

import {
  TemplateAction,
  initRepoAndPush,
} from '@backstage/plugin-scaffolder-node';
import { createMockActionContext } from '@backstage/plugin-scaffolder-node-test-utils';
import { ConfigReader } from '@backstage/config';
import {
  DefaultGithubCredentialsProvider,
  GithubCredentialsProvider,
  ScmIntegrations,
} from '@backstage/integration';
import { createGithubRepoPushAction } from './githubRepoPush';
import { examples } from './githubRepoPush.examples';
import yaml from 'yaml';

jest.mock('./helpers', () => {
  return {
    ...jest.requireActual('./helpers'),
    entityRefToName: jest.fn(),
  };
});

const initRepoAndPushMocked = initRepoAndPush as jest.Mock<
  Promise<{ commitHash: string }>
>;

const mockOctokit = {
  rest: {
    repos: {
      get: jest.fn(),
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

describe('github:repo:push examples', () => {
  const config = new ConfigReader({
    integrations: {
      github: [
        { host: 'github.com', token: 'tokenlols' },
        { host: 'ghe.github.com' },
      ],
    },
  });

  const integrations = ScmIntegrations.fromConfig(config);
  let githubCredentialsProvider: GithubCredentialsProvider;
  let action: TemplateAction<any>;

  const mockContext = createMockActionContext();

  beforeEach(() => {
    jest.resetAllMocks();

    initRepoAndPushMocked.mockResolvedValue({ commitHash: 'test123' });

    githubCredentialsProvider =
      DefaultGithubCredentialsProvider.fromIntegrations(integrations);

    action = createGithubRepoPushAction({
      integrations,
      config,
      githubCredentialsProvider,
    });
  });

  it('should call initRepoAndPush with the correct values', async () => {
    mockOctokit.rest.repos.get.mockResolvedValue({
      data: {
        clone_url: 'https://github.com/clone/url.git',
        html_url: 'https://github.com/html/url',
      },
    });

    await action.handler({
      ...mockContext,
      input: yaml.parse(examples[0].example).steps[0].input,
    });

    expect(initRepoAndPush).toHaveBeenCalledWith({
      dir: mockContext.workspacePath,
      remoteUrl: 'https://github.com/clone/url.git',
      defaultBranch: 'master',
      auth: { username: 'x-access-token', password: 'tokenlols' },
      logger: mockContext.logger,
      commitMessage: 'initial commit',
      gitAuthorInfo: {},
    });
  });
});
