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
import { GithubSession } from './types';
import {
  OAuthApi,
  SessionApi,
  SessionState,
  ProfileInfo,
  BackstageIdentity,
  AuthRequestOptions,
} from '@backstage/core-plugin-api';
import { Observable } from '@backstage/types';
import { SessionManager } from '../../../../lib/AuthSessionManager/types';
import {
  AuthSessionStore,
  RefreshingAuthSessionManager,
  StaticAuthSessionManager,
} from '../../../../lib/AuthSessionManager';
import { OAuthApiCreateOptions } from '../types';
import { OptionalRefreshSessionManagerMux } from '../../../../lib/AuthSessionManager/OptionalRefreshSessionManagerMux';

export type GithubAuthResponse = {
  providerInfo: {
    accessToken: string;
    scope: string;
    expiresInSeconds?: number;
  };
  profile: ProfileInfo;
  backstageIdentity: BackstageIdentity;
};

const DEFAULT_PROVIDER = {
  id: 'github',
  title: 'GitHub',
  icon: () => null,
};

/**
 * Implements the OAuth flow to GitHub products.
 *
 * @public
 */
export default class GithubAuth implements OAuthApi, SessionApi {
  static create({
    discoveryApi,
    environment = 'development',
    provider = DEFAULT_PROVIDER,
    oauthRequestApi,
    defaultScopes = ['read:user'],
  }: OAuthApiCreateOptions) {
    const connector = new DefaultAuthConnector({
      discoveryApi,
      environment,
      provider,
      oauthRequestApi: oauthRequestApi,
      sessionTransform(res: GithubAuthResponse): GithubSession {
        return {
          ...res,
          providerInfo: {
            accessToken: res.providerInfo.accessToken,
            scopes: GithubAuth.normalizeScope(res.providerInfo.scope),
            expiresAt: res.providerInfo.expiresInSeconds
              ? new Date(Date.now() + res.providerInfo.expiresInSeconds * 1000)
              : undefined,
          },
        };
      },
    });

    const refreshingSessionManager = new RefreshingAuthSessionManager({
      connector,
      defaultScopes: new Set(defaultScopes),
      sessionScopes: (session: GithubSession) => session.providerInfo.scopes,
      sessionShouldRefresh: (session: GithubSession) => {
        const { expiresAt } = session.providerInfo;
        if (!expiresAt) {
          return false;
        }
        const expiresInSec = (expiresAt.getTime() - Date.now()) / 1000;
        return expiresInSec < 60 * 5;
      },
    });

    const staticSessionManager = new AuthSessionStore<GithubSession>({
      manager: new StaticAuthSessionManager({
        connector,
        defaultScopes: new Set(defaultScopes),
        sessionScopes: (session: GithubSession) => session.providerInfo.scopes,
      }),
      storageKey: `${provider.id}Session`,
      sessionScopes: (session: GithubSession) => session.providerInfo.scopes,
    });

    const sessionManagerMux = new OptionalRefreshSessionManagerMux({
      refreshingSessionManager,
      staticSessionManager,
      sessionCanRefresh: session =>
        session.providerInfo.expiresAt !== undefined,
    });

    return new GithubAuth(sessionManagerMux);
  }

  /**
   * @deprecated will be made private in the future. Use create method instead.
   */
  constructor(private readonly sessionManager: SessionManager<GithubSession>) {}

  async signIn() {
    await this.getAccessToken();
  }

  async signOut() {
    await this.sessionManager.removeSession();
  }

  sessionState$(): Observable<SessionState> {
    return this.sessionManager.sessionState$();
  }

  async getAccessToken(scope?: string, options?: AuthRequestOptions) {
    const session = await this.sessionManager.getSession({
      ...options,
      scopes: GithubAuth.normalizeScope(scope),
    });
    return session?.providerInfo.accessToken ?? '';
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

  static normalizeScope(scope?: string): Set<string> {
    if (!scope) {
      return new Set();
    }

    const scopeList = Array.isArray(scope)
      ? scope
      : scope.split(/[\s|,]/).filter(Boolean);

    return new Set(scopeList);
  }
}
