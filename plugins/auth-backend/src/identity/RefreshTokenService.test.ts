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

import { RefreshTokenService } from './RefreshTokenService';
import { RefreshSessionDatabase } from '../database/RefreshSessionDatabase';
import { UserInfoDatabase } from '../database/UserInfoDatabase';
import { TokenIssuer } from './types';
import { LoggerService } from '@backstage/backend-plugin-api';
import { DateTime } from 'luxon';

describe('RefreshTokenService', () => {
  let refreshTokenService: RefreshTokenService;
  let mockRefreshSessionDatabase: jest.Mocked<RefreshSessionDatabase>;
  let mockUserInfoDatabase: jest.Mocked<UserInfoDatabase>;
  let mockTokenIssuer: jest.Mocked<TokenIssuer>;
  let mockLogger: jest.Mocked<LoggerService>;

  beforeEach(() => {
    mockRefreshSessionDatabase = {
      createRefreshSession: jest.fn(),
      getRefreshSession: jest.fn(),
      updateLastUsed: jest.fn(),
      revokeRefreshSession: jest.fn(),
      revokeAllUserSessions: jest.fn(),
      getUserSessions: jest.fn(),
      cleanupExpiredSessions: jest.fn(),
    } as any;

    mockUserInfoDatabase = {
      addUserInfo: jest.fn(),
      getUserInfo: jest.fn(),
    } as any;

    mockTokenIssuer = {
      issueToken: jest.fn(),
      listPublicKeys: jest.fn(),
    };

    mockLogger = {
      info: jest.fn(),
      warn: jest.fn(),
      error: jest.fn(),
      debug: jest.fn(),
      child: jest.fn(() => mockLogger),
    } as any;

    refreshTokenService = new RefreshTokenService({
      logger: mockLogger,
      refreshSessionDatabase: mockRefreshSessionDatabase,
      userInfoDatabase: mockUserInfoDatabase,
      tokenIssuer: mockTokenIssuer,
    });
  });

  describe('issueRefreshToken', () => {
    it('should issue a refresh token with default expiration', async () => {
      const userEntityRef = 'user:default/test';
      const claims = { sub: userEntityRef, ent: [userEntityRef] };
      const mockSessionData = {
        sessionId: 'session-123',
        userEntityRef,
        claims,
        createdAt: new Date(),
        expiresAt: new Date(),
        revoked: false,
      };
      const mockRefreshToken = 'bsr_abc123';

      mockRefreshSessionDatabase.createRefreshSession.mockResolvedValue({
        sessionData: mockSessionData,
        refreshToken: mockRefreshToken,
      });

      const result = await refreshTokenService.issueRefreshToken({
        userEntityRef,
        claims,
      });

      expect(result.refreshToken).toBe(mockRefreshToken);
      expect(result.sessionData).toBe(mockSessionData);
      expect(mockUserInfoDatabase.addUserInfo).toHaveBeenCalledWith({ claims });
      expect(mockRefreshSessionDatabase.createRefreshSession).toHaveBeenCalled();
    });

    it('should enforce maximum expiration time', async () => {
      const userEntityRef = 'user:default/test';
      const claims = { sub: userEntityRef, ent: [userEntityRef] };
      const excessiveExpiration = 100 * 24 * 60 * 60; // 100 days

      mockRefreshSessionDatabase.createRefreshSession.mockResolvedValue({
        sessionData: {} as any,
        refreshToken: 'token',
      });

      await refreshTokenService.issueRefreshToken({
        userEntityRef,
        claims,
        expirationSeconds: excessiveExpiration,
      });

      expect(mockLogger.warn).toHaveBeenCalledWith(
        expect.stringContaining('exceeds maximum'),
      );
    });
  });

  describe('exchangeRefreshToken', () => {
    it('should exchange valid refresh token for access token', async () => {
      const refreshToken = 'bsr_abc123';
      const sessionData = {
        sessionId: 'session-123',
        userEntityRef: 'user:default/test',
        claims: { sub: 'user:default/test', ent: ['user:default/test'] },
        createdAt: new Date(),
        expiresAt: DateTime.utc().plus({ days: 30 }).toJSDate(),
        revoked: false,
      };
      const accessToken = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1c2VyOmRlZmF1bHQvdGVzdCIsImV4cCI6MTY0MDk5NTIwMH0.signature';

      mockRefreshSessionDatabase.getRefreshSession.mockResolvedValue(sessionData);
      mockTokenIssuer.issueToken.mockResolvedValue({ token: accessToken });

      const result = await refreshTokenService.exchangeRefreshToken(refreshToken);

      expect(result).not.toBeNull();
      expect(result!.token).toBe(accessToken);
      expect(mockRefreshSessionDatabase.updateLastUsed).toHaveBeenCalledWith(refreshToken);
      expect(mockTokenIssuer.issueToken).toHaveBeenCalled();
    });

    it('should return null for invalid refresh token', async () => {
      const refreshToken = 'invalid-token';

      mockRefreshSessionDatabase.getRefreshSession.mockResolvedValue(undefined);

      const result = await refreshTokenService.exchangeRefreshToken(refreshToken);

      expect(result).toBeNull();
      expect(mockRefreshSessionDatabase.updateLastUsed).not.toHaveBeenCalled();
      expect(mockTokenIssuer.issueToken).not.toHaveBeenCalled();
    });

    it('should handle token issuer errors', async () => {
      const refreshToken = 'bsr_abc123';
      const sessionData = {
        sessionId: 'session-123',
        userEntityRef: 'user:default/test',
        claims: { sub: 'user:default/test', ent: ['user:default/test'] },
        createdAt: new Date(),
        expiresAt: DateTime.utc().plus({ days: 30 }).toJSDate(),
        revoked: false,
      };

      mockRefreshSessionDatabase.getRefreshSession.mockResolvedValue(sessionData);
      mockTokenIssuer.issueToken.mockRejectedValue(new Error('Token issue failed'));

      await expect(
        refreshTokenService.exchangeRefreshToken(refreshToken),
      ).rejects.toThrow('Token issue failed');

      expect(mockLogger.error).toHaveBeenCalledWith(
        expect.stringContaining('Failed to issue access token'),
      );
    });
  });

  describe('revokeRefreshToken', () => {
    it('should revoke a refresh token', async () => {
      const refreshToken = 'bsr_abc123';

      mockRefreshSessionDatabase.revokeRefreshSession.mockResolvedValue(true);

      const result = await refreshTokenService.revokeRefreshToken(refreshToken);

      expect(result).toBe(true);
      expect(mockRefreshSessionDatabase.revokeRefreshSession).toHaveBeenCalledWith(refreshToken);
      expect(mockLogger.info).toHaveBeenCalledWith('Refresh token revoked');
    });

    it('should handle non-existent token revocation', async () => {
      const refreshToken = 'non-existent-token';

      mockRefreshSessionDatabase.revokeRefreshSession.mockResolvedValue(false);

      const result = await refreshTokenService.revokeRefreshToken(refreshToken);

      expect(result).toBe(false);
      expect(mockLogger.debug).toHaveBeenCalledWith(
        'Attempted to revoke non-existent refresh token',
      );
    });
  });

  describe('revokeAllUserRefreshTokens', () => {
    it('should revoke all user refresh tokens', async () => {
      const userEntityRef = 'user:default/test';
      const revokedCount = 3;

      mockRefreshSessionDatabase.revokeAllUserSessions.mockResolvedValue(revokedCount);

      const result = await refreshTokenService.revokeAllUserRefreshTokens(userEntityRef);

      expect(result).toBe(revokedCount);
      expect(mockRefreshSessionDatabase.revokeAllUserSessions).toHaveBeenCalledWith(userEntityRef);
      expect(mockLogger.info).toHaveBeenCalledWith(
        `Revoked ${revokedCount} refresh tokens for user ${userEntityRef}`,
      );
    });
  });

  describe('getUserRefreshSessions', () => {
    it('should get user refresh sessions', async () => {
      const userEntityRef = 'user:default/test';
      const mockSessions = [
        {
          sessionId: 'session-1',
          userEntityRef,
          claims: { sub: userEntityRef },
          createdAt: new Date(),
          expiresAt: new Date(),
          revoked: false,
        },
      ];

      mockRefreshSessionDatabase.getUserSessions.mockResolvedValue(mockSessions);

      const result = await refreshTokenService.getUserRefreshSessions(userEntityRef);

      expect(result).toBe(mockSessions);
      expect(mockRefreshSessionDatabase.getUserSessions).toHaveBeenCalledWith(userEntityRef);
    });
  });

  describe('cleanupExpiredSessions', () => {
    it('should cleanup expired sessions', async () => {
      const cleanedUpCount = 5;

      mockRefreshSessionDatabase.cleanupExpiredSessions.mockResolvedValue(cleanedUpCount);

      const result = await refreshTokenService.cleanupExpiredSessions();

      expect(result).toBe(cleanedUpCount);
      expect(mockRefreshSessionDatabase.cleanupExpiredSessions).toHaveBeenCalled();
      expect(mockLogger.info).toHaveBeenCalledWith(
        `Cleaned up ${cleanedUpCount} expired refresh sessions`,
      );
    });

    it('should not log when no sessions are cleaned up', async () => {
      mockRefreshSessionDatabase.cleanupExpiredSessions.mockResolvedValue(0);

      await refreshTokenService.cleanupExpiredSessions();

      expect(mockLogger.info).not.toHaveBeenCalled();
    });
  });
});