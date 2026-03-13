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

import type { LoggerService } from '@backstage/backend-plugin-api';
import type { Knex } from 'knex';
import { encrypt, decrypt } from './crypto';
import type {
  ProviderToken,
  ProviderTokenService,
  ProviderTokenRefresher,
  ProviderTokenSession,
  RefreshResult,
} from '@devhub/plugin-provider-token-node';
import { OAuthPermanentError } from '@devhub/plugin-provider-token-node';

export class DefaultProviderTokenService implements ProviderTokenService {
  /** Prevents concurrent refresh for the same user+provider from double-consuming a refresh token. */
  private readonly refreshLocks = new Map<
    string,
    Promise<ProviderToken | undefined>
  >();

  constructor(
    private readonly db: Knex,
    private readonly encKey: Buffer,
    private readonly refreshers: Map<string, ProviderTokenRefresher>,
    private readonly refreshBufferSeconds: number,
    private readonly logger: LoggerService,
  ) {}

  async upsertToken(
    userEntityRef: string,
    providerId: string,
    session: ProviderTokenSession,
  ): Promise<void> {
    const expiresAt = session.expiresInSeconds
      ? new Date(Date.now() + session.expiresInSeconds * 1000)
      : null;

    await this.db('provider_tokens')
      .insert({
        user_entity_ref: userEntityRef,
        provider_id: providerId,
        access_token: encrypt(session.accessToken, this.encKey),
        refresh_token: session.refreshToken
          ? encrypt(session.refreshToken, this.encKey)
          : null,
        scope: session.scope ? encrypt(session.scope, this.encKey) : null,
        expires_at: expiresAt,
        updated_at: this.db.fn.now(),
      })
      .onConflict(['user_entity_ref', 'provider_id'])
      .merge([
        'access_token',
        'refresh_token',
        'scope',
        'expires_at',
        'updated_at',
      ]);

    // Audit log — no token values, no scope values
    this.logger.info('Provider token stored', {
      userEntityRef,
      providerId,
      hasRefreshToken: !!session.refreshToken,
      expiresAt: expiresAt?.toISOString() ?? 'none',
    });
  }

  async getToken(
    userEntityRef: string,
    providerId: string,
  ): Promise<ProviderToken | undefined> {
    const row = await this.db('provider_tokens')
      .where({ user_entity_ref: userEntityRef, provider_id: providerId })
      .first();

    if (!row) {
      this.logger.debug('No provider token found', {
        userEntityRef,
        providerId,
      });
      return undefined;
    }

    const expiresAt = row.expires_at ? new Date(row.expires_at) : undefined;
    const expiryBufferMs = this.refreshBufferSeconds * 1000;
    const isNearExpiry =
      expiresAt !== undefined &&
      expiresAt.getTime() - Date.now() < expiryBufferMs;

    // Only decrypt the refresh token when we actually need it (near-expiry branch).
    // Avoids AES-256-GCM decryption overhead on every hot-path getToken call.
    const hasRefreshToken = !!row.refresh_token;

    if (isNearExpiry && hasRefreshToken) {
      // Deduplicate concurrent refresh calls — prevents double-consumption of single-use tokens
      const lockKey = `${userEntityRef}|${providerId}`;
      let refreshPromise = this.refreshLocks.get(lockKey);
      if (!refreshPromise) {
        const refreshToken = decrypt(row.refresh_token, this.encKey);
        refreshPromise = this.refreshAndPersist(
          userEntityRef,
          providerId,
          refreshToken,
          row.scope,
        ).finally(() => this.refreshLocks.delete(lockKey));
        this.refreshLocks.set(lockKey, refreshPromise);
      }
      return refreshPromise;
    }

    if (isNearExpiry && !hasRefreshToken) {
      this.logger.warn('Provider token expired with no refresh token', {
        userEntityRef,
        providerId,
        expiresAt: expiresAt?.toISOString(),
      });
      return undefined;
    }

    // Downgraded to debug: fires on every action invocation (hot path).
    // Production log aggregation pipelines typically exclude debug-level logs,
    // keeping userEntityRef (PII) out of long-retention log sinks.
    this.logger.debug('Provider token retrieved', {
      userEntityRef,
      providerId,
      hasRefreshToken,
      expiresAt: expiresAt?.toISOString() ?? 'none',
    });

    return {
      userEntityRef,
      providerId,
      accessToken: decrypt(row.access_token, this.encKey),
      scope: row.scope ? decrypt(row.scope, this.encKey) : undefined,
      expiresAt,
    };
  }

  async deleteTokens(userEntityRef: string): Promise<void> {
    const count = await this.db('provider_tokens')
      .where({ user_entity_ref: userEntityRef })
      .delete();
    this.logger.info('Provider tokens deleted for user', {
      userEntityRef,
      count,
    });
  }

  async deleteToken(userEntityRef: string, providerId: string): Promise<void> {
    await this.db('provider_tokens')
      .where({ user_entity_ref: userEntityRef, provider_id: providerId })
      .delete();
    this.logger.info('Provider token deleted', { userEntityRef, providerId });
  }

  private async refreshAndPersist(
    userEntityRef: string,
    providerId: string,
    refreshToken: string,
    encryptedScope: string | null,
  ): Promise<ProviderToken | undefined> {
    const refresher = this.refreshers.get(providerId);
    if (!refresher) {
      this.logger.warn('No refresher registered for provider', {
        userEntityRef,
        providerId,
      });
      return undefined;
    }

    let result: RefreshResult;
    try {
      result = await refresher.refresh(refreshToken);
    } catch (err) {
      if (err instanceof OAuthPermanentError) {
        // Refresh token is permanently invalid (revoked, de-authorized, etc.).
        // Delete the stale row to prevent an infinite retry loop on every subsequent getToken call.
        this.logger.warn(
          'Refresh token permanently revoked — deleting stale token',
          { userEntityRef, providerId },
        );
        await this.deleteToken(userEntityRef, providerId).catch(deleteErr => {
          this.logger.error(
            'Failed to delete stale token after permanent refresh error',
            {
              userEntityRef,
              providerId,
              error:
                deleteErr instanceof Error
                  ? deleteErr.message
                  : String(deleteErr),
            },
          );
        });
      } else {
        // Transient failure (network error, 5xx, timeout) — keep the row for next attempt.
        this.logger.error('Failed to refresh provider token', {
          userEntityRef,
          providerId,
          error: err instanceof Error ? err.message : String(err),
        });
      }
      return undefined;
    }

    const newRefreshToken = result.refreshToken ?? refreshToken;
    const currentScope = encryptedScope
      ? decrypt(encryptedScope, this.encKey)
      : undefined;
    const effectiveScope = result.scope ?? currentScope;

    const expiresAt = result.expiresInSeconds
      ? new Date(Date.now() + result.expiresInSeconds * 1000)
      : undefined;

    await this.upsertToken(userEntityRef, providerId, {
      accessToken: result.accessToken,
      refreshToken: newRefreshToken,
      scope: effectiveScope,
      expiresInSeconds: result.expiresInSeconds,
    });

    return {
      userEntityRef,
      providerId,
      accessToken: result.accessToken,
      scope: effectiveScope,
      expiresAt,
    };
  }
}
