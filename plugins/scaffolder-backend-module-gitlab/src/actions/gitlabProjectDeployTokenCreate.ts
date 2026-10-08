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

import { InputError } from '@backstage/errors';
import { ScmIntegrationRegistry } from '@backstage/integration';
import { createTemplateAction } from '@backstage/plugin-scaffolder-node';
import { DeployTokenScope, VariableType } from '@gitbeaker/rest';
import { getClient, parseRepoUrl } from '../util';
import { examples } from './gitlabProjectDeployTokenCreate.examples';

/**
 * Creates a `gitlab:projectDeployToken:create` Scaffolder action.
 *
 * @param options - Templating configuration.
 * @public
 */
export const createGitlabProjectDeployTokenAction = (options: {
  integrations: ScmIntegrationRegistry;
  requireScmUserCredentials?: boolean;
}) => {
  const { integrations, requireScmUserCredentials } = options;
  return createTemplateAction({
    id: 'gitlab:projectDeployToken:create',
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
          z.union([z.number(), z.string()], {
            description: 'Project ID',
          }),
        name: z =>
          z.string({
            description: 'Deploy Token Name',
          }),
        username: z =>
          z
            .string({
              description: 'Deploy Token Username',
            })
            .optional(),
        scopes: z =>
          z.array(z.string(), {
            description: 'Scopes',
          }),
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
        deploy_token: z =>
          z
            .string({
              description:
                'Deprecated. The raw deploy token. Omitted when variableKey is provided.',
            })
            .optional(),
        user: z =>
          z.string({
            description: 'Deploy token username',
          }),
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
        name,
        username,
        scopes,
        repoUrl,
        token,
        variableKey,
        variableProtected = false,
        maskedAndHidden = false,
        environmentScope = '*',
      } = ctx.input;

      if (scopes.length === 0) {
        throw new InputError(
          `Could not create token for project "${ctx.input.projectId}": scopes cannot be empty.`,
        );
      }

      const { host } = parseRepoUrl(repoUrl, integrations);
      const api = getClient({
        host,
        integrations,
        token,
        requireScmUserCredentials,
      });

      if (variableKey) {
        const deployUsername = await ctx.checkpoint({
          key: `create.deploy.token.variable.${projectId}.${name}.${variableKey}.${environmentScope}`,
          fn: async () => {
            const response = await api.DeployTokens.create(
              name,
              scopes as DeployTokenScope[],
              {
                projectId,
                username,
              },
            );

            if (!response.hasOwnProperty('token')) {
              throw new InputError(
                `No deploy_token given from gitlab instance`,
              );
            }

            try {
              await api.ProjectVariables.create(
                projectId,
                variableKey,
                response.token as string,
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
                await api.DeployTokens.remove(response.id, { projectId });
              } catch (cleanupError) {
                ctx.logger.error(
                  `Failed to revoke project deploy token ${response.id}`,
                );
              }

              throw error;
            }

            // Username is not secret.
            return response.username;
          },
        });

        ctx.output('variableKey', variableKey);
        ctx.output('user', deployUsername);
        return;
      }

      ctx.logger.warn(
        'The deploy_token output is deprecated because it persists the token in task state. Provide variableKey to store the token securely in GitLab.',
      );

      const { deployToken, deployUsername } = await ctx.checkpoint({
        key: `create.deploy.token.${projectId}.${name}`,
        fn: async () => {
          const res = await api.DeployTokens.create(
            name,
            scopes as DeployTokenScope[],
            {
              projectId,
              username,
            },
          );

          if (!res.hasOwnProperty('token')) {
            throw new InputError(`No deploy_token given from gitlab instance`);
          }

          return {
            deployToken: res.token as string,
            deployUsername: res.username,
          };
        },
      });

      ctx.output('deploy_token', deployToken);
      ctx.output('user', deployUsername);
    },
  });
};
