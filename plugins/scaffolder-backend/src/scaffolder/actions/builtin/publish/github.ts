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
import {
  GithubCredentialsProvider,
  ScmIntegrationRegistry,
} from '@backstage/integration';
import {
  enableBranchProtectionOnDefaultRepoBranch,
  initRepoAndPush,
} from '../helpers';
import { getRepoSourceDirectory, parseRepoUrl } from './util';
import { createTemplateAction } from '../../createTemplateAction';
import { Config } from '@backstage/config';
import { assertError, InputError } from '@backstage/errors';
import { getOctokitOptions } from '../github/helpers';
import { Octokit } from 'octokit';

/**
 * Creates a new action that initializes a git repository of the content in the workspace
 * and publishes it to GitHub.
 *
 * @public
 */
export function createPublishGithubAction(options: {
  integrations: ScmIntegrationRegistry;
  config: Config;
  githubCredentialsProvider?: GithubCredentialsProvider;
}) {
  const { integrations, config, githubCredentialsProvider } = options;

  return createTemplateAction<{
    repoUrl: string;
    description?: string;
    access?: string;
    defaultBranch?: string;
    protectDefaultBranch?: boolean;
    deleteBranchOnMerge?: boolean;
    gitCommitMessage?: string;
    gitAuthorName?: string;
    gitAuthorEmail?: string;
    allowRebaseMerge?: boolean;
    allowSquashMerge?: boolean;
    allowMergeCommit?: boolean;
    sourcePath?: string;
    requireCodeOwnerReviews?: boolean;
    requiredStatusCheckContexts?: string[];
    repoVisibility?: 'private' | 'internal' | 'public';
    collaborators?: Array<
      | {
          user: string;
          access: 'pull' | 'push' | 'admin' | 'maintain' | 'triage';
        }
      | {
          team: string;
          access: 'pull' | 'push' | 'admin' | 'maintain' | 'triage';
        }
      | {
          /** @deprecated This field is deprecated in favor of team */
          username: string;
          access: 'pull' | 'push' | 'admin' | 'maintain' | 'triage';
        }
    >;
    token?: string;
    topics?: string[];
  }>({
    id: 'publish:github',
    description:
      'Initializes a git repository of contents in workspace and publishes it to GitHub.',
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
          description: {
            title: 'Repository Description',
            type: 'string',
          },
          access: {
            title: 'Repository Access',
            description: `Sets an admin collaborator on the repository. Can either be a user reference different from 'owner' in 'repoUrl' or team reference, eg. 'org/team-name'`,
            type: 'string',
          },
          requireCodeOwnerReviews: {
            title: 'Require CODEOWNER Reviews?',
            description:
              'Require an approved review in PR including files with a designated Code Owner',
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
          repoVisibility: {
            title: 'Repository Visibility',
            type: 'string',
            enum: ['private', 'public', 'internal'],
          },
          defaultBranch: {
            title: 'Default Branch',
            type: 'string',
            description: `Sets the default branch on the repository. The default value is 'master'`,
          },
          protectDefaultBranch: {
            title: 'Protect Default Branch',
            type: 'boolean',
            description: `Protect the default branch after creating the repository. The default value is 'true'`,
          },
          deleteBranchOnMerge: {
            title: 'Delete Branch On Merge',
            type: 'boolean',
            description: `Delete the branch after merging the PR. The default value is 'false'`,
          },
          gitCommitMessage: {
            title: 'Git Commit Message',
            type: 'string',
            description: `Sets the commit message on the repository. The default value is 'initial commit'`,
          },
          gitAuthorName: {
            title: 'Default Author Name',
            type: 'string',
            description: `Sets the default author name for the commit. The default value is 'Scaffolder'`,
          },
          gitAuthorEmail: {
            title: 'Default Author Email',
            type: 'string',
            description: `Sets the default author email for the commit.`,
          },
          allowMergeCommit: {
            title: 'Allow Merge Commits',
            type: 'boolean',
            description: `Allow merge commits. The default value is 'true'`,
          },
          allowSquashMerge: {
            title: 'Allow Squash Merges',
            type: 'boolean',
            description: `Allow squash merges. The default value is 'true'`,
          },
          allowRebaseMerge: {
            title: 'Allow Rebase Merges',
            type: 'boolean',
            description: `Allow rebase merges. The default value is 'true'`,
          },
          sourcePath: {
            title: 'Source Path',
            description:
              'Path within the workspace that will be used as the repository root. If omitted, the entire workspace will be published as the repository.',
            type: 'string',
          },
          collaborators: {
            title: 'Collaborators',
            description: 'Provide additional users or teams with permissions',
            type: 'array',
            items: {
              type: 'object',
              additionalProperties: false,
              required: ['access'],
              properties: {
                access: {
                  type: 'string',
                  description: 'The type of access for the user',
                  enum: ['push', 'pull', 'admin', 'maintain', 'triage'],
                },
                user: {
                  type: 'string',
                  description:
                    'The name of the user that will be added as a collaborator',
                },
                username: {
                  type: 'string',
                  description:
                    'Deprecated. Use the `team` or `user` field instead.',
                },
                team: {
                  type: 'string',
                  description:
                    'The name of the team that will be added as a collaborator',
                },
              },
              oneOf: [
                { required: ['user'] },
                { required: ['username'] },
                { required: ['team'] },
              ],
            },
          },
          token: {
            title: 'Authentication Token',
            type: 'string',
            description: 'The token to use for authorization to GitHub',
          },
          topics: {
            title: 'Topics',
            type: 'array',
            items: {
              type: 'string',
            },
          },
        },
      },
      output: {
        type: 'object',
        properties: {
          remoteUrl: {
            title: 'A URL to the repository with the provider',
            type: 'string',
          },
          repoContentsUrl: {
            title: 'A URL to the root of the repository',
            type: 'string',
          },
        },
      },
    },
    async handler(ctx) {
      const {
        repoUrl,
        description,
        access,
        requireCodeOwnerReviews = false,
        requiredStatusCheckContexts = [],
        repoVisibility = 'private',
        defaultBranch = 'master',
        protectDefaultBranch = true,
        deleteBranchOnMerge = false,
        gitCommitMessage = 'initial commit',
        gitAuthorName,
        gitAuthorEmail,
        allowMergeCommit = true,
        allowSquashMerge = true,
        allowRebaseMerge = true,
        collaborators,
        topics,
        token: providedToken,
      } = ctx.input;

      const { owner, repo } = parseRepoUrl(repoUrl, integrations);

      if (!owner) {
        throw new InputError('Invalid repository owner provided in repoUrl');
      }

      const octokitOptions = await getOctokitOptions({
        integrations,
        credentialsProvider: githubCredentialsProvider,
        token: providedToken,
        repoUrl,
      });

      const client = new Octokit(octokitOptions);

      const user = await client.rest.users.getByUsername({
        username: owner,
      });

      const repoCreationPromise =
        user.data.type === 'Organization'
          ? client.rest.repos.createInOrg({
              name: repo,
              org: owner,
              private: repoVisibility === 'private',
              visibility: repoVisibility,
              description: description,
              delete_branch_on_merge: deleteBranchOnMerge,
              allow_merge_commit: allowMergeCommit,
              allow_squash_merge: allowSquashMerge,
              allow_rebase_merge: allowRebaseMerge,
            })
          : client.rest.repos.createForAuthenticatedUser({
              name: repo,
              private: repoVisibility === 'private',
              description: description,
              delete_branch_on_merge: deleteBranchOnMerge,
              allow_merge_commit: allowMergeCommit,
              allow_squash_merge: allowSquashMerge,
              allow_rebase_merge: allowRebaseMerge,
            });

      let newRepo;

      try {
        newRepo = (await repoCreationPromise).data;
      } catch (e) {
        assertError(e);
        if (e.message === 'Resource not accessible by integration') {
          ctx.logger.warn(
            `The GitHub app or token provided may not have the required permissions to create the ${user.data.type} repository ${owner}/${repo}.`,
          );
        }
        throw new Error(
          `Failed to create the ${user.data.type} repository ${owner}/${repo}, ${e.message}`,
        );
      }

      if (access?.startsWith(`${owner}/`)) {
        const [, team] = access.split('/');
        await client.rest.teams.addOrUpdateRepoPermissionsInOrg({
          org: owner,
          team_slug: team,
          owner,
          repo,
          permission: 'admin',
        });
        // No need to add access if it's the person who owns the personal account
      } else if (access && access !== owner) {
        await client.rest.repos.addCollaborator({
          owner,
          repo,
          username: access,
          permission: 'admin',
        });
      }

      if (collaborators) {
        for (const collaborator of collaborators) {
          try {
            if ('user' in collaborator) {
              await client.rest.repos.addCollaborator({
                owner,
                repo,
                username: collaborator.user,
                permission: collaborator.access,
              });
            } else if ('username' in collaborator) {
              ctx.logger.warn(
                'The field `username` is deprecated in favor of `team` and will be removed in the future.',
              );
              await client.rest.teams.addOrUpdateRepoPermissionsInOrg({
                org: owner,
                team_slug: collaborator.username,
                owner,
                repo,
                permission: collaborator.access,
              });
            } else if ('team' in collaborator) {
              await client.rest.teams.addOrUpdateRepoPermissionsInOrg({
                org: owner,
                team_slug: collaborator.team,
                owner,
                repo,
                permission: collaborator.access,
              });
            }
          } catch (e) {
            assertError(e);
            const name = extractCollaboratorName(collaborator);
            ctx.logger.warn(
              `Skipping ${collaborator.access} access for ${name}, ${e.message}`,
            );
          }
        }
      }

      if (topics) {
        try {
          await client.rest.repos.replaceAllTopics({
            owner,
            repo,
            names: topics.map(t => t.toLowerCase()),
          });
        } catch (e) {
          assertError(e);
          ctx.logger.warn(`Skipping topics ${topics.join(' ')}, ${e.message}`);
        }
      }

      const remoteUrl = newRepo.clone_url;
      const repoContentsUrl = `${newRepo.html_url}/blob/${defaultBranch}`;

      const gitAuthorInfo = {
        name: gitAuthorName
          ? gitAuthorName
          : config.getOptionalString('scaffolder.defaultAuthor.name'),
        email: gitAuthorEmail
          ? gitAuthorEmail
          : config.getOptionalString('scaffolder.defaultAuthor.email'),
      };

      await initRepoAndPush({
        dir: getRepoSourceDirectory(ctx.workspacePath, ctx.input.sourcePath),
        remoteUrl,
        defaultBranch,
        auth: {
          username: 'x-access-token',
          password: octokitOptions.auth,
        },
        logger: ctx.logger,
        commitMessage: gitCommitMessage
          ? gitCommitMessage
          : config.getOptionalString('scaffolder.defaultCommitMessage'),
        gitAuthorInfo,
      });

      if (protectDefaultBranch) {
        try {
          await enableBranchProtectionOnDefaultRepoBranch({
            owner,
            client,
            repoName: newRepo.name,
            logger: ctx.logger,
            defaultBranch,
            requireCodeOwnerReviews,
            requiredStatusCheckContexts,
          });
        } catch (e) {
          assertError(e);
          ctx.logger.warn(
            `Skipping: default branch protection on '${newRepo.name}', ${e.message}`,
          );
        }
      }

      ctx.output('remoteUrl', remoteUrl);
      ctx.output('repoContentsUrl', repoContentsUrl);
    },
  });
}

function extractCollaboratorName(
  collaborator: { user: string } | { team: string } | { username: string },
) {
  if ('username' in collaborator) return collaborator.username;
  if ('user' in collaborator) return collaborator.user;
  return collaborator.team;
}
