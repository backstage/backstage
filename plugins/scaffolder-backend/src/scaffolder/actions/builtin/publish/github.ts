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
import { ScmIntegrationRegistry } from '@backstage/integration';
import {
  enableBranchProtectionOnDefaultRepoBranch,
  initRepoAndPush,
} from '../helpers';
import { getRepoSourceDirectory } from './util';
import { createTemplateAction } from '../../createTemplateAction';
import { Config } from '@backstage/config';
import { OctokitProvider } from '../github/OctokitProvider';

type Permission = 'pull' | 'push' | 'admin' | 'maintain' | 'triage';
type Collaborator = { access: Permission; username: string };

export function createPublishGithubAction(options: {
  integrations: ScmIntegrationRegistry;
  config: Config;
}) {
  const { integrations, config } = options;
  const octokitProvider = new OctokitProvider(integrations);

  return createTemplateAction<{
    repoUrl: string;
    description?: string;
    access?: string;
    defaultBranch?: string;
    sourcePath?: string;
    requireCodeOwnerReviews?: boolean;
    repoVisibility: 'private' | 'internal' | 'public';
    collaborators: Collaborator[];
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
            title:
              'Require an approved review in PR including files with a designated Code Owner',
            type: 'boolean',
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
          sourcePath: {
            title:
              'Path within the workspace that will be used as the repository root. If omitted, the entire workspace will be published as the repository.',
            type: 'string',
          },
          collaborators: {
            title: 'Collaborators',
            description: 'Provide additional users with permissions',
            type: 'array',
            items: {
              type: 'object',
              required: ['username', 'access'],
              properties: {
                access: {
                  type: 'string',
                  description: 'The type of access for the user',
                  enum: ['push', 'pull', 'admin', 'maintain', 'triage'],
                },
                username: {
                  type: 'string',
                  description: 'The username or group',
                },
              },
            },
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
        repoVisibility = 'private',
        defaultBranch = 'master',
        collaborators,
        topics,
      } = ctx.input;

      const { client, token, owner, repo } = await octokitProvider.getOctokit(
        repoUrl,
      );

      const user = await client.users.getByUsername({
        username: owner,
      });

      const repoCreationPromise =
        user.data.type === 'Organization'
          ? client.repos.createInOrg({
              name: repo,
              org: owner,
              private: repoVisibility === 'private',
              visibility: repoVisibility,
              description: description,
            })
          : client.repos.createForAuthenticatedUser({
              name: repo,
              private: repoVisibility === 'private',
              description: description,
            });

      const { data: newRepo } = await repoCreationPromise;
      if (access?.startsWith(`${owner}/`)) {
        const [, team] = access.split('/');
        await client.teams.addOrUpdateRepoPermissionsInOrg({
          org: owner,
          team_slug: team,
          owner,
          repo,
          permission: 'admin',
        });
        // No need to add access if it's the person who owns the personal account
      } else if (access && access !== owner) {
        await client.repos.addCollaborator({
          owner,
          repo,
          username: access,
          permission: 'admin',
        });
      }

      if (collaborators) {
        for (const {
          access: permission,
          username: team_slug,
        } of collaborators) {
          try {
            await client.teams.addOrUpdateRepoPermissionsInOrg({
              org: owner,
              team_slug,
              owner,
              repo,
              permission,
            });
          } catch (e) {
            ctx.logger.warn(
              `Skipping ${permission} access for ${team_slug}, ${e.message}`,
            );
          }
        }
      }

      if (topics) {
        try {
          await client.repos.replaceAllTopics({
            owner,
            repo,
            names: topics.map(t => t.toLowerCase()),
          });
        } catch (e) {
          ctx.logger.warn(`Skipping topics ${topics.join(' ')}, ${e.message}`);
        }
      }

      const remoteUrl = newRepo.clone_url;
      const repoContentsUrl = `${newRepo.html_url}/blob/${defaultBranch}`;

      const gitAuthorInfo = {
        name: config.getOptionalString('scaffolder.defaultAuthor.name'),
        email: config.getOptionalString('scaffolder.defaultAuthor.email'),
      };

      await initRepoAndPush({
        dir: getRepoSourceDirectory(ctx.workspacePath, ctx.input.sourcePath),
        remoteUrl,
        defaultBranch,
        auth: {
          username: 'x-access-token',
          password: token,
        },
        logger: ctx.logger,
        commitMessage: config.getOptionalString(
          'scaffolder.defaultCommitMessage',
        ),
        gitAuthorInfo,
      });

      try {
        await enableBranchProtectionOnDefaultRepoBranch({
          owner,
          client,
          repoName: newRepo.name,
          logger: ctx.logger,
          defaultBranch,
          requireCodeOwnerReviews,
        });
      } catch (e) {
        ctx.logger.warn(
          `Skipping: default branch protection on '${newRepo.name}', ${e.message}`,
        );
      }

      ctx.output('remoteUrl', remoteUrl);
      ctx.output('repoContentsUrl', repoContentsUrl);
    },
  });
}
