/*
 * Copyright 2023 The Backstage Authors
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
import { DiscoveryApi, FetchApi } from '@backstage/core-plugin-api';

interface AccessToken {
  token: string;
  expiresOnTimestamp: number;
}

export class AccessTokenManager {
  private accessToken: AccessToken = { token: '', expiresOnTimestamp: 0 };
  private newTokenPromise: Promise<string> | undefined;

  constructor(private discoveryApi: DiscoveryApi, private fetchApi: FetchApi) {}

  public async getToken(): Promise<string> {
    if (!this.tokenRequiresRefresh()) {
      return this.accessToken.token;
    }

    if (!this.newTokenPromise) {
      this.newTokenPromise = this.fetchNewToken();
    }

    return await this.newTokenPromise;
  }

  private async fetchNewToken(): Promise<string> {
    try {
      const apiUrl = await this.discoveryApi.getBaseUrl('hcp-consul-backend');
      const url = `${apiUrl}/oauth/token`;
      const resp = await this.fetchApi.fetch(url);
      const data = await resp.json();
      this.accessToken.token = data.access_token;
      this.accessToken.expiresOnTimestamp = Date.now() + data.expires_in * 1000;
    } catch (err) {
      throw err;
    }

    this.newTokenPromise = undefined;
    return this.accessToken.token;
  }

  private tokenRequiresRefresh(): boolean {
    // Set tokens to expire 5 minutes before its actual expiry time
    const expiresOn = this.accessToken.expiresOnTimestamp - 5 * 60 * 1000;
    return Date.now() >= expiresOn;
  }
}
