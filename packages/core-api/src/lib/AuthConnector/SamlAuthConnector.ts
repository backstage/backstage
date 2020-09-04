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
import {
  AuthProvider,
  ProfileInfo,
  BackstageIdentity,
} from '../../apis/definitions';
import { AuthConnector } from './types';
import { showLoginPopup } from '../loginPopup';

const DEFAULT_BASE_PATH = '/api/auth';

type Options = {
  apiOrigin?: string;
  basePath?: string;
  environment?: string;
  provider: AuthProvider & { id: string };
};

export type SamlResponse = {
  userId: string;
  profile: ProfileInfo;
  backstageIdentity: BackstageIdentity;
};

export class SamlAuthConnector<SamlResponse> implements AuthConnector<SamlResponse> {
  private readonly apiOrigin: string;
  private readonly basePath: string;
  private readonly environment: string | undefined;
  private readonly provider: AuthProvider & { id: string };

  constructor(options: Options) {
    const {
      apiOrigin = window.location.origin,
      basePath = DEFAULT_BASE_PATH,
      environment,
      provider,
    } = options;

    this.apiOrigin = apiOrigin;
    this.basePath = basePath;
    this.environment = environment;
    this.provider = provider;
  }

  async createSession(): Promise<SamlResponse> {
    // eslint-disable-next-line no-console
    console.log('==> from SamlAuthConnector createSession');

    const payload = await showLoginPopup({
      url: 'http://localhost:7000/auth/saml/start', // FIXME: this should be from app.config or somewhere
      name: 'SAML Login', // FIXME: change this to provider name? and not hardcode the name
      origin: this.apiOrigin,
      width: 450,
      height: 730,
    });

    // eslint-disable-next-line no-console
    console.log(payload);

    return {
      ...payload,
      id: payload.profile.email,
    };
  }

  // TODO: do we need this for SAML?
  async refreshSession(): Promise<any> {
    // eslint-disable-next-line no-console
    console.log('==> this is refresh session');
  }

  async removeSession(): Promise<void> {
    // eslint-disable-next-line no-console
    console.log('this removes the session');
    const res = await fetch('http://localhost:7000/auth/saml/logout', {
      method: 'POST',
      headers: {
        'x-requested-with': 'XMLHttpRequest',
      },
      credentials: 'include',
    }).catch(error => {
      throw new Error(`Logout request failed, ${error}`);
    });

    if (!res.ok) {
      const error: any = new Error(`Logout request failed, ${res.statusText}`);
      error.status = res.status;
      throw error;
    }
  }
}
