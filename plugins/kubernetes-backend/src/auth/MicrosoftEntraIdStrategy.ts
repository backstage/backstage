/*
 * Copyright 2026 The Backstage Authors
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
import { hostnameMatchesPattern } from '../cluster-locator/validateClusterApiServerUrl';

interface CachedToken {
  accessToken: AccessToken;
  newTokenPromise: Promise<string> | undefined;
}

/**
 * @public
 */
export type MicrosoftEntraIdStrategyOptions = {
  config: Config;
};

/**
 * Authenticates to Kubernetes clusters with a Microsoft Entra ID application
 * token, issued only for scope and hostname pairs listed in `allowedScopes`.
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
      const prefix = this.getConfigPrefix();
      this.lazyTokenCredential = new ClientSecretCredential(
        this.options.config.getString(`${prefix}.tenantId`),
        this.options.config.getString(`${prefix}.clientId`),
        this.options.config.getString(`${prefix}.clientSecret`),
      );
    }
    return this.lazyTokenCredential;
  }

  public async getCredential(
    clusterDetails: ClusterDetails,
    _authConfig?: KubernetesRequestAuth,
  ): Promise<KubernetesCredential> {
    const scope = this.resolveScope(clusterDetails);
    this.assertScopeAllowedForCluster(scope, clusterDetails.url);
    const cached = this.getOrCreateCacheEntry(scope);

    if (!this.tokenRequiresRefresh(cached)) {
      return { type: 'bearer token', token: cached.accessToken.token };
    }

    if (!cached.newTokenPromise) {
      cached.newTokenPromise = Promise.resolve().then(() =>
        this.fetchNewToken(scope, cached),
      );
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
      return this.validateScope(annotation, 'annotation');
    }
    const key = `${this.getConfigPrefix()}.scope`;
    return this.validateScope(
      this.options.config.getString(key),
      `config key '${key}'`,
    );
  }
  private getConfigPrefix(): string {
    const env =
      this.options.config.getOptionalString('kubernetes.auth.environment') ??
      'development';
    return `kubernetes.auth.providers.microsoft.${env}`;
  }
  /** Security check: send tokens only to trusted hosts for allowed scopes. */
  private assertScopeAllowedForCluster(
    scope: string,
    clusterUrl: string,
  ): void {
    const key = `${this.getConfigPrefix()}.allowedScopes`;
    const entries = this.options.config.getOptionalConfigArray(key);
    if (!entries || entries.length === 0) {
      throw new Error(
        `Refusing to issue a Microsoft Entra ID token: no allowed scopes are configured. ` +
          `Set '${key}' to bind each allowed scope to the cluster hostnames it may be sent to.`,
      );
    }
    let hostname: string;
    try {
      hostname = new URL(clusterUrl).hostname.toLowerCase();
    } catch {
      throw new Error(
        'Refusing to issue a Microsoft Entra ID token: cluster URL is not a valid URL.',
      );
    }
    const allowed = entries.some((entry, i) => {
      const allowedScope = this.validateScope(
        entry.getString('scope'),
        `config key '${key}[${i}].scope'`,
      );
      return (
        allowedScope === scope &&
        entry
          .getStringArray('clusterUrls')
          .some(pattern => hostnameMatchesPattern(hostname, pattern))
      );
    });
    if (!allowed) {
      throw new Error(
        `Refusing to issue a Microsoft Entra ID token: scope '${scope}' is not allowed for cluster host '${hostname}'. ` +
          `Add a matching entry to '${key}'.`,
      );
    }
  }

  /** Accepts only a single resource scope ending in `/.default`. */
  private validateScope(scope: string, source: string): string {
    const trimmed = scope.trim();
    if (!/^[0-9a-zA-Z-_.:/]+\/\.default$/.test(trimmed)) {
      throw new Error(
        `Invalid Microsoft Entra ID scope '${scope}' from ${source}. ` +
          `Expected a single resource scope ending in '/.default', such as 'api://<app-id>/.default', ` +
          `'<app-id>/.default', or 'https://graph.microsoft.com/.default'.`,
      );
    }
    return trimmed;
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
        requestOptions: { timeout: 10_000 },
      });
      if (!newAccessToken) {
        throw new Error('AccessToken is null');
      }

      cached.accessToken = newAccessToken;
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      this.logger.error('Unable to fetch Microsoft Entra ID token', error);

      // Keep serving the cached token until it actually expires.
      if (this.tokenExpired(cached)) {
        throw err;
      }
    } finally {
      cached.newTokenPromise = undefined;
    }

    return cached.accessToken.token;
  }

  private tokenRequiresRefresh(cached: CachedToken): boolean {
    // Refresh 15 minutes before expiry.
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
