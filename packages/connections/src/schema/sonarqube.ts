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
import { connectionBaseUrlSchema } from '../system/connectionBaseUrlSchema';
import { withBaseUrl } from '../system/withBaseUrl';
import { createConnectionType } from '../system/createConnectionType';

/**
 * A SonarQube Server or SonarQube Cloud instance.
 *
 * @public
 */
export const SonarqubeConnectionType = createConnectionType({
  type: 'sonarqube',
  title: 'SonarQube',
  ...withBaseUrl(
    z.object({
      apiBaseUrl: connectionBaseUrlSchema.optional(),
    }),
  ),
  authMethods: [
    {
      method: 'none',
      title: 'None',
      configSchema: z.object({}),
    },
    {
      method: 'token',
      title: 'Token',
      configSchema: z.object({
        token: z.string().min(1).regex(/^\S+$/),
        authType: z.enum(['bearer', 'basic']).default('bearer'),
      }),
    },
  ],
});
