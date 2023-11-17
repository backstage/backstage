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

import { Config } from '@backstage/config';
import { InputError, NotFoundError } from '@backstage/errors';
import {
  GithubCredentialsProvider,
  ScmIntegrationRegistry,
} from '@backstage/integration';
import { Octokit } from 'octokit';
import { createTemplateAction } from '@backstage/plugin-scaffolder-node';
import { getOctokitOptions } from './helpers';
import { parseRepoUrl } from './util';

export type RepoQuery = {
  repository: Repository;
};
type Repository = {
  id: string;
};
/**
 * Creates a new action that can add wildcard branch protections to a GitHub repository.
 *
 * @public
 */
export function createGithubBranchProtectionsAction(options: {
  integrations: ScmIntegrationRegistry;
  config: Config;
  githubCredentialsProvider?: GithubCredentialsProvider;
}) {
  const { integrations, githubCredentialsProvider } = options;

  return createTemplateAction<{
    repoUrl: string;
    branches: string[];
    isAdminEnforced?: boolean;
    deleteBranchOnMerge?: boolean;
    requiredApprovingReviewCount?: number;
    requiresApprovingReviews?: boolean;
    requiresStatusChecks?: boolean;
    requiresCodeOwnerReviews?: boolean;
    dismissStaleReviews?: boolean;
    requiredStatusCheckContexts?: string[];
    requiresBranchesToBeUpToDate?: boolean;
    requiresConversationResolution?: boolean;
    token?: string;
    requiresCommitSignatures?: boolean;
  }>({
    id: 'github:branchprotections',
    description: 'Adds branch protections to a github repository.',
    schema: {
      input: {
        type: 'object',
        required: ['repoUrl'],
        properties: {
          repoUrl: {
            title: 'Repository Location',
            description: `Accepts the format 'github.com?repo=reponame&owner=owner' where 'reponame' is the new repository name and 'owner' is an organization or username`,
            type: 'string',
          },
          requiresApprovingReviews: {
            title: 'Require an approval to update branches',
            description:
              'Are approving reviews required to update matching branches.',
            type: 'boolean',
          },
          requiredApprovingReviewCount: {
            title: 'Required approving review count',
            type: 'number',
            description: `Specify the number of reviewers required to approve pull requests. Use a number between 1 and 6 or 0 to not require reviewers. Defaults to 1.`,
          },
          requiresStatusChecks: {
            title: 'Require a status check',
            type: 'boolean',
          },
          requiresCodeOwnerReviews: {
            title: 'Require CODEOWNER Reviews?',
            description:
              'Require an approved review in PR including files with a designated Code Owner',
            type: 'boolean',
          },
          dismissStaleReviews: {
            title: 'Dismiss Stale Reviews',
            description:
              'New reviewable commits pushed to a matching branch will dismiss pull request review approvals.',
            type: 'boolean',
          },
          requiredStatusCheckContexts: {
            title: 'Required Status Check Contexts',
            description:
              'The list of status checks to require in order to merge into this branch',
            type: 'array',
            items: {
              type: 'string',
            },
          },
          requiresBranchesToBeUpToDate: {
            title: 'Require Branches To Be Up To Date?',
            description: `Require branches to be up to date before merging. The default value is 'true'`,
            type: 'boolean',
          },
          requiresCommitSignatures: {
            title: 'Require commit signing',
            type: 'boolean',
            description: `Require commit signing so that you must sign commits on this branch.`,
          },
          requiresConversationResolution: {
            title: 'Required Conversation Resolution',
            description:
              'Requires all conversations on code to be resolved before a pull request can be merged into this branch',
            type: 'boolean',
          },
          branches: {
            title: 'Required list of branch patterns.',
            description:
              'List of branch protection patterns to apply the protections onto.',
            type: 'array',
            items: {
              type: 'string',
            },
          },
          isAdminEnforced: {
            title: 'Enforce Admins On Protected Branches',
            type: 'boolean',
            description: `Enforce admins to adhere to default branch protection. The default value is 'true'`,
          },
          token: {
            title: 'Authentication Token',
            type: 'string',
            description: 'The token to use for authorization to GitHub',
          },
        },
      },
    },
    async handler(ctx) {
      const {
        repoUrl,
        requiresCodeOwnerReviews = true,
        dismissStaleReviews = true,
        requiresApprovingReviews = true,
        requiredApprovingReviewCount = 1,
        requiresStatusChecks = false,
        requiredStatusCheckContexts = [],
        requiresBranchesToBeUpToDate = false,
        requiresConversationResolution = false,
        requiresCommitSignatures = false,
        branches = [],
        isAdminEnforced = true,
        token: providedToken,
      } = ctx.input;

      const { owner, repo } = parseRepoUrl(repoUrl, integrations);

      if (!owner) {
        throw new InputError('Invalid repository owner provided in repoUrl');
      }

      if (!branches || branches.length <= 0) {
        throw new InputError('The branches field is empty');
      }

      const client = new Octokit(
        await getOctokitOptions({
          integrations,
          credentialsProvider: githubCredentialsProvider,
          repoUrl: repoUrl,
          token: providedToken,
        }),
      );

      const sanitizedRepo = repo.replace(/ /g, '-');

      const repository: RepoQuery = await client.graphql(`
        {
          repository(followRenames: true, owner:"${owner}", name:"${sanitizedRepo}") {
            id
          }
        }
      `);

      if (!repository?.repository?.id) {
        throw new NotFoundError('Input repository does not exist');
      }

      branches.forEach(async (branchName: string) => {
        try {
          ctx.logger.info(`adding protections for the branch: ${branchName}`);
          await client.graphql(`
            mutation {
              createBranchProtectionRule(input: {
                repositoryId: "${repository.repository.id}"
                pattern: "${branchName}"
                isAdminEnforced: ${isAdminEnforced}
                dismissesStaleReviews: ${dismissStaleReviews}
                requiresCodeOwnerReviews: ${requiresCodeOwnerReviews}
                requiresApprovingReviews: ${requiresApprovingReviews}
                requiredApprovingReviewCount: ${requiredApprovingReviewCount}
                requiresStatusChecks: ${requiresStatusChecks}
                requiredStatusCheckContexts: ${JSON.stringify(
                  requiredStatusCheckContexts,
                )}
                requiresStrictStatusChecks: ${requiresBranchesToBeUpToDate}
                requiresConversationResolution: ${requiresConversationResolution}
                requiresCommitSignatures: ${requiresCommitSignatures}
              })
              {
                branchProtectionRule {
                  pattern
                }
              }
            }
          `);
          ctx.logger.info(
            `Successfully created branch protections for '${branchName}'`,
          );
        } catch (e) {
          ctx.logger.warn(
            `Failed: created branch protections on branch: ${branchName}, repo: ${repo}`,
          );
        }
      });
    },
  });
}
