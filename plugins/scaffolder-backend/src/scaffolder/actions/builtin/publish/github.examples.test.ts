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
jest.mock('../helpers');

import { TemplateAction } from '@backstage/plugin-scaffolder-node';
import { getVoidLogger } from '@backstage/backend-common';
import { ConfigReader } from '@backstage/config';
import {
  DefaultGithubCredentialsProvider,
  GithubCredentialsProvider,
  ScmIntegrations,
} from '@backstage/integration';
import { PassThrough } from 'stream';
import { entityRefToName, initRepoAndPush } from '../helpers';
import { createPublishGithubAction } from './github';
import { examples } from './github.examples';
import yaml from 'yaml';

const publicKey = '2Sg8iYjAxxmI2LvUXpJjkYrMxURPc8r+dB7TJyvvcCU=';

const initRepoAndPushMocked = initRepoAndPush as jest.Mock<
  Promise<{ commitHash: string }>
>;

const mockOctokit = {
  rest: {
    users: {
      getByUsername: jest.fn(),
    },
    repos: {
      addCollaborator: jest.fn(),
      createInOrg: jest.fn(),
      createForAuthenticatedUser: jest.fn(),
      replaceAllTopics: jest.fn(),
    },
    teams: {
      getByName: jest.fn(),
      addOrUpdateRepoPermissionsInOrg: jest.fn(),
    },
    actions: {
      createRepoVariable: jest.fn(),
      createOrUpdateRepoSecret: jest.fn(),
      getRepoPublicKey: jest.fn(),
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

describe('publish:github', () => {
  const config = new ConfigReader({
    integrations: {
      github: [
        { host: 'github.com', token: 'tokenlols' },
        { host: 'ghe.github.com' },
      ],
    },
  });

  const { entityRefToName: realFamiliarizeEntityName } =
    jest.requireActual('../helpers');
  const integrations = ScmIntegrations.fromConfig(config);
  let githubCredentialsProvider: GithubCredentialsProvider;
  let action: TemplateAction<any>;

  const mockContext = {
    input: {
      repoUrl: 'github.com?repo=repo&owner=owner',
      description: 'description',
      repoVisibility: 'private' as const,
      access: 'owner/blam',
    },
    workspacePath: 'lol',
    logger: getVoidLogger(),
    logStream: new PassThrough(),
    output: jest.fn(),
    createTemporaryDirectory: jest.fn(),
  };

  beforeEach(() => {
    initRepoAndPushMocked.mockResolvedValue({
      commitHash: '220f19cc36b551763d157f1b5e4a4b446165dbd6',
    });
    githubCredentialsProvider =
      DefaultGithubCredentialsProvider.fromIntegrations(integrations);
    action = createPublishGithubAction({
      integrations,
      config,
      githubCredentialsProvider,
    });

    // restore real implmentation
    (entityRefToName as jest.Mock).mockImplementation(
      realFamiliarizeEntityName,
    );
    mockOctokit.rest.actions.getRepoPublicKey.mockResolvedValue({
      data: {
        key: publicKey,
        key_id: 'keyid',
      },
    });
  });

  afterEach(jest.resetAllMocks);

  it('should call initRepoAndPush with the correct values', async () => {
    mockOctokit.rest.users.getByUsername.mockResolvedValue({
      data: { type: 'User' },
    });

    mockOctokit.rest.repos.createForAuthenticatedUser.mockResolvedValue({
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
