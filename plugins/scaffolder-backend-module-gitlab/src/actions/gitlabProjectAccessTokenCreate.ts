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
import { AccessTokenScopes, Gitlab, VariableType } from '@gitbeaker/rest';
import { DateTime } from 'luxon';
import { getToken } from '../util';
import { examples } from './gitlabProjectAccessTokenCreate.examples';

/**
 * Creates a `gitlab:projectAccessToken:create` Scaffolder action.
 *
 * @param options - Templating configuration.
 * @public
 */

export const createGitlabProjectAccessTokenAction = (options: {
  integrations: ScmIntegrationRegistry;
  requireScmUserCredentials?: boolean;
}) => {
  const { integrations, requireScmUserCredentials } = options;
  return createTemplateAction({
    id: 'gitlab:projectAccessToken:create',
    examples,
    schema: {
      input: {
        projectId: z =>
          z.union([z.number(), z.string()], {
            description: 'Project ID/Name(slug) of the Gitlab Project',
          }),
        token: z =>
          z
            .string({
              description: 'The token to use for authorization to GitLab',
            })
            .optional(),
        name: z =>
          z
            .string({
              description: 'Name of Access Key',
            })
            .optional(),
        repoUrl: z =>
          z.string({
            description: 'URL to gitlab instance',
          }),
        accessLevel: z =>
          z
            .number({
              description:
                'Access Level of the Token, 10 (Guest), 20 (Reporter), 30 (Developer), 40 (Maintainer), and 50 (Owner)',
            })
            .optional(),
        scopes: z =>
          z
            .string({
              description: 'Scopes for a project access token',
            })
            .array()
            .optional(),
        expiresAt: z =>
          z
            .string({
              description:
                'Expiration date of the access token in ISO format (YYYY-MM-DD). If Empty, it will set to the maximum of 365 days.',
            })
            .optional(),
        variableKey: z =>
          z
            .string({
              description:
                'GitLab CI/CD variable name in which to store the generated token. When set, the raw token is not exposed in outputs.',
            })
            .regex(/^[A-Za-z0-9_]{1,255}$/)
            .optional(),
        variableProtected: z =>
          z
            .boolean({
              description: 'Whether the CI/CD variable should be protected',
            })
            .default(false)
            .optional(),
        maskedAndHidden: z =>
          z
            .boolean({
              description:
                'Whether the CI/CD variable should be masked and hidden',
            })
            .default(false)
            .optional(),
        environmentScope: z =>
          z
            .string({
              description: 'The environment scope of the CI/CD variable',
            })
            .default('*')
            .optional(),
      },
      output: {
        access_token: z =>
          z
            .string({
              description:
                'Deprecated. The raw access token. Omitted when variableKey is provided.',
            })
            .optional(),
        variableKey: z =>
          z
            .string({
              description:
                'Name of the GitLab CI/CD variable containing the token',
            })
            .optional(),
      },
    },
    async handler(ctx) {
      ctx.logger.info(`Creating Token for Project "${ctx.input.projectId}"`);
      const {
        projectId,
        name = 'tokenname',
        accessLevel = 40,
        scopes = ['read_repository'],
        expiresAt,
        variableKey,
        variableProtected = false,
        maskedAndHidden = false,
        environmentScope = '*',
      } = ctx.input;

      const { token, integrationConfig } = getToken(
        ctx.input,
        integrations,
        requireScmUserCredentials,
      );

      let api;

      if (!ctx.input.token) {
        api = new Gitlab({
          host: integrationConfig.config.baseUrl,
          token: token,
        });
      } else {
        api = new Gitlab({
          host: integrationConfig.config.baseUrl,
          oauthToken: token,
        });
      }

      const createAccessToken = () =>
        api.ProjectAccessTokens.create(
          projectId,
          name,
          scopes as AccessTokenScopes[],
          expiresAt || DateTime.now().plus({ days: 365 }).toISODate()!,
          {
            accessLevel,
          },
        );

      if (variableKey) {
        await ctx.checkpoint({
          key: `project.access.token.variable.${projectId}.${name}.${variableKey}.${environmentScope}`,
          fn: async () => {
            const response = await createAccessToken();

            try {
              await api.ProjectVariables.create(
                projectId,
                variableKey,
                response.token,
                {
                  variableType: 'env_var' as VariableType,
                  protected: variableProtected,
                  masked: true,
                  masked_and_hidden: maskedAndHidden,
                  raw: true,
                  environmentScope,
                },
              );
            } catch (error) {
              try {
                await api.ProjectAccessTokens.revoke(projectId, response.id);
              } catch (cleanupError) {
                ctx.logger.error(
                  `Failed to revoke project access token ${response.id}`,
                );
              }

              throw error;
            }
          },
        });

        ctx.output('variableKey', variableKey);
        return;
      }

      ctx.logger.warn(
        'The access_token output is deprecated because it persists the token in task state. Provide variableKey to store the token securely in GitLab.',
      );

      const projectAccessToken = await ctx.checkpoint({
        key: `project.access.token.${projectId}.${name}`,
        fn: async () => {
          const response = await createAccessToken();
          return response.token;
        },
      });

      if (!projectAccessToken) {
        throw new Error('Could not create project access token');
      }

      ctx.output('access_token', projectAccessToken);
    },
  });
};
