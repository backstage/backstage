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

  // oauthRequestApi?: OAuthRequestApi;

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
    // eslint-disable-next-line no-console
    console.log('this is from SamlAuth');

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
  // constructor(private readonly sessionManager: any) {}
  // eslint-disable-next-line @typescript-eslint/no-useless-constructor
  constructor(private readonly sessionManager: SessionManager<SamlSession>) {
    // eslint-disable-next-line no-console
    console.log('this is the constructor');
  }

  async getBackstageIdentity(
    options: AuthRequestOptions,
  ): Promise<BackstageIdentity | undefined> {
    // eslint-disable-next-line no-console
    console.log('===> Saml getBackstageIdentity()');
    const session = await this.sessionManager.getSession(options);
    // eslint-disable-next-line no-console
    console.log('this this thish lkkdfkkfkfji');
    // eslint-disable-next-line no-console
    console.log(session);
    return session?.backstageIdentity;
  }

  async getProfile(options: AuthRequestOptions = {}) {
    // eslint-disable-next-line no-console
    console.log('==> samlauth getprofile()');
    const session = await this.sessionManager.getSession(options);
    // eslint-disable-next-line no-console
    console.log('+++ this is the session from getProfile()');
    // eslint-disable-next-line no-console
    console.log(session);
    return session?.profile;
  }

  async logout() {
    await this.sessionManager.removeSession();
  }
}

export default SamlAuth;
