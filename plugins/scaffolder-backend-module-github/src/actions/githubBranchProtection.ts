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

  return createTemplateAction({
    id: 'github:branch-protection:create',
    description: 'Configures Branch Protection',
    examples,
    schema: {
      input: {
        repoUrl: z =>
          z.string({
            description:
              'Accepts the format `github.com?repo=reponame&owner=owner` where `reponame` is the new repository name and `owner` is an organization or username',
          }),
        branch: z =>
          z
            .string({
              description: `The branch to protect. Defaults to the repository's default branch`,
            })
            .optional(),
        enforceAdmins: z =>
          z
            .boolean({
              description:
                'Enforce admins to adhere to default branch protection. The default value is `true`',
            })
            .optional(),
        requiredApprovingReviewCount: z =>
          z
            .number({
              description:
                'Specify the number of reviewers required to approve pull requests. Use a number between `1` and `6` or `0` to not require reviewers. Defaults to `1`.',
            })
            .optional(),
        requireCodeOwnerReviews: z =>
          z
            .boolean({
              description:
                'Require an approved review in PR including files with a designated Code Owner',
            })
            .optional(),
        dismissStaleReviews: z =>
          z
            .boolean({
              description:
                'New reviewable commits pushed to a matching branch will dismiss pull request review approvals.',
            })
            .optional(),
        bypassPullRequestAllowances: z =>
          z
            .object(
              {
                apps: z.array(z.string()).optional(),
                users: z.array(z.string()).optional(),
                teams: z.array(z.string()).optional(),
              },
              {
                description:
                  'Allow specific users, teams, or apps to bypass pull request requirements.',
              },
            )
            .optional(),
        restrictions: z =>
          z
            .object(
              {
                users: z.array(z.string()),
                teams: z.array(z.string()),
                apps: z.array(z.string()).optional(),
              },
              {
                description:
                  'Restrict who can push to the protected branch. User, app, and team restrictions are only available for organization-owned repositories.',
              },
            )
            .optional(),
        requiredStatusCheckContexts: z =>
          z
            .array(z.string(), {
              description:
                'The list of status checks to require in order to merge into this branch',
            })
            .optional(),
        requireBranchesToBeUpToDate: z =>
          z
            .boolean({
              description:
                'Require branches to be up to date before merging. The default value is `true`',
            })
            .optional(),
        requiredConversationResolution: z =>
          z
            .boolean({
              description:
                'Requires all conversations on code to be resolved before a pull request can be merged into this branch',
            })
            .optional(),
        requireLastPushApproval: z =>
          z
            .boolean({
              description:
                'Whether the most recent push to a PR must be approved by someone other than the person who pushed it. The default value is `false`',
            })
            .optional(),
        requiredCommitSigning: z =>
          z
            .boolean({
              description:
                'Require commit signing so that you must sign commits on this branch.',
            })
            .optional(),
        requiredLinearHistory: z =>
          z
            .boolean({
              description:
                'Prevent merge commits from being pushed to matching branches.',
            })
            .optional(),
        token: z =>
          z
            .string({
              description: 'The token to use for authorization to GitHub',
            })
            .optional(),
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
      const client = new Octokit({
        ...octokitOptions,
        log: ctx.logger,
      });

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
