/*
 * Copyright 2023 The Backstage Authors
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

import { CacheService } from '@backstage/backend-plugin-api';
import {
  ProxyAuthenticator,
  createProxyAuthenticator,
} from '@backstage/plugin-auth-node';
import { AuthHelper } from './helpers';
import { CloudflareAccessResult } from './types';

/**
 * Implements Cloudflare Access authentication.
 *
 * @public
 */
export function createCloudflareAccessAuthenticator(options?: {
  cache?: CacheService;
}): ProxyAuthenticator<
  unknown,
  CloudflareAccessResult,
  CloudflareAccessResult
> {
  return createProxyAuthenticator({
    async defaultProfileTransform(result: CloudflareAccessResult) {
      return {
        profile: {
          email: result.cfIdentity.email,
          displayName: result.cfIdentity.name,
        },
      };
    },
    initialize({ config }) {
      return {
        helper: AuthHelper.fromConfig(config, { cache: options?.cache }),
      };
    },
    async authenticate({ req }, { helper }) {
      const result = await helper.authenticate(req);
      return {
        result,
        providerInfo: result,
      };
    },
  });
}
