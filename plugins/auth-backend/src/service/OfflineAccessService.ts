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
  DatabaseService,
  LifecycleService,
  LoggerService,
  RootConfigService,
} from '@backstage/backend-plugin-api';
import { AuthenticationError } from '@backstage/errors';
import { readDurationFromConfig } from '@backstage/config';
import { durationToMilliseconds } from '@backstage/types';
import { v4 as uuid } from 'uuid';
import { OfflineSessionDatabase } from '../database/OfflineSessionDatabase';
import {
  generateRefreshToken,
  getRefreshTokenId,
  verifyRefreshToken,
} from '../lib/refreshToken';
import { TokenIssuer } from '../identity/types';

/**
 * Service for managing offline access (refresh tokens)
 * @internal
 */
export class OfflineAccessService {
  readonly #offlineSessionDb: OfflineSessionDatabase;
  readonly #logger: LoggerService;

  static async create(options: {
    config: RootConfigService;
    database: DatabaseService;
    logger: LoggerService;
    lifecycle: LifecycleService;
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

    return new OfflineAccessService(offlineSessionDb, logger);
  }

  private constructor(
    offlineSessionDb: OfflineSessionDatabase,
    logger: LoggerService,
  ) {
    this.#offlineSessionDb = offlineSessionDb;
    this.#logger = logger;
  }

  /**
   * Issue a new refresh token for a user
   */
  async issueRefreshToken(options: {
    userEntityRef: string;
    oidcClientId?: string;
  }): Promise<string> {
    const { userEntityRef, oidcClientId } = options;

    const sessionId = uuid();
    const { token, hash } = await generateRefreshToken(sessionId);

    await this.#offlineSessionDb.createSession({
      id: sessionId,
      userEntityRef,
      oidcClientId,
      tokenHash: hash,
    });

    this.#logger.debug(
      `Issued refresh token for user ${userEntityRef} with session ${sessionId}`,
    );

    return token;
  }

  /**
   * Refresh an access token using a refresh token
   */
  async refreshAccessToken(options: {
    refreshToken: string;
    tokenIssuer: TokenIssuer;
    clientId?: string;
  }): Promise<{ accessToken: string; refreshToken: string }> {
    const { refreshToken, tokenIssuer, clientId } = options;

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

    // Verify the caller actually holds a valid token, not just the session ID
    const isValid = await verifyRefreshToken(refreshToken, session.tokenHash);
    if (!isValid) {
      throw new AuthenticationError('Invalid refresh token');
    }

    const { token: newRefreshToken, hash: newHash } =
      await generateRefreshToken(sessionId);

    // Atomically swap the hash so a concurrent request with the same token fails
    const rotatedSession = await this.#offlineSessionDb.getAndRotateToken(
      sessionId,
      session.tokenHash,
      newHash,
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
