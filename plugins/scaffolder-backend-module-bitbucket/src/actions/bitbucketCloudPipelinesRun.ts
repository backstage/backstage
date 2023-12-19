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

import { examples } from './bitbucketCloudPipelinesRun.examples';
import { createTemplateAction } from '@backstage/plugin-scaffolder-node';
import fetch from 'node-fetch';
import * as inputProps from './inputProperties';
import { ScmIntegrationRegistry } from '@backstage/integration';
import { InputError } from '@backstage/errors';
import { getAuthorizationHeader } from './helpers';

const id = 'bitbucket:pipelines:run';
/**
 * Creates a new action that triggers a run of a bitbucket pipeline
 *
 * @public
 */
export const createBitbucketPipelinesRunAction = (options: {
  integrations: ScmIntegrationRegistry;
}) => {
  const { integrations } = options;
  return createTemplateAction<{
    workspace: string;
    repo_slug: string;
    body?: object;
    token?: string;
  }>({
    id,
    description: '',
    examples,
    schema: {
      input: {
        type: 'object',
        required: ['workspace', 'repo_url'],
        properties: {
          workspace: inputProps.workspace,
          repo_slug: inputProps.repo_slug,
          body: inputProps.pipelinesRunBody,
          token: inputProps.token,
        },
      },
    },
    supportsDryRun: false,
    async handler(ctx) {
      const { workspace, repo_slug, body, token } = ctx.input;
      const host = 'bitbucket.org';
      const integrationConfig = integrations.bitbucketCloud.byHost(host);
      if (!integrationConfig) {
        throw new InputError(
          `No matching integration configuration for host ${host}, please check your integrations config`,
        );
      }

      const authorization = getAuthorizationHeader(
        token ? { token } : integrationConfig.config,
      );

      try {
        const response = await fetch(
          `https://api.bitbucket.org/2.0/repositories/${workspace}/${repo_slug}/pipelines`,
          {
            method: 'POST',
            headers: {
              Authorization: authorization,
              Accept: 'application/json',
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(body) ?? {},
          },
        );
        const data = await response.json();
      } catch (e) {
        throw new Error(`Unable to run pipeline, ${e}`);
      }
    },
  });
};
