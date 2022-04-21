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
  BackstageIdentityResponse,
  OAuthApi,
  OpenIdConnectApi,
  ProfileInfo,
  ProfileInfoApi,
  SessionState,
  SessionApi,
  BackstageIdentityApi,
} from '@backstage/core-plugin-api';
import { Observable } from '@backstage/types';
import { OpenAMSession } from './types';
import { OAuthApiCreateOptions } from '../types';

/**
 * OpenAM create options.
 * @public
 */
export type OpenAMCreateOptions = OAuthApiCreateOptions & {
  scopeTransform?: (scopes: string[]) => string[];
};

export type OpenAMResponse = {
  providerInfo: {
    accessToken: string;
    idToken: string;
    scope: string;
    expiresInSeconds: number;
  };
  profile: ProfileInfo;
  backstageIdentity: BackstageIdentityResponse;
};

const DEFAULT_PROVIDER = {
  id: 'openam',
  title: 'OpenAM Identity Provider',
  icon: () => null,
};

/**
 * Implements a generic OpenAM flow for auth.
 *
 * @public
 */
export default class OpenAMAuth
  implements
    OAuthApi,
    OpenIdConnectApi,
    ProfileInfoApi,
    BackstageIdentityApi,
    SessionApi
{
  static create(options: OpenAMCreateOptions) {
    const {
      discoveryApi,
      environment = 'development',
      provider = DEFAULT_PROVIDER,
      oauthRequestApi,
      defaultScopes = [],
      scopeTransform = x => x,
    } = options;

    const connector = new DefaultAuthConnector({
      discoveryApi,
      environment,
      provider,
      oauthRequestApi: oauthRequestApi,
      sessionTransform(res: OpenAMResponse): OpenAMSession {
        return {
          ...res,
          providerInfo: {
            idToken: res.providerInfo.idToken,
            accessToken: res.providerInfo.accessToken,
            scopes: OpenAMAuth.normalizeScopes(
              scopeTransform,
              res.providerInfo.scope,
            ),
            expiresAt: new Date(
              Date.now() + res.providerInfo.expiresInSeconds * 1000,
            ),
          },
        };
      },
    });

    const sessionManager = new RefreshingAuthSessionManager({
      connector,
      defaultScopes: new Set(defaultScopes),
      sessionScopes: (session: OpenAMSession) => session.providerInfo.scopes,
      sessionShouldRefresh: (session: OpenAMSession) => {
        const expiresInSec =
          (session.providerInfo.expiresAt.getTime() - Date.now()) / 1000;
        return expiresInSec < 60 * 5;
      },
    });

    return new OpenAMAuth({ sessionManager, scopeTransform });
  }

  private readonly sessionManager: SessionManager<OpenAMSession>;
  private readonly scopeTransform: (scopes: string[]) => string[];

  private constructor(options: {
    sessionManager: SessionManager<OpenAMSession>;
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
    const normalizedScopes = OpenAMAuth.normalizeScopes(
      this.scopeTransform,
      scope,
    );
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

  private static normalizeScopes(
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
