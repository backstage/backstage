/*
 * Copyright 2025 The Backstage Authors
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
import type { KubernetesRequestAuth } from '@backstage/plugin-kubernetes-common';
import { LoggerService } from '@backstage/backend-plugin-api';

interface CachedToken {
  accessToken: AccessToken;
  newTokenPromise: Promise<string> | undefined;
}

const env = process.env.NODE_ENV || 'development';

/**
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
  private tokenCache: Map<string, CachedToken> = new Map();
  private lazyTokenCredential: TokenCredential | undefined;

  constructor(
    private readonly logger: LoggerService,
    private readonly options: MicrosoftEntraIdStrategyOptions,
    private readonly explicitTokenCredential?: TokenCredential,
  ) {}

  private getTokenCredential(): TokenCredential {
    if (this.explicitTokenCredential) {
      return this.explicitTokenCredential;
    }
    if (!this.lazyTokenCredential) {
      this.lazyTokenCredential = new ClientSecretCredential(
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
    }
    return this.lazyTokenCredential;
  }

  public async getCredential(
    clusterDetails: ClusterDetails,
    _authConfig?: KubernetesRequestAuth,
  ): Promise<KubernetesCredential> {
    const scope = this.resolveScope(clusterDetails);
    const cached = this.getOrCreateCacheEntry(scope);

    if (!this.tokenRequiresRefresh(cached)) {
      return { type: 'bearer token', token: cached.accessToken.token };
    }

    if (!cached.newTokenPromise) {
      cached.newTokenPromise = this.fetchNewToken(scope, cached);
    }

    return cached.newTokenPromise
      ? { type: 'bearer token', token: await cached.newTokenPromise }
      : { type: 'anonymous' };
  }

  public validateCluster(): Error[] {
    return [];
  }

  private resolveScope(clusterDetails: ClusterDetails): string {
    const annotation =
      clusterDetails.authMetadata[
        ANNOTATION_KUBERNETES_MICROSOFT_ENTRA_ID_SCOPE
      ];
    if (annotation && annotation.length > 0) {
      return annotation;
    }
    return this.options.config.getString(
      `kubernetes.auth.providers.microsoft.${env}.scope`,
    );
  }

  private getOrCreateCacheEntry(scope: string): CachedToken {
    let cached = this.tokenCache.get(scope);
    if (!cached) {
      cached = {
        accessToken: { token: '', expiresOnTimestamp: 0 },
        newTokenPromise: undefined,
      };
      this.tokenCache.set(scope, cached);
    }
    return cached;
  }

  private async fetchNewToken(
    scope: string,
    cached: CachedToken,
  ): Promise<string> {
    try {
      this.logger.info('Fetching new Microsoft Entra ID token');

      const newAccessToken = await this.getTokenCredential().getToken(scope, {
        requestOptions: { timeout: 10_000 }, // 10 seconds
      });
      if (!newAccessToken) {
        throw new Error('AccessToken is null');
      }

      cached.accessToken = newAccessToken;
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      this.logger.error('Unable to fetch Microsoft Entra ID token', error);

      // only throw the error if the token has already expired, otherwise re-use existing until we're able to fetch a new token
      if (this.tokenExpired(cached)) {
        throw err;
      }
    } finally {
      cached.newTokenPromise = undefined;
    }

    return cached.accessToken.token;
  }

  private tokenRequiresRefresh(cached: CachedToken): boolean {
    // Set tokens to expire 15 minutes before its actual expiry time
    const expiresOn = cached.accessToken.expiresOnTimestamp - 15 * 60 * 1000;
    return Date.now() >= expiresOn;
  }

  private tokenExpired(cached: CachedToken): boolean {
    return Date.now() >= cached.accessToken.expiresOnTimestamp;
  }

  public presentAuthMetadata(_authMetadata: AuthMetadata): AuthMetadata {
    return {};
  }
}
