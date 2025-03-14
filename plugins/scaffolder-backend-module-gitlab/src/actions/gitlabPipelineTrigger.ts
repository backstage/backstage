/*
 * Copyright 2023 The Backstage Authors
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
import { createTemplateAction } from '@backstage/plugin-scaffolder-node';
import {
  ExpandedPipelineSchema,
  PipelineTriggerTokenSchema,
} from '@gitbeaker/rest';
import { z } from 'zod';
import commonGitlabConfig from '../commonGitlabConfig';
import { getClient, parseRepoUrl } from '../util';
import { examples } from './gitlabPipelineTrigger.examples';
import { getErrorMessage } from './helpers';

const pipelineInputProperties = z.object({
  projectId: z.number().describe('Project Id'),
  tokenDescription: z.string().describe('Pipeline token description'),
  branch: z.string().describe('Project branch'),
  variables: z
    .record(z.string(), z.string())
    .optional()
    .describe(
      'A object/record of key-valued strings containing the pipeline variables.',
    ),
});

const pipelineOutputProperties = z.object({
  pipelineUrl: z.string({ description: 'Pipeline Url' }),
});

/**
 * Creates a `gitlab:pipeline:trigger` Scaffolder action.
 *
 * @param options - Templating configuration.
 * @public
 */
export const createTriggerGitlabPipelineAction = (options: {
  integrations: ScmIntegrationRegistry;
}) => {
  const { integrations } = options;
  return createTemplateAction({
    id: 'gitlab:pipeline:trigger',
    description: 'Triggers a GitLab Pipeline.',
    examples,
    schema: {
      input: commonGitlabConfig.merge(pipelineInputProperties),
      output: pipelineOutputProperties,
    },
    async handler(ctx) {
      let pipelineTriggerToken: string | undefined = undefined;
      let pipelineTriggerId: number | undefined = undefined;

      const { repoUrl, projectId, tokenDescription, token, branch, variables } =
        commonGitlabConfig.merge(pipelineInputProperties).parse(ctx.input);

      const { host } = parseRepoUrl(repoUrl, integrations);
      const api = getClient({ host, integrations, token });

      try {
        ({ pipelineTriggerToken, pipelineTriggerId } = await ctx.checkpoint({
          key: `create.pipeline.token.${projectId}`,
          fn: async () => {
            const res = (await api.PipelineTriggerTokens.create(
              projectId,
              tokenDescription,
            )) as PipelineTriggerTokenSchema;
            return {
              pipelineTriggerToken: res.token,
              pipelineTriggerId: res.id,
            };
          },
        }));

        if (!pipelineTriggerToken) {
          ctx.logger.error(
            `Failed to create pipeline token for project ${projectId}.`,
          );
          return;
        }
        ctx.logger.info(
          `Pipeline token id ${pipelineTriggerId} created for project ${projectId}.`,
        );

        // Use the pipeline token to trigger the pipeline in the project
        const pipelineTriggerResponse =
          (await api.PipelineTriggerTokens.trigger(
            projectId,
            branch,
            pipelineTriggerToken,
            { variables },
          )) as ExpandedPipelineSchema;

        if (!pipelineTriggerResponse.id) {
          ctx.logger.error(
            `Failed to trigger pipeline for project ${projectId}.`,
          );
          return;
        }

        ctx.logger.info(
          `Pipeline id ${pipelineTriggerResponse.id} for project ${projectId} triggered.`,
        );

        ctx.output('pipelineUrl', pipelineTriggerResponse.web_url);
      } catch (error: any) {
        if (error instanceof z.ZodError) {
          // Handling Zod validation errors
          throw new InputError(`Validation error: ${error.message}`, {
            validationErrors: error.errors,
          });
        }
        // Handling other errors
        throw new InputError(
          `Failed to trigger Pipeline: ${getErrorMessage(error)}`,
        );
      } finally {
        // Delete the pipeline token if it was created
        if (pipelineTriggerId) {
          try {
            await ctx.checkpoint({
              key: `create.delete.token.${projectId}`,
              fn: async () => {
                if (pipelineTriggerId) {
                  // to make the current version of TypeScript happy
                  await api.PipelineTriggerTokens.remove(
                    projectId,
                    pipelineTriggerId,
                  );
                }
              },
            });
            ctx.logger.info(
              `Deleted pipeline with token id ${pipelineTriggerId}.`,
            );
          } catch (error: any) {
            ctx.logger.error(
              `Failed to delete pipeline with token id ${pipelineTriggerId}.`,
            );
          }
        }
      }
    },
  });
};
