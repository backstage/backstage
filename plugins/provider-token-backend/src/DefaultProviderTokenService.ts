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
  createServiceFactory,
  coreServices,
  resolvePackagePath,
} from '@backstage/backend-plugin-api';
import type { LoggerService, ServiceRef } from '@backstage/backend-plugin-api';
import type { Knex } from 'knex';
import { encrypt, decrypt, deriveKey } from './crypto';
import type {
  ProviderToken,
  ProviderTokenService,
} from './ProviderTokenService';
import type { ProviderTokenRefresher } from './ProviderTokenRefresher';

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
    session: {
      accessToken: string;
      refreshToken?: string;
      scope?: string;
      expiresInSeconds?: number;
    },
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

    const refreshToken = row.refresh_token
      ? decrypt(row.refresh_token, this.encKey)
      : undefined;

    if (isNearExpiry && refreshToken) {
      // Deduplicate concurrent refresh calls — prevents double-consumption of single-use tokens
      const lockKey = `${userEntityRef}:${providerId}`;
      let refreshPromise = this.refreshLocks.get(lockKey);
      if (!refreshPromise) {
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

    if (isNearExpiry && !refreshToken) {
      this.logger.warn('Provider token expired with no refresh token', {
        userEntityRef,
        providerId,
        expiresAt: expiresAt?.toISOString(),
      });
      return undefined;
    }

    // Audit log — no token values
    this.logger.info('Provider token retrieved', {
      userEntityRef,
      providerId,
      hasRefreshToken: !!refreshToken,
      expiresAt: expiresAt?.toISOString() ?? 'none',
    });

    return {
      userEntityRef,
      providerId,
      accessToken: decrypt(row.access_token, this.encKey),
      refreshToken,
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

    let result;
    try {
      result = await refresher.refresh(refreshToken);
    } catch (err) {
      // Log error type/message — never include the token value
      this.logger.error('Failed to refresh provider token', {
        userEntityRef,
        providerId,
        error: err instanceof Error ? err.message : String(err),
      });
      return undefined;
    }

    const newRefreshToken = result.refreshToken ?? refreshToken;
    const currentScope = encryptedScope
      ? decrypt(encryptedScope, this.encKey)
      : undefined;
    const effectiveScope = result.scope ?? currentScope;

    await this.upsertToken(userEntityRef, providerId, {
      accessToken: result.accessToken,
      refreshToken: newRefreshToken,
      scope: effectiveScope,
      expiresInSeconds: result.expiresInSeconds,
    });

    const expiresAt = result.expiresInSeconds
      ? new Date(Date.now() + result.expiresInSeconds * 1000)
      : undefined;

    return {
      userEntityRef,
      providerId,
      accessToken: result.accessToken,
      refreshToken: newRefreshToken,
      scope: effectiveScope,
      expiresAt,
    };
  }
}

/**
 * Creates the Backstage ServiceFactory for ProviderTokenService.
 * Called by the defaultFactory in providerTokenServiceRef.
 */
export function createProviderTokenServiceFactory(
  service: ServiceRef<ProviderTokenService, 'plugin'>,
) {
  return createServiceFactory({
    service,
    deps: {
      database: coreServices.database,
      config: coreServices.rootConfig,
      logger: coreServices.logger,
    },
    async factory({ database, config, logger }) {
      const db = await database.getClient();

      await db.migrate.latest({
        directory: resolvePackagePath(
          '@devhub/plugin-provider-token-backend',
          'migrations',
        ),
      });

      const secret = config.getString('providerToken.encryptionSecret');
      const encKey = deriveKey(secret);
      const refreshBufferSeconds =
        config.getOptionalNumber('providerToken.refreshBufferSeconds') ?? 300;

      // Refreshers are imported lazily to avoid loading provider-specific OAuth libs at startup
      const { createAtlassianRefresher } = await import('./atlassianRefresher');
      const { createMicrosoftRefresher } = await import('./microsoftRefresher');
      const { createGithubRefresher } = await import('./githubRefresher');

      const refreshers = new Map([
        ['atlassian', createAtlassianRefresher(config)],
        ['microsoft', createMicrosoftRefresher(config)],
        ['github', createGithubRefresher(config)],
      ]);

      return new DefaultProviderTokenService(
        db,
        encKey,
        refreshers,
        refreshBufferSeconds,
        logger,
      );
    },
  });
}
