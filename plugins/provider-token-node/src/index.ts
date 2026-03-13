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
  createExtensionPoint,
  createServiceRef,
} from '@backstage/backend-plugin-api';

/**
 * Result of a provider-specific token refresh operation.
 * @public
 */
export interface RefreshResult {
  accessToken: string;
  /** Provider may or may not rotate the refresh token. If absent, keep the existing token. */
  refreshToken?: string;
  expiresInSeconds?: number;
  /** Scope may not be returned by all providers on refresh. */
  scope?: string;
}

/**
 * Provider-specific OAuth token refresh logic.
 * One implementation per OAuth provider.
 *
 * SECURITY: Implementations MUST NOT log token values or include them in Error messages.
 *
 * @public
 */
export interface ProviderTokenRefresher {
  readonly providerId: string;
  refresh(refreshToken: string): Promise<RefreshResult>;
}

/**
 * Session data provided at sign-in time. Used as input to upsertToken.
 * Includes the refresh token because sign-in resolvers have access to it.
 * Action handlers should use ProviderToken (returned by getToken), which omits the refresh token.
 *
 * @public
 */
export interface ProviderTokenSession {
  accessToken: string;
  refreshToken?: string;
  scope?: string;
  expiresInSeconds?: number;
}

/**
 * Token record returned to action callers by getToken.
 * Always valid (non-expired) when returned.
 *
 * SECURITY: Intentionally does NOT expose refreshToken — action handlers only need the
 * access token. Exposing the refresh token would allow accidental exfiltration via logs
 * or serialized outputs.
 *
 * @public
 */
export interface ProviderToken {
  userEntityRef: string;
  providerId: string;
  /** Decrypted, valid access token. */
  accessToken: string;
  /** Decrypted scope string. */
  scope?: string;
  expiresAt?: Date;
}

/**
 * Thrown by a ProviderTokenRefresher when the refresh token is permanently invalid
 * (e.g. invalid_grant, token revoked, user de-authorized the app).
 * DefaultProviderTokenService catches this and deletes the stale token row to prevent
 * an infinite retry loop on every subsequent getToken call.
 *
 * @public
 */
export class OAuthPermanentError extends Error {
  readonly isPermanent = true as const;

  constructor(message: string) {
    super(message);
    this.name = 'OAuthPermanentError';
  }
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
    session: ProviderTokenSession,
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
   * - Refresh attempt fails (transient or permanent)
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
 * Extension point interface for registering OAuth token refreshers.
 *
 * @public
 */
export interface ProviderTokenRefresherExtensionPoint {
  addRefresher(refresher: ProviderTokenRefresher): void;
}

/**
 * Extension point for registering OAuth token refreshers with the provider-token plugin.
 * Modules use this to register provider-specific refresh logic.
 *
 * @public
 */
export const providerTokenRefresherExtensionPoint =
  createExtensionPoint<ProviderTokenRefresherExtensionPoint>({
    id: 'provider-token.refresher',
  });

/**
 * ServiceRef for ProviderTokenService.
 * Plugin-scoped — each plugin that injects this gets an instance backed by the shared DB.
 * Requires the provider-token-backend plugin to be registered in the backend.
 *
 * @public
 */
export const providerTokenServiceRef = createServiceRef<ProviderTokenService>({
  id: 'devhub.provider-token',
  scope: 'plugin',
});
