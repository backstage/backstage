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
export const JenkinsConnectionType = createConnectionType({
  type: 'jenkins',
  title: 'Jenkins',
  configSchema: z.object({
    host: z.string().min(1),
    baseUrl: z.url({ protocol: /^https?$/ }).refine(value => {
      try {
        const url = new URL(value);
        return (
          !url.username &&
          !url.password &&
          !value.includes('?') &&
          !value.includes('#')
        );
      } catch {
        return false;
      }
    }, 'baseUrl must not contain credentials, a query, or a fragment'),
  }),
  authMethods: [
    {
      method: 'apiToken',
      title: 'API token',
      configSchema: z
        .object({
          username: z
            .string()
            .min(1)
            .regex(/^[^:]+$/),
          apiToken: z.string().min(1),
        })
        .strict(),
    },
    {
      method: 'none',
      title: 'None',
      configSchema: z.object({}).strict(),
    },
  ],
  validate({ config }) {
    if (new URL(config.baseUrl).host !== config.host) {
      throw new InputError(
        'Jenkins host must match the host of baseUrl, including any non-default port',
      );
    }
  },
});
