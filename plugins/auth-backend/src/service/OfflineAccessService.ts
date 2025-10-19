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

import { LoggerService } from '@backstage/backend-plugin-api';
import { AuthenticationError } from '@backstage/errors';
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
 * @public
 */
export class OfflineAccessService {
  private readonly offlineSessionDb: OfflineSessionDatabase;
  private readonly logger: LoggerService;
  private lastCleanupTime: number = 0;
  private readonly cleanupProbability = 0.05; // 5% chance
  private readonly cleanupMinIntervalMs = 60 * 1000; // 1 minute

  private constructor(
    offlineSessionDb: OfflineSessionDatabase,
    logger: LoggerService,
  ) {
    this.offlineSessionDb = offlineSessionDb;
    this.logger = logger;
  }

  static create(options: {
    offlineSessionDb: OfflineSessionDatabase;
    logger: LoggerService;
  }) {
    return new OfflineAccessService(options.offlineSessionDb, options.logger);
  }

  /**
   * Issue a new refresh token for a user
   */
  async issueRefreshToken(options: {
    userEntityRef: string;
    oidcClientId?: string;
  }): Promise<string> {
    const { userEntityRef, oidcClientId } = options;

    // Generate a new session ID
    const sessionId = uuid();

    // Generate refresh token with embedded session ID
    const { token, hash } = generateRefreshToken(sessionId);

    // Store session in database
    await this.offlineSessionDb.createSession({
      id: sessionId,
      userEntityRef,
      oidcClientId,
      tokenHash: hash,
    });

    this.logger.debug(
      `Issued refresh token for user ${userEntityRef} with session ${sessionId}`,
    );

    // Trigger stochastic cleanup
    this.triggerCleanup();

    return token;
  }

  /**
   * Refresh an access token using a refresh token
   */
  async refreshAccessToken(options: {
    refreshToken: string;
    tokenIssuer: TokenIssuer;
  }): Promise<{ accessToken: string; refreshToken: string }> {
    const { refreshToken, tokenIssuer } = options;

    // Extract session ID from token
    let sessionId: string;
    try {
      sessionId = getRefreshTokenId(refreshToken);
    } catch (error) {
      throw new AuthenticationError('Invalid refresh token format');
    }

    // Fetch session from database
    const session = await this.offlineSessionDb.getSessionById(sessionId);
    if (!session) {
      throw new AuthenticationError('Invalid refresh token');
    }

    // Check if session is expired
    if (this.offlineSessionDb.isSessionExpired(session)) {
      await this.offlineSessionDb.deleteSession(sessionId);
      throw new AuthenticationError('Refresh token expired');
    }

    // Verify token hash
    const isValid = verifyRefreshToken(refreshToken, session.tokenHash);
    if (!isValid) {
      throw new AuthenticationError('Invalid refresh token');
    }

    // Issue new access token
    // Note: Ownership references (ent) will be computed by the token issuer
    // or should be provided through the catalog resolution mechanism
    const { token: accessToken } = await tokenIssuer.issueToken({
      claims: {
        sub: session.userEntityRef,
      },
    });

    // Generate new refresh token with same session ID
    const { token: newRefreshToken, hash: newHash } =
      generateRefreshToken(sessionId);

    // Update database with new token hash
    await this.offlineSessionDb.rotateToken(sessionId, newHash);

    this.logger.debug(
      `Refreshed access token for user ${session.userEntityRef} with session ${sessionId}`,
    );

    // Trigger stochastic cleanup
    this.triggerCleanup();

    return { accessToken, refreshToken: newRefreshToken };
  }

  /**
   * Revoke a refresh token
   */
  async revokeRefreshToken(refreshToken: string): Promise<void> {
    try {
      const sessionId = getRefreshTokenId(refreshToken);
      await this.offlineSessionDb.deleteSession(sessionId);
      this.logger.debug(`Revoked refresh token with session ${sessionId}`);
    } catch (error) {
      // Ignore errors when revoking - token may already be invalid
      this.logger.debug('Failed to revoke refresh token', error);
    }
  }

  /**
   * Revoke all refresh tokens for a user
   */
  async revokeRefreshTokensByUserEntityRef(
    userEntityRef: string,
  ): Promise<void> {
    const deletedCount =
      await this.offlineSessionDb.deleteSessionsByUserEntityRef(userEntityRef);
    this.logger.debug(
      `Revoked ${deletedCount} refresh tokens for user ${userEntityRef}`,
    );
  }

  /**
   * Trigger stochastic cleanup of expired sessions
   * - 5% probability of running
   * - Max once per minute (deduplicated)
   * - Non-blocking (fire and forget)
   * @internal
   */
  private triggerCleanup(): void {
    // Check probability
    if (Math.random() > this.cleanupProbability) {
      return;
    }

    // Check if cleanup ran recently (deduplicate)
    const now = Date.now();
    if (now - this.lastCleanupTime < this.cleanupMinIntervalMs) {
      return;
    }

    // Update timestamp
    this.lastCleanupTime = now;

    // Run cleanup asynchronously without blocking
    this.offlineSessionDb
      .cleanupExpiredSessions()
      .then(deletedCount => {
        if (deletedCount > 0) {
          this.logger.debug(
            `Cleaned up ${deletedCount} expired offline sessions`,
          );
        }
      })
      .catch(error => {
        this.logger.warn('Failed to cleanup expired offline sessions', error);
      });
  }
}
