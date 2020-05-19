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

import GoogleIcon from '@material-ui/icons/AcUnit';
import GoogleScopes from './GoogleScopes';
import { GoogleSession } from './types';
import { AuthRequester, OAuthRequestApi } from '../../..';

const API_PATH = '/api/backend/auth';

type Options = {
  apiOrigin: string;
  dev: boolean;
};

export type GoogleAuthResponse = {
  accessToken: string;
  idToken: string;
  scopes: string;
  expiresInSeconds: number;
};

export type AuthHelper = {
  refreshSession(): Promise<GoogleSession>;
  removeSession(): Promise<void>;
  createSession(scope: string): Promise<GoogleSession>;
};

class GoogleAuthHelper implements AuthHelper {
  private readonly authRequester: AuthRequester<GoogleSession>;
  private refreshPromise?: Promise<GoogleSession>;

  static create(oauthRequest: OAuthRequestApi) {
    return new GoogleAuthHelper(
      {
        apiOrigin: window.location.origin,
        dev: process.env.NODE_ENV === 'development',
      },
      oauthRequest,
    );
  }

  constructor(
    private readonly options: Options,
    private readonly oauth: OAuthRequestApi,
  ) {
    this.authRequester = oauth.createAuthRequester({
      provider: {
        title: 'Google',
        icon: GoogleIcon,
      },
      onAuthRequest: (scopes) => this.showPopup(scopes.toString()),
    });
  }

  async refreshSession(): Promise<GoogleSession> {
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
    }).catch((error) => {
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
    return GoogleAuthHelper.convertAuthInfo(authInfo);
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

  async createSession(scope: string): Promise<GoogleSession> {
    return this.authRequester(GoogleScopes.from(scope));
  }

  private async showPopup(scope: string): Promise<GoogleSession> {
    const popupUrl = this.buildUrl('/start', { scope });

    const payload = await this.oauth.showLoginPopup({
      url: popupUrl,
      name: 'google-login',
      origin: this.options.apiOrigin,
      width: 450,
      height: 730,
    });

    return GoogleAuthHelper.convertAuthInfo(payload);
  }

  private buildUrl(
    path: string,
    query?: { [key: string]: string | boolean | undefined },
  ): string {
    const queryString = this.buildQueryString({
      ...query,
      dev: this.options.dev,
    });

    return `${this.options.apiOrigin}${API_PATH}${path}${queryString}`;
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

  private static convertAuthInfo(authInfo: GoogleAuthResponse): GoogleSession {
    return {
      idToken: authInfo.idToken,
      accessToken: authInfo.accessToken,
      scopes: GoogleScopes.from(authInfo.scopes),
      expiresAt: new Date(Date.now() + authInfo.expiresInSeconds * 1000),
    };
  }
}

export default GoogleAuthHelper;
