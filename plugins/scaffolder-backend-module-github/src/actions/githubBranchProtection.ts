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

import { InputError } from '@backstage/errors';
import {
  createTemplateAction,
  parseRepoUrl,
} from '@backstage/plugin-scaffolder-node';
import { ScmIntegrationRegistry } from '@backstage/integration';
import { examples } from './githubBranchProtection.examples';
import * as inputProps from './inputProperties';
import { getOctokitOptions } from '../util';
import { Octokit } from 'octokit';
import { enableBranchProtectionOnDefaultRepoBranch } from './gitHelpers';

/**
 * Creates an `github:branch-protection:create` Scaffolder action that configured Branch Protection in a Github Repository.
 *
 * @public
 */
export function createGithubBranchProtectionAction(options: {
  integrations: ScmIntegrationRegistry;
}) {
  const { integrations } = options;

  return createTemplateAction<{
    repoUrl: string;
    branch?: string;
    enforceAdmins?: boolean;
    requiredApprovingReviewCount?: number;
    requireCodeOwnerReviews?: boolean;
    dismissStaleReviews?: boolean;
    bypassPullRequestAllowances?:
      | {
          users?: string[];
          teams?: string[];
          apps?: string[];
        }
      | undefined;
    restrictions?:
      | {
          users: string[];
          teams: string[];
          apps?: string[];
        }
      | undefined;
    requiredStatusCheckContexts?: string[];
    requireBranchesToBeUpToDate?: boolean;
    requiredConversationResolution?: boolean;
    requireLastPushApproval?: boolean;
    requiredCommitSigning?: boolean;
    requiredLinearHistory?: boolean;
    token?: string;
  }>({
    id: 'github:branch-protection:create',
    description: 'Configures Branch Protection',
    examples,
    schema: {
      input: {
        type: 'object',
        required: ['repoUrl'],
        properties: {
          repoUrl: inputProps.repoUrl,
          branch: {
            title: 'Branch name',
            description: `The branch to protect. Defaults to the repository's default branch`,
            type: 'string',
          },
          enforceAdmins: inputProps.protectEnforceAdmins,
          requiredApprovingReviewCount: inputProps.requiredApprovingReviewCount,
          requireCodeOwnerReviews: inputProps.requireCodeOwnerReviews,
          dismissStaleReviews: inputProps.dismissStaleReviews,
          bypassPullRequestAllowances: inputProps.bypassPullRequestAllowances,
          restrictions: inputProps.restrictions,
          requiredStatusCheckContexts: inputProps.requiredStatusCheckContexts,
          requireBranchesToBeUpToDate: inputProps.requireBranchesToBeUpToDate,
          requiredConversationResolution:
            inputProps.requiredConversationResolution,
          requireLastPushApproval: inputProps.requireLastPushApproval,
          requiredCommitSigning: inputProps.requiredCommitSigning,
          requiredLinearHistory: inputProps.requiredLinearHistory,
          token: inputProps.token,
        },
      },
    },
    async handler(ctx) {
      const {
        repoUrl,
        branch,
        enforceAdmins = true,
        requiredApprovingReviewCount = 1,
        requireCodeOwnerReviews = false,
        dismissStaleReviews = false,
        bypassPullRequestAllowances,
        restrictions,
        requiredStatusCheckContexts = [],
        requireBranchesToBeUpToDate = true,
        requiredConversationResolution = false,
        requireLastPushApproval = false,
        requiredCommitSigning = false,
        requiredLinearHistory = false,
        token: providedToken,
      } = ctx.input;

      const { host, owner, repo } = parseRepoUrl(repoUrl, integrations);

      if (!owner) {
        throw new InputError(`No owner provided for repo ${repoUrl}`);
      }

      const octokitOptions = await getOctokitOptions({
        integrations,
        token: providedToken,
        host,
        owner,
        repo,
      });
      const client = new Octokit(octokitOptions);

      const defaultBranch = await ctx.checkpoint({
        key: `read.default.branch.${owner}.${repo}`,
        fn: async () => {
          const repository = await client.rest.repos.get({
            owner: owner,
            repo: repo,
          });
          return repository.data.default_branch;
        },
      });

      await ctx.checkpoint({
        key: `enable.branch.protection.${owner}.${repo}`,
        fn: async () => {
          await enableBranchProtectionOnDefaultRepoBranch({
            repoName: repo,
            client,
            owner,
            logger: ctx.logger,
            requireCodeOwnerReviews,
            bypassPullRequestAllowances,
            requiredApprovingReviewCount,
            restrictions,
            requiredStatusCheckContexts,
            requireBranchesToBeUpToDate,
            requiredConversationResolution,
            requireLastPushApproval,
            defaultBranch: branch ?? defaultBranch,
            enforceAdmins,
            dismissStaleReviews,
            requiredCommitSigning,
            requiredLinearHistory,
          });
        },
      });
    },
  });
}
