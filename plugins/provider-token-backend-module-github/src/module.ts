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
  createBackendModule,
  coreServices,
} from '@backstage/backend-plugin-api';
import {
  providerTokenRefresherExtensionPoint,
  OAuthPermanentError,
  type ProviderTokenRefresher,
  type RefreshResult,
} from '@devhub/plugin-provider-token-node';

/** Shape of a successful or error response from GitHub's token endpoint. */
interface GithubTokenResponse {
  access_token?: string;
  refresh_token?: string;
  expires_in?: number;
  refresh_token_expires_in?: number;
  scope?: string;
  token_type?: string;
  error?: string;
  error_description?: string;
  error_uri?: string;
}

/**
 * GitHub OAuth token refresher.
 * Calls https://github.com/login/oauth/access_token with grant_type=refresh_token.
 * Note: Standard GitHub OAuth tokens do not expire. This refresher handles GitHub Apps
 * with fine-grained expiring tokens.
 *
 * SECURITY: Never logs token values or includes them in Error messages.
 * @public
 */
export class GithubTokenRefresher implements ProviderTokenRefresher {
  readonly providerId = 'github';

  constructor(
    private readonly clientId: string,
    private readonly clientSecret: string,
  ) {}

  async refresh(refreshToken: string): Promise<RefreshResult> {
    const body = new URLSearchParams({
      grant_type: 'refresh_token',
      client_id: this.clientId,
      client_secret: this.clientSecret,
      refresh_token: refreshToken,
    });

    const response = await fetch(
      'https://github.com/login/oauth/access_token',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          Accept: 'application/json',
        },
        body: body.toString(),
        signal: AbortSignal.timeout(15_000),
      },
    );

    if (!response.ok) {
      throw new Error(
        `GitHub token refresh failed with status ${response.status}`,
      );
    }

    const data = (await response.json()) as GithubTokenResponse;

    if (data.error) {
      // Sanitize provider-controlled string: strip control characters, limit length
      const desc = String(data.error_description ?? data.error)
        .slice(0, 200)
        .replace(/[\r\n\t]/g, ' ');

      if (data.error === 'invalid_grant') {
        // Refresh token is permanently invalid — signal DefaultProviderTokenService
        // to delete the stale row and stop retrying.
        throw new OAuthPermanentError(`GitHub token refresh error: ${desc}`);
      }
      throw new Error(`GitHub token refresh error: ${desc}`);
    }

    if (!data.access_token) {
      throw new Error('GitHub token refresh returned no access_token');
    }

    return {
      accessToken: data.access_token,
      refreshToken: data.refresh_token,
      expiresInSeconds: data.expires_in,
      scope: data.scope,
    };
  }
}

/**
 * Registers the GitHub OAuth token refresher with the provider-token plugin.
 * Reads clientId + clientSecret from auth.providers.github.{env}.
 *
 * @public
 */
export const providerTokenGithubModule = createBackendModule({
  pluginId: 'provider-token',
  moduleId: 'github-refresher',
  register(env) {
    env.registerInit({
      deps: {
        refresherExtensionPoint: providerTokenRefresherExtensionPoint,
        config: coreServices.rootConfig,
      },
      async init({ refresherExtensionPoint, config }) {
        const authEnv =
          config.getOptionalString('auth.environment') ?? 'development';
        const ghConfig = config.getConfig(`auth.providers.github.${authEnv}`);
        const clientId = ghConfig.getString('clientId');
        const clientSecret = ghConfig.getString('clientSecret');

        refresherExtensionPoint.addRefresher(
          new GithubTokenRefresher(clientId, clientSecret),
        );
      },
    });
  },
});
