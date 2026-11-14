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

import { createGithubRepoRulesetsCreateAction } from './githubRulesets';
import { createMockActionContext } from '@backstage/plugin-scaffolder-node-test-utils';
import { TemplateAction } from '@backstage/plugin-scaffolder-node';
import { ConfigReader } from '@backstage/config';
import { ScmIntegrations } from '@backstage/integration';
import { Schema, Validator } from 'jsonschema';

import { Octokit } from 'octokit';

const octokitMock = Octokit as unknown as jest.Mock;
const mockOctokit = {
  rest: {
    repos: {
      createRepoRuleset: jest.fn(),
    },
  },
};
jest.mock('octokit', () => ({
  Octokit: jest.fn(),
}));

describe('github:repo:rulesets:create', () => {
  const config = new ConfigReader({
    integrations: {
      github: [
        { host: 'github.com', token: 'tokenlols' },
        { host: 'ghe.github.com' },
      ],
    },
  });

  const integrations = ScmIntegrations.fromConfig(config);
  let action: TemplateAction<any, any, any>;

  const mockContext = createMockActionContext({
    input: {
      repoUrl: 'github.com?repo=repository&owner=owner',
      name: 'my-ruleset',
    },
  });

  beforeEach(() => {
    octokitMock.mockImplementation(() => mockOctokit);
    mockOctokit.rest.repos.createRepoRuleset.mockResolvedValue({
      data: { id: 42 },
    });

    action = createGithubRepoRulesetsCreateAction({
      integrations,
    });
  });

  afterEach(jest.resetAllMocks);

  it('should create a ruleset with default params', async () => {
    await action.handler(mockContext);

    expect(octokitMock).toHaveBeenCalledWith(
      expect.objectContaining({ auth: 'tokenlols', log: mockContext.logger }),
    );
    expect(mockOctokit.rest.repos.createRepoRuleset).toHaveBeenCalledWith({
      owner: 'owner',
      repo: 'repository',
      name: 'my-ruleset',
      target: 'branch',
      enforcement: 'active',
      conditions: undefined,
      rules: undefined,
      bypass_actors: undefined,
    });
    expect(mockContext.output).toHaveBeenCalledWith('id', 42);
  });

  it('should create a ruleset with all params supplied', async () => {
    const rules = [
      { type: 'deletion' },
      {
        type: 'pull_request',
        parameters: {
          required_approving_review_count: 2,
          dismiss_stale_reviews_on_push: true,
          require_code_owner_review: true,
          require_last_push_approval: true,
          required_review_thread_resolution: true,
        },
      },
    ];
    const conditions = {
      ref_name: {
        include: ['refs/tags/v*'],
        exclude: ['refs/tags/v0*'],
      },
    };
    const bypassActors = [
      { actor_id: 1, actor_type: 'OrganizationAdmin', bypass_mode: 'always' },
      { actor_id: null, actor_type: 'DeployKey' },
    ];

    await action.handler({
      ...mockContext,
      input: {
        ...mockContext.input,
        target: 'tag',
        enforcement: 'evaluate',
        conditions,
        rules,
        bypassActors,
        token: 'gph_YourGitHubToken',
      },
    });

    expect(octokitMock).toHaveBeenCalledWith(
      expect.objectContaining({ auth: 'gph_YourGitHubToken' }),
    );
    expect(mockOctokit.rest.repos.createRepoRuleset).toHaveBeenCalledWith({
      owner: 'owner',
      repo: 'repository',
      name: 'my-ruleset',
      target: 'tag',
      enforcement: 'evaluate',
      conditions,
      rules,
      bypass_actors: bypassActors,
    });
    expect(mockContext.output).toHaveBeenCalledWith('id', 42);
  });

  it('should fail when the GitHub API returns an error', async () => {
    mockOctokit.rest.repos.createRepoRuleset.mockRejectedValue(
      new Error('Validation Failed: Name must be unique'),
    );

    await expect(action.handler(mockContext)).rejects.toThrow(
      'Validation Failed: Name must be unique',
    );
    expect(mockContext.output).not.toHaveBeenCalled();
  });

  it('should not call GitHub without an owner, a configured integration or required user credentials', async () => {
    await expect(
      action.handler({
        ...mockContext,
        input: { ...mockContext.input, repoUrl: 'github.com?repo=repository' },
      }),
    ).rejects.toThrow(/missing owner/);
    await expect(
      action.handler({
        ...mockContext,
        input: {
          ...mockContext.input,
          repoUrl: 'evil.example.com?repo=repository&owner=owner',
        },
      }),
    ).rejects.toThrow(/No matching integration configuration/);
    const userCredentialsAction: TemplateAction<any, any, any> =
      createGithubRepoRulesetsCreateAction({
        integrations,
        requireScmUserCredentials: true,
      });
    await expect(userCredentialsAction.handler(mockContext)).rejects.toThrow(
      /No user credentials provided/,
    );
    expect(octokitMock).not.toHaveBeenCalled();
    expect(mockOctokit.rest.repos.createRepoRuleset).not.toHaveBeenCalled();
  });

  it('should validate bypass actors', () => {
    const validator = new Validator();
    const isValid = (bypassActors: unknown) =>
      validator.validate(
        { ...mockContext.input, bypassActors },
        action.schema?.input as Schema,
      ).valid;

    expect(isValid([{ actor_id: 5, actor_type: 'RepositoryRole' }])).toBe(true);
    expect(isValid([{ actor_id: null, actor_type: 'DeployKey' }])).toBe(true);
    expect(isValid([{ actor_type: 'OrganizationAdmin' }])).toBe(true);
    expect(isValid([{ actor_id: 1.5, actor_type: 'Team' }])).toBe(false);
    expect(
      isValid([{ actor_id: 1, actor_type: 'Team', bypass_mode: 'exempt' }]),
    ).toBe(true);
    expect(
      isValid([{ actor_id: 1, actor_type: 'Team', bypass_mode: 'never' }]),
    ).toBe(false);
  });
});
