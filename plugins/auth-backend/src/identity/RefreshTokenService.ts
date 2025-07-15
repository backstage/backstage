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

import { DateTime } from 'luxon';
import { LoggerService } from '@backstage/backend-plugin-api';
import { TokenParams, BackstageSignInResult } from '@backstage/plugin-auth-node';
import { JsonObject } from '@backstage/types';
import {
  RefreshSessionDatabase,
  RefreshSessionData,
  CreateRefreshSessionOptions,
} from '../database/RefreshSessionDatabase';
import { TokenIssuer } from './types';
import { UserInfoDatabase } from '../database/UserInfoDatabase';

export type RefreshTokenServiceOptions = {
  logger: LoggerService;
  refreshSessionDatabase: RefreshSessionDatabase;
  userInfoDatabase: UserInfoDatabase;
  tokenIssuer: TokenIssuer;
  /** Default refresh token expiration time in seconds. Defaults to 30 days */
  defaultRefreshTokenExpirationSeconds?: number;
  /** Maximum refresh token expiration time in seconds. Defaults to 90 days */
  maxRefreshTokenExpirationSeconds?: number;
};

export type IssueRefreshTokenOptions = {
  userEntityRef: string;
  claims: JsonObject;
  /** Custom expiration time in seconds. If not provided, uses default */
  expirationSeconds?: number;
};

export type RefreshTokenResult = {
  refreshToken: string;
  sessionData: RefreshSessionData;
};

export type AccessTokenResult = {
  token: string;
  expiresIn: number;
};

const DEFAULT_REFRESH_TOKEN_EXPIRATION_SECONDS = 30 * 24 * 60 * 60; // 30 days
const MAX_REFRESH_TOKEN_EXPIRATION_SECONDS = 90 * 24 * 60 * 60; // 90 days

export class RefreshTokenService {
  private readonly logger: LoggerService;
  private readonly refreshSessionDatabase: RefreshSessionDatabase;
  private readonly userInfoDatabase: UserInfoDatabase;
  private readonly tokenIssuer: TokenIssuer;
  private readonly defaultRefreshTokenExpirationSeconds: number;
  private readonly maxRefreshTokenExpirationSeconds: number;

  constructor(options: RefreshTokenServiceOptions) {
    this.logger = options.logger;
    this.refreshSessionDatabase = options.refreshSessionDatabase;
    this.userInfoDatabase = options.userInfoDatabase;
    this.tokenIssuer = options.tokenIssuer;
    this.defaultRefreshTokenExpirationSeconds =
      options.defaultRefreshTokenExpirationSeconds ??
      DEFAULT_REFRESH_TOKEN_EXPIRATION_SECONDS;
    this.maxRefreshTokenExpirationSeconds =
      options.maxRefreshTokenExpirationSeconds ??
      MAX_REFRESH_TOKEN_EXPIRATION_SECONDS;
  }

  /**
   * Issue a new refresh token for a user
   */
  async issueRefreshToken(
    options: IssueRefreshTokenOptions,
  ): Promise<RefreshTokenResult> {
    const { userEntityRef, claims } = options;

    // Validate expiration time
    let expirationSeconds =
      options.expirationSeconds ?? this.defaultRefreshTokenExpirationSeconds;
    
    if (expirationSeconds > this.maxRefreshTokenExpirationSeconds) {
      this.logger.warn(
        `Requested refresh token expiration ${expirationSeconds}s exceeds maximum ${this.maxRefreshTokenExpirationSeconds}s, using maximum`,
      );
      expirationSeconds = this.maxRefreshTokenExpirationSeconds;
    }

    const expiresAt = DateTime.utc()
      .plus({ seconds: expirationSeconds })
      .toJSDate();

    // Store user info if not already present
    await this.userInfoDatabase.addUserInfo({ claims });

    // Create refresh session
    const { sessionData, refreshToken } =
      await this.refreshSessionDatabase.createRefreshSession({
        userEntityRef,
        claims,
        expiresAt,
      });

    this.logger.info(
      `Issued refresh token for user ${userEntityRef}, expires at ${expiresAt.toISOString()}`,
    );

    return { refreshToken, sessionData };
  }

  /**
   * Exchange a refresh token for a new access token
   */
  async exchangeRefreshToken(
    refreshToken: string,
  ): Promise<AccessTokenResult | null> {
    // Validate and retrieve refresh session
    const sessionData = await this.refreshSessionDatabase.getRefreshSession(
      refreshToken,
    );

    if (!sessionData) {
      this.logger.debug('Invalid or expired refresh token used');
      return null;
    }

    // Update last used timestamp
    await this.refreshSessionDatabase.updateLastUsed(refreshToken);

    // Issue new access token using the stored claims
    const tokenParams: TokenParams = {
      claims: {
        ...sessionData.claims,
        ent: sessionData.claims.ent || [sessionData.userEntityRef],
      },
    };

    try {
      const result = await this.tokenIssuer.issueToken(tokenParams);

      this.logger.debug(
        `Exchanged refresh token for access token for user ${sessionData.userEntityRef}`,
      );

      // Extract expiration from token if available, otherwise assume default
      let expiresIn = 3600; // Default 1 hour
      if ('identity' in result && result.identity) {
        const payload = JSON.parse(
          Buffer.from(result.token.split('.')[1], 'base64').toString(),
        );
        if (payload.exp) {
          expiresIn = payload.exp - Math.floor(Date.now() / 1000);
        }
      }

      return {
        token: result.token,
        expiresIn,
      };
    } catch (error) {
      this.logger.error(
        `Failed to issue access token from refresh token: ${error}`,
      );
      throw error;
    }
  }

  /**
   * Revoke a specific refresh token
   */
  async revokeRefreshToken(refreshToken: string): Promise<boolean> {
    const revoked = await this.refreshSessionDatabase.revokeRefreshSession(
      refreshToken,
    );

    if (revoked) {
      this.logger.info('Refresh token revoked');
    } else {
      this.logger.debug('Attempted to revoke non-existent refresh token');
    }

    return revoked;
  }

  /**
   * Revoke all refresh tokens for a user
   */
  async revokeAllUserRefreshTokens(userEntityRef: string): Promise<number> {
    const revokedCount = await this.refreshSessionDatabase.revokeAllUserSessions(
      userEntityRef,
    );

    this.logger.info(
      `Revoked ${revokedCount} refresh tokens for user ${userEntityRef}`,
    );

    return revokedCount;
  }

  /**
   * Get all active refresh sessions for a user
   */
  async getUserRefreshSessions(
    userEntityRef: string,
  ): Promise<RefreshSessionData[]> {
    return this.refreshSessionDatabase.getUserSessions(userEntityRef);
  }

  /**
   * Clean up expired refresh sessions
   */
  async cleanupExpiredSessions(): Promise<number> {
    const cleanedUp = await this.refreshSessionDatabase.cleanupExpiredSessions();

    if (cleanedUp > 0) {
      this.logger.info(`Cleaned up ${cleanedUp} expired refresh sessions`);
    }

    return cleanedUp;
  }
}