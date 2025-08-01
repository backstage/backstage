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

import express from 'express';
import Router from 'express-promise-router';
import { LoggerService, AuthService } from '@backstage/backend-plugin-api';
import { getBearerTokenFromAuthorizationHeader } from '@backstage/plugin-auth-node';
import { InputError, NotFoundError, AuthenticationError } from '@backstage/errors';
import { RefreshTokenService } from '../identity/RefreshTokenService';

export interface RefreshTokenRouterOptions {
  logger: LoggerService;
  auth: AuthService;
  refreshTokenService: RefreshTokenService;
}

export class RefreshTokenRouter {
  private readonly logger: LoggerService;
  private readonly auth: AuthService;
  private readonly refreshTokenService: RefreshTokenService;

  constructor(options: RefreshTokenRouterOptions) {
    this.logger = options.logger;
    this.auth = options.auth;
    this.refreshTokenService = options.refreshTokenService;
  }

  getRouter(): express.Router {
    const router = Router();

    // Issue a new refresh token
    router.post('/refresh-tokens', async (req, res) => {
      try {
        // Require authentication
        const credentials = await this.auth.authenticate(req);
        if (!credentials) {
          throw new AuthenticationError('Authentication required');
        }

        const { expirationSeconds } = req.body;

        // Validate expiration if provided
        if (expirationSeconds !== undefined) {
          if (typeof expirationSeconds !== 'number' || expirationSeconds <= 0) {
            throw new InputError('Invalid expirationSeconds');
          }
        }

        const userEntityRef = credentials.principal.userEntityRef;
        const claims = {
          sub: userEntityRef,
          ent: credentials.principal.ownershipEntityRefs || [userEntityRef],
          // Include any additional claims from the principal
          ...credentials.principal.claims,
        };

        const result = await this.refreshTokenService.issueRefreshToken({
          userEntityRef,
          claims,
          expirationSeconds,
        });

        res.json({
          refreshToken: result.refreshToken,
          expiresAt: result.sessionData.expiresAt.toISOString(),
          sessionId: result.sessionData.sessionId,
        });
      } catch (error) {
        this.logger.error(`Failed to issue refresh token: ${error}`);
        throw error;
      }
    });

    // Exchange refresh token for access token
    router.post('/refresh-tokens/exchange', async (req, res) => {
      try {
        const { refreshToken } = req.body;

        if (!refreshToken || typeof refreshToken !== 'string') {
          throw new InputError('Missing or invalid refreshToken');
        }

        const result = await this.refreshTokenService.exchangeRefreshToken(refreshToken);

        if (!result) {
          throw new AuthenticationError('Invalid or expired refresh token');
        }

        res.json({
          accessToken: result.token,
          tokenType: 'bearer',
          expiresIn: result.expiresIn,
        });
      } catch (error) {
        this.logger.error(`Failed to exchange refresh token: ${error}`);
        throw error;
      }
    });

    // Revoke a specific refresh token
    router.delete('/refresh-tokens/:token', async (req, res) => {
      try {
        const { token } = req.params;

        if (!token) {
          throw new InputError('Missing refresh token');
        }

        const revoked = await this.refreshTokenService.revokeRefreshToken(token);

        if (!revoked) {
          throw new NotFoundError('Refresh token not found');
        }

        res.status(204).send();
      } catch (error) {
        this.logger.error(`Failed to revoke refresh token: ${error}`);
        throw error;
      }
    });

    // Get user's refresh sessions
    router.get('/refresh-tokens', async (req, res) => {
      try {
        // Require authentication
        const credentials = await this.auth.authenticate(req);
        if (!credentials) {
          throw new AuthenticationError('Authentication required');
        }

        const userEntityRef = credentials.principal.userEntityRef;
        const sessions = await this.refreshTokenService.getUserRefreshSessions(userEntityRef);

        // Don't include sensitive session data, just metadata
        const sanitizedSessions = sessions.map(session => ({
          sessionId: session.sessionId,
          createdAt: session.createdAt.toISOString(),
          expiresAt: session.expiresAt.toISOString(),
          lastUsedAt: session.lastUsedAt?.toISOString(),
        }));

        res.json({ sessions: sanitizedSessions });
      } catch (error) {
        this.logger.error(`Failed to get user refresh sessions: ${error}`);
        throw error;
      }
    });

    // Revoke all refresh tokens for current user
    router.delete('/refresh-tokens', async (req, res) => {
      try {
        // Require authentication
        const credentials = await this.auth.authenticate(req);
        if (!credentials) {
          throw new AuthenticationError('Authentication required');
        }

        const userEntityRef = credentials.principal.userEntityRef;
        const revokedCount = await this.refreshTokenService.revokeAllUserRefreshTokens(userEntityRef);

        res.json({ revokedCount });
      } catch (error) {
        this.logger.error(`Failed to revoke all user refresh tokens: ${error}`);
        throw error;
      }
    });

    return router;
  }

  static create(options: RefreshTokenRouterOptions): RefreshTokenRouter {
    return new RefreshTokenRouter(options);
  }
}