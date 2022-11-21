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
import { ScmIntegrationRegistry } from '@backstage/integration';
import { Gitlab } from '@gitbeaker/node';
import { initRepoAndPush } from '../helpers';
import { getRepoSourceDirectory, parseRepoUrl } from './util';
import { createTemplateAction } from '../../createTemplateAction';
import { Config } from '@backstage/config';

/**
 * Creates a new action that initializes a git repository of the content in the workspace
 * and publishes it to GitLab.
 *
 * @public
 */
export function createPublishGitlabAction(options: {
  integrations: ScmIntegrationRegistry;
  config: Config;
}) {
  const { integrations, config } = options;

  return createTemplateAction<{
    repoUrl: string;
    defaultBranch?: string;
    repoVisibility?: 'private' | 'internal' | 'public';
    sourcePath?: string;
    token?: string;
    gitCommitMessage?: string;
    gitAuthorName?: string;
    gitAuthorEmail?: string;
    setUserAsOwner?: boolean;
    topics?: string[];
  }>({
    id: 'publish:gitlab',
    description:
      'Initializes a git repository of the content in the workspace, and publishes it to GitLab.',
    schema: {
      input: {
        type: 'object',
        required: ['repoUrl'],
        properties: {
          repoUrl: {
            title: 'Repository Location',
            type: 'string',
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
          sourcePath: {
            title: 'Source Path',
            description:
              'Path within the workspace that will be used as the repository root. If omitted, the entire workspace will be published as the repository.',
            type: 'string',
          },
          token: {
            title: 'Authentication Token',
            type: 'string',
            description: 'The token to use for authorization to GitLab',
          },
          setUserAsOwner: {
            title: 'Set User As Owner',
            type: 'boolean',
            description:
              'Set the token user as owner of the newly created repository. Requires a token authorized to do the edit in the integration configuration for the matching host',
          },
          topics: {
            title: 'Topic labels',
            description: 'Topic labels to apply on the repository.',
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
          projectId: {
            title: 'The ID of the project',
            type: 'string',
          },
        },
      },
    },
    async handler(ctx) {
      const {
        repoUrl,
        repoVisibility = 'private',
        defaultBranch = 'master',
        gitCommitMessage = 'initial commit',
        gitAuthorName,
        gitAuthorEmail,
        setUserAsOwner = false,
        topics = [],
      } = ctx.input;
      const { owner, repo, host } = parseRepoUrl(repoUrl, integrations);

      if (!owner) {
        throw new InputError(
          `No owner provided for host: ${host}, and repo ${repo}`,
        );
      }

      const integrationConfig = integrations.gitlab.byHost(host);

      if (!integrationConfig) {
        throw new InputError(
          `No matching integration configuration for host ${host}, please check your integrations config`,
        );
      }

      if (!integrationConfig.config.token && !ctx.input.token) {
        throw new InputError(`No token available for host ${host}`);
      }

      const token = ctx.input.token || integrationConfig.config.token!;
      const tokenType = ctx.input.token ? 'oauthToken' : 'token';

      const client = new Gitlab({
        host: integrationConfig.config.baseUrl,
        [tokenType]: token,
      });

      let { id: targetNamespace } = (await client.Namespaces.show(owner)) as {
        id: number;
      };

      const { id: userId } = (await client.Users.current()) as {
        id: number;
      };

      if (!targetNamespace) {
        targetNamespace = userId;
      }

      const { id: projectId, http_url_to_repo } = await client.Projects.create({
        namespace_id: targetNamespace,
        name: repo,
        visibility: repoVisibility,
        ...(topics.length ? { topics } : {}),
      });

      // When setUserAsOwner is true the input token is expected to come from an unprivileged user GitLab
      // OAuth flow. In this case GitLab works in a way that allows the unprivileged user to
      // create the repository, but not to push the default protected branch (e.g. master).
      // In order to set the user as owner of the newly created repository we need to check that the
      // GitLab integration configuration for the matching host contains a token and use
      // such token to bootstrap a new privileged client.
      if (setUserAsOwner && integrationConfig.config.token) {
        const adminClient = new Gitlab({
          host: integrationConfig.config.baseUrl,
          token: integrationConfig.config.token,
        });

        await adminClient.ProjectMembers.add(projectId, userId, 50);
      }

      const remoteUrl = (http_url_to_repo as string).replace(/\.git$/, '');
      const repoContentsUrl = `${remoteUrl}/-/blob/${defaultBranch}`;

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
        remoteUrl: http_url_to_repo as string,
        defaultBranch,
        auth: {
          username: 'oauth2',
          password: token,
        },
        logger: ctx.logger,
        commitMessage: gitCommitMessage
          ? gitCommitMessage
          : config.getOptionalString('scaffolder.defaultCommitMessage'),
        gitAuthorInfo,
      });

      ctx.output('remoteUrl', remoteUrl);
      ctx.output('repoContentsUrl', repoContentsUrl);
      ctx.output('projectId', projectId);
    },
  });
}
