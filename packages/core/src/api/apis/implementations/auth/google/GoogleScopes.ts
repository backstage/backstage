/*
 * Copyright 2020 Spotify AB
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

import { BasicOAuthScopes } from '../../OAuthRequestManager/BasicOAuthScopes';
import { OAuthScopeLike } from '../../..';

const SCOPE_PREFIX = 'https://www.googleapis.com/auth/';

export default class GoogleScopes extends BasicOAuthScopes {
  static from(scope: OAuthScopeLike): GoogleScopes {
    return new GoogleScopes(
      new Set(BasicOAuthScopes.asStrings(scope, GoogleScopes.canonicalScope)),
    );
  }

  static default(): GoogleScopes {
    return new GoogleScopes(
      new Set([
        'openid',
        `${SCOPE_PREFIX}userinfo.email`,
        `${SCOPE_PREFIX}userinfo.profile`,
      ]),
    );
  }

  static empty(): GoogleScopes {
    return new GoogleScopes(new Set());
  }

  constructor(scopes: Set<string>) {
    super(scopes, GoogleScopes.canonicalScope);
  }

  private static canonicalScope(scope: string): string {
    if (scope === 'openid') {
      return scope;
    }

    if (scope === 'profile' || scope === 'email') {
      return `${SCOPE_PREFIX}userinfo.${scope}`;
    }

    if (scope.startsWith(SCOPE_PREFIX)) {
      return scope;
    }

    return `${SCOPE_PREFIX}${scope}`;
  }
}
