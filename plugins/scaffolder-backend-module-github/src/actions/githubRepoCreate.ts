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
import { createGithubRepoWithCollaboratorsAndTopics } from './helpers';
import { getOctokitOptions } from '../util';
import { examples } from './githubRepoCreate.examples';

/**
 * Creates a new action that initializes a git repository
 *
 * @public
 */
export function createGithubRepoCreateAction(options: {
  integrations: ScmIntegrationRegistry;
  githubCredentialsProvider?: GithubCredentialsProvider;
}) {
  const { integrations, githubCredentialsProvider } = options;

  return createTemplateAction({
    id: 'github:repo:create',
    description: 'Creates a GitHub repository.',
    examples,
    schema: {
      input: {
        repoUrl: z =>
          z.string({
            description:
              'Accepts the format `github.com?repo=reponame&owner=owner` where `reponame` is the new repository name and `owner` is an organization or username',
          }),
        description: z =>
          z
            .string({
              description: 'Repository Description',
            })
            .optional(),
        homepage: z =>
          z
            .string({
              description: 'Repository Homepage',
            })
            .optional(),
        access: z =>
          z
            .string({
              description:
                'Sets an admin collaborator on the repository. Can either be a user reference different from `owner` in `repoUrl` or team reference, eg. `org/team-name`',
            })
            .optional(),
        requireCodeOwnerReviews: z =>
          z
            .boolean({
              description:
                'Require an approved review in PR including files with a designated Code Owner',
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
        repoVisibility: z =>
          z
            .enum(['private', 'public', 'internal'], {
              description: 'Repository Visibility',
            })
            .optional(),
        deleteBranchOnMerge: z =>
          z
            .boolean({
              description:
                'Delete the branch after merging the PR. The default value is `false`',
            })
            .optional(),
        allowMergeCommit: z =>
          z
            .boolean({
              description: 'Allow merge commits. The default value is `true`',
            })
            .optional(),
        allowSquashMerge: z =>
          z
            .boolean({
              description: 'Allow squash merges. The default value is `true`',
            })
            .optional(),
        squashMergeCommitTitle: z =>
          z
            .enum(['PR_TITLE', 'COMMIT_OR_PR_TITLE'], {
              description:
                'Sets the default value for a squash merge commit title. The default value is `COMMIT_OR_PR_TITLE`',
            })
            .optional(),
        squashMergeCommitMessage: z =>
          z
            .enum(['PR_BODY', 'COMMIT_MESSAGES', 'BLANK'], {
              description:
                'Sets the default value for a squash merge commit message. The default value is `COMMIT_MESSAGES`',
            })
            .optional(),
        allowRebaseMerge: z =>
          z
            .boolean({
              description: 'Allow rebase merges. The default value is `true`',
            })
            .optional(),
        allowAutoMerge: z =>
          z
            .boolean({
              description:
                'Allow individual PRs to merge automatically when all merge requirements are met. The default value is `false`',
            })
            .optional(),
        allowUpdateBranch: z =>
          z
            .boolean({
              description:
                'Allow branch to be updated. The default value is `false`',
            })
            .optional(),
        collaborators: z =>
          z
            .array(
              z.union([
                z.object({
                  access: z.string({
                    description: 'The type of access for the user',
                  }),
                  user: z.string({
                    description:
                      'The name of the user that will be added as a collaborator',
                  }),
                }),
                z.object({
                  access: z.string({
                    description: 'The type of access for the user',
                  }),
                  team: z.string({
                    description:
                      'The name of the team that will be added as a collaborator',
                  }),
                }),
              ]),
              {
                description:
                  'Provide additional users or teams with permissions',
              },
            )
            .optional(),
        hasProjects: z =>
          z
            .boolean({
              description:
                'Enable projects for the repository. The default value is `true` unless the organization has disabled repository projects',
            })
            .optional(),
        hasWiki: z =>
          z
            .boolean({
              description:
                'Enable the wiki for the repository. The default value is `true`',
            })
            .optional(),
        hasIssues: z =>
          z
            .boolean({
              description:
                'Enable issues for the repository. The default value is `true`',
            })
            .optional(),
        token: z =>
          z
            .string({
              description: 'The token to use for authorization to GitHub',
            })
            .optional(),
        topics: z =>
          z
            .array(z.string(), {
              description: 'Topics',
            })
            .optional(),
        repoVariables: z =>
          z
            .record(z.string(), {
              description: 'Variables attached to the repository',
            })
            .optional(),
        secrets: z =>
          z
            .record(z.string(), {
              description: 'Secrets attached to the repository',
            })
            .optional(),
        oidcCustomization: z =>
          z
            .object(
              {
                useDefault: z
                  .boolean({
                    description:
                      'Whether to use the default OIDC template or not.',
                  })
                  .optional(),
                includeClaimKeys: z
                  .array(z.string(), {
                    description:
                      'Array of unique strings. Each claim key can only contain alphanumeric characters and underscores.',
                  })
                  .optional(),
              },
              {
                description:
                  'OIDC customization template attached to the repository.',
              },
            )
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
        customProperties: z =>
          z
            .record(z.string(), {
              description:
                'Custom properties to be added to the repository (note, this only works for organization repositories)',
            })
            .optional(),
        subscribe: z =>
          z
            .boolean({
              description:
                "Subscribe to the repository. The default value is 'false'",
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
      },
    },
    async handler(ctx) {
      const {
        repoUrl,
        description,
        homepage,
        access,
        repoVisibility = 'private',
        deleteBranchOnMerge = false,
        allowMergeCommit = true,
        allowSquashMerge = true,
        squashMergeCommitTitle = 'COMMIT_OR_PR_TITLE',
        squashMergeCommitMessage = 'COMMIT_MESSAGES',
        allowRebaseMerge = true,
        allowAutoMerge = false,
        allowUpdateBranch = false,
        collaborators,
        hasProjects = undefined,
        hasWiki = undefined,
        hasIssues = undefined,
        topics,
        repoVariables,
        secrets,
        oidcCustomization,
        customProperties,
        subscribe,
        token: providedToken,
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

      const remoteUrl = await ctx.checkpoint({
        key: `create.repo.and.topics.${owner}.${repo}`,
        fn: async () => {
          const newRepo = await createGithubRepoWithCollaboratorsAndTopics(
            client,
            repo,
            owner,
            repoVisibility,
            description,
            homepage,
            deleteBranchOnMerge,
            allowMergeCommit,
            allowSquashMerge,
            squashMergeCommitTitle,
            squashMergeCommitMessage,
            allowRebaseMerge,
            allowAutoMerge,
            allowUpdateBranch,
            access,
            collaborators,
            hasProjects,
            hasWiki,
            hasIssues,
            topics,
            repoVariables,
            secrets,
            oidcCustomization,
            customProperties,
            subscribe,
            ctx.logger,
          );
          return newRepo.clone_url;
        },
      });

      ctx.output('remoteUrl', remoteUrl);
    },
  });
}
