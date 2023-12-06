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

const id = 'bitbucket:pipelines:run';
/**
 * Creates a new action that triggers a run of a bitbucket pipeline
 *
 * @public
 */
export const createBitbucketPipelinesRunAction = () => {
  return createTemplateAction<{
    workspace: string;
    repo_slug: string;
  }>({
    id,
    description: '',
    examples,
    schema: {
      input: {
        type: 'object',
        required: ['workspace', 'repo_url'],
        properties: {
          workspace: {
            title: 'Workspace',
            description: `This can either be the workspace ID (slug) or the workspace UUID surrounded by curly-braces, for example {workspace UUID}.`,
            type: 'string',
          },
          repo_slug: {
            title: 'The repository',
            description: 'The repository name',
            type: 'string',
          },
        },
      },
    },
    supportsDryRun: false,
    async handler(ctx) {
      const { workspace, repo_slug } = ctx.input;
      const bodyData = {
        type: '<string>',
        uuid: '<string>',
        build_number: 33,
        creator: {
          type: '<string>',
        },
        repository: {
          type: '<string>',
        },
        target: {
          type: '<string>',
        },
        trigger: {
          type: '<string>',
        },
        state: {
          type: '<string>',
        },
        created_on: '<string>',
        completed_on: '<string>',
        build_seconds_used: 50,
      };
      try {
        const response = await fetch(
          `https://api.bitbucket.org/2.0/repositories/${workspace}/${repo_slug}/pipelines`,
          {
            method: 'POST',
            headers: {
              Authorization: 'Bearer testToken',
              Accept: 'application/json',
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(bodyData),
          },
        );
        ctx.logStream.write(
          `Response: ${response.status} ${response.statusText}`,
        );
        const data = await response.json();
        ctx.logStream.write(data);
      } catch (err) {
        ctx.logStream.write(err);
      }
    },
  });
};
