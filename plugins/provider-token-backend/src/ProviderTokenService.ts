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

import { createServiceRef } from '@backstage/backend-plugin-api';

/** Opaque token record returned to action callers. Always valid (non-expired) when returned by getToken. */
export interface ProviderToken {
  userEntityRef: string;
  providerId: string;
  /** Decrypted, valid access token. */
  accessToken: string;
  /** Present only if the provider issued a refresh token. */
  refreshToken?: string;
  /** Decrypted scope string. */
  scope?: string;
  expiresAt?: Date;
}

/**
 * Service for persisting and retrieving OAuth provider tokens on behalf of Backstage users.
 * Plugin-scoped: inject via providerTokenServiceRef.
 *
 * SECURITY: This service is backend-only. Token values must never be logged or included in errors.
 *
 * @public
 */
export interface ProviderTokenService {
  /**
   * Upserts (creates or replaces) the provider OAuth session for a user.
   * Call only from sign-in resolver modules — never from action handlers.
   * Throws if encryption or DB write fails (sign-in should be aborted on failure).
   */
  upsertToken(
    userEntityRef: string,
    providerId: string,
    session: {
      accessToken: string;
      refreshToken?: string;
      scope?: string;
      expiresInSeconds?: number;
    },
  ): Promise<void>;

  /**
   * Returns a valid (non-expired) provider token for the user.
   * Auto-refreshes if within refreshBufferSeconds of expiry.
   * Concurrent calls for the same user+provider share one in-flight refresh promise
   * (thundering-herd deduplication).
   *
   * Returns undefined if:
   * - No token stored (user hasn't signed in via this provider)
   * - Token expired with no refresh token
   * - Refresh attempt fails
   */
  getToken(
    userEntityRef: string,
    providerId: string,
  ): Promise<ProviderToken | undefined>;

  /** Deletes all tokens for a user. Call from sign-out handlers. */
  deleteTokens(userEntityRef: string): Promise<void>;

  /** Deletes the token for a specific user + provider. */
  deleteToken(userEntityRef: string, providerId: string): Promise<void>;
}

/**
 * ServiceRef for ProviderTokenService.
 * Plugin-scoped — each plugin that injects this gets an instance backed by the shared DB.
 * Uses defaultFactory so no explicit registration in backend/index.ts is needed.
 *
 * @public
 */
export const providerTokenServiceRef = createServiceRef<ProviderTokenService>({
  id: 'devhub.provider-token',
  scope: 'plugin',
  async defaultFactory(service) {
    const { createProviderTokenServiceFactory } = await import(
      './DefaultProviderTokenService'
    );
    return createProviderTokenServiceFactory(service);
  },
});
