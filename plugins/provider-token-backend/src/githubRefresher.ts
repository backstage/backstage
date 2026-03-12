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

import type { RootConfigService } from '@backstage/backend-plugin-api';
import type {
  ProviderTokenRefresher,
  RefreshResult,
} from './ProviderTokenRefresher';

/**
 * GitHub token refresh via https://github.com/login/oauth/access_token
 * Note: Standard GitHub OAuth tokens do not expire (no refresh needed).
 * GitHub Apps use fine-grained tokens with expiry — this refresher handles that case.
 * Reads clientId + clientSecret from auth.providers.github.development.
 */
export function createGithubRefresher(
  config: RootConfigService,
): ProviderTokenRefresher {
  const env = config.getOptionalString('auth.environment') ?? 'development';
  const ghConfig = config.getConfig(`auth.providers.github.${env}`);
  const clientId = ghConfig.getString('clientId');
  const clientSecret = ghConfig.getString('clientSecret');

  return {
    providerId: 'github',
    async refresh(refreshToken: string): Promise<RefreshResult> {
      const body = new URLSearchParams({
        grant_type: 'refresh_token',
        client_id: clientId,
        client_secret: clientSecret,
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
        },
      );

      if (!response.ok) {
        throw new Error(
          `GitHub token refresh failed with status ${response.status}`,
        );
      }

      const data = await response.json();
      if (data.error) {
        throw new Error(
          `GitHub token refresh error: ${data.error_description ?? data.error}`,
        );
      }

      return {
        accessToken: data.access_token,
        refreshToken: data.refresh_token,
        expiresInSeconds: data.expires_in,
        scope: data.scope,
      };
    },
  };
}
