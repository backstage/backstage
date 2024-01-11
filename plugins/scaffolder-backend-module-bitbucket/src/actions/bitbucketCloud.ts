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
import {
  createTemplateAction,
  initRepoAndPush,
  getRepoSourceDirectory,
  parseRepoUrl,
} from '@backstage/plugin-scaffolder-node';
import fetch, { Response, RequestInit } from 'node-fetch';

import { Config } from '@backstage/config';
import { getAuthorizationHeader } from './helpers';

const createRepository = async (opts: {
  workspace: string;
  project: string;
  repo: string;
  description?: string;
  repoVisibility: 'private' | 'public';
  mainBranch: string;
  authorization: string;
  apiBaseUrl: string;
}) => {
  const {
    workspace,
    project,
    repo,
    description,
    repoVisibility,
    mainBranch,
    authorization,
    apiBaseUrl,
  } = opts;

  const options: RequestInit = {
    method: 'POST',
    body: JSON.stringify({
      scm: 'git',
      description: description,
      is_private: repoVisibility === 'private',
      project: { key: project },
    }),
    headers: {
      Authorization: authorization,
      'Content-Type': 'application/json',
    },
  };

  let response: Response;
  try {
    response = await fetch(
      `${apiBaseUrl}/repositories/${workspace}/${repo}`,
      options,
    );
  } catch (e) {
    throw new Error(`Unable to create repository, ${e}`);
  }

  if (response.status !== 200) {
    throw new Error(
      `Unable to create repository, ${response.status} ${
        response.statusText
      }, ${await response.text()}`,
    );
  }

  const r = await response.json();
  let remoteUrl = '';
  for (const link of r.links.clone) {
    if (link.name === 'https') {
      remoteUrl = link.href;
    }
  }

  // "mainbranch.name" cannot be set neither at create nor update of the repo
  // the first pushed branch will be set as "main branch" then
  const repoContentsUrl = `${r.links.html.href}/src/${mainBranch}`;
  return { remoteUrl, repoContentsUrl };
};

/**
 * Creates a new action that initializes a git repository of the content in the workspace
 * and publishes it to Bitbucket Cloud.
 * @public
 */
export function createPublishBitbucketCloudAction(options: {
  integrations: ScmIntegrationRegistry;
  config: Config;
}) {
  const { integrations, config } = options;

  return createTemplateAction<{
    repoUrl: string;
    description?: string;
    defaultBranch?: string;
    repoVisibility?: 'private' | 'public';
    sourcePath?: string;
    token?: string;
  }>({
    id: 'publish:bitbucketCloud',
    description:
      'Initializes a git repository of the content in the workspace, and publishes it to Bitbucket Cloud.',
    schema: {
      input: {
        type: 'object',
        required: ['repoUrl'],
        properties: {
          repoUrl: {
            title: 'Repository Location',
            type: 'string',
          },
          description: {
            title: 'Repository Description',
            type: 'string',
          },
          repoVisibility: {
            title: 'Repository Visibility',
            type: 'string',
            enum: ['private', 'public'],
          },
          defaultBranch: {
            title: 'Default Branch',
            type: 'string',
            description: `Sets the default branch on the repository. The default value is 'master'`,
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
            description:
              'The token to use for authorization to BitBucket Cloud',
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
          commitHash: {
            title: 'The git commit hash of the initial commit',
            type: 'string',
          },
        },
      },
    },
    async handler(ctx) {
      const {
        repoUrl,
        description,
        defaultBranch = 'master',
        repoVisibility = 'private',
      } = ctx.input;

      const { workspace, project, repo, host } = parseRepoUrl(
        repoUrl,
        integrations,
      );

      if (!workspace) {
        throw new InputError(
          `Invalid URL provider was included in the repo URL to create ${ctx.input.repoUrl}, missing workspace`,
        );
      }

      if (!project) {
        throw new InputError(
          `Invalid URL provider was included in the repo URL to create ${ctx.input.repoUrl}, missing project`,
        );
      }

      const integrationConfig = integrations.bitbucketCloud.byHost(host);
      if (!integrationConfig) {
        throw new InputError(
          `No matching integration configuration for host ${host}, please check your integrations config`,
        );
      }

      const authorization = getAuthorizationHeader(
        ctx.input.token ? { token: ctx.input.token } : integrationConfig.config,
      );

      const apiBaseUrl = integrationConfig.config.apiBaseUrl;

      const { remoteUrl, repoContentsUrl } = await createRepository({
        authorization,
        workspace: workspace || '',
        project,
        repo,
        repoVisibility,
        mainBranch: defaultBranch,
        description,
        apiBaseUrl,
      });

      const gitAuthorInfo = {
        name: config.getOptionalString('scaffolder.defaultAuthor.name'),
        email: config.getOptionalString('scaffolder.defaultAuthor.email'),
      };

      let auth;

      if (ctx.input.token) {
        auth = {
          username: 'x-token-auth',
          password: ctx.input.token,
        };
      } else {
        if (
          !integrationConfig.config.username ||
          !integrationConfig.config.appPassword
        ) {
          throw new Error(
            'Credentials for Bitbucket Cloud integration required for this action.',
          );
        }

        auth = {
          username: integrationConfig.config.username,
          password: integrationConfig.config.appPassword,
        };
      }

      const commitResult = await initRepoAndPush({
        dir: getRepoSourceDirectory(ctx.workspacePath, ctx.input.sourcePath),
        remoteUrl,
        auth,
        defaultBranch,
        logger: ctx.logger,
        commitMessage: config.getOptionalString(
          'scaffolder.defaultCommitMessage',
        ),
        gitAuthorInfo,
      });

      ctx.output('commitHash', commitResult?.commitHash);
      ctx.output('remoteUrl', remoteUrl);
      ctx.output('repoContentsUrl', repoContentsUrl);
    },
  });
}
