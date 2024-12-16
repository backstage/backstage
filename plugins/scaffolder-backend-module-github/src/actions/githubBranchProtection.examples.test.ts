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

import { ScmIntegrations } from '@backstage/integration';
import { ConfigReader } from '@backstage/config';
import { TemplateAction } from '@backstage/plugin-scaffolder-node';
import { createMockActionContext } from '@backstage/plugin-scaffolder-node-test-utils';
import yaml from 'yaml';
import { examples } from './githubBranchProtection.examples';
import { createGithubBranchProtectionAction } from './githubBranchProtection';

const mockOctokit = {
  rest: {
    repos: {
      createCommitSignatureProtection: jest.fn(),
      get: jest.fn(),
      updateBranchProtection: jest.fn(),
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

describe('github:branch-protection:create', () => {
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
      repoUrl: 'github.com?repo=repo&owner=owner',
    },
  });

  beforeEach(() => {
    jest.resetAllMocks();

    mockOctokit.rest.repos.get.mockResolvedValue({
      data: {
        default_branch: 'master',
      },
    });

    action = createGithubBranchProtectionAction({
      integrations,
    });
  });

  it('should create branch protection for the default branch with default params', async () => {
    const input = yaml.parse(examples[0].example).steps[0].input;
    const ctx = Object.assign({}, mockContext, { input });
    await action.handler(ctx);

    expect(mockOctokit.rest.repos.updateBranchProtection).toHaveBeenCalledWith({
      mediaType: {
        previews: ['luke-cage-preview'],
      },
      owner: 'owner',
      repo: 'repo',
      branch: 'master',
      required_status_checks: {
        strict: true,
        contexts: [],
      },
      restrictions: null,
      enforce_admins: true,
      required_pull_request_reviews: {
        required_approving_review_count: 1,
        require_code_owner_reviews: false,
        bypass_pull_request_allowances: undefined,
        dismiss_stale_reviews: false,
        require_last_push_approval: false,
      },
      required_conversation_resolution: false,
      required_linear_history: false,
    });
    expect(
      mockOctokit.rest.repos.createCommitSignatureProtection,
    ).not.toHaveBeenCalled();
  });

  it('should create branch protection for the specified branch', async () => {
    const input = yaml.parse(examples[1].example).steps[0].input;
    const ctx = Object.assign({}, mockContext, { input });
    await action.handler(ctx);

    expect(mockOctokit.rest.repos.updateBranchProtection).toHaveBeenCalledWith({
      mediaType: {
        previews: ['luke-cage-preview'],
      },
      owner: 'owner',
      repo: 'repo',
      branch: 'my-awesome-branch',
      required_status_checks: {
        strict: true,
        contexts: [],
      },
      restrictions: null,
      enforce_admins: true,
      required_pull_request_reviews: {
        required_approving_review_count: 1,
        require_code_owner_reviews: false,
        bypass_pull_request_allowances: undefined,
        dismiss_stale_reviews: false,
        require_last_push_approval: false,
      },
      required_conversation_resolution: false,
      required_linear_history: false,
    });
    expect(
      mockOctokit.rest.repos.createCommitSignatureProtection,
    ).not.toHaveBeenCalled();
  });

  it('should create branch protection with params and require commit signing', async () => {
    const input = yaml.parse(examples[2].example).steps[0].input;
    const ctx = Object.assign({}, mockContext, { input });
    await action.handler(ctx);

    expect(mockOctokit.rest.repos.updateBranchProtection).toHaveBeenCalledWith({
      mediaType: {
        previews: ['luke-cage-preview'],
      },
      owner: 'owner',
      repo: 'repo',
      branch: 'master',
      required_status_checks: {
        strict: true,
        contexts: ['test'],
      },
      restrictions: null,
      enforce_admins: true,
      required_pull_request_reviews: {
        required_approving_review_count: 1,
        require_code_owner_reviews: true,
        bypass_pull_request_allowances: undefined,
        dismiss_stale_reviews: true,
        require_last_push_approval: true,
      },
      required_conversation_resolution: true,
      required_linear_history: false,
    });
    expect(
      mockOctokit.rest.repos.createCommitSignatureProtection,
    ).toHaveBeenCalledWith({
      owner: 'owner',
      repo: 'repo',
      branch: 'master',
    });
  });

  it('should create branch protection with params and require linear history', async () => {
    const input = yaml.parse(examples[3].example).steps[0].input;
    const ctx = Object.assign({}, mockContext, { input });
    await action.handler(ctx);

    expect(mockOctokit.rest.repos.updateBranchProtection).toHaveBeenCalledWith({
      mediaType: {
        previews: ['luke-cage-preview'],
      },
      owner: 'owner',
      repo: 'repo',
      branch: 'master',
      required_status_checks: {
        strict: true,
        contexts: ['test'],
      },
      restrictions: null,
      enforce_admins: true,
      required_pull_request_reviews: {
        required_approving_review_count: 1,
        require_code_owner_reviews: true,
        bypass_pull_request_allowances: undefined,
        dismiss_stale_reviews: true,
        require_last_push_approval: true,
      },
      required_conversation_resolution: true,
      required_linear_history: true,
    });
    expect(
      mockOctokit.rest.repos.createCommitSignatureProtection,
    ).toHaveBeenCalledWith({
      owner: 'owner',
      repo: 'repo',
      branch: 'master',
    });
  });
});
