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

import { DefaultAuthConnector } from '../../../../lib/AuthConnector';
import { RefreshingAuthSessionManager } from '../../../../lib/AuthSessionManager';
import { SessionManager } from '../../../../lib/AuthSessionManager/types';
import {
  AuthRequestOptions,
  BackstageIdentityApi,
  BackstageIdentityResponse,
  OAuthApi,
  OpenIdConnectApi,
  ProfileInfoApi,
  SessionApi,
  SessionState,
} from '@backstage/core-plugin-api';
import { Observable } from '@backstage/types';
import {
  OAuth2CreateOptions,
  OAuth2CreateOptionsWithAuthConnector,
  OAuth2Response,
  OAuth2Session,
} from './types';

const DEFAULT_PROVIDER = {
  id: 'oauth2',
  title: 'Your Identity Provider',
  icon: () => null,
};

/**
 * Implements a generic OAuth2 flow for auth.
 *
 * @public
 */
export default class OAuth2
  implements
    OAuthApi,
    OpenIdConnectApi,
    ProfileInfoApi,
    BackstageIdentityApi,
    SessionApi
{
  private static createAuthConnector(
    options: OAuth2CreateOptions | OAuth2CreateOptionsWithAuthConnector,
  ) {
    if ('authConnector' in options) {
      return options.authConnector;
    }
    const {
      scopeTransform = x => x,
      configApi,
      discoveryApi,
      environment = 'development',
      provider = DEFAULT_PROVIDER,
      oauthRequestApi,
      popupOptions,
    } = options;

    return new DefaultAuthConnector({
      configApi,
      discoveryApi,
      environment,
      provider,
      oauthRequestApi: oauthRequestApi,
      sessionTransform({
        backstageIdentity,
        ...res
      }: OAuth2Response): OAuth2Session {
        const session: OAuth2Session = {
          ...res,
          providerInfo: {
            idToken: res.providerInfo.idToken,
            accessToken: res.providerInfo.accessToken,
            scopes: OAuth2.normalizeScopes(
              scopeTransform,
              res.providerInfo.scope,
            ),
            expiresAt: res.providerInfo.expiresInSeconds
              ? new Date(Date.now() + res.providerInfo.expiresInSeconds * 1000)
              : undefined,
          },
        };
        if (backstageIdentity) {
          session.backstageIdentity = {
            token: backstageIdentity.token,
            identity: backstageIdentity.identity,
            expiresAt: backstageIdentity.expiresInSeconds
              ? new Date(Date.now() + backstageIdentity.expiresInSeconds * 1000)
              : undefined,
          };
        }
        return session;
      },
      popupOptions,
    });
  }

  static create(
    options: OAuth2CreateOptions | OAuth2CreateOptionsWithAuthConnector,
  ) {
    const { defaultScopes = [], scopeTransform = x => x } = options;

    const connector = OAuth2.createAuthConnector(options);

    const sessionManager = new RefreshingAuthSessionManager({
      connector,
      defaultScopes: new Set(defaultScopes),
      sessionScopes: (session: OAuth2Session) => session.providerInfo.scopes,
      sessionShouldRefresh: (session: OAuth2Session) => {
        // TODO(Rugvip): Optimize to use separate checks for provider vs backstage session expiration
        let min = Infinity;
        if (session.providerInfo?.expiresAt) {
          min = Math.min(
            min,
            (session.providerInfo.expiresAt.getTime() - Date.now()) / 1000,
          );
        }
        if (session.backstageIdentity?.expiresAt) {
          min = Math.min(
            min,
            (session.backstageIdentity.expiresAt.getTime() - Date.now()) / 1000,
          );
        }
        return min < 60 * 3;
      },
    });

    return new OAuth2({ sessionManager, scopeTransform });
  }

  private readonly sessionManager: SessionManager<OAuth2Session>;
  private readonly scopeTransform: (scopes: string[]) => string[];

  private constructor(options: {
    sessionManager: SessionManager<OAuth2Session>;
    scopeTransform: (scopes: string[]) => string[];
  }) {
    this.sessionManager = options.sessionManager;
    this.scopeTransform = options.scopeTransform;
  }

  async signIn() {
    await this.getAccessToken();
  }

  async signOut() {
    await this.sessionManager.removeSession();
  }

  sessionState$(): Observable<SessionState> {
    return this.sessionManager.sessionState$();
  }

  async getAccessToken(
    scope?: string | string[],
    options?: AuthRequestOptions,
  ) {
    const normalizedScopes = OAuth2.normalizeScopes(this.scopeTransform, scope);
    const session = await this.sessionManager.getSession({
      ...options,
      scopes: normalizedScopes,
    });
    return session?.providerInfo.accessToken ?? '';
  }

  async getIdToken(options: AuthRequestOptions = {}) {
    const session = await this.sessionManager.getSession({
      ...options,
      scopes: new Set(['openid']),
    });
    return session?.providerInfo.idToken ?? '';
  }

  async getBackstageIdentity(
    options: AuthRequestOptions = {},
  ): Promise<BackstageIdentityResponse | undefined> {
    const session = await this.sessionManager.getSession(options);
    return session?.backstageIdentity;
  }

  async getProfile(options: AuthRequestOptions = {}) {
    const session = await this.sessionManager.getSession(options);
    return session?.profile;
  }

  /**
   * @public
   */
  public static normalizeScopes(
    scopeTransform: (scopes: string[]) => string[],
    scopes?: string | string[],
  ): Set<string> {
    if (!scopes) {
      return new Set();
    }

    const scopeList = Array.isArray(scopes)
      ? scopes
      : scopes.split(/[\s|,]/).filter(Boolean);

    return new Set(scopeTransform(scopeList));
  }
}
