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

import OAuth2Icon from '@material-ui/icons/AcUnit';
import { DefaultAuthConnector } from '../../../../lib/AuthConnector';
import { OAuth2Session } from './types';
import {
  OAuthApi,
  OpenIdConnectApi,
  IdTokenOptions,
  AccessTokenOptions,
  ProfileInfoApi,
  ProfileInfoOptions,
  ProfileInfo,
  SessionStateApi,
  SessionState,
} from '../../../definitions/auth';
import { OAuthRequestApi, AuthProvider } from '../../../definitions';
import { SessionManager } from '../../../../lib/AuthSessionManager/types';
import { RefreshingAuthSessionManager } from '../../../../lib/AuthSessionManager';
import { Observable } from '../../../../types';
import { SessionStateTracker } from '../../../../lib/AuthSessionManager/SessionStateTracker';

type CreateOptions = {
  apiOrigin: string;
  basePath: string;

  oauthRequestApi: OAuthRequestApi;

  environment?: string;
  provider?: AuthProvider & { id: string };
};

export type OAuth2Response = {
  profile: ProfileInfo;
  accessToken: string;
  idToken: string;
  scope: string;
  expiresInSeconds: number;
};

const DEFAULT_PROVIDER = {
  id: 'oauth2',
  title: 'Your Identity Provider',
  icon: OAuth2Icon,
};

const SCOPE_PREFIX = '';

class OAuth2
  implements OAuthApi, OpenIdConnectApi, ProfileInfoApi, SessionStateApi {
  static create({
    apiOrigin,
    basePath,
    environment = 'development',
    provider = DEFAULT_PROVIDER,
    oauthRequestApi,
  }: CreateOptions) {
    const connector = new DefaultAuthConnector({
      apiOrigin,
      basePath,
      environment,
      provider,
      oauthRequestApi: oauthRequestApi,
      sessionTransform(res: OAuth2Response): OAuth2Session {
        return {
          profile: res.profile,
          idToken: res.idToken,
          accessToken: res.accessToken,
          scopes: OAuth2.normalizeScopes(res.scope),
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

    return new OAuth2(sessionManager);
  }

  private readonly sessionStateTracker = new SessionStateTracker();

  sessionState$(): Observable<SessionState> {
    return this.sessionStateTracker.observable;
  }

  constructor(private readonly sessionManager: SessionManager<OAuth2Session>) {}

  async getAccessToken(
    scope?: string | string[],
    options?: AccessTokenOptions,
  ) {
    const normalizedScopes = OAuth2.normalizeScopes(scope);
    const session = await this.sessionManager.getSession({
      ...options,
      scopes: normalizedScopes,
    });
    this.sessionStateTracker.setIsSignedId(!!session);
    if (session) {
      return session.accessToken;
    }
    return '';
  }

  async getIdToken(options: IdTokenOptions = {}) {
    const session = await this.sessionManager.getSession(options);
    this.sessionStateTracker.setIsSignedId(!!session);
    if (session) {
      return session.idToken;
    }
    return '';
  }

  async logout() {
    await this.sessionManager.removeSession();
    this.sessionStateTracker.setIsSignedId(false);
  }

  async getProfile(options: ProfileInfoOptions = {}) {
    const session = await this.sessionManager.getSession(options);
    this.sessionStateTracker.setIsSignedId(!!session);
    if (!session) {
      return undefined;
    }
    return session.profile;
  }

  static normalizeScopes(scopes?: string | string[]): Set<string> {
    if (!scopes) {
      return new Set();
    }

    const scopeList = Array.isArray(scopes)
      ? scopes
      : scopes.split(/[\s]/).filter(Boolean);

    return new Set(scopeList);
  }
}
export default OAuth2;
