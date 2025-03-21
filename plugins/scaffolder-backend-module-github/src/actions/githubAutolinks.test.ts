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

import { ConfigReader } from '@backstage/config';
import {
  DefaultGithubCredentialsProvider,
  GithubCredentialsProvider,
  ScmIntegrations,
} from '@backstage/integration';
import { createMockDirectory } from '@backstage/backend-test-utils';
import { createMockActionContext } from '@backstage/plugin-scaffolder-node-test-utils';
import { TemplateAction } from '@backstage/plugin-scaffolder-node';
import { createGithubAutolinksAction } from './githubAutolinks';

const mockOctokit = {
  rest: {
    repos: {
      createAutolink: jest.fn(),
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

describe('github:autolinks:create', () => {
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
  let action: TemplateAction<any, any>;
  const workspacePath = createMockDirectory().resolve('workspace');

  it('should call the githubApis for creating alphanumeric autolink reference', async () => {
    githubCredentialsProvider =
      DefaultGithubCredentialsProvider.fromIntegrations(integrations);
    action = createGithubAutolinksAction({
      integrations,
      githubCredentialsProvider,
    });

    mockOctokit.rest.repos.createAutolink.mockResolvedValue({
      data: {
        id: '1',
      },
    });
    await action.handler(
      createMockActionContext({
        input: {
          repoUrl: 'github.com?repo=repo&owner=owner',
          keyPrefix: 'TICKET-',
          urlTemplate: 'https://example.com/TICKET?query=<num>',
        },
        workspacePath,
      }),
    );

    expect(mockOctokit.rest.repos.createAutolink).toHaveBeenCalledWith({
      owner: 'owner',
      repo: 'repo',
      key_prefix: 'TICKET-',
      url_template: 'https://example.com/TICKET?query=<num>',
    });
  });

  it('should call the githubApis for creating numeric autolink reference', async () => {
    githubCredentialsProvider =
      DefaultGithubCredentialsProvider.fromIntegrations(integrations);
    action = createGithubAutolinksAction({
      integrations,
      githubCredentialsProvider,
    });

    mockOctokit.rest.repos.createAutolink.mockResolvedValue({
      data: {
        id: '1',
      },
    });
    await action.handler(
      createMockActionContext({
        input: {
          repoUrl: 'github.com?repo=repo&owner=owner',
          keyPrefix: 'TICKET-',
          urlTemplate: 'https://example.com/TICKET?query=<num>',
          isAlphanumeric: false,
        },
        workspacePath,
      }),
    );

    expect(mockOctokit.rest.repos.createAutolink).toHaveBeenCalledWith({
      owner: 'owner',
      repo: 'repo',
      key_prefix: 'TICKET-',
      url_template: 'https://example.com/TICKET?query=<num>',
      is_alphanumeric: false,
    });
  });
});
