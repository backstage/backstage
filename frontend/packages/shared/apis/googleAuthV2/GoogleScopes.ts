import { BasicOAuthScopes } from 'shared/apis/oauth/BasicOAuthScopes';
import { OAuthScopeLike } from '../oauth/types';

// https://www.googleapis.com/auth/userinfo.profile
// https://www.googleapis.com/auth/userinfo.email
// openid

const SCOPE_PREFIX = 'https://www.googleapis.com/auth/';

export default class GoogleScopes extends BasicOAuthScopes {
  static from(scope: OAuthScopeLike): GoogleScopes {
    return new GoogleScopes(new Set(BasicOAuthScopes.asStrings(scope, GoogleScopes.canonicalScope)));
  }

  static default(): GoogleScopes {
    return new GoogleScopes(new Set(['openid', `${SCOPE_PREFIX}userinfo.email`, `${SCOPE_PREFIX}userinfo.profile`]));
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
