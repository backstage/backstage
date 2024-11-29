/*
 * Copyright 2020 The Backstage Authors
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

import {
  oneloginAuthApiRef,
  OAuthRequestApi,
  AuthProviderInfo,
  ConfigApi,
  DiscoveryApi,
} from '@backstage/core-plugin-api';
import { OAuth2 } from '../oauth2';

/**
 * OneLogin auth provider create options.
 * @public
 */
export type OneLoginAuthCreateOptions = {
  configApi?: ConfigApi;
  discoveryApi: DiscoveryApi;
  oauthRequestApi: OAuthRequestApi;
  environment?: string;
  provider?: AuthProviderInfo;
};

const DEFAULT_PROVIDER = {
  id: 'onelogin',
  title: 'onelogin',
  icon: () => null,
};

const OIDC_SCOPES: Set<String> = new Set([
  'openid',
  'profile',
  'email',
  'phone',
  'address',
  'groups',
  'offline_access',
]);

const SCOPE_PREFIX: string = 'onelogin.';

/**
 * Implements a OneLogin OAuth flow.
 *
 * @public
 */
export default class OneLoginAuth {
  static create(
    options: OneLoginAuthCreateOptions,
  ): typeof oneloginAuthApiRef.T {
    const {
      configApi,
      discoveryApi,
      environment = 'development',
      provider = DEFAULT_PROVIDER,
      oauthRequestApi,
    } = options;

    return OAuth2.create({
      configApi,
      discoveryApi,
      oauthRequestApi,
      provider,
      environment,
      defaultScopes: ['openid', 'email', 'profile', 'offline_access'],
      scopeTransform(scopes) {
        return scopes.map(scope => {
          if (OIDC_SCOPES.has(scope)) {
            return scope;
          }

          if (scope.startsWith(SCOPE_PREFIX)) {
            return scope;
          }

          return `${SCOPE_PREFIX}${scope}`;
        });
      },
    });
  }
}
