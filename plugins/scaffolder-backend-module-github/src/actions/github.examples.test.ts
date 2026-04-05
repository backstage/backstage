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

import { vi, type Mock } from 'vitest';

vi.mock('./gitHelpers', () => {
  return {
    ...vi.importActual('./gitHelpers'),
    entityRefToName: vi.fn(),
  };
});

vi.mock('@backstage/plugin-scaffolder-node', () => {
  return {
    ...vi.importActual('@backstage/plugin-scaffolder-node'),
    initRepoAndPush: vi.fn().mockResolvedValue({
      commitHash: '220f19cc36b551763d157f1b5e4a4b446165dbd6',
    }),
    commitAndPushRepo: vi.fn().mockResolvedValue({
      commitHash: '220f19cc36b551763d157f1b5e4a4b446165dbd6',
    }),
  };
});

import {
  TemplateAction,
  initRepoAndPush,
} from '@backstage/plugin-scaffolder-node';
import { ConfigReader } from '@backstage/config';
import { createMockActionContext } from '@backstage/plugin-scaffolder-node-test-utils';
import {
  DefaultGithubCredentialsProvider,
  GithubCredentialsProvider,
  ScmIntegrations,
} from '@backstage/integration';
import { createPublishGithubAction } from './github';
import { examples } from './github.examples';
import yaml from 'yaml';
import { entityRefToName } from './gitHelpers';

const publicKey = '2Sg8iYjAxxmI2LvUXpJjkYrMxURPc8r+dB7TJyvvcCU=';

const initRepoAndPushMocked = initRepoAndPush as Mock<
  (...args: any[]) => Promise<{ commitHash: string }>
>;

const mockOctokit = {
  rest: {
    users: {
      getByUsername: vi.fn(),
    },
    repos: {
      addCollaborator: vi.fn(),
      createInOrg: vi.fn(),
      createForAuthenticatedUser: vi.fn(),
      replaceAllTopics: vi.fn(),
    },
    teams: {
      getByName: vi.fn(),
      addOrUpdateRepoPermissionsInOrg: vi.fn(),
    },
    actions: {
      createRepoVariable: vi.fn(),
      createOrUpdateRepoSecret: vi.fn(),
      getRepoPublicKey: vi.fn(),
    },
  },
};
vi.mock('octokit', () => ({
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

  let realFamiliarizeEntityName: typeof entityRefToName;
  const integrations = ScmIntegrations.fromConfig(config);
  let githubCredentialsProvider: GithubCredentialsProvider;
  let action: TemplateAction<any, any, any>;

  const mockContext = createMockActionContext({
    input: {
      repoUrl: 'github.com?repo=repo&owner=owner',
      description: 'description',
      repoVisibility: 'private' as const,
      access: 'owner/blam',
    },
  });

  beforeAll(async () => {
    const actual = await vi.importActual<typeof import('./gitHelpers')>(
      './gitHelpers',
    );
    realFamiliarizeEntityName = actual.entityRefToName;
  });

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

    (entityRefToName as Mock).mockImplementation(realFamiliarizeEntityName);
    mockOctokit.rest.actions.getRepoPublicKey.mockResolvedValue({
      data: {
        key: publicKey,
        key_id: 'keyid',
      },
    });
  });

  afterEach(vi.resetAllMocks);

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
      defaultBranch: 'main',
      auth: { username: 'x-access-token', password: 'tokenlols' },
      logger: mockContext.logger,
      commitMessage: 'initial commit',
      gitAuthorInfo: {},
    });
  });
});
