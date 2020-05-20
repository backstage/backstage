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

import GoogleIcon from '@material-ui/icons/AcUnit';
import { DefaultAuthConnector } from '../../lib/AuthConnector';
import { GoogleSession } from './types';
import {
  OAuthApi,
  OpenIdConnectApi,
  IdTokenOptions,
} from '../../../definitions/auth';
import { OAuthRequestApi } from '../../../definitions';
import { SessionManager } from '../../lib/AuthSessionManager/types';
import { RefreshingAuthSessionManager } from '../../lib/AuthSessionManager';

export type GoogleAuthResponse = {
  accessToken: string;
  idToken: string;
  scopes: string;
  expiresInSeconds: number;
};

const SCOPE_PREFIX = 'https://www.googleapis.com/auth/';

class GoogleAuth implements OAuthApi, OpenIdConnectApi {
  static create(oauthRequestApi: OAuthRequestApi) {
    const connector = new DefaultAuthConnector({
      environment: 'dev',
      provider: {
        id: 'google',
        title: 'Google',
        icon: GoogleIcon,
      },
      oauthRequestApi: oauthRequestApi,
      sessionTransform(res: GoogleAuthResponse): GoogleSession {
        return {
          idToken: res.idToken,
          accessToken: res.accessToken,
          scopes: GoogleAuth.normalizeScopes(res.scopes),
          expiresAt: new Date(Date.now() + res.expiresInSeconds * 1000),
        };
      },
    });

    const sessionManager = new RefreshingAuthSessionManager({
      connector,
      defaultScopes: new Set([
        'openid',
        `${SCOPE_PREFIX}userinfo.email`,
        `${SCOPE_PREFIX}userinfo.profile`,
      ]),
      sessionScopes: session => session.scopes,
      sessionShouldRefresh: session => {
        const expiresInSec = (session.expiresAt.getTime() - Date.now()) / 1000;
        return expiresInSec < 60 * 5;
      },
    });

    return new GoogleAuth(sessionManager);
  }

  constructor(private readonly sessionManager: SessionManager<GoogleSession>) {}

  async getAccessToken(scope?: string | string[]) {
    const normalizedScopes = GoogleAuth.normalizeScopes(scope);
    const session = await this.sessionManager.getSession({
      optional: false,
      scope: normalizedScopes,
    });
    return session.accessToken;
  }

  async getIdToken({ optional }: IdTokenOptions = {}) {
    const session = await this.sessionManager.getSession({
      optional: optional || false,
    });
    if (session) {
      return session.idToken;
    }
    return '';
  }

  async logout() {
    await this.sessionManager.removeSession();
  }

  private static normalizeScopes(scopes?: string | string[]): Set<string> {
    if (!scopes) {
      return new Set();
    }

    const scopeList = Array.isArray(scopes)
      ? scopes
      : scopes.split(' ').filter(Boolean);

    const normalizedScopes = scopeList.map(scope => {
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
    });

    return new Set(normalizedScopes);
  }
}
export default GoogleAuth;
