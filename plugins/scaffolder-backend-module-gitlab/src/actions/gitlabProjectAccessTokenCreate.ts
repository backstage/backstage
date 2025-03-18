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
import { AccessTokenScopes, Gitlab } from '@gitbeaker/rest';
import { DateTime } from 'luxon';
import { z } from 'zod';
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
}) => {
  const { integrations } = options;
  return createTemplateAction({
    id: 'gitlab:projectAccessToken:create',
    examples,
    schema: {
      input: z.object({
        projectId: z.union([z.number(), z.string()], {
          description: 'Project ID/Name(slug) of the Gitlab Project',
        }),
        token: z
          .string({
            description: 'The token to use for authorization to GitLab',
          })
          .optional(),
        name: z.string({ description: 'Name of Access Key' }).optional(),
        repoUrl: z.string({ description: 'URL to gitlab instance' }),
        accessLevel: z
          .number({
            description:
              'Access Level of the Token, 10 (Guest), 20 (Reporter), 30 (Developer), 40 (Maintainer), and 50 (Owner)',
          })
          .optional(),
        scopes: z
          .string({
            description: 'Scopes for a project access token',
          })
          .array()
          .optional(),
        expiresAt: z
          .string({
            description:
              'Expiration date of the access token in ISO format (YYYY-MM-DD). If Empty, it will set to the maximum of 365 days.',
          })
          .optional(),
      }),
      output: z.object({
        access_token: z.string({ description: 'Access Token' }),
      }),
    },
    async handler(ctx) {
      ctx.logger.info(`Creating Token for Project "${ctx.input.projectId}"`);
      const {
        projectId,
        name = 'tokenname',
        accessLevel = 40,
        scopes = ['read_repository'],
        expiresAt,
      } = ctx.input;

      const { token, integrationConfig } = getToken(ctx.input, integrations);

      if (!integrationConfig.config.token && token) {
        throw new InputError(
          `No token available for host ${integrationConfig.config.baseUrl}`,
        );
      }

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

      const projectAccessToken = await ctx.checkpoint({
        key: `project.access.token.${projectId}.${name}`,
        fn: async () => {
          const response = await api.ProjectAccessTokens.create(
            projectId,
            name,
            scopes as AccessTokenScopes[],
            expiresAt || DateTime.now().plus({ days: 365 }).toISODate()!,
            {
              accessLevel,
            },
          );
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
