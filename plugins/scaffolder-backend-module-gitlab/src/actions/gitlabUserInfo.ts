/*
 * Copyright 2026 The Backstage Authors
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
import { examples } from './gitlabUserInfo.examples';
import { getClient, parseRepoUrl } from '../util';
import { getErrorMessage } from './helpers';

/**
 * Creates a `gitlab:user:info` Scaffolder action.
 *
 * @param options - Templating configuration.
 * @public
 */
export const createGitlabUserInfoAction = (options: {
  integrations: ScmIntegrationRegistry;
}) => {
  const { integrations } = options;

  return createTemplateAction({
    id: 'gitlab:user:info',
    description:
      'Retrieves information about a GitLab user or the current authenticated user',
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
        userId: z =>
          z
            .number({
              description:
                'User ID. If not provided, returns current authenticated user',
            })
            .optional(),
      },
      output: {
        id: z =>
          z.number({
            description: 'The user ID',
          }),
        username: z =>
          z.string({
            description: 'The username',
          }),
        name: z =>
          z.string({
            description: 'The display name',
          }),
        state: z =>
          z.string({
            description: 'User state (active, blocked, etc.)',
          }),
        webUrl: z =>
          z.string({
            description: 'URL to user profile',
          }),
        email: z =>
          z
            .string({
              description:
                'Email address (only available for current user or admins)',
            })
            .optional(),
        createdAt: z =>
          z
            .string({
              description: 'User creation date',
            })
            .optional(),
        publicEmail: z =>
          z
            .string({
              description: 'Public email address',
            })
            .optional(),
      },
    },
    async handler(ctx) {
      try {
        const { repoUrl, token, userId } = ctx.input;

        const { host } = parseRepoUrl(repoUrl, integrations);
        const api = getClient({ host, integrations, token });

        const userInfo =
          userId !== undefined
            ? await api.Users.show(userId)
            : await api.Users.showCurrentUser();

        ctx.output('id', userInfo.id);
        ctx.output('username', userInfo.username);
        ctx.output('name', userInfo.name);
        ctx.output('state', userInfo.state);
        ctx.output('webUrl', userInfo.web_url as string);

        if (userInfo.email) {
          ctx.output('email', userInfo.email as string);
        }
        if (userInfo.created_at) {
          ctx.output('createdAt', userInfo.created_at as string);
        }
        if (userInfo.public_email) {
          ctx.output('publicEmail', userInfo.public_email as string);
        }
      } catch (error: any) {
        throw new InputError(
          `Failed to retrieve GitLab user info: ${getErrorMessage(error)}`,
        );
      }
    },
  });
};
