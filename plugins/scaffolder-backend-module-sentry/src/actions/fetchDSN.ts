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
 * Creates the `sentry:fetch:dsn` Scaffolder action.
 *
 * @remarks
 *
 * See {@link https://backstage.io/docs/features/software-templates/writing-custom-actions}.
 *
 * @param options - Configuration of the Sentry API.
 * @public
 */
export function createSentryFetchDSNAction(options: { config: Config }) {
  const { config } = options;

  return createTemplateAction({
    id: 'sentry:fetch:dsn',
    supportsDryRun: true,
    schema: {
      input: {
        organizationSlug: z =>
          z.string({
            description: 'The slug of the organization the project belongs to',
          }),
        projectSlug: z =>
          z.string({
            description: 'The slug of the project to fetch the DSN for',
          }),
        authToken: z =>
          z
            .string({
              description:
                'authenticate via bearer auth token. Requires one of the following scopes: project:admin, project:read, project:write',
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
      output: {
        dsn: z =>
          z
            .string({
              description: 'The public DSN of the Sentry project',
            })
            .optional(),
      },
    },
    async handler(ctx) {
      const { organizationSlug, projectSlug, authToken, apiBaseUrl } =
        ctx.input;

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

      const { body: keys } = await requestSentryApi<unknown>({
        url: `${baseUrl}/projects/${organizationSlug}/${projectSlug}/keys/`,
        init: {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        },
        expectedStatus: 200,
      });

      if (!Array.isArray(keys) || keys.length === 0) {
        throw new InputError('No keys found for the specified project');
      }

      const publicDsn = keys[0]?.dsn?.public;
      if (!publicDsn) {
        throw new InputError('No public DSN found in project keys');
      }

      ctx.output('dsn', publicDsn);
    },
  });
}
