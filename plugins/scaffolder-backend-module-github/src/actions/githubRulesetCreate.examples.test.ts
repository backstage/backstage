/*
 * Copyright 2026 The Backstage Authors
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
import { TemplateAction } from '@backstage/plugin-scaffolder-node';
import { createMockActionContext } from '@backstage/plugin-scaffolder-node-test-utils';
import { createGithubRulesetCreateAction } from './githubRulesetCreate';
import { examples } from './githubRulesetCreate.examples';
import yaml from 'yaml';

const mockOctokit = {
  rest: {
    repos: {
      createRepoRuleset: jest.fn(),
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

describe('github:ruleset:create examples', () => {
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
  let action: TemplateAction<any, any, any>;

  beforeEach(() => {
    githubCredentialsProvider =
      DefaultGithubCredentialsProvider.fromIntegrations(integrations);
    action = createGithubRulesetCreateAction({
      integrations,
      githubCredentialsProvider,
    });
    mockOctokit.rest.repos.createRepoRuleset.mockResolvedValue({
      data: {
        id: 1,
        name: 'Require pull requests',
      },
    });
  });

  afterEach(jest.resetAllMocks);

  it.each(examples)('should handle example: $description', async example => {
    const input = yaml.parse(example.example).steps[0].input;

    await action.handler(
      createMockActionContext({
        input,
      }),
    );

    expect(mockOctokit.rest.repos.createRepoRuleset).toHaveBeenCalledWith(
      expect.objectContaining({
        owner: 'owner',
        repo: 'repo',
        name: input.name,
        target: input.target ?? 'branch',
        enforcement: input.enforcement,
        rules: input.rules,
      }),
    );
  });
});
