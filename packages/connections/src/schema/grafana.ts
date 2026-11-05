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

/** @public */
export const GrafanaConnectionType = createConnectionType({
  type: 'grafana',
  title: 'Grafana',
  configSchema: z.object({
    host: z.string().min(1),
    baseUrl: z.url({ protocol: /^https?$/ }).refine(value => {
      try {
        const url = new URL(value);
        return !url.username && !url.password && !/[?#]/.test(value);
      } catch {
        return false;
      }
    }, 'baseUrl must not contain credentials, a query, or a fragment'),
  }),
  authMethods: [
    {
      method: 'token',
      title: 'Service Account Token',
      configSchema: z.object({
        token: z.string().regex(/^\S+$/),
      }),
    },
    {
      method: 'basic',
      title: 'Basic Authentication',
      configSchema: z.object({
        username: z
          .string()
          .min(1)
          .regex(/^[^:\r\n]+$/),
        password: z.string().min(1),
        orgId: z.number().int().positive().optional(),
      }),
    },
  ],
  validate({ config }) {
    // The lookup strategy compares against URL.host, including non-default ports.
    try {
      if (
        ['http', 'https'].some(
          scheme => new URL(`${scheme}://${config.host}`).host === config.host,
        )
      ) {
        return;
      }
    } catch {
      // Report the same rule for malformed URLs and hosts containing URL parts.
    }
    throw new InputError(
      'host must be a lowercase URL host, with an optional port and no scheme or path',
    );
  },
});
