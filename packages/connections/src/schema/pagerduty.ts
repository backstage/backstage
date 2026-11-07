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
import { z } from 'zod/v4';
import { createConnectionType } from '../system/createConnectionType';

/** @public */
export const PagerDutyConnectionType = createConnectionType({
  type: 'pagerduty',
  title: 'PagerDuty',
  configSchema: z.object({
    host: z.hostname().toLowerCase(),
    apiBaseUrl: z.url({ protocol: /^https$/ }).refine(value => {
      const url = new URL(value);
      return !url.username && !url.password && !/[?#]/.test(value);
    }, 'API base URL must not contain credentials, a query, or a fragment'),
  }),
  authMethods: [
    {
      method: 'token',
      title: 'REST API Token',
      configSchema: z.object({
        token: z
          .string()
          .regex(/^\S+$/, 'Token must be non-empty and contain no whitespace'),
      }),
    },
  ],
});
