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

import { createTemplateAction } from '@backstage/plugin-scaffolder-backend';
import { ScmIntegrationRegistry } from '@backstage/integration';
import { InputError } from '@backstage/errors';
import { parseRepoHost } from '../util';

export const createGitlabProjectAccessToken = (options: {
  integrations: ScmIntegrationRegistry;
}) => {
  const { integrations } = options;
  return createTemplateAction<{
    repoUrl: string;
    projectId: string | number;
    name: string;
    accessLevel: number;
    scopes: string[];
    token?: string;
  }>({
    id: 'gitlab:create-project-access-token',
    schema: {
      input: {
        required: ['projectId'],
        type: 'object',
        properties: {
          repoUrl: {
            title: 'Repository Location',
            type: 'string',
          },
          projectId: {
            title: 'Project ID',
            type: 'string | number',
          },
          name: {
            title: 'Deploy Token Name',
            type: 'string',
          },
          accessLevel: {
            title: 'Access Level of the Token',
            type: 'number',
          },
          scopes: {
            title: 'Scopes',
            type: 'array',
          },
          token: {
            title: 'Authentication Token',
            type: 'string',
            description: 'The token to use for authorization to GitLab',
          },
        },
      },
    },
    async handler(ctx) {
      ctx.logger.info(`Creating Token for Project "${ctx.input.projectId}"`);
      const { repoUrl, projectId, name, accessLevel, scopes } = ctx.input;

      const host = parseRepoHost(repoUrl);
      const integrationConfig = integrations.gitlab.byHost(host);

      if (!integrationConfig) {
        throw new InputError(
          `No matching integration configuration for host ${host}, please check your integrations config`,
        );
      }

      const token = ctx.input.token || integrationConfig.config.token!;
      const tokenType = ctx.input.token ? 'oauthToken' : 'token';

      if (tokenType === 'oauthToken') {
        throw new InputError(`OAuth Token is currently not supported`);
      }

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
