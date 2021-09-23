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

import BitbucketIcon from '@material-ui/icons/FormatBold';
import { DefaultAuthConnector } from '../../../../lib/AuthConnector';
import { BitbucketSession } from './types';
import {
  OAuthApi,
  SessionApi,
  SessionState,
  ProfileInfo,
  BackstageIdentity,
  AuthRequestOptions,
  Observable,
} from '@backstage/core-plugin-api';
import { SessionManager } from '../../../../lib/AuthSessionManager/types';
import {
  AuthSessionStore,
  StaticAuthSessionManager,
} from '../../../../lib/AuthSessionManager';
import { OAuthApiCreateOptions } from '../types';

export type BitbucketAuthResponse = {
  providerInfo: {
    accessToken: string;
    scope: string;
    expiresInSeconds: number;
  };
  profile: ProfileInfo;
  backstageIdentity: BackstageIdentity;
};

const DEFAULT_PROVIDER = {
  id: 'bitbucket',
  title: 'Bitbucket',
  icon: BitbucketIcon,
};

class BitbucketAuth implements OAuthApi, SessionApi {
  static create({
    discoveryApi,
    environment = 'development',
    provider = DEFAULT_PROVIDER,
    oauthRequestApi,
    defaultScopes = ['team'],
  }: OAuthApiCreateOptions) {
    const connector = new DefaultAuthConnector({
      discoveryApi,
      environment,
      provider,
      oauthRequestApi: oauthRequestApi,
      sessionTransform(res: BitbucketAuthResponse): BitbucketSession {
        return {
          ...res,
          providerInfo: {
            accessToken: res.providerInfo.accessToken,
            scopes: BitbucketAuth.normalizeScope(res.providerInfo.scope),
            expiresAt: new Date(
              Date.now() + res.providerInfo.expiresInSeconds * 1000,
            ),
          },
        };
      },
    });

    const sessionManager = new StaticAuthSessionManager({
      connector,
      defaultScopes: new Set(defaultScopes),
      sessionScopes: (session: BitbucketSession) => session.providerInfo.scopes,
    });

    const authSessionStore = new AuthSessionStore<BitbucketSession>({
      manager: sessionManager,
      storageKey: `${provider.id}Session`,
      sessionScopes: (session: BitbucketSession) => session.providerInfo.scopes,
    });

    return new BitbucketAuth(authSessionStore);
  }

  constructor(
    private readonly sessionManager: SessionManager<BitbucketSession>,
  ) {}

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
      scopes: BitbucketAuth.normalizeScope(scope),
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
export default BitbucketAuth;
