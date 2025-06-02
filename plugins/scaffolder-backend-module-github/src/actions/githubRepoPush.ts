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

import { Config } from '@backstage/config';
import { InputError } from '@backstage/errors';
import {
  GithubCredentialsProvider,
  ScmIntegrationRegistry,
} from '@backstage/integration';
import { Octokit } from 'octokit';
import {
  createTemplateAction,
  parseRepoUrl,
} from '@backstage/plugin-scaffolder-node';
import { initRepoPushAndProtect } from './helpers';
import { getOctokitOptions } from '../util';
import { examples } from './githubRepoPush.examples';

/**
 * Creates a new action that initializes a git repository of the content in the workspace
 * and publishes it to GitHub.
 *
 * @public
 */
export function createGithubRepoPushAction(options: {
  integrations: ScmIntegrationRegistry;
  config: Config;
  githubCredentialsProvider?: GithubCredentialsProvider;
}) {
  const { integrations, config, githubCredentialsProvider } = options;

  return createTemplateAction({
    id: 'github:repo:push',
    description:
      'Initializes a git repository of contents in workspace and publishes it to GitHub.',
    examples,
    schema: {
      input: {
        repoUrl: z =>
          z.string({
            description:
              'Accepts the format `github.com?repo=reponame&owner=owner` where `reponame` is the new repository name and `owner` is an organization or username',
          }),
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
        requiredStatusCheckContexts: z =>
          z
            .array(z.string(), {
              description:
                'The list of status checks to require in order to merge into this branch',
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
        requiredApprovingReviewCount: z =>
          z
            .number({
              description:
                'Specify the number of reviewers required to approve pull requests. Use a number between `1` and `6` or `0` to not require reviewers. Defaults to `1`.',
            })
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
        defaultBranch: z =>
          z
            .string({
              description:
                'Sets the default branch on the repository. The default value is `master`',
            })
            .optional(),
        protectDefaultBranch: z =>
          z
            .boolean({
              description:
                'Protect the default branch after creating the repository. The default value is `true`',
            })
            .optional(),
        protectEnforceAdmins: z =>
          z
            .boolean({
              description:
                'Enforce admins to adhere to default branch protection. The default value is `true`',
            })
            .optional(),
        gitCommitMessage: z =>
          z
            .string({
              description:
                'Sets the commit message on the repository. The default value is `initial commit`',
            })
            .optional(),
        gitAuthorName: z =>
          z
            .string({
              description:
                'Sets the default author name for the commit. The default value is `Scaffolder`',
            })
            .optional(),
        gitAuthorEmail: z =>
          z
            .string({
              description: 'Sets the default author email for the commit.',
            })
            .optional(),
        sourcePath: z =>
          z
            .string({
              description:
                'Path within the workspace that will be used as the repository root. If omitted, the entire workspace will be published as the repository.',
            })
            .optional(),
        token: z =>
          z
            .string({
              description: 'The token to use for authorization to GitHub',
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
      },
      output: {
        remoteUrl: z =>
          z.string({
            description: 'A URL to the repository with the provider',
          }),
        repoContentsUrl: z =>
          z.string({
            description: 'A URL to the root of the repository',
          }),
        commitHash: z =>
          z.string({
            description: 'The git commit hash of the initial commit',
          }),
      },
    },
    async handler(ctx) {
      const {
        repoUrl,
        defaultBranch = 'main',
        protectDefaultBranch = true,
        protectEnforceAdmins = true,
        gitCommitMessage = 'initial commit',
        gitAuthorName,
        gitAuthorEmail,
        requireCodeOwnerReviews = false,
        dismissStaleReviews = false,
        bypassPullRequestAllowances,
        requiredApprovingReviewCount = 1,
        restrictions,
        requiredStatusCheckContexts = [],
        requireBranchesToBeUpToDate = true,
        requiredConversationResolution = false,
        requireLastPushApproval = false,
        token: providedToken,
        requiredCommitSigning = false,
        requiredLinearHistory = false,
      } = ctx.input;

      const { host, owner, repo } = parseRepoUrl(repoUrl, integrations);

      if (!owner) {
        throw new InputError('Invalid repository owner provided in repoUrl');
      }

      const octokitOptions = await getOctokitOptions({
        integrations,
        credentialsProvider: githubCredentialsProvider,
        token: providedToken,
        host,
        owner,
        repo,
      });

      const client = new Octokit({
        ...octokitOptions,
        log: ctx.logger,
      });

      const targetRepo = await client.rest.repos.get({ owner, repo });

      const remoteUrl = targetRepo.data.clone_url;
      const repoContentsUrl = `${targetRepo.data.html_url}/blob/${defaultBranch}`;

      const commitHash = await ctx.checkpoint({
        key: `init.repo.publish.${owner}.${client}.${repo}`,
        fn: async () => {
          const { commitHash: hash } = await initRepoPushAndProtect(
            remoteUrl,
            octokitOptions.auth,
            ctx.workspacePath,
            ctx.input.sourcePath,
            defaultBranch,
            protectDefaultBranch,
            protectEnforceAdmins,
            owner,
            client,
            repo,
            requireCodeOwnerReviews,
            bypassPullRequestAllowances,
            requiredApprovingReviewCount,
            restrictions,
            requiredStatusCheckContexts,
            requireBranchesToBeUpToDate,
            requiredConversationResolution,
            requireLastPushApproval,
            config,
            ctx.logger,
            gitCommitMessage,
            gitAuthorName,
            gitAuthorEmail,
            dismissStaleReviews,
            requiredCommitSigning,
            requiredLinearHistory,
          );
          return hash;
        },
      });

      ctx.output('remoteUrl', remoteUrl);
      ctx.output('repoContentsUrl', repoContentsUrl);
      ctx.output('commitHash', commitHash);
    },
  });
}
