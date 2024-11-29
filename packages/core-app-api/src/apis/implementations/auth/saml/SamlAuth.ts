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
import {
  AuthSessionStore,
  StaticAuthSessionManager,
} from '../../../../lib/AuthSessionManager';
import { SessionManager } from '../../../../lib/AuthSessionManager/types';
import { AuthApiCreateOptions } from '../types';
import { SamlSession, samlSessionSchema } from './types';

export type SamlAuthResponse = {
  profile: ProfileInfo;
  backstageIdentity: BackstageIdentityResponse;
};

const DEFAULT_PROVIDER = {
  id: 'saml',
  title: 'SAML',
  icon: () => null,
};

/**
 * Implements a general SAML based auth flow.
 *
 * @public
 */
export default class SamlAuth
  implements ProfileInfoApi, BackstageIdentityApi, SessionApi
{
  static create(options: AuthApiCreateOptions) {
    const {
      discoveryApi,
      environment = 'development',
      provider = DEFAULT_PROVIDER,
    } = options;

    const connector = new DirectAuthConnector<SamlSession>({
      discoveryApi,
      environment,
      provider,
    });

    const sessionManager = new StaticAuthSessionManager<SamlSession>({
      connector,
    });

    const authSessionStore = new AuthSessionStore<SamlSession>({
      manager: sessionManager,
      storageKey: `${provider.id}Session`,
      schema: samlSessionSchema,
    });

    return new SamlAuth(authSessionStore);
  }

  sessionState$(): Observable<SessionState> {
    return this.sessionManager.sessionState$();
  }

  private constructor(
    private readonly sessionManager: SessionManager<SamlSession>,
  ) {}

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
