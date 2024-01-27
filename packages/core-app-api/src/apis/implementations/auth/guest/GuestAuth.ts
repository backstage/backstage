/*
 * Copyright 2024 The Backstage Authors
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

import {
  AuthRequestOptions,
  BackstageIdentityApi,
  ProfileInfo,
  ProfileInfoApi,
  SessionApi,
  SessionState,
  BackstageIdentityResponse,
} from '@backstage/core-plugin-api';
import { Observable } from '@backstage/types';
import { DirectAuthConnector } from '../../../../lib/AuthConnector';
import { RefreshingAuthSessionManager } from '../../../../lib/AuthSessionManager';
import { SessionManager } from '../../../../lib/AuthSessionManager/types';
import { AuthApiCreateOptions } from '../types';

type GuestSession = {
  profile: ProfileInfo;
  backstageIdentity: BackstageIdentityResponse;
};

const DEFAULT_PROVIDER = {
  id: 'guest',
  title: 'Guest',
  icon: () => null,
};

/**
 * Implements a guest auth flow.
 *
 * @public
 */
export default class GuestAuth
  implements ProfileInfoApi, BackstageIdentityApi, SessionApi
{
  static create(options: AuthApiCreateOptions) {
    const {
      discoveryApi,
      environment = 'development',
      provider = DEFAULT_PROVIDER,
    } = options;

    const connector = new DirectAuthConnector<GuestSession>({
      discoveryApi,
      environment,
      provider,
    });

    const sessionManager = new RefreshingAuthSessionManager<GuestSession>({
      connector,
      defaultScopes: new Set([]),
      sessionScopes: (_: GuestSession) => new Set<string>(),
      sessionShouldRefresh: (session: GuestSession) => {
        let min = Infinity;
        if (session.backstageIdentity?.expiresAt) {
          min = Math.min(
            min,
            (session.backstageIdentity.expiresAt.getTime() - Date.now()) / 1000,
          );
        }
        return min < 60 * 5;
      },
    });

    return new GuestAuth({ sessionManager });
  }

  sessionState$(): Observable<SessionState> {
    return this.sessionManager.sessionState$();
  }

  private readonly sessionManager: SessionManager<GuestSession>;

  private constructor(options: {
    sessionManager: SessionManager<GuestSession>;
  }) {
    this.sessionManager = options.sessionManager;
  }

  async signIn() {
    await this.getBackstageIdentity({});
  }
  async signOut() {
    await this.sessionManager.removeSession();
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
}
