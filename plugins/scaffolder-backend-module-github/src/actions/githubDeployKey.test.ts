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

import { createGithubDeployKeyAction } from './githubDeployKey';
import { TemplateAction } from '@backstage/plugin-scaffolder-node';
import { createMockActionContext } from '@backstage/plugin-scaffolder-node-test-utils';
import { ConfigReader } from '@backstage/config';
import { ScmIntegrations } from '@backstage/integration';

const mockOctokit = {
  rest: {
    actions: {
      getRepoPublicKey: jest.fn(),
      createOrUpdateRepoSecret: jest.fn(),
    },
    repos: {
      createDeployKey: jest.fn(),
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

const publicKey = '2Sg8iYjAxxmI2LvUXpJjkYrMxURPc8r+dB7TJyvvcCU=';

describe('github:deployKey:create', () => {
  const config = new ConfigReader({
    integrations: {
      github: [
        { host: 'github.com', token: 'tokenlols' },
        { host: 'ghe.github.com' },
      ],
    },
  });

  const integrations = ScmIntegrations.fromConfig(config);
  let action: TemplateAction<any>;

  const mockContext = createMockActionContext({
    input: {
      repoUrl: 'github.com?repo=repository&owner=owner',
      publicKey: 'pubkey',
      privateKey: 'privkey',
      deployKeyName: 'Push Tags',
    },
  });

  beforeEach(() => {
    jest.resetAllMocks();

    action = createGithubDeployKeyAction({
      integrations,
    });
  });

  it('should work happy path', async () => {
    mockOctokit.rest.actions.getRepoPublicKey.mockResolvedValue({
      data: {
        key: publicKey,
        key_id: 'keyid',
      },
    });

    await action.handler(mockContext);

    expect(mockOctokit.rest.repos.createDeployKey).toHaveBeenCalledWith({
      owner: 'owner',
      repo: 'repository',
      title: 'Push Tags',
      key: 'pubkey',
    });

    expect(
      mockOctokit.rest.actions.createOrUpdateRepoSecret,
    ).toHaveBeenCalledWith({
      owner: 'owner',
      repo: 'repository',
      secret_name: 'PUSH_TAGS_PRIVATE_KEY',
      key_id: 'keyid',
      encrypted_value: expect.any(String),
    });

    expect(mockContext.output).toHaveBeenCalledWith(
      'privateKeySecretName',
      'PUSH_TAGS_PRIVATE_KEY',
    );
  });
});
