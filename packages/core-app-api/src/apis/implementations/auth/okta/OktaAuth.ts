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

import { oktaAuthApiRef } from '@backstage/core-plugin-api';
import { OAuth2 } from '../oauth2';
import { OAuthApiCreateOptions } from '../types';

const DEFAULT_PROVIDER = {
  id: 'okta',
  title: 'Okta',
  icon: () => null,
};

const OKTA_OIDC_SCOPES: Set<String> = new Set([
  'openid',
  'profile',
  'email',
  'phone',
  'address',
  'groups',
  'offline_access',
]);

const OKTA_SCOPE_PREFIX: string = 'okta.';

/**
 * Implements the OAuth flow to Okta products.
 *
 * @public
 */
export default class OktaAuth {
  static create(options: OAuthApiCreateOptions): typeof oktaAuthApiRef.T {
    const {
      configApi,
      discoveryApi,
      environment = 'development',
      provider = DEFAULT_PROVIDER,
      oauthRequestApi,
      defaultScopes = ['openid', 'email', 'profile', 'offline_access'],
    } = options;

    return OAuth2.create({
      configApi,
      discoveryApi,
      oauthRequestApi,
      provider,
      environment,
      defaultScopes,
      scopeTransform(scopes) {
        return scopes.map(scope => {
          if (OKTA_OIDC_SCOPES.has(scope)) {
            return scope;
          }

          if (scope.startsWith(OKTA_SCOPE_PREFIX)) {
            return scope;
          }

          return `${OKTA_SCOPE_PREFIX}${scope}`;
        });
      },
    });
  }
}
