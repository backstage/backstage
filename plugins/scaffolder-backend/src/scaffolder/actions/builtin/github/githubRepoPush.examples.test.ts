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
import { TemplateAction } from '@backstage/plugin-scaffolder-node';
import { getVoidLogger } from '@backstage/backend-common';
import { ConfigReader } from '@backstage/config';
import {
  DefaultGithubCredentialsProvider,
  GithubCredentialsProvider,
  ScmIntegrations,
} from '@backstage/integration';
import { PassThrough } from 'stream';
import { initRepoAndPush } from '../helpers';
import { createGithubRepoPushAction } from './githubRepoPush';
import { examples } from './githubRepoPush.examples';
import yaml from 'yaml';

const mockGit = {
  init: jest.fn(),
  add: jest.fn(),
  checkout: jest.fn(),
  commit: jest
    .fn()
    .mockResolvedValue('220f19cc36b551763d157f1b5e4a4b446165dbd6'),
  fetch: jest.fn(),
  addRemote: jest.fn(),
  push: jest.fn(),
};

jest.mock('@backstage/backend-common', () => ({
  Git: {
    fromAuth() {
      return mockGit;
    },
  },
  getVoidLogger: jest.requireActual('@backstage/backend-common').getVoidLogger,
}));

jest.mock('../helpers');

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

  const mockContext = {
    workspacePath: 'lol',
    logger: getVoidLogger(),
    logStream: new PassThrough(),
    output: jest.fn(),
    createTemporaryDirectory: jest.fn(),
  };

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
