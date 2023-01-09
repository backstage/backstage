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
import { Gitlab } from '@gitbeaker/node';

export const createGitlabProjectVariable = (options: {
  integrations: ScmIntegrationRegistry;
}) => {
  const { integrations } = options;
  return createTemplateAction<{
    repoUrl: string;
    projectId: string | number;
    key: string;
    value: string;
    variableType: string;
    variableProtected: boolean;
    masked: boolean;
    raw: boolean;
    environmentScope: string;
    token?: string;
  }>({
    id: 'gitlab:create-project-variable',
    schema: {
      input: {
        required: [
          'projectId',
          'key',
          'value',
          'variableType',
          'variableProtected',
          'masked',
          'raw',
          'environmentScope',
        ],
        type: 'object',
        properties: {
          repoUrl: {
            title: 'Repository Location',
            type: 'string',
          },
          key: {
            title:
              'The key of a variable; must have no more than 255 characters; only A-Z, a-z, 0-9, and _ are allowed',
            type: 'string',
          },
          value: {
            title: 'The value of a variable',
            type: 'string',
          },
          variableType: {
            title: 'Variable Type (env_var or file)',
            type: 'string',
          },
          variableProtected: {
            title: 'Whether the variable is protected. Default: false',
            type: 'boolean',
          },
          masked: {
            title: 'Whether the variable is masked. Default: false',
            type: 'boolean',
          },
          raw: {
            title: 'Whether the variable is expandable. Default: false',
            type: 'boolean',
          },
          environmentScope: {
            title: 'The environment_scope of the variable. Default: *',
            type: 'string',
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
      const {
        repoUrl,
        projectId,
        key,
        value,
        variableType,
        variableProtected,
        masked,
        raw,
        environmentScope,
      } = ctx.input;

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

      const api = new Gitlab({
        host: integrationConfig.config.baseUrl,
        token: token,
      });

      await api.ProjectVariables.create(projectId, {
        key: key,
        value: value,
        variable_type: variableType,
        protected: variableProtected,
        masked: masked,
        raw: raw,
        environment_scope: environmentScope,
      });
    },
  });
};
