/*
 * Copyright 2025 The Backstage Authors
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
  AuthService,
  DatabaseService,
  LifecycleService,
  LoggerService,
  RootConfigService,
} from '@backstage/backend-plugin-api';
import { AuthenticationError } from '@backstage/errors';
import { readDurationFromConfig } from '@backstage/config';
import { durationToMilliseconds } from '@backstage/types';
import { CatalogService } from '@backstage/plugin-catalog-node';
import { randomUUID as uuid } from 'node:crypto';
import { OfflineSessionDatabase } from '../database/OfflineSessionDatabase';
import {
  generateRefreshToken,
  getRefreshTokenId,
  getEncryptedUpstreamToken,
  verifyRefreshToken,
} from '../lib/refreshToken';
import {
  generateEncryptionKey,
  encryptToken,
  decryptToken,
} from '../lib/tokenEncryption';
import { TokenIssuer } from '../identity/types';

/**
 * Result of refreshing a token against the upstream auth provider.
 * @internal
 */
export type UpstreamRefreshResult = {
  /** The new upstream refresh token, if the provider rotated it. */
  refreshToken?: string;
};

/**
 * Function that refreshes a token against the upstream auth provider.
 * @internal
 */
export type UpstreamRefreshFn = (options: {
  authProviderId: string;
  refreshToken: string;
  env?: string;
}) => Promise<UpstreamRefreshResult>;

/**
 * Service for managing offline access (refresh tokens)
 * @internal
 */
export class OfflineAccessService {
  readonly #offlineSessionDb: OfflineSessionDatabase;
  readonly #logger: LoggerService;
  readonly #dangerouslyDisableCatalogPresenceCheck: boolean;
  readonly #catalog: CatalogService;
  readonly #auth: AuthService;

  static async create(options: {
    config: RootConfigService;
    database: DatabaseService;
    logger: LoggerService;
    lifecycle: LifecycleService;
    catalog: CatalogService;
    auth: AuthService;
  }): Promise<OfflineAccessService> {
    const { config, database, logger, lifecycle } = options;

    const tokenLifetime = config.has(
      'auth.experimentalRefreshToken.tokenLifetime',
    )
      ? readDurationFromConfig(config, {
          key: 'auth.experimentalRefreshToken.tokenLifetime',
        })
      : { days: 30 };

    const maxRotationLifetime = config.has(
      'auth.experimentalRefreshToken.maxRotationLifetime',
    )
      ? readDurationFromConfig(config, {
          key: 'auth.experimentalRefreshToken.maxRotationLifetime',
        })
      : { years: 1 };

    const tokenLifetimeSeconds = Math.floor(
      durationToMilliseconds(tokenLifetime) / 1000,
    );
    const maxRotationLifetimeSeconds = Math.floor(
      durationToMilliseconds(maxRotationLifetime) / 1000,
    );

    if (tokenLifetimeSeconds <= 0) {
      throw new Error(
        'auth.experimentalRefreshToken.tokenLifetime must be a positive duration',
      );
    }
    if (maxRotationLifetimeSeconds <= 0) {
      throw new Error(
        'auth.experimentalRefreshToken.maxRotationLifetime must be a positive duration',
      );
    }
    if (maxRotationLifetimeSeconds <= tokenLifetimeSeconds) {
      throw new Error(
        'auth.experimentalRefreshToken.maxRotationLifetime must be greater than tokenLifetime',
      );
    }

    const maxTokensPerUser =
      config.getOptionalNumber(
        'auth.experimentalRefreshToken.maxTokensPerUser',
      ) ?? 20;

    if (maxTokensPerUser <= 0) {
      throw new Error(
        'auth.experimentalRefreshToken.maxTokensPerUser must be a positive number',
      );
    }

    const dangerouslyDisableCatalogPresenceCheck =
      config.getOptionalBoolean(
        'auth.experimentalRefreshToken.dangerouslyDisableCatalogPresenceCheck',
      ) ?? false;

    const knex = await database.getClient();

    if (
      knex.client.config.client.includes('sqlite') ||
      knex.client.config.client.includes('better-sqlite')
    ) {
      logger.warn(
        'Refresh tokens are enabled with SQLite, which does not support row-level locking. ' +
          'Concurrent token rotation may not be fully protected against race conditions. ' +
          'Use PostgreSQL for production deployments.',
      );
    }

    const offlineSessionDb = OfflineSessionDatabase.create({
      knex,
      tokenLifetimeSeconds,
      maxRotationLifetimeSeconds,
      maxTokensPerUser,
    });

    const cleanupIntervalMs = 60 * 60 * 1000;
    const cleanupInterval = setInterval(async () => {
      try {
        const deleted = await offlineSessionDb.cleanupExpiredSessions();
        if (deleted > 0) {
          logger.info(`Cleaned up ${deleted} expired offline sessions`);
        }
      } catch (error) {
        logger.error('Failed to cleanup expired offline sessions', error);
      }
    }, cleanupIntervalMs);
    cleanupInterval.unref();

    lifecycle.addShutdownHook(() => {
      clearInterval(cleanupInterval);
    });

    return new OfflineAccessService(
      offlineSessionDb,
      logger,
      dangerouslyDisableCatalogPresenceCheck,
      options.catalog,
      options.auth,
    );
  }

