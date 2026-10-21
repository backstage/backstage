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
import { createConnectionType } from '../system/createConnectionType';
import { z } from 'zod/v4';

/** @public */
export const GiteaConnectionType = createConnectionType({
  type: 'gitea',
  title: 'Gitea',
  configSchema: z.object({
    host: z.string(),
    baseUrl: z.string().optional(),
  }),
  authMethods: [
    {
      method: 'none',
      title: 'None',
      configSchema: z.object({}),
    },
    {
      method: 'basic',
      title: 'Basic',
      configSchema: z.object({
        username: z.string(),
        password: z.string(),
      }),
    },
  ],
});
