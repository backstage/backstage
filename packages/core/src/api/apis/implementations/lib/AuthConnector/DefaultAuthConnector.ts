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
import { AuthConnector } from './types';

const DEFAULT_BASE_PATH = '/api/auth/';

type Options<AuthSession> = {
  /**
   * Origin of auth requests, defaults to location.origin
   */
  apiOrigin?: string;
  /**
   * Base path of the auth requests, defaults to /api/auth/
   */
  basePath?: string;
  /**
   * Environment hint passed on to auth backend, for example 'production' or 'development'
   */
  environment: string;
  /**
   * Information about the auth provider to be shown to the user.
   * The ID Must match the backend auth plugin configuration, for example 'google'.
   */
  provider: AuthProvider & { id: string };
  /**
   * API used to instantiate an auth requester.
   */
  oauthRequestApi: OAuthRequestApi;
  /**
   * Function used to join together a set of scopes, defaults to joining with a space character.
   */
  joinScopes?: (scopes: Set<string>) => string;
  /**
   * Function used to transform an auth response into the session type.
   */
  sessionTransform?(response: any): AuthSession | Promise<AuthSession>;
};

function defaultJoinScopes(scopes: Set<string>) {
  return [...scopes].join(' ');
}

/**
 * DefaultAuthConnector is the default auth connector in Backstage. It talks to the
 * backend auth plugin through the standardized API, and requests user permission
 * via the OAuthRequestApi.
 */
export class DefaultAuthConnector<AuthSession>
  implements AuthConnector<AuthSession> {
  private readonly apiOrigin: string;
  private readonly basePath: string;
  private readonly environment: string;
  private readonly provider: AuthProvider & { id: string };
  private readonly authRequester: AuthRequester<AuthSession>;
  private readonly sessionTransform: (response: any) => Promise<AuthSession>;

  constructor(options: Options<AuthSession>) {
    const {
      apiOrigin = window.location.origin,
      basePath = DEFAULT_BASE_PATH,
      environment,
      provider,
      joinScopes = defaultJoinScopes,
      oauthRequestApi,
      sessionTransform = id => id,
    } = options;

    this.authRequester = oauthRequestApi.createAuthRequester({
      provider,
      onAuthRequest: scopes => this.showPopup(joinScopes(scopes)),
    });

    this.apiOrigin = apiOrigin;
    this.basePath = basePath;
    this.environment = environment;
    this.provider = provider;
    this.sessionTransform = sessionTransform;
  }

  async createSession(scopes: Set<string>): Promise<AuthSession> {
    return this.authRequester(scopes);
  }

  async refreshSession(): Promise<any> {
    const res = await fetch(this.buildUrl('/refresh', { optional: true }), {
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

    return `${this.apiOrigin}${this.basePath}${this.provider.id}${path}${queryString}`;
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
