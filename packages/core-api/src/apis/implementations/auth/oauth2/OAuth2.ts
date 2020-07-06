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
import { RefreshingAuthSessionManager } from '../../../../lib/AuthSessionManager';
import { SessionManager } from '../../../../lib/AuthSessionManager/types';
import { Observable } from '../../../../types';
import { AuthProvider, OAuthRequestApi } from '../../../definitions';
import {
  AuthRequestOptions,
  BackstageIdentity,
  OAuthApi,
  OpenIdConnectApi,
  ProfileInfo,
  ProfileInfoApi,
  SessionState,
  SessionStateApi,
} from '../../../definitions/auth';
import { OAuth2Session } from './types';

type CreateOptions = {
  apiOrigin: string;
  basePath: string;

  oauthRequestApi: OAuthRequestApi;

  environment?: string;
  provider?: AuthProvider & { id: string };
};

export type OAuth2Response = {
  providerInfo: {
    accessToken: string;
    idToken: string;
    scope: string;
    expiresInSeconds: number;
  };
  profile: ProfileInfo;
  backstageIdentity: BackstageIdentity;
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
          ...res,
          providerInfo: {
            idToken: res.providerInfo.idToken,
            accessToken: res.providerInfo.accessToken,
            scopes: OAuth2.normalizeScopes(res.providerInfo.scope),
            expiresAt: new Date(
              Date.now() + res.providerInfo.expiresInSeconds * 1000,
            ),
          },
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
      sessionScopes: (session: OAuth2Session) => session.providerInfo.scopes,
      sessionShouldRefresh: (session: OAuth2Session) => {
        const expiresInSec =
          (session.providerInfo.expiresAt.getTime() - Date.now()) / 1000;
        return expiresInSec < 60 * 5;
      },
    });

    return new OAuth2(sessionManager);
  }

  sessionState$(): Observable<SessionState> {
    return this.sessionManager.sessionState$();
  }

  constructor(private readonly sessionManager: SessionManager<OAuth2Session>) {}

  async getAccessToken(
    scope?: string | string[],
    options?: AuthRequestOptions,
  ) {
    const normalizedScopes = OAuth2.normalizeScopes(scope);
    const session = await this.sessionManager.getSession({
      ...options,
      scopes: normalizedScopes,
    });
    return session?.providerInfo.accessToken ?? '';
  }

  async getIdToken(options: AuthRequestOptions = {}) {
    const session = await this.sessionManager.getSession(options);
    return session?.providerInfo.idToken ?? '';
  }

  async logout() {
    await this.sessionManager.removeSession();
  }

  async getBackstageIdentity(
    options: AuthRequestOptions = {},
  ): Promise<BackstageIdentity | undefined> {
    const session = await this.sessionManager.getSession(options);
    return session?.backstageIdentity;
  }

  async getProfile(options: AuthRequestOptions = {}) {
    const session = await this.sessionManager.getSession(options);
    return session?.profile;
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
