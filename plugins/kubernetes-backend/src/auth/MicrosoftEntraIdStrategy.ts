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
  AccessToken,
  ClientSecretCredential,
  TokenCredential,
} from '@azure/identity';
import { Config } from '@backstage/config';
import {
  AuthenticationStrategy,
  AuthMetadata,
  ClusterDetails,
  KubernetesCredential,
} from '@backstage/plugin-kubernetes-node';
import { ANNOTATION_KUBERNETES_MICROSOFT_ENTRA_ID_SCOPE } from '@backstage/plugin-kubernetes-common';
import { LoggerService } from '@backstage/backend-plugin-api';

const env = process.env.NODE_ENV || 'development';

/**
 *
 * @public
 */
export type MicrosoftEntraIdStrategyOptions = {
  config: Config;
};

/**
 *
 * @public
 */
export class MicrosoftEntraIdStrategy implements AuthenticationStrategy {
  private accessToken: AccessToken = { token: '', expiresOnTimestamp: 0 };
  private newTokenPromise: Promise<string> | undefined;

  constructor(
    private readonly logger: LoggerService,
    private readonly options: MicrosoftEntraIdStrategyOptions,
    private tokenCredential: TokenCredential,
  ) {}

  public async getCredential(
    clusterDetails: ClusterDetails,
  ): Promise<KubernetesCredential> {
    if (!this.tokenRequiresRefresh()) {
      return { type: 'bearer token', token: this.accessToken.token };
    }

    if (!this.newTokenPromise) {
      this.newTokenPromise = this.fetchNewToken(
        clusterDetails.authMetadata[
          ANNOTATION_KUBERNETES_MICROSOFT_ENTRA_ID_SCOPE
        ],
      );
    }

    return this.newTokenPromise
      ? { type: 'bearer token', token: await this.newTokenPromise }
      : { type: 'anonymous' };
  }

  public validateCluster(): Error[] {
    return [];
  }

  private async fetchNewToken(microsftEntraIdScope: string): Promise<string> {
    try {
      this.logger.info('Fetching new Microsoft Entra ID token');

      this.tokenCredential = new ClientSecretCredential(
        this.options.config.getString(
          `auth.providers.microsoft.${env}.tenantId`,
        ),
        this.options.config.getString(
          `auth.providers.microsoft.${env}.clientId`,
        ),
        this.options.config.getString(
          `auth.providers.microsoft.${env}.clientSecret`,
        ),
      );

      const newAccessToken = await this.tokenCredential.getToken(
        microsftEntraIdScope,
        {
          requestOptions: { timeout: 10_000 }, // 10 seconds
        },
      );
      if (!newAccessToken) {
        throw new Error('AccessToken is null');
      }

      this.accessToken = newAccessToken;
    } catch (err: any) {
      this.logger.error('Unable to fetch Microsoft Entran ID token', err);

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
