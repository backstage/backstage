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
import { InputError } from '@backstage/errors';
import { Config } from '@backstage/config';
import { requestSentryApi, resolveSentryApiBaseUrl } from './sentryApi';

/**
 * Creates the `sentry:project:create` Scaffolder action.
 *
 * @remarks
 *
 * See {@link https://backstage.io/docs/features/software-templates/writing-custom-actions}.
 *
 * @param options - Configuration of the Sentry API.
 * @public
 */
export function createSentryCreateProjectAction(options: { config: Config }) {
  const { config } = options;

  return createTemplateAction({
    id: 'sentry:project:create',
    schema: {
      input: {
        organizationSlug: z =>
          z.string({
            description: 'The slug of the organization the team belongs to',
          }),
        teamSlug: z =>
          z.string({
            description: 'The slug of the team to create a new project for',
          }),
        name: z =>
          z.string({
            description: 'The name for the new project',
          }),
        slug: z =>
          z
            .string({
              description:
                'Optional slug for the new project. If not provided a slug is generated from the name',
            })
            .optional(),
        platform: z =>
          z
            .string({
              description: 'Optional sentry platform for the new project. ',
            })
            .optional(),
        authToken: z =>
          z
            .string({
              description:
                'authenticate via bearer auth token. Requires scope: project:write',
            })
            .optional(),
        apiBaseUrl: z =>
          z
            .string({
              description:
                'Optional compatibility value that must match the configured Sentry API base URL, or the default Sentry API URL if none is configured',
            })
            .optional(),
      },
    },
    async handler(ctx) {
      const {
        organizationSlug,
        teamSlug,
        name,
        slug,
        platform,
        authToken,
        apiBaseUrl,
      } = ctx.input;

      const body: any = {
        name: name,
      };

      if (slug) {
        body.slug = slug;
      }

      if (platform) {
        body.platform = platform;
      }

      const token = authToken
        ? authToken
        : config.getOptionalString('scaffolder.sentry.token');

      if (!token) {
        throw new InputError(`No valid sentry token given`);
      }

      const baseUrl = resolveSentryApiBaseUrl({
        config,
        inputApiBaseUrl: apiBaseUrl,
      });

      const { result } = await ctx.checkpoint({
        key: `create.project.${organizationSlug}.${teamSlug}`,
        fn: async () => {
          const { body: res, status } = await requestSentryApi<{ id: string }>({
            url: `${baseUrl}/teams/${organizationSlug}/${teamSlug}/projects/`,
            init: {
              method: 'POST',
              headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
              },
              body: JSON.stringify(body),
            },
            expectedStatus: 201,
          });

          return {
            code: status,
            result: res,
          };
        },
      });

      ctx.output('id', result.id);
      ctx.output('result', result);
    },
  });
}
