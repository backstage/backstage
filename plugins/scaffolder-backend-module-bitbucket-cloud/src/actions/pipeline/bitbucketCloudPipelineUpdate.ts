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
import { createTemplateAction } from '@backstage/plugin-scaffolder-backend';
import { Config } from '@backstage/config';
import { getBitbucketCloudConfig } from '../util';
import {
  BitbucketCloudClient,
  Models,
} from '@backstage/plugin-bitbucket-cloud-common';

/**
 * Creates a new action that updates a repository pipelines config for Bitbucket Cloud.
 * @public
 */
export function createBitbucketCloudPipelineUpdateAction(options: {
  integrations: ScmIntegrationRegistry;
  config: Config;
}) {
  const { integrations } = options;

  return createTemplateAction<{
    repoUrl: string;
    enable: boolean;
    token?: string;
  }>({
    id: 'bitbucketCloud:pipeline:update',
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
          enable: {
            title: 'Enable repository pipelines',
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
      const { repoUrl, token, enable } = ctx.input;

      const { integrationConfig, project, repo, workspace } =
        getBitbucketCloudConfig({ repoUrl, token, integrations });

      const client = BitbucketCloudClient.fromConfig(integrationConfig.config);

      // Use Bitbucket API to create a new repository
      // try {
      console.log('\n\n Scaffolder start');
      const response = await client.updatePipelinesConfig(workspace, repo, {
        repository: {} as Models.Repository,
        enabled: enable,
        type: 'repository_pipelines_configuration',
      } as Models.PipelinesConfig);
      console.log('\n\n Scaffolder end');

      // TODO better error handling
      console.log(response);

      // ctx.output('remoteUrl', remoteUrl);
      // ctx.output('repoContentsUrl', repoContentsUrl);
      // ctx.output('enablePipeline', enablePipeline);
    },
  });
}
