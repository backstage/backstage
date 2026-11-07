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
import { z } from 'zod/v4';
import { createConnectionType } from '../system/createConnectionType';

const baseUrlSchema = z.url({ protocol: /^https?$/ });

/**
 * A Jira Cloud site or Data Center installation. API roots exclude `/rest`.
 *
 * @public
 */
export const JiraConnectionType = createConnectionType({
  type: 'jira',
  title: 'Jira',
  configSchema: z.object({
    host: z.string().min(1),
    deployment: z.enum(['cloud', 'datacenter']),
    baseUrl: baseUrlSchema,
    apiBaseUrl: baseUrlSchema.optional(),
  }),
  authMethods: [
    {
      method: 'none',
      title: 'None',
      configSchema: z.object({}).strict(),
    },
    {
      method: 'apiToken',
      title: 'Cloud API token',
      configSchema: z
        .object({
          email: z.email(),
          token: z.string().min(1).regex(/^\S+$/),
        })
        .strict(),
    },
    {
      method: 'pat',
      title: 'Data Center personal access token',
      configSchema: z
        .object({
          token: z.string().min(1).regex(/^\S+$/),
        })
        .strict(),
    },
  ],
  validate({ config, auth }) {
    const baseUrl = new URL(config.baseUrl);
    if (baseUrl.host !== config.host) {
      throw new InputError('Jira baseUrl host must match host');
    }
    for (const value of [config.baseUrl, config.apiBaseUrl]) {
      if (!value) {
        continue;
      }
      const url = new URL(value);
      if (url.username || url.password || /[?#]/.test(value)) {
        throw new InputError(
          'Jira base URLs must not contain credentials, query parameters, or fragments',
        );
      }
      if (url.pathname.split('/').includes('rest')) {
        throw new InputError('Jira base URLs must exclude /rest API paths');
      }
    }
    for (const entry of auth) {
      if (
        (config.deployment === 'cloud' && entry.method === 'pat') ||
        (config.deployment === 'datacenter' && entry.method === 'apiToken')
      ) {
        throw new InputError(
          `Jira auth method "${entry.method}" is not supported for deployment "${config.deployment}"`,
        );
      }
    }
  },
});
