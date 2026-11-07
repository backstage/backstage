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

/**
 * An Argo CD deployment with API token authentication.
 *
 * @public
 */
export const ArgoCdConnectionType = createConnectionType({
  type: 'argocd',
  title: 'Argo CD',
  configSchema: z.object({
    host: z.string().min(1),
    baseUrl: z.url({ protocol: /^https?$/ }),
  }),
  authMethods: [
    {
      method: 'token',
      title: 'API Token',
      configSchema: z.object({
        token: z.string().regex(/^(?!argocd\.token=)\S+$/),
      }),
    },
  ],
  validate({ config }) {
    const url = new URL(config.baseUrl);
    if (url.username || url.password || /[?#]/.test(config.baseUrl)) {
      throw new InputError(
        'Argo CD baseUrl must not contain credentials, a query, or a fragment',
      );
    }
    if (url.host !== config.host) {
      throw new InputError('Argo CD host must match the host of baseUrl');
    }
  },
});
