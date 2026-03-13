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

/** Shape of a successful or error response from Microsoft's token endpoint. */
interface MicrosoftTokenResponse {
  access_token?: string;
  refresh_token?: string;
  expires_in?: number;
  scope?: string;
  token_type?: string;
  error?: string;
  error_description?: string;
  error_codes?: number[];
  correlation_id?: string;
}

/**
 * Microsoft OAuth token refresher.
 * Calls https://login.microsoftonline.com/{tenantId}/oauth2/v2.0/token.
 * Omits scope on refresh — Microsoft re-issues the original consented scopes.
 * Hardcoding a scope string risks AADSTS70011 if the app registration differs.
 *
 * SECURITY: Never logs token values or includes them in Error messages.
 * @public
 */
export class MicrosoftTokenRefresher implements ProviderTokenRefresher {
  readonly providerId = 'microsoft';

  constructor(
    private readonly clientId: string,
    private readonly clientSecret: string,
    private readonly tenantId: string,
  ) {}

  async refresh(refreshToken: string): Promise<RefreshResult> {
    const body = new URLSearchParams({
      grant_type: 'refresh_token',
      client_id: this.clientId,
      client_secret: this.clientSecret,
      refresh_token: refreshToken,
    });

    const response = await fetch(
      `https://login.microsoftonline.com/${encodeURIComponent(
        this.tenantId,
      )}/oauth2/v2.0/token`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: body.toString(),
        signal: AbortSignal.timeout(15_000),
      },
    );

    if (!response.ok) {
      throw new Error(
        `Microsoft token refresh failed with status ${response.status}`,
      );
    }

    const data = (await response.json()) as MicrosoftTokenResponse;

    // Microsoft can return HTTP 200 with {"error": "invalid_grant"} for conditional access, revoked tokens, etc.
    if (data.error) {
      // Sanitize provider-controlled string: strip control characters, limit length
      const desc = String(data.error_description ?? data.error)
        .slice(0, 200)
        .replace(/[\r\n\t]/g, ' ');

      if (data.error === 'invalid_grant') {
        // Refresh token is permanently invalid — signal DefaultProviderTokenService
        // to delete the stale row and stop retrying.
        throw new OAuthPermanentError(`Microsoft token refresh error: ${desc}`);
      }
      throw new Error(`Microsoft token refresh error: ${desc}`);
    }

    if (!data.access_token) {
      throw new Error('Microsoft token refresh returned no access_token');
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
 * Registers the Microsoft OAuth token refresher with the provider-token plugin.
 * Reads clientId, clientSecret, tenantId from auth.providers.microsoft.{env}.
 *
 * @public
 */
export const providerTokenMicrosoftModule = createBackendModule({
  pluginId: 'provider-token',
  moduleId: 'microsoft-refresher',
  register(env) {
    env.registerInit({
      deps: {
        refresherExtensionPoint: providerTokenRefresherExtensionPoint,
        config: coreServices.rootConfig,
      },
      async init({ refresherExtensionPoint, config }) {
        const authEnv =
          config.getOptionalString('auth.environment') ?? 'development';
        const msConfig = config.getConfig(
          `auth.providers.microsoft.${authEnv}`,
        );
        const clientId = msConfig.getString('clientId');
        const clientSecret = msConfig.getString('clientSecret');
        const tenantId = msConfig.getString('tenantId');

        refresherExtensionPoint.addRefresher(
          new MicrosoftTokenRefresher(clientId, clientSecret, tenantId),
        );
      },
    });
  },
});
