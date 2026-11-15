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

import { ScmIntegrations } from '@backstage/integration';
import { ConfigReader } from '@backstage/config';
import { TemplateAction } from '@backstage/plugin-scaffolder-node';
import { createMockActionContext } from '@backstage/plugin-scaffolder-node-test-utils';
import yaml from 'yaml';
import { examples } from './githubRulesets.examples';
import { createGithubRepoRulesetsCreateAction } from './githubRulesets';

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

describe('github:repo:rulesets:create examples', () => {
  const config = new ConfigReader({
    integrations: {
      github: [{ host: 'github.com', token: 'tokenlols' }],
    },
  });

  const integrations = ScmIntegrations.fromConfig(config);
  let action: TemplateAction<any, any, any>;

  beforeEach(() => {
    jest.resetAllMocks();
    mockOctokit.rest.repos.createRepoRuleset.mockResolvedValue({
      data: { id: 42 },
    });

    action = createGithubRepoRulesetsCreateAction({
      integrations,
    });
  });

  const runExample = async (index: number) => {
    const input = yaml.parse(examples[index].example).steps[0].input;
    const ctx = createMockActionContext({ input });
    await action.handler(ctx);
    expect(ctx.output).toHaveBeenCalledWith('id', 42);
  };

  it('should protect the default branch', async () => {
    await runExample(0);

    expect(mockOctokit.rest.repos.createRepoRuleset).toHaveBeenCalledWith({
      owner: 'owner',
      repo: 'repo',
      name: 'default-branch',
      target: 'branch',
      enforcement: 'active',
      conditions: {
        ref_name: { include: ['~DEFAULT_BRANCH'], exclude: [] },
      },
      rules: [
        { type: 'deletion' },
        { type: 'non_fast_forward' },
        {
          type: 'pull_request',
          parameters: {
            required_approving_review_count: 1,
            dismiss_stale_reviews_on_push: true,
            require_code_owner_review: false,
            require_last_push_approval: false,
            required_review_thread_resolution: false,
          },
        },
        {
          type: 'required_status_checks',
          parameters: {
            strict_required_status_checks_policy: true,
            required_status_checks: [{ context: 'ci/build' }],
          },
        },
      ],
      bypass_actors: undefined,
    });
  });

  it('should evaluate signed commits on release branches', async () => {
    await runExample(1);

    expect(mockOctokit.rest.repos.createRepoRuleset).toHaveBeenCalledWith({
      owner: 'owner',
      repo: 'repo',
      name: 'release-signed-commits',
      target: 'branch',
      enforcement: 'evaluate',
      conditions: { ref_name: { include: ['refs/heads/release/*'] } },
      rules: [{ type: 'required_signatures' }],
      bypass_actors: undefined,
    });
  });

  it('should protect version tags', async () => {
    await runExample(2);

    expect(mockOctokit.rest.repos.createRepoRuleset).toHaveBeenCalledWith({
      owner: 'owner',
      repo: 'repo',
      name: 'version-tags',
      target: 'tag',
      enforcement: 'active',
      conditions: { ref_name: { include: ['refs/tags/v*'] } },
      rules: [{ type: 'update' }, { type: 'deletion' }],
      bypass_actors: undefined,
    });
  });

  it('should require linear history with an admin bypass', async () => {
    await runExample(3);

    expect(mockOctokit.rest.repos.createRepoRuleset).toHaveBeenCalledWith({
      owner: 'owner',
      repo: 'repo',
      name: 'linear-history',
      target: 'branch',
      enforcement: 'active',
      conditions: { ref_name: { include: ['~ALL'] } },
      rules: [{ type: 'required_linear_history' }],
      bypass_actors: [
        { actor_id: 5, actor_type: 'RepositoryRole', bypass_mode: 'always' },
      ],
    });
  });
});
