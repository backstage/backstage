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

import { AuthRequester } from '../../..';
import { OAuthRequestApi, AuthProvider } from '../../../definitions';
import { showLoginPopup } from '../loginPopup';

const DEFAULT_BASE_PATH = '/api/auth/';

type Options<AuthSession> = {
  apiOrigin?: string;
  basePath?: string;
  providerPath: string;
  environment: string;
  provider: AuthProvider;
  oauthRequestApi: OAuthRequestApi;
  sessionTransform?(response: any): AuthSession | Promise<AuthSession>;
};

export type GenericAuthHelper<AuthSession> = {
  refreshSession(): Promise<AuthSession>;
  removeSession(): Promise<void>;
  createSession(scopes: Set<string>): Promise<AuthSession>;
};

export class AuthHelper<AuthSession> implements AuthHelper<AuthSession> {
  private readonly apiOrigin: string;
  private readonly basePath: string;
  private readonly providerPath: string;
  private readonly environment: string;
  private readonly provider: AuthProvider;
  private readonly authRequester: AuthRequester<AuthSession>;
  private readonly sessionTransform: (response: any) => Promise<AuthSession>;

  private refreshPromise?: Promise<AuthSession>;

  constructor(options: Options<AuthSession>) {
    const {
      apiOrigin = window.location.origin,
      basePath = DEFAULT_BASE_PATH,
      providerPath,
      environment,
      provider,
      oauthRequestApi,
      sessionTransform = id => id,
    } = options;

    this.authRequester = oauthRequestApi.createAuthRequester({
      provider,
      onAuthRequest: scopes => this.showPopup([...scopes].join(' ')),
    });

    this.apiOrigin = apiOrigin;
    this.basePath = basePath;
    this.providerPath = providerPath;
    this.environment = environment;
    this.provider = provider;
    this.sessionTransform = sessionTransform;
  }

  async refreshSession(): Promise<AuthSession> {
    if (this.refreshPromise) {
      return this.refreshPromise;
    }

    this.refreshPromise = this.doAuthRefresh();

    try {
      return await this.refreshPromise;
    } finally {
      delete this.refreshPromise;
    }
  }

  private async doAuthRefresh(): Promise<any> {
    const res = await fetch(this.buildUrl('/token', { optional: true }), {
      headers: {
        'x-requested-with': 'XMLHttpRequest',
      },
      credentials: 'include',
    }).catch(error => {
      throw new Error(`Auth refresh request failed, ${error}`);
    });

    if (!res.ok) {
      const error: any = new Error(
        `Auth refresh request failed with status ${res.statusText}`,
      );
      error.status = res.status;
      throw error;
    }

    const authInfo = await res.json();

    if (authInfo.error) {
      const error = new Error(authInfo.error.message);
      if (authInfo.error.name) {
        error.name = authInfo.error.name;
      }
      throw error;
    }
    return await this.sessionTransform(authInfo);
  }

  async removeSession(): Promise<void> {
    const res = await fetch(this.buildUrl('/logout'), {
      method: 'POST',
      headers: {
        'x-requested-with': 'XMLHttpRequest',
      },
      credentials: 'include',
    });

    if (!res.ok) {
      throw new Error(`Logout request failed with status ${res.status}`);
    }
  }

  async createSession(scopes: Set<string>): Promise<AuthSession> {
    return this.authRequester(scopes);
  }

  private async showPopup(scope: string): Promise<AuthSession> {
    const popupUrl = this.buildUrl('/start', { scope });

    const payload = await showLoginPopup({
      url: popupUrl,
      name: `${this.provider.title} Login`,
      origin: this.apiOrigin,
      width: 450,
      height: 730,
    });

    return await this.sessionTransform(payload);
  }

  private buildUrl(
    path: string,
    query?: { [key: string]: string | boolean | undefined },
  ): string {
    const queryString = this.buildQueryString({
      ...query,
      env: this.environment,
    });

    return `${this.apiOrigin}${this.basePath}${this.providerPath}${path}${queryString}`;
  }

  private buildQueryString(query?: {
    [key: string]: string | boolean | undefined;
  }): string {
    if (!query) {
      return '';
    }

    const queryString = Object.entries<string | boolean | undefined>(query)
      .map(([key, value]) => {
        if (typeof value === 'string') {
          return `${encodeURIComponent(key)}=${encodeURIComponent(value)}`;
        } else if (value) {
          return encodeURIComponent(key);
        }
        return undefined;
      })
      .filter(Boolean)
      .join('&');

    if (!queryString) {
      return '';
    }
    return `?${queryString}`;
  }
}
