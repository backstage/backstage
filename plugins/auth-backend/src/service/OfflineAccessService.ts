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
 * @internal
 */
export class OfflineAccessService {
  readonly #offlineSessionDb: OfflineSessionDatabase;
  readonly #logger: LoggerService;

  static create(options: {
    offlineSessionDb: OfflineSessionDatabase;
    logger: LoggerService;
  }) {
    return new OfflineAccessService(options.offlineSessionDb, options.logger);
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
  }): Promise<{ accessToken: string; refreshToken: string }> {
    const { refreshToken, tokenIssuer } = options;

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
