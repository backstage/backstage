/*
 * Copyright 2022 The Backstage Authors
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
import { initRepoAndPush } from '../helpers';
import { createTemplateAction } from '../../createTemplateAction';
import { getRepoSourceDirectory } from '../publish/util';
import { Config } from '@backstage/config';
import { getBitbucketCloudConfig } from './util';
import {
  bitbucketCloudEnablePipeline,
  bitbucketCloudCreateRepository,
} from './helpers';

/**
 * Creates a new action that initializes a git repository of the content in the workspace
 * and publishes it to Bitbucket Cloud.
 * @public
 */
export function createBitbucketCloudRepoCreateAction(options: {
  integrations: ScmIntegrationRegistry;
  config: Config;
}) {
  const { integrations, config } = options;

  return createTemplateAction<{
    repoUrl: string;
    description?: string;
    defaultBranch?: string;
    enablePipeline?: boolean;
    repoVisibility?: 'private' | 'public';
    sourcePath?: string;
    token?: string;
  }>({
    id: 'bitbucketCloud:repo:create',
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
          enablePipeline: {
            title: 'Enable Bitbucket pipeline',
            description:
              'Enable Bitbucket pipelines on this repository. Default is False',
            type: 'boolean',
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
        },
      },
    },
    async handler(ctx) {
      const {
        description,
        defaultBranch = 'master',
        enablePipeline = false,
        repoVisibility = 'private',
        token,
        repoUrl,
      } = ctx.input;

      const {
        apiBaseUrl,
        authorization,
        integrationConfig,
        project,
        repo,
        workspace,
      } = getBitbucketCloudConfig({ repoUrl, token, integrations });

      // Use Bitbucket API to create a new repository
      const { remoteUrl, repoContentsUrl } =
        await bitbucketCloudCreateRepository({
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
      // Use isomorphic-git to push workspace to new repository
      await initRepoAndPush({
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
      // Use Bitbucket API to enable pipeline
      if (enablePipeline) {
        await bitbucketCloudEnablePipeline({
          workspace,
          repo,
          authorization,
          apiBaseUrl,
        });
      }

      ctx.output('remoteUrl', remoteUrl);
      ctx.output('repoContentsUrl', repoContentsUrl);
      ctx.output('enablePipeline', enablePipeline);
    },
  });
}
