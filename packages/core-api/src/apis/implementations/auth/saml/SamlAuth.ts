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

import SamlIcon from '@material-ui/icons/AcUnit';
import { SamlAuthConnector } from '../../../../lib/AuthConnector';
import { SessionManager } from '../../../../lib/AuthSessionManager/types';
import { Observable } from '../../../../types';
import {
  ProfileInfo,
  BackstageIdentity,
  SessionState,
  AuthRequestOptions,
  SamlApi,
} from '../../../definitions/auth';
import { AuthProvider } from '../../../definitions';
import { SamlSession } from './types';
import {
  SamlAuthSessionManager,
  SamlAuthSessionStore,
} from '../../../../lib/AuthSessionManager';

type CreateOptions = {
  apiOrigin: string;
  basePath: string;
  environment?: string;
  provider?: AuthProvider & { id: string };
};

export type SamlAuthResponse = {
  userId: string;
  profile: ProfileInfo;
  backstageIdentity: BackstageIdentity;
};

const DEFAULT_PROVIDER = {
  id: 'saml',
  title: 'SAML',
  icon: SamlIcon,
};

class SamlAuth implements SamlApi {
  static create({
    apiOrigin,
    basePath,
    environment = 'development',
    provider = DEFAULT_PROVIDER,
  }: CreateOptions) {
    const connector = new SamlAuthConnector<SamlSession>({
      apiOrigin,
      basePath,
      environment,
      provider,
    });

    const sessionManager = new SamlAuthSessionManager<SamlSession>({
      connector,
    });

    const authSessionStore = new SamlAuthSessionStore<SamlSession>({
      manager: sessionManager,
      storageKey: 'samlSession',
    });

    // return new SamlAuth(authSessionStore);
    return new SamlAuth(authSessionStore);
  }

  sessionState$(): Observable<SessionState> {
    return this.sessionManager.sessionState$();
  }

  constructor(private readonly sessionManager: SessionManager<SamlSession>) {}

  async getBackstageIdentity(
    options: AuthRequestOptions,
  ): Promise<BackstageIdentity | undefined> {
    const session = await this.sessionManager.getSession(options);
    return session?.backstageIdentity;
  }

  async getProfile(options: AuthRequestOptions = {}) {
    const session = await this.sessionManager.getSession(options);
    return session?.profile;
  }

  // FIXME: Is this needed?...
  async getAccessToken(options: AuthRequestOptions) {
    const session = await this.sessionManager.getSession(options);
    return session?.userId ?? '';
  }

  async logout() {
    await this.sessionManager.removeSession();
  }
}

export default SamlAuth;
