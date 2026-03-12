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
 * Microsoft token refresh via https://login.microsoftonline.com/<tenantId>/oauth2/v2.0/token
 * Reads clientId, clientSecret, tenantId from auth.providers.microsoft.development.
 */
export function createMicrosoftRefresher(
  config: RootConfigService,
): ProviderTokenRefresher {
  const env = config.getOptionalString('auth.environment') ?? 'development';
  const msConfig = config.getConfig(`auth.providers.microsoft.${env}`);
  const clientId = msConfig.getString('clientId');
  const clientSecret = msConfig.getString('clientSecret');
  const tenantId = msConfig.getString('tenantId');

  return {
    providerId: 'microsoft',
    async refresh(refreshToken: string): Promise<RefreshResult> {
      // Omit `scope` on refresh — Microsoft re-issues the original consented scopes.
      // Hardcoding a scope string risks AADSTS70011 if the app registration differs.
      const body = new URLSearchParams({
        grant_type: 'refresh_token',
        client_id: clientId,
        client_secret: clientSecret,
        refresh_token: refreshToken,
      });

      const response = await fetch(
        `https://login.microsoftonline.com/${encodeURIComponent(
          tenantId,
        )}/oauth2/v2.0/token`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: body.toString(),
        },
      );

      if (!response.ok) {
        throw new Error(
          `Microsoft token refresh failed with status ${response.status}`,
        );
      }

      const data = await response.json();
      return {
        accessToken: data.access_token,
        refreshToken: data.refresh_token,
        expiresInSeconds: data.expires_in,
        scope: data.scope,
      };
    },
  };
}
