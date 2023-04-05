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

import { createTemplateAction } from '@backstage/plugin-scaffolder-node';
import { ScmIntegrationRegistry } from '@backstage/integration';
import commonGitlabConfig from '../commonGitlabConfig';
import { getToken } from '../util';
import { z } from 'zod';

/**
 * Creates a `gitlab:projectAccessToken:create` Scaffolder action.
 *
 * @param options - Templating configuration.
 * @public
 */
export const createGitlabProjectAccessTokenAction = (options: {
  integrations: ScmIntegrationRegistry;
}) => {
  const { integrations } = options;
  return createTemplateAction({
    id: 'gitlab:projectAccessToken:create',
    schema: {
      input: commonGitlabConfig.and(
        z.object({
          projectId: z.union([z.number(), z.string()], {
            description: 'Project ID',
          }),
          name: z.string({ description: 'Deploy Token Name' }).optional(),
          accessLevel: z
            .number({ description: 'Access Level of the Token' })
            .optional(),
          scopes: z.array(z.string(), { description: 'Scopes' }).optional(),
        }),
      ),
      output: z.object({
        access_token: z.string({ description: 'Access Token' }),
      }),
    },
    async handler(ctx) {
      ctx.logger.info(`Creating Token for Project "${ctx.input.projectId}"`);
      const { projectId, name, accessLevel, scopes } = ctx.input;
      const { token, integrationConfig } = getToken(ctx.input, integrations);

      const response = await fetch(
        `${integrationConfig.config.baseUrl}/api/v4/projects/${projectId}/access_tokens`,
        {
          method: 'POST', // *GET, POST, PUT, DELETE, etc.
          headers: {
            'PRIVATE-TOKEN': token,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name: name,
            scopes: scopes,
            access_level: accessLevel,
          }),
        },
      );

      const result = await response.json();

      ctx.output('access_token', result.token);
    },
  });
};
