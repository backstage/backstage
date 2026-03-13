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
import { LRUCache } from 'lru-cache';
import { encrypt, decrypt, decryptWithFallback } from './crypto';
import type {
  ProviderToken,
  ProviderTokenService,
  ProviderTokenRefresher,
  ProviderTokenSession,
  RefreshResult,
} from '@devhub/plugin-provider-token-node';
import { OAuthPermanentError } from '@devhub/plugin-provider-token-node';

/**
 * Shared in-process lock map for refresh deduplication.
 *
 * Exported so createProviderTokenServiceFactory can pass the same instance to every
 * DefaultProviderTokenService (one is created per consumer plugin due to 'plugin' scope).
 * This ensures all plugin-scoped instances within a single process deduplicate concurrent
 * refreshes instead of each racing independently to consume a single-use refresh token.
 *
 * Tests that construct DefaultProviderTokenService directly do NOT pass this map, so
 * each test gets an isolated `new Map()` — preventing cross-test state leakage.
 */
export const sharedRefreshLocks = new Map<
  string,
  Promise<ProviderToken | undefined>
>();

/**
 * Returns true when the Knex instance is connected to PostgreSQL.
 * Used to gate the optimistic updated_at claim (G2 cross-replica guard).
 * SQLite (development/test) is single-process so in-process locks are sufficient.
 */
function isPostgres(db: Knex): boolean {
  const clientName = (db as any).client?.config?.client as unknown;
  if (typeof clientName !== 'string') return false;
  const lc = clientName.toLowerCase();
  return lc === 'pg' || lc.startsWith('postgres');
}

/** Maximum number of user+provider entries to hold in the in-process LRU cache (G6). */
const CACHE_MAX_ENTRIES = 1000;
/** Hard upper bound on cache TTL regardless of token expiry (ms). */
const CACHE_MAX_TTL_MS = 5 * 60 * 1000; // 5 minutes
/** Buffer subtracted from token expiry when computing cache TTL (ms). */
const CACHE_EXPIRY_BUFFER_MS = 60 * 1000; // 1 minute

export class DefaultProviderTokenService implements ProviderTokenService {
  /**
   * Prevents concurrent refresh calls for the same user+provider from
   * double-consuming a single-use refresh token within one process.
   * Set from the shared module-level map in production; isolated new Map() in tests.
   */
  private readonly refreshLocks: Map<
    string,
    Promise<ProviderToken | undefined>
  >;

  /**
   * Short-lived in-process LRU cache for valid tokens (G6).
   * Reduces DB round-trips on hot paths (MCP tool calls).
   * Cache key: `${userEntityRef}|${providerId}`.
   * Entries are evicted immediately on upsertToken() and deleteToken()/deleteTokens().
   */
  private readonly tokenCache: LRUCache<string, ProviderToken>;

  constructor(
    private readonly db: Knex,
    private readonly encKey: Buffer,
    private readonly refreshers: Map<string, ProviderTokenRefresher>,
    private readonly refreshBufferSeconds: number,
    private readonly logger: LoggerService,
    refreshLocks?: Map<string, Promise<ProviderToken | undefined>>,
    /** G5: optional previous-secret derived key for lazy key rotation. */
    private readonly fallbackKey?: Buffer,
  ) {
    this.refreshLocks = refreshLocks ?? new Map();
    this.tokenCache = new LRUCache<string, ProviderToken>({
      max: CACHE_MAX_ENTRIES,
      ttl: CACHE_MAX_TTL_MS,
    });
  }

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

