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

import { Logger } from 'winston';
import {
  AccessToken,
  DefaultAzureCredential,
  TokenCredential,
} from '@azure/identity';
import {
  AuthMetadata,
  AuthenticationStrategy,
  KubernetesCredential,
} from '@backstage/plugin-kubernetes-node';

const aksScope = '6dae42f8-4368-4678-94ff-3960e28e3630/.default'; // This scope is the same for all Azure Managed Kubernetes

/**
 *
 * @public
 */
export class AzureIdentityStrategy implements AuthenticationStrategy {
  private accessToken: AccessToken = { token: '', expiresOnTimestamp: 0 };
  private newTokenPromise: Promise<string> | undefined;

  constructor(
    private readonly logger: Logger,
    private readonly tokenCredential: TokenCredential = new DefaultAzureCredential(),
  ) {}

  public async getCredential(): Promise<KubernetesCredential> {
    if (!this.tokenRequiresRefresh()) {
      return { type: 'bearer token', token: this.accessToken.token };
    }

    if (!this.newTokenPromise) {
      this.newTokenPromise = this.fetchNewToken();
    }

    return this.newTokenPromise
      ? { type: 'bearer token', token: await this.newTokenPromise }
      : { type: 'anonymous' };
  }

  public validateCluster(): Error[] {
    return [];
  }

  private async fetchNewToken(): Promise<string> {
    try {
      this.logger.info('Fetching new Azure token for AKS');

      const newAccessToken = await this.tokenCredential.getToken(aksScope, {
        requestOptions: { timeout: 10_000 }, // 10 seconds
      });
      if (!newAccessToken) {
        throw new Error('AccessToken is null');
      }

      this.accessToken = newAccessToken;
    } catch (err) {
      this.logger.error('Unable to fetch Azure token', err);

      // only throw the error if the token has already expired, otherwise re-use existing until we're able to fetch a new token
      if (this.tokenExpired()) {
        throw err;
      }
    }

    this.newTokenPromise = undefined;
    return this.accessToken.token;
  }

  private tokenRequiresRefresh(): boolean {
    // Set tokens to expire 15 minutes before its actual expiry time
    const expiresOn = this.accessToken.expiresOnTimestamp - 15 * 60 * 1000;
    return Date.now() >= expiresOn;
  }

  private tokenExpired(): boolean {
    return Date.now() >= this.accessToken.expiresOnTimestamp;
  }

  public presentAuthMetadata(_authMetadata: AuthMetadata): AuthMetadata {
    return {};
  }
}
