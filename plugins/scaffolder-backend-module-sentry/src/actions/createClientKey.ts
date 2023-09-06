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

/**
 * Creates the `sentry:client:create` Scaffolder action.
 *
 * @remarks
 *
 * See {@link https://backstage.io/docs/features/software-templates/writing-custom-actions}.
 *
 * @param config - Configuration of the Sentry API.
 * @public
 */
export function createSentryClientAction(config: Config) {
  return createTemplateAction<{
    organizationSlug: string;
    projectSlug?: string;
    authToken?: string;
    apiBaseUrl?: string;
  }>({
    id: 'sentry:client:create',
    schema: {
      input: {
        required: ['organizationSlug', 'projectSlug', 'authToken'],
        type: 'object',
        properties: {
          organizationSlug: {
            title: 'The slug of the organization the team belongs to',
            type: 'string',
          },
          projectSlug: {
            title:
              'Optional slug for the new project. If not provided a slug is generated from the name',
            type: 'string',
          },
          authToken: {
            title:
              'authenticate via bearer auth token. Requires scope: project:write',
            type: 'string',
          },
          apiBaseUrl: {
            title:
              'Optional custom api base url. If not provided the default sentry base url will be used',
            type: 'string',
          },
        },
      },
    },
    async handler(ctx) {
      const { organizationSlug, projectSlug, authToken, apiBaseUrl } =
        ctx.input;

      const token = authToken
        ? authToken
        : config.getOptionalString('scaffolder.sentry.token');

      const baseUrl = apiBaseUrl ?? 'https://sentry.io/api/0';

      if (!token) {
        throw new InputError(`No valid sentry token given`);
      }

      const response = await fetch(
        `${baseUrl}/projects/${organizationSlug}/${projectSlug}/keys/`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        },
      );

      const contentType = response.headers.get('content-type');

      if (contentType !== 'application/json') {
        throw new InputError(
          `Unexpected Sentry Response Type: ${await response.text()}`,
        );
      }

      const code = response.status;
      const result = await response.json();

      if (code !== 201) {
        throw new InputError(`Sentry Response was: ${await result.detail}`);
      }

      const keyResult = await response.json();
      ctx.output('sentryKeys', keyResult.dsn);
    },
  });
}
