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
 * Atlassian token refresh via https://auth.atlassian.com/oauth/token
 * Reads clientId + clientSecret from auth.providers.atlassian.development (or production).
 * Atlassian rotates the refresh token on each use.
 */
export function createAtlassianRefresher(
  config: RootConfigService,
): ProviderTokenRefresher {
  const env = config.getOptionalString('auth.environment') ?? 'development';
  const atlassianConfig = config.getConfig(`auth.providers.atlassian.${env}`);
  const clientId = atlassianConfig.getString('clientId');
  const clientSecret = atlassianConfig.getString('clientSecret');

  return {
    providerId: 'atlassian',
    async refresh(refreshToken: string): Promise<RefreshResult> {
      const body = new URLSearchParams({
        grant_type: 'refresh_token',
        client_id: clientId,
        client_secret: clientSecret,
        refresh_token: refreshToken,
      });

      const response = await fetch('https://auth.atlassian.com/oauth/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: body.toString(),
      });

      if (!response.ok) {
        // Do not include response body — may contain error details with token hints
        throw new Error(
          `Atlassian token refresh failed with status ${response.status}`,
        );
      }

      const data = await response.json();
      // Atlassian can return HTTP 200 with {"error": "invalid_grant"} for revoked refresh tokens
      if (data.error) {
        throw new Error(
          `Atlassian token refresh error: ${
            data.error_description ?? data.error
          }`,
        );
      }
      return {
        accessToken: data.access_token,
        refreshToken: data.refresh_token, // Atlassian always rotates
        expiresInSeconds: data.expires_in,
        scope: data.scope,
      };
    },
  };
}
