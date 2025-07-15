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
import request from 'supertest';
import { RefreshTokenRouter } from './RefreshTokenRouter';
import { RefreshTokenService } from '../identity/RefreshTokenService';
import { AuthService, LoggerService } from '@backstage/backend-plugin-api';
import { BackstageCredentials } from '@backstage/plugin-auth-node';

describe('RefreshTokenRouter', () => {
  let app: express.Application;
  let mockRefreshTokenService: jest.Mocked<RefreshTokenService>;
  let mockAuthService: jest.Mocked<AuthService>;
  let mockLogger: jest.Mocked<LoggerService>;

  beforeEach(() => {
    mockRefreshTokenService = {
      issueRefreshToken: jest.fn(),
      exchangeRefreshToken: jest.fn(),
      revokeRefreshToken: jest.fn(),
      revokeAllUserRefreshTokens: jest.fn(),
      getUserRefreshSessions: jest.fn(),
      cleanupExpiredSessions: jest.fn(),
    } as any;

    mockAuthService = {
      authenticate: jest.fn(),
    } as any;

    mockLogger = {
      info: jest.fn(),
      warn: jest.fn(),
      error: jest.fn(),
      debug: jest.fn(),
      child: jest.fn(() => mockLogger),
    } as any;

    const router = RefreshTokenRouter.create({
      logger: mockLogger,
      auth: mockAuthService,
      refreshTokenService: mockRefreshTokenService,
    });

    app = express();
    app.use(express.json());
    app.use(router.getRouter());
  });

  const mockCredentials: BackstageCredentials<any> = {
    principal: {
      type: 'user',
      userEntityRef: 'user:default/test',
      ownershipEntityRefs: ['user:default/test'],
      claims: {},
    },
  };

  describe('POST /refresh-tokens', () => {
    it('should issue a new refresh token', async () => {
      const mockResult = {
        refreshToken: 'bsr_abc123',
        sessionData: {
          sessionId: 'session-123',
          userEntityRef: 'user:default/test',
          claims: { sub: 'user:default/test', ent: ['user:default/test'] },
          createdAt: new Date(),
          expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
          revoked: false,
        },
      };

      mockAuthService.authenticate.mockResolvedValue(mockCredentials);
      mockRefreshTokenService.issueRefreshToken.mockResolvedValue(mockResult);

      const response = await request(app)
        .post('/refresh-tokens')
        .send({})
        .expect(200);

      expect(response.body).toEqual({
        refreshToken: mockResult.refreshToken,
        expiresAt: mockResult.sessionData.expiresAt.toISOString(),
        sessionId: mockResult.sessionData.sessionId,
      });

      expect(mockRefreshTokenService.issueRefreshToken).toHaveBeenCalledWith({
        userEntityRef: 'user:default/test',
        claims: {
          sub: 'user:default/test',
          ent: ['user:default/test'],
        },
        expirationSeconds: undefined,
      });
    });

    it('should issue a refresh token with custom expiration', async () => {
      const mockResult = {
        refreshToken: 'bsr_abc123',
        sessionData: {
          sessionId: 'session-123',
          userEntityRef: 'user:default/test',
          claims: { sub: 'user:default/test' },
          createdAt: new Date(),
          expiresAt: new Date(),
          revoked: false,
        },
      };

      mockAuthService.authenticate.mockResolvedValue(mockCredentials);
      mockRefreshTokenService.issueRefreshToken.mockResolvedValue(mockResult);

      await request(app)
        .post('/refresh-tokens')
        .send({ expirationSeconds: 7200 })
        .expect(200);

      expect(mockRefreshTokenService.issueRefreshToken).toHaveBeenCalledWith({
        userEntityRef: 'user:default/test',
        claims: {
          sub: 'user:default/test',
          ent: ['user:default/test'],
        },
        expirationSeconds: 7200,
      });
    });

    it('should reject unauthenticated requests', async () => {
      mockAuthService.authenticate.mockResolvedValue(null);

      await request(app)
        .post('/refresh-tokens')
        .send({})
        .expect(401);
    });

    it('should reject invalid expiration seconds', async () => {
      mockAuthService.authenticate.mockResolvedValue(mockCredentials);

      await request(app)
        .post('/refresh-tokens')
        .send({ expirationSeconds: -1 })
        .expect(400);

      await request(app)
        .post('/refresh-tokens')
        .send({ expirationSeconds: 'invalid' })
        .expect(400);
    });
  });

  describe('POST /refresh-tokens/exchange', () => {
    it('should exchange refresh token for access token', async () => {
      const mockResult = {
        token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
        expiresIn: 3600,
      };

      mockRefreshTokenService.exchangeRefreshToken.mockResolvedValue(mockResult);

      const response = await request(app)
        .post('/refresh-tokens/exchange')
        .send({ refreshToken: 'bsr_abc123' })
        .expect(200);

      expect(response.body).toEqual({
        accessToken: mockResult.token,
        tokenType: 'bearer',
        expiresIn: mockResult.expiresIn,
      });

      expect(mockRefreshTokenService.exchangeRefreshToken).toHaveBeenCalledWith('bsr_abc123');
    });

    it('should reject invalid refresh tokens', async () => {
      mockRefreshTokenService.exchangeRefreshToken.mockResolvedValue(null);

      await request(app)
        .post('/refresh-tokens/exchange')
        .send({ refreshToken: 'invalid-token' })
        .expect(401);
    });

    it('should reject missing refresh token', async () => {
      await request(app)
        .post('/refresh-tokens/exchange')
        .send({})
        .expect(400);

      await request(app)
        .post('/refresh-tokens/exchange')
        .send({ refreshToken: 123 })
        .expect(400);
    });
  });

  describe('DELETE /refresh-tokens/:token', () => {
    it('should revoke a refresh token', async () => {
      mockRefreshTokenService.revokeRefreshToken.mockResolvedValue(true);

      await request(app)
        .delete('/refresh-tokens/bsr_abc123')
        .expect(204);

      expect(mockRefreshTokenService.revokeRefreshToken).toHaveBeenCalledWith('bsr_abc123');
    });

    it('should return 404 for non-existent token', async () => {
      mockRefreshTokenService.revokeRefreshToken.mockResolvedValue(false);

      await request(app)
        .delete('/refresh-tokens/non-existent')
        .expect(404);
    });
  });

  describe('GET /refresh-tokens', () => {
    it('should get user refresh sessions', async () => {
      const mockSessions = [
        {
          sessionId: 'session-1',
          userEntityRef: 'user:default/test',
          claims: { sub: 'user:default/test' },
          createdAt: new Date('2023-01-01T00:00:00Z'),
          expiresAt: new Date('2023-01-31T00:00:00Z'),
          lastUsedAt: new Date('2023-01-15T00:00:00Z'),
          revoked: false,
        },
        {
          sessionId: 'session-2',
          userEntityRef: 'user:default/test',
          claims: { sub: 'user:default/test' },
          createdAt: new Date('2023-01-02T00:00:00Z'),
          expiresAt: new Date('2023-02-01T00:00:00Z'),
          revoked: false,
        },
      ];

      mockAuthService.authenticate.mockResolvedValue(mockCredentials);
      mockRefreshTokenService.getUserRefreshSessions.mockResolvedValue(mockSessions);

      const response = await request(app)
        .get('/refresh-tokens')
        .expect(200);

      expect(response.body).toEqual({
        sessions: [
          {
            sessionId: 'session-1',
            createdAt: '2023-01-01T00:00:00.000Z',
            expiresAt: '2023-01-31T00:00:00.000Z',
            lastUsedAt: '2023-01-15T00:00:00.000Z',
          },
          {
            sessionId: 'session-2',
            createdAt: '2023-01-02T00:00:00.000Z',
            expiresAt: '2023-02-01T00:00:00.000Z',
            lastUsedAt: undefined,
          },
        ],
      });

      expect(mockRefreshTokenService.getUserRefreshSessions).toHaveBeenCalledWith('user:default/test');
    });

    it('should reject unauthenticated requests', async () => {
      mockAuthService.authenticate.mockResolvedValue(null);

      await request(app)
        .get('/refresh-tokens')
        .expect(401);
    });
  });

  describe('DELETE /refresh-tokens', () => {
    it('should revoke all user refresh tokens', async () => {
      mockAuthService.authenticate.mockResolvedValue(mockCredentials);
      mockRefreshTokenService.revokeAllUserRefreshTokens.mockResolvedValue(3);

      const response = await request(app)
        .delete('/refresh-tokens')
        .expect(200);

      expect(response.body).toEqual({ revokedCount: 3 });
      expect(mockRefreshTokenService.revokeAllUserRefreshTokens).toHaveBeenCalledWith('user:default/test');
    });

    it('should reject unauthenticated requests', async () => {
      mockAuthService.authenticate.mockResolvedValue(null);

      await request(app)
        .delete('/refresh-tokens')
        .expect(401);
    });
  });
});