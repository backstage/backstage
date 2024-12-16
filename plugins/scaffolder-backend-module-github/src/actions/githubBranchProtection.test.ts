/*
 * Copyright 2024 The Backstage Authors
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

import { createGithubBranchProtectionAction } from './githubBranchProtection';
import { createMockActionContext } from '@backstage/plugin-scaffolder-node-test-utils';
import { TemplateAction } from '@backstage/plugin-scaffolder-node';
import { ConfigReader } from '@backstage/config';
import { ScmIntegrations } from '@backstage/integration';

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
      repoUrl: 'github.com?repo=repository&owner=owner',
      name: 'envname',
    },
  });

  beforeEach(() => {
    mockOctokit.rest.repos.get.mockResolvedValue({
      data: {
        default_branch: 'master',
      },
    });

    action = createGithubBranchProtectionAction({
      integrations,
    });
  });

  afterEach(jest.resetAllMocks);

  it('should work with default params', async () => {
    await action.handler(mockContext);

    expect(mockOctokit.rest.repos.updateBranchProtection).toHaveBeenCalledWith({
      mediaType: {
        previews: ['luke-cage-preview'],
      },
      owner: 'owner',
      repo: 'repository',
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

  it('should require commit signing on default branch', async () => {
    await action.handler({
      ...mockContext,
      input: {
        ...mockContext.input,
        requiredCommitSigning: true,
      },
    });

    expect(mockOctokit.rest.repos.updateBranchProtection).toHaveBeenCalledWith({
      mediaType: {
        previews: ['luke-cage-preview'],
      },
      owner: 'owner',
      repo: 'repository',
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
    ).toHaveBeenCalledWith({
      owner: 'owner',
      repo: 'repository',
      branch: 'master',
    });
  });

  it('should work with all params supplied', async () => {
    await action.handler({
      ...mockContext,
      input: {
        ...mockContext.input,
        branch: 'branch',
        enforceAdmins: false,
        requiredApprovingReviewCount: 2,
        requireCodeOwnerReviews: true,
        dismissStaleReviews: true,
        bypassPullRequestAllowances: {
          users: ['user1'],
          teams: ['team1'],
          apps: ['app1'],
        },
        restrictions: {
          users: ['user2'],
          teams: ['team2'],
          apps: ['app2'],
        },
        requiredStatusCheckContexts: ['context1', 'context2'],
        requireBranchesToBeUpToDate: false,
        requiredConversationResolution: true,
        requireLastPushApproval: true,
        requiredCommitSigning: true,
        requiredLinearHistory: true,
      },
    });

    expect(mockOctokit.rest.repos.updateBranchProtection).toHaveBeenCalledWith({
      mediaType: {
        previews: ['luke-cage-preview'],
      },
      owner: 'owner',
      repo: 'repository',
      branch: 'branch',
      required_status_checks: {
        strict: false,
        contexts: ['context1', 'context2'],
      },
      restrictions: {
        users: ['user2'],
        teams: ['team2'],
        apps: ['app2'],
      },
      enforce_admins: false,
      required_pull_request_reviews: {
        required_approving_review_count: 2,
        require_code_owner_reviews: true,
        bypass_pull_request_allowances: {
          users: ['user1'],
          teams: ['team1'],
          apps: ['app1'],
        },
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
      repo: 'repository',
      branch: 'branch',
    });
  });
});