  private constructor(
    offlineSessionDb: OfflineSessionDatabase,
    logger: LoggerService,
    dangerouslyDisableCatalogPresenceCheck: boolean,
    catalog: CatalogService,
    auth: AuthService,
  ) {
    this.#offlineSessionDb = offlineSessionDb;
    this.#logger = logger;
    this.#dangerouslyDisableCatalogPresenceCheck =
      dangerouslyDisableCatalogPresenceCheck;
    this.#catalog = catalog;
    this.#auth = auth;
  }

  /**
   * Issue a new refresh token for a user, optionally backed by an upstream
   * provider's refresh token using split-knowledge encryption.
   */
  async issueRefreshToken(options: {
    userEntityRef: string;
    oidcClientId?: string;
    upstreamRefreshToken?: string;
    authProviderId?: string;
    authProviderEnv?: string;
  }): Promise<string> {
    const {
      userEntityRef,
      oidcClientId,
      upstreamRefreshToken,
      authProviderId,
      authProviderEnv,
    } = options;

    const sessionId = uuid();

    let encryptedUpstream: string | undefined;
    let upstreamTokenKey: string | undefined;

    if (upstreamRefreshToken) {
      upstreamTokenKey = generateEncryptionKey();
      encryptedUpstream = encryptToken(upstreamRefreshToken, upstreamTokenKey);
    }

    const { token, hash } = await generateRefreshToken(
      sessionId,
      encryptedUpstream,
    );

    await this.#offlineSessionDb.createSession({
      id: sessionId,
      userEntityRef,
      oidcClientId,
      tokenHash: hash,
      upstreamTokenKey,
      authProviderId,
      authProviderEnv,
    });

    this.#logger.debug(
      `Issued refresh token for user ${userEntityRef} with session ${sessionId}`,
    );

    return token;
  }

  /**
   * Refresh an access token using a refresh token.
   * If the session is backed by an upstream provider, validates against
   * the upstream provider before issuing a new token.
   */
  async refreshAccessToken(options: {
    refreshToken: string;
    tokenIssuer: TokenIssuer;
    clientId?: string;
    upstreamRefresh?: UpstreamRefreshFn;
  }): Promise<{ accessToken: string; refreshToken: string }> {
    const { refreshToken, tokenIssuer, clientId, upstreamRefresh } = options;

    let sessionId: string;
    try {
      sessionId = getRefreshTokenId(refreshToken);
    } catch (error) {
      this.#logger.debug('Failed to extract refresh token ID', error);
      throw new AuthenticationError('Invalid refresh token format');
    }

    const session = await this.#offlineSessionDb.getSessionById(sessionId);
    if (!session) {
      throw new AuthenticationError('Invalid refresh token');
    }

    if (this.#offlineSessionDb.isSessionExpired(session)) {
      await this.#offlineSessionDb.deleteSession(sessionId);
      throw new AuthenticationError('Invalid refresh token');
    }

    if (clientId && session.oidcClientId && clientId !== session.oidcClientId) {
      throw new AuthenticationError(
        'Refresh token was not issued to this client',
      );
    }

    const isValid = await verifyRefreshToken(refreshToken, session.tokenHash);
    if (!isValid) {
      throw new AuthenticationError('Invalid refresh token');
    }

    // If the session has an upstream token, validate against the upstream provider.
    // Otherwise fall back to the catalog presence check for non-OAuth providers.
    let newEncryptedUpstream: string | undefined;
    let newUpstreamTokenKey: string | undefined;

    if (session.upstreamTokenKey && session.authProviderId) {
      if (!upstreamRefresh) {
        throw new AuthenticationError(
          'Upstream refresh not available for this session',
        );
      }

      const encryptedUpstream = getEncryptedUpstreamToken(refreshToken);
      if (!encryptedUpstream) {
        await this.#offlineSessionDb.deleteSession(sessionId);
        throw new AuthenticationError('Invalid refresh token');
      }

      let upstreamRefreshToken: string;
      try {
        upstreamRefreshToken = decryptToken(
          encryptedUpstream,
          session.upstreamTokenKey,
        );
      } catch (error) {
        this.#logger.debug('Failed to decrypt upstream token', error);
        await this.#offlineSessionDb.deleteSession(sessionId);
        throw new AuthenticationError('Invalid refresh token');
      }

      let upstreamResult: UpstreamRefreshResult;
      try {
        upstreamResult = await upstreamRefresh({
          authProviderId: session.authProviderId,
          refreshToken: upstreamRefreshToken,
          env: session.authProviderEnv ?? undefined,
        });
      } catch (error) {
        this.#logger.info(
          `Upstream refresh failed for user ${session.userEntityRef} ` +
            `(provider: ${session.authProviderId}, session: ${sessionId}), ` +
            `deleting session`,
        );
        await this.#offlineSessionDb.deleteSession(sessionId);
        throw new AuthenticationError('Upstream session is no longer valid');
      }

      // Re-encrypt the upstream token (may have been rotated by the provider)
      const currentUpstreamToken =
        upstreamResult.refreshToken ?? upstreamRefreshToken;
      newUpstreamTokenKey = generateEncryptionKey();
      newEncryptedUpstream = encryptToken(
        currentUpstreamToken,
        newUpstreamTokenKey,
      );
    } else if (!this.#dangerouslyDisableCatalogPresenceCheck) {
      try {
        const entity = await this.#catalog.getEntityByRef(
          session.userEntityRef,
          { credentials: await this.#auth.getOwnServiceCredentials() },
        );
        if (!entity) {
          this.#logger.info(
            `Rejecting refresh for user ${session.userEntityRef} - catalog entity not found, revoking session ${sessionId}`,
          );
          await this.#offlineSessionDb.deleteSession(sessionId);
          throw new AuthenticationError(
            'User entity no longer exists in the catalog',
          );
        }
      } catch (error) {
        if ((error as { name?: string }).name === 'AuthenticationError') {
          throw error;
        }
        this.#logger.warn(
          `Failed to validate catalog user existence for ${session.userEntityRef}, rejecting refresh`,
          error,
        );
        throw new AuthenticationError('Unable to validate user existence');
      }
    }

    const { token: newRefreshToken, hash: newHash } =
      await generateRefreshToken(sessionId, newEncryptedUpstream);

    // Atomically swap the hash (and upstream key if applicable)
    const rotatedSession = await this.#offlineSessionDb.getAndRotateToken(
      sessionId,
      session.tokenHash,
      newHash,
      newUpstreamTokenKey,
    );

    if (!rotatedSession) {
      throw new AuthenticationError('Invalid refresh token');
    }

    const { token: accessToken } = await tokenIssuer.issueToken({
      claims: {
        sub: rotatedSession.userEntityRef,
      },
    });

    this.#logger.debug(
      `Refreshed access token for user ${session.userEntityRef} with session ${sessionId}`,
    );

    return { accessToken, refreshToken: newRefreshToken };
  }

  /**
   * Revoke a refresh token
   */
  async revokeRefreshToken(refreshToken: string): Promise<void> {
    try {
      const sessionId = getRefreshTokenId(refreshToken);
      await this.#offlineSessionDb.deleteSession(sessionId);
      this.#logger.debug(`Revoked refresh token with session ${sessionId}`);
    } catch (error) {
      // Ignore errors when revoking - token may already be invalid
      this.#logger.debug('Failed to revoke refresh token', error);
    }
  }

  /**
   * Revoke all refresh tokens for a user
   */
  async revokeRefreshTokensByUserEntityRef(
    userEntityRef: string,
  ): Promise<void> {
    const deletedCount =
      await this.#offlineSessionDb.deleteSessionsByUserEntityRef(userEntityRef);
    this.#logger.debug(
      `Revoked ${deletedCount} refresh tokens for user ${userEntityRef}`,
    );
  }
}
