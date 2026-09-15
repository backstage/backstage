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
import { getClient, parseRepoUrl } from '../util';
import { examples } from './gitlabPipelineTrigger.examples';
import { getErrorMessage } from './helpers';

/**
 * Creates a `gitlab:pipeline:trigger` Scaffolder action.
 *
 * @param options - Templating configuration.
 * @public
 */
export const createTriggerGitlabPipelineAction = (options: {
  integrations: ScmIntegrationRegistry;
  requireScmUserCredentials?: boolean;
}) => {
  const { integrations, requireScmUserCredentials } = options;
  return createTemplateAction({
    id: 'gitlab:pipeline:trigger',
    description: 'Triggers a GitLab Pipeline.',
    examples,
    schema: {
      input: {
        repoUrl: z =>
          z.string({
            description: `Accepts the format 'gitlab.com?repo=project_name&owner=group_name' where 'project_name' is the repository name and 'group_name' is a group or username`,
          }),
        token: z =>
          z
            .string({
              description: 'The token to use for authorization to GitLab',
            })
            .optional(),
        projectId: z =>
          z.number({
            description: 'Project Id',
          }),
        tokenDescription: z =>
          z.string({
            description: 'Pipeline token description',
          }),
        branch: z =>
          z.string({
            description: 'Project branch',
          }),
        variables: z =>
          z
            .record(z.string(), z.string(), {
              description:
                'A object/record of key-valued strings containing the pipeline variables.',
            })
            .optional(),
      },
      output: {
        pipelineUrl: z =>
          z.string({
            description: 'Pipeline Url',
          }),
      },
    },
    async handler(ctx) {
      const { repoUrl, projectId, tokenDescription, token, branch, variables } =
        ctx.input;

      const { host } = parseRepoUrl(repoUrl, integrations);
      const api = getClient({
        host,
        integrations,
        token,
        requireScmUserCredentials,
      });

      const pipelineUrl = await ctx.checkpoint({
        key: `trigger.pipeline.${projectId}.${branch}.${tokenDescription}`,
        fn: async () => {
          const triggerToken = (await api.PipelineTriggerTokens.create(
            projectId,
            tokenDescription,
          )) as PipelineTriggerTokenSchema;

          try {
            const pipeline = (await api.PipelineTriggerTokens.trigger(
              projectId,
              branch,
              triggerToken.token,
              { variables },
            )) as ExpandedPipelineSchema;

            if (!pipeline.id) {
              throw new InputError(
                `Failed to trigger pipeline for project ${projectId}`,
              );
            }

            // Only this non-secret value enters checkpoint state.
            return pipeline.web_url;
          } finally {
            try {
              await api.PipelineTriggerTokens.remove(
                projectId,
                triggerToken.id,
              );
            } catch (error) {
              ctx.logger.error(
                `Failed to delete pipeline trigger token ${
                  triggerToken.id
                }: ${getErrorMessage(error)}`,
              );
            }
          }
        },
      });

      ctx.output('pipelineUrl', pipelineUrl);
    },
  });
};
