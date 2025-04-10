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

import { ScmIntegrationRegistry } from '@backstage/integration';
import { createTemplateAction } from '@backstage/plugin-scaffolder-node';
import { VariableType } from '@gitbeaker/rest';
import { z } from 'zod';
import commonGitlabConfig from '../commonGitlabConfig';
import { getClient, parseRepoUrl } from '../util';
import { examples } from './gitlabProjectVariableCreate.examples';

/**
 * Creates a `gitlab:projectVariable:create` Scaffolder action.
 *
 * @param options - Templating configuration.
 * @public
 */
export const createGitlabProjectVariableAction = (options: {
  integrations: ScmIntegrationRegistry;
}) => {
  const { integrations } = options;
  return createTemplateAction({
    id: 'gitlab:projectVariable:create',
    examples,
    schema: {
      input: commonGitlabConfig.merge(
        z.object({
          projectId: z.union([z.number(), z.string()], {
            description: 'Project ID',
          }),
          key: z
            .string({
              description:
                'The key of a variable; must have no more than 255 characters; only A-Z, a-z, 0-9, and _ are allowed',
            })
            .regex(/^[A-Za-z0-9_]{1,255}$/),
          value: z.string({ description: 'The value of a variable' }),
          variableType: z.string({
            description: 'Variable Type (env_var or file)',
          }),
          variableProtected: z
            .boolean({ description: 'Whether the variable is protected' })
            .default(false)
            .optional(),
          masked: z
            .boolean({ description: 'Whether the variable is masked' })
            .default(false)
            .optional(),
          raw: z
            .boolean({ description: 'Whether the variable is expandable' })
            .default(false)
            .optional(),
          environmentScope: z
            .string({ description: 'The environment_scope of the variable' })
            .default('*')
            .optional(),
        }),
      ),
    },
    async handler(ctx) {
      const {
        repoUrl,
        projectId,
        key,
        value,
        variableType,
        variableProtected = false,
        masked = false,
        raw = false,
        environmentScope = '*',
        token,
      } = ctx.input;

      const { host } = parseRepoUrl(repoUrl, integrations);

      const api = getClient({ host, integrations, token });

      await ctx.checkpoint({
        key: `create.project.variables.${projectId}.${key}.${value}`,
        fn: async () => {
          await api.ProjectVariables.create(projectId, key, value, {
            variableType: variableType as VariableType,
            protected: variableProtected,
            masked,
            raw,
            environmentScope,
          });
        },
      });
    },
  });
};
