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
    body?: object;
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
          body: {
            title: '',
            description: '',
            type: 'object',
            properties: {
              target: {
                title: 'target',
                type: 'object',
                properties: {
                  ref_type: {
                    title: 'ref_type',
                    type: 'string',
                  },
                  type: {
                    title: 'type',
                    type: 'string',
                  },
                  ref_name: {
                    title: 'ref_name',
                    type: 'string',
                  },
                  source: {
                    title: 'source',
                    type: 'string',
                  },
                  destination: {
                    title: 'destination',
                    type: 'string',
                  },
                  destination_commit: {
                    title: 'destination_commit',
                    type: 'object',
                    properties: {
                      hash: {
                        title: 'hash',
                        type: 'string',
                      },
                    },
                  },
                  commit: {
                    title: 'commit',
                    type: 'object',
                    properties: {
                      type: {
                        title: 'type',
                        type: 'string',
                      },
                      hash: {
                        title: 'hash',
                        type: 'string',
                      },
                    },
                  },
                  selector: {
                    title: 'selector',
                    type: 'object',
                    properties: {
                      type: {
                        title: 'type',
                        type: 'string',
                      },
                      pattern: {
                        title: 'pattern',
                        type: 'string',
                      },
                    },
                  },
                  pull_request: {
                    title: 'pull_request',
                    type: 'object',
                    properties: {
                      id: {
                        title: 'id',
                        type: 'string',
                      },
                    },
                  },
                },
              },
              variables: {
                title: 'variables',
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    key: {
                      title: 'key',
                      type: 'string',
                    },
                    value: {
                      title: 'value',
                      type: 'string',
                    },
                    secured: {
                      title: 'secured',
                      type: 'boolean',
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
    supportsDryRun: false,
    async handler(ctx) {
      const { workspace, repo_slug, body } = ctx.input;
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
            body: JSON.stringify(body) ?? {},
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
