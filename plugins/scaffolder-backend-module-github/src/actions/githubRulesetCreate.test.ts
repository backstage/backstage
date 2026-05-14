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

describe('github:ruleset:create', () => {
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
    octokitMock.mockImplementation(() => mockOctokit);
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
        _links: {
          self: {
            href: 'https://api.github.com/repos/owner/repo/rulesets/1',
          },
        },
      },
    });
  });

  afterEach(jest.resetAllMocks);

  it('should pass context logger to Octokit client', async () => {
    const mockContext = createMockActionContext({
      input: {
        repoUrl: 'github.com?repo=repo&owner=owner',
        name: 'Require pull requests',
        enforcement: 'active',
        rules: [{ type: 'deletion' }],
      },
    });

    await action.handler(mockContext);

    expect(octokitMock).toHaveBeenCalledWith(
      expect.objectContaining({ log: mockContext.logger }),
    );
  });

  it('should create a repository ruleset with default target', async () => {
    const mockContext = createMockActionContext({
      input: {
        repoUrl: 'github.com?repo=repo&owner=owner',
        name: 'Require pull requests',
        enforcement: 'active',
        conditions: {
          refName: {
            include: ['~DEFAULT_BRANCH'],
            exclude: [],
          },
        },
        rules: [
          {
            type: 'pull_request',
            parameters: {
              dismiss_stale_reviews_on_push: true,
              require_code_owner_review: true,
              require_last_push_approval: false,
              required_approving_review_count: 1,
              required_review_thread_resolution: true,
            },
          },
        ],
      },
    });

    await action.handler(mockContext);

    expect(mockOctokit.rest.repos.createRepoRuleset).toHaveBeenCalledWith({
      owner: 'owner',
      repo: 'repo',
      name: 'Require pull requests',
      target: 'branch',
      enforcement: 'active',
      bypass_actors: undefined,
      conditions: {
        ref_name: {
          include: ['~DEFAULT_BRANCH'],
          exclude: [],
        },
      },
      rules: [
        {
          type: 'pull_request',
          parameters: {
            dismiss_stale_reviews_on_push: true,
            require_code_owner_review: true,
            require_last_push_approval: false,
            required_approving_review_count: 1,
            required_review_thread_resolution: true,
          },
        },
      ],
    });
    expect(mockContext.output).toHaveBeenCalledWith('rulesetId', 1);
    expect(mockContext.output).toHaveBeenCalledWith(
      'rulesetName',
      'Require pull requests',
    );
    expect(mockContext.output).toHaveBeenCalledWith(
      'rulesetUrl',
      'https://api.github.com/repos/owner/repo/rulesets/1',
    );
  });

  it('should translate bypass actors and explicit tag target', async () => {
    await action.handler(
      createMockActionContext({
        input: {
          repoUrl: 'github.com?repo=repo&owner=owner',
          name: 'Protect tags',
          target: 'tag',
          enforcement: 'active',
          bypassActors: [
            {
              actorId: 1,
              actorType: 'Team',
              bypassMode: 'always',
            },
            {
              actorId: null,
              actorType: 'DeployKey',
            },
            {
              actorId: 2,
              actorType: 'User',
              bypassMode: 'exempt',
            },
          ],
          conditions: {
            refName: {
              include: ['refs/tags/v*'],
              exclude: [],
            },
          },
          rules: [{ type: 'deletion' }],
        },
      }),
    );

    expect(mockOctokit.rest.repos.createRepoRuleset).toHaveBeenCalledWith({
      owner: 'owner',
      repo: 'repo',
      name: 'Protect tags',
      target: 'tag',
      enforcement: 'active',
      bypass_actors: [
        {
          actor_id: 1,
          actor_type: 'Team',
          bypass_mode: 'always',
        },
        {
          actor_id: null,
          actor_type: 'DeployKey',
          bypass_mode: undefined,
        },
        {
          actor_id: 2,
          actor_type: 'User',
          bypass_mode: 'exempt',
        },
      ],
      conditions: {
        ref_name: {
          include: ['refs/tags/v*'],
          exclude: [],
        },
      },
      rules: [{ type: 'deletion' }],
    });
  });

  it('should create a minimal repository ruleset without optional outputs', async () => {
    mockOctokit.rest.repos.createRepoRuleset.mockResolvedValueOnce({
      data: {
        id: 2,
        name: 'Block deletions',
      },
    });
    const mockContext = createMockActionContext({
      input: {
        repoUrl: 'github.com?repo=repo&owner=owner',
        name: 'Block deletions',
        enforcement: 'disabled',
        rules: [{ type: 'deletion' }],
      },
    });

    await action.handler(mockContext);

    expect(mockOctokit.rest.repos.createRepoRuleset).toHaveBeenCalledWith({
      owner: 'owner',
      repo: 'repo',
      name: 'Block deletions',
      target: 'branch',
      enforcement: 'disabled',
      bypass_actors: undefined,
      conditions: undefined,
      rules: [{ type: 'deletion' }],
    });
    expect(mockContext.output).toHaveBeenCalledWith('rulesetId', 2);
    expect(mockContext.output).toHaveBeenCalledWith(
      'rulesetName',
      'Block deletions',
    );
    expect(mockContext.output).not.toHaveBeenCalledWith(
      'rulesetUrl',
      expect.anything(),
    );
  });

  it('should reject repoUrl without owner', async () => {
    await expect(
      action.handler(
        createMockActionContext({
          input: {
            repoUrl: 'github.com?repo=repo',
            name: 'Require pull requests',
            enforcement: 'active',
            rules: [{ type: 'deletion' }],
          },
        }),
      ),
    ).rejects.toThrow('missing owner');
  });
});
