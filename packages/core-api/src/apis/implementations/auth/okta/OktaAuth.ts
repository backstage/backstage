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

import OktaIcon from '@material-ui/icons/AcUnit';
import { DefaultAuthConnector } from '../../../../lib/AuthConnector';
import { OktaSession } from './types';
import {
  OAuthApi,
  OpenIdConnectApi,
  ProfileInfoApi,
  ProfileInfo,
  SessionStateApi,
  SessionState,
  BackstageIdentityApi,
  AuthRequestOptions,
  BackstageIdentity,
} from '../../../definitions/auth';
import {
  OAuthRequestApi,
  AuthProvider,
  DiscoveryApi,
} from '../../../definitions';
import { SessionManager } from '../../../../lib/AuthSessionManager/types';
import { RefreshingAuthSessionManager } from '../../../../lib/AuthSessionManager';
import { Observable } from '../../../../types';

type CreateOptions = {
  discoveryApi: DiscoveryApi;
  oauthRequestApi: OAuthRequestApi;

  environment?: string;
  provider?: AuthProvider & { id: string };
};

export type OktaAuthResponse = {
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
  id: 'okta',
  title: 'Okta',
  icon: OktaIcon,
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

class OktaAuth
  implements
    OAuthApi,
    OpenIdConnectApi,
    ProfileInfoApi,
    BackstageIdentityApi,
    SessionStateApi {
  static create({
    discoveryApi,
    environment = 'development',
    provider = DEFAULT_PROVIDER,
    oauthRequestApi,
  }: CreateOptions) {
    const connector = new DefaultAuthConnector({
      discoveryApi,
      environment,
      provider,
      oauthRequestApi: oauthRequestApi,
      sessionTransform(res: OktaAuthResponse): OktaSession {
        return {
          ...res,
          providerInfo: {
            idToken: res.providerInfo.idToken,
            accessToken: res.providerInfo.accessToken,
            scopes: OktaAuth.normalizeScopes(res.providerInfo.scope),
            expiresAt: new Date(
              Date.now() + res.providerInfo.expiresInSeconds * 1000,
            ),
          },
        };
      },
    });

    const sessionManager = new RefreshingAuthSessionManager({
      connector,
      defaultScopes: new Set(['openid', 'email', 'profile', 'offline_access']),
      sessionScopes: session => session.scopes,
      sessionShouldRefresh: session => {
        const expiresInSec =
          (session.providerInfo.expiresAt.getTime() - Date.now()) / 1000;
        return expiresInSec < 60 * 5;
      },
    });

    return new OktaAuth(sessionManager);
  }

  sessionState$(): Observable<SessionState> {
    return this.sessionManager.sessionState$();
  }

  constructor(private readonly sessionManager: SessionManager<OktaSession>) {}

  async getAccessToken(scope?: string, options?: AuthRequestOptions) {
    const session = await this.sessionManager.getSession({
      ...options,
      scopes: OktaAuth.normalizeScopes(scope),
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
      : scopes.split(/[\s|,]/).filter(Boolean);

    const normalizedScopes = scopeList.map(scope => {
      if (OKTA_OIDC_SCOPES.has(scope)) {
        return scope;
      }

      if (scope.startsWith(OKTA_SCOPE_PREFIX)) {
        return scope;
      }

      return `${OKTA_SCOPE_PREFIX}${scope}`;
    });

    return new Set(normalizedScopes);
  }
}

export default OktaAuth;
