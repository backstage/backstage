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
import { ScmIntegrationRegistry } from '@backstage/integration';
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
  return createTemplateAction({
    id,
    description: 'Run a bitbucket cloud pipeline',
    examples,
    schema: {
      input: {
        workspace: z =>
          z.string({
            description: 'The workspace name',
          }),
        repo_slug: z =>
          z.string({
            description: 'The repository name',
          }),
        body: z =>
          z
            .object(
              {
                target: z
                  .object({
                    ref_type: z
                      .string({
                        description: 'The ref type',
                      })
                      .optional(),
                    type: z
                      .string({
                        description: 'The type',
                      })
                      .optional(),
                    ref_name: z
                      .string({
                        description: 'The ref name',
                      })
                      .optional(),
                    source: z
                      .string({
                        description: 'The source',
                      })
                      .optional(),
                    destination: z
                      .string({
                        description: 'The destination',
                      })
                      .optional(),
                    destination_commit: z
                      .object({
                        hash: z.string({
                          description: 'The hash',
                        }),
                      })
                      .optional(),
                    commit: z
                      .object({
                        type: z.string({
                          description: 'The type',
                        }),
                        hash: z.string({
                          description: 'The hash',
                        }),
                      })
                      .optional(),
                    selector: z
                      .object({
                        type: z.string({
                          description: 'The type',
                        }),
                        pattern: z.string({
                          description: 'The pattern',
                        }),
                      })
                      .optional(),
                    pull_request: z
                      .object({
                        id: z.string({
                          description: 'The id',
                        }),
                      })
                      .optional(),
                  })
                  .optional(),
                variables: z
                  .array(
                    z.object({
                      key: z.string({
                        description: 'The key',
                      }),
                      value: z.string({
                        description: 'The value',
                      }),
                      secured: z
                        .boolean({
                          description: 'Whether the value is secured',
                        })
                        .optional(),
                    }),
                  )
                  .optional(),
              },
              {
                description: 'Pipeline configuration body',
              },
            )
            .passthrough()
            .optional(),
        token: z =>
          z
            .string({
              description:
                'The token to use for authorization to BitBucket Cloud',
            })
            .optional(),
      },
      output: {
        buildNumber: z =>
          z.number({
            description: 'Build number',
          }),
        repoUrl: z =>
          z.string({
            description: 'A URL to the pipeline repository',
          }),
        pipelinesUrl: z =>
          z.string({
            description: 'A URL to the pipeline',
          }),
      },
    },
    supportsDryRun: false,
    async handler(ctx) {
      const { workspace, repo_slug, body, token } = ctx.input;
      const host = 'bitbucket.org';
      const integrationConfig = integrations.bitbucketCloud.byHost(host);

      const authorization = getAuthorizationHeader(
        token ? { token } : integrationConfig!.config,
      );
      let response: Response;
      try {
        response = await fetch(
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
      } catch (e) {
        throw new Error(`Unable to run pipeline, ${e}`);
      }

      if (response.status !== 201) {
        throw new Error(
          `Unable to run pipeline, ${response.status} ${
            response.statusText
          }, ${await response.text()}`,
        );
      }

      const responseObject = await response.json();

      ctx.output('buildNumber', responseObject.build_number);
      ctx.output('repoUrl', responseObject.repository.links.html.href);
      ctx.output(
        'pipelinesUrl',
        `${responseObject.repository.links.html.href}/pipelines`,
      );
    },
  });
};