    // Evict the cache entry immediately so the next getToken() call reads fresh data
    // (G6 cache invalidation — must happen after the write succeeds).
    this.tokenCache.delete(`${userEntityRef}|${providerId}`);

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
    // G6: check in-process cache before hitting the DB.
    const cacheKey = `${userEntityRef}|${providerId}`;
    const cached = this.tokenCache.get(cacheKey);
    if (cached) {
      this.logger.debug('Provider token served from cache', {
        userEntityRef,
        providerId,
      });
      return cached;
    }

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
      // Deduplicate concurrent refresh calls — prevents double-consumption of single-use tokens.
      // refreshLocks is shared across all service instances in this process (G1 fix).
      let refreshPromise = this.refreshLocks.get(cacheKey);
      if (!refreshPromise) {
        // G5: decrypt the refresh token using the current key; fall back to the previous key
        // if the row was encrypted before the last secret rotation.
        const { plaintext: refreshToken, usedFallback } = decryptWithFallback(
          row.refresh_token,
          this.encKey,
          this.fallbackKey,
        );
        if (usedFallback) {
          this.logger.info(
            'Refresh token decrypted with previous key — will re-encrypt on write',
            { userEntityRef, providerId },
          );
        }
        refreshPromise = this.claimAndRefresh(
          userEntityRef,
          providerId,
          refreshToken,
          row.scope,
          row.updated_at ?? null,
        ).finally(() => this.refreshLocks.delete(cacheKey));
        this.refreshLocks.set(cacheKey, refreshPromise);
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

    // G5: decrypt access token and scope with fallback support.
    const { plaintext: accessToken, usedFallback: accessFallback } =
      decryptWithFallback(row.access_token, this.encKey, this.fallbackKey);
    const scope = row.scope
      ? decryptWithFallback(row.scope, this.encKey, this.fallbackKey).plaintext
      : undefined;

    if (accessFallback) {
      // Row was encrypted with the previous key. Lazily re-encrypt with the current key
      // so the row migrates transparently without a bulk migration job.
      this.logger.info(
        'Access token decrypted with previous key — lazily re-encrypting with current key',
        { userEntityRef, providerId },
      );
      await this.db('provider_tokens')
        .where({ user_entity_ref: userEntityRef, provider_id: providerId })
        .update({
          access_token: encrypt(accessToken, this.encKey),
          scope: scope ? encrypt(scope, this.encKey) : null,
          updated_at: this.db.fn.now(),
        });
    }

    const token: ProviderToken = {
      userEntityRef,
      providerId,
      accessToken,
      scope,
      expiresAt,
    };

    // G6: cache the token for subsequent calls.
    // TTL = min(CACHE_MAX_TTL_MS, expiresAt - now - CACHE_EXPIRY_BUFFER_MS).
    // Only cache tokens that won't expire within the buffer window.
    const cacheTtl = expiresAt
      ? Math.min(
          CACHE_MAX_TTL_MS,
          Math.max(
            0,
            expiresAt.getTime() - Date.now() - CACHE_EXPIRY_BUFFER_MS,
          ),
        )
      : CACHE_MAX_TTL_MS;

    if (cacheTtl > 0) {
      this.tokenCache.set(cacheKey, token, { ttl: cacheTtl });
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

    return token;
  }

  async deleteTokens(userEntityRef: string): Promise<void> {
    const count = await this.db('provider_tokens')
      .where({ user_entity_ref: userEntityRef })
      .delete();

    // Evict all cached entries for this user (G6 invalidation).
    // We don't know which providers were cached, so scan the cache keys.
    for (const key of this.tokenCache.keys()) {
      if (key.startsWith(`${userEntityRef}|`)) {
        this.tokenCache.delete(key);
      }
    }

    this.logger.info('Provider tokens deleted for user', {
      userEntityRef,
      count,
    });
  }

  async deleteToken(userEntityRef: string, providerId: string): Promise<void> {
    await this.db('provider_tokens')
      .where({ user_entity_ref: userEntityRef, provider_id: providerId })
      .delete();

    // Evict the cache entry immediately (G6 invalidation).
    this.tokenCache.delete(`${userEntityRef}|${providerId}`);

    this.logger.info('Provider token deleted', { userEntityRef, providerId });
  }

  /**
   * Attempts to atomically claim the refresh slot via an optimistic updated_at lock
   * (PostgreSQL only), then delegates to refreshAndPersist.
   *
   * **Cross-replica guard (G2):** In a multi-replica deployment, two pods may read the
   * same near-expiry row simultaneously. The first `UPDATE … WHERE updated_at = $last`
   * to succeed "claims" the slot by bumping updated_at before making the HTTP refresh
   * call. The losing replica sees 0 rows updated and re-reads the DB — either finding
   * the already-refreshed token (if the winner finished first) or the row still near
   * expiry (the loser's next request will attempt a claim again, which is safe).
   *
   * SQLite (development/test) is single-process so in-process `refreshLocks` are
   * sufficient; the optimistic claim is skipped to avoid SQLite timestamp precision issues.
   */
  private async claimAndRefresh(
    userEntityRef: string,
    providerId: string,
    refreshToken: string,
    encryptedScope: string | null,
    lastUpdatedAt: Date | string | null,
  ): Promise<ProviderToken | undefined> {
    if (isPostgres(this.db) && lastUpdatedAt !== null) {
      const claimed = await this.db('provider_tokens')
        .where({
          user_entity_ref: userEntityRef,
          provider_id: providerId,
          updated_at: lastUpdatedAt,
        })
        .update({ updated_at: this.db.fn.now() });

      if (claimed === 0) {
        // Another replica already claimed the refresh slot.
        // Re-read to return whatever is currently in the DB.
        this.logger.debug(
          'Refresh claim lost to concurrent replica — re-reading token from DB',
          { userEntityRef, providerId },
        );
        const freshRow = await this.db('provider_tokens')
          .where({ user_entity_ref: userEntityRef, provider_id: providerId })
          .first();
        if (!freshRow) return undefined;
        return {
          userEntityRef,
          providerId,
          accessToken: decryptWithFallback(
            freshRow.access_token,
            this.encKey,
            this.fallbackKey,
          ).plaintext,
          scope: freshRow.scope
            ? decryptWithFallback(freshRow.scope, this.encKey, this.fallbackKey)
                .plaintext
            : undefined,
          expiresAt: freshRow.expires_at
            ? new Date(freshRow.expires_at)
            : undefined,
        };
      }
    }

    return this.refreshAndPersist(
      userEntityRef,
      providerId,
      refreshToken,
      encryptedScope,
    );
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
      ? decryptWithFallback(encryptedScope, this.encKey, this.fallbackKey)
          .plaintext
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
