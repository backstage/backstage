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

  return createTemplateAction<{
    organizationSlug: string;
    teamSlug: string;
    name: string;
    slug?: string;
    authToken?: string;
  }>({
    id: 'sentry:project:create',
    schema: {
      input: {
        required: ['organizationSlug', 'teamSlug', 'name'],
        type: 'object',
        properties: {
          organizationSlug: {
            title: 'The slug of the organization the team belongs to',
            type: 'string',
          },
          teamSlug: {
            title: 'The slug of the team to create a new project for',
            type: 'string',
          },
          name: {
            title: 'The name for the new project',
            type: 'string',
          },
          slug: {
            title:
              'Optional slug for the new project. If not provided a slug is generated from the name',
            type: 'string',
          },
          authToken: {
            title:
              'authenticate via bearer auth token. Requires scope: project:write',
            type: 'string',
          },
        },
      },
    },
    async handler(ctx) {
      const { organizationSlug, teamSlug, name, slug, authToken } = ctx.input;

      const body: any = {
        name: name,
      };

      if (slug) {
        body.slug = slug;
      }

      const token = authToken
        ? authToken
        : config.getOptionalString('scaffolder.sentry.token');

      if (!token) {
        throw new InputError(`No valid sentry token given`);
      }

      const { result } = await ctx.checkpoint({
        key: `create.project.${organizationSlug}.${teamSlug}`,
        fn: async () => {
          const response = await fetch(
            `https://sentry.io/api/0/teams/${organizationSlug}/${teamSlug}/projects/`,
            {
              method: 'POST',
              headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
              },
              body: JSON.stringify(body),
            },
          );

          const contentType = response.headers.get('content-type');

          if (contentType !== 'application/json') {
            throw new InputError(
              `Unexpected Sentry Response Type: ${await response.text()}`,
            );
          }

          const res = await response.json();

          if (response.status !== 201) {
            throw new InputError(`Sentry Response was: ${await res.detail}`);
          }

          return {
            code: response.status,
            result: res as { id: string },
          };
        },
      });

      ctx.output('id', result.id);
      ctx.output('result', result);
    },
  });
}
