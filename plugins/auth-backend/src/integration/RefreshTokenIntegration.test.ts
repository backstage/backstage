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

import { resolvePackagePath } from '@backstage/backend-plugin-api';
import { TestDatabaseId, TestDatabases } from '@backstage/backend-test-utils';
import { AuthDatabase } from '../database/AuthDatabase';
import { RefreshSessionDatabase } from '../database/RefreshSessionDatabase';
import { UserInfoDatabase } from '../database/UserInfoDatabase';
import { RefreshTokenService } from '../identity/RefreshTokenService';
import { TokenIssuer } from '../identity/types';
import { DateTime } from 'luxon';

const migrationsDir = resolvePackagePath(
  '@backstage/plugin-auth-backend',
  'migrations',
);

jest.setTimeout(60_000);

// Mock TokenIssuer for testing
const mockTokenIssuer: TokenIssuer = {
  async issueToken(params) {
    const payload = {
      sub: params.claims.sub,
      ent: params.claims.ent,
      aud: 'backstage',
      exp: Math.floor(Date.now() / 1000) + 3600, // 1 hour from now
      iat: Math.floor(Date.now() / 1000),
    };
    
    // Create a mock JWT token (not actually signed, just for testing)
    const header = Buffer.from(JSON.stringify({ alg: 'HS256', typ: 'JWT' })).toString('base64url');
    const payloadEncoded = Buffer.from(JSON.stringify(payload)).toString('base64url');
    const signature = 'mock-signature';
    
    return {
      token: `${header}.${payloadEncoded}.${signature}`,
    };
  },
  
  async listPublicKeys() {
    return { keys: [] };
  },
};

describe('Refresh Token Integration', () => {
  const databases = TestDatabases.create();

  async function createServices(databaseId: TestDatabaseId) {
    const knex = await databases.init(databaseId);

    await knex.migrate.latest({
      directory: migrationsDir,
    });

    const database = AuthDatabase.create({
      getClient: async () => knex,
    });

    const refreshSessionDatabase = await RefreshSessionDatabase.create({ database });
    const userInfoDatabase = await UserInfoDatabase.create({ database });

    const refreshTokenService = new RefreshTokenService({
      logger: {
        info: jest.fn(),
        warn: jest.fn(),
        error: jest.fn(),
        debug: jest.fn(),
        child: jest.fn().mockReturnThis(),
      } as any,
      refreshSessionDatabase,
      userInfoDatabase,
      tokenIssuer: mockTokenIssuer,
      defaultRefreshTokenExpirationSeconds: 30 * 24 * 60 * 60, // 30 days
      maxRefreshTokenExpirationSeconds: 90 * 24 * 60 * 60, // 90 days
    });

    return {
      knex,
      refreshTokenService,
      refreshSessionDatabase,
      userInfoDatabase,
    };
  }

  it.each(databases.eachSupportedId())(
    'should complete full refresh token flow, %p',
    async databaseId => {
      const { refreshTokenService } = await createServices(databaseId);

      const userEntityRef = 'user:default/testuser';
      const claims = {
        sub: userEntityRef,
        ent: [userEntityRef],
        email: 'testuser@example.com',
      };

      // Step 1: Issue a refresh token
      const { refreshToken, sessionData } = await refreshTokenService.issueRefreshToken({
        userEntityRef,
        claims,
      });

      expect(refreshToken).toMatch(/^bsr_/);
      expect(sessionData.userEntityRef).toBe(userEntityRef);
      expect(sessionData.claims).toEqual(claims);
      expect(sessionData.expiresAt.getTime()).toBeGreaterThan(Date.now());

      // Step 2: Exchange refresh token for access token
      const accessTokenResult = await refreshTokenService.exchangeRefreshToken(refreshToken);

      expect(accessTokenResult).not.toBeNull();
      expect(accessTokenResult!.token).toMatch(/^[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+$/); // JWT format
      expect(accessTokenResult!.expiresIn).toBeGreaterThan(0);

      // Step 3: Exchange again to verify token is still valid
      const secondExchange = await refreshTokenService.exchangeRefreshToken(refreshToken);
      expect(secondExchange).not.toBeNull();

      // Step 4: Get user sessions
      const sessions = await refreshTokenService.getUserRefreshSessions(userEntityRef);
      expect(sessions).toHaveLength(1);
      expect(sessions[0].sessionId).toBe(sessionData.sessionId);
      expect(sessions[0].lastUsedAt).toBeDefined(); // Should be set after exchange

      // Step 5: Revoke the refresh token
      const revoked = await refreshTokenService.revokeRefreshToken(refreshToken);
      expect(revoked).toBe(true);

      // Step 6: Try to exchange revoked token (should fail)
      const failedExchange = await refreshTokenService.exchangeRefreshToken(refreshToken);
      expect(failedExchange).toBeNull();

      // Step 7: Verify sessions are no longer active
      const sessionsAfterRevoke = await refreshTokenService.getUserRefreshSessions(userEntityRef);
      expect(sessionsAfterRevoke).toHaveLength(0);
    },
  );

  it.each(databases.eachSupportedId())(
    'should handle multiple refresh tokens for same user, %p',
    async databaseId => {
      const { refreshTokenService } = await createServices(databaseId);

      const userEntityRef = 'user:default/multiuser';
      const claims = {
        sub: userEntityRef,
        ent: [userEntityRef],
      };

      // Issue multiple refresh tokens
      const token1 = await refreshTokenService.issueRefreshToken({
        userEntityRef,
        claims,
        expirationSeconds: 7 * 24 * 60 * 60, // 7 days
      });

      const token2 = await refreshTokenService.issueRefreshToken({
        userEntityRef,
        claims,
        expirationSeconds: 14 * 24 * 60 * 60, // 14 days
      });

      // Both should be valid
      expect(await refreshTokenService.exchangeRefreshToken(token1.refreshToken)).not.toBeNull();
      expect(await refreshTokenService.exchangeRefreshToken(token2.refreshToken)).not.toBeNull();

      // Should have 2 active sessions
      let sessions = await refreshTokenService.getUserRefreshSessions(userEntityRef);
      expect(sessions).toHaveLength(2);

      // Revoke all tokens for user
      const revokedCount = await refreshTokenService.revokeAllUserRefreshTokens(userEntityRef);
      expect(revokedCount).toBe(2);

      // Both tokens should now be invalid
      expect(await refreshTokenService.exchangeRefreshToken(token1.refreshToken)).toBeNull();
      expect(await refreshTokenService.exchangeRefreshToken(token2.refreshToken)).toBeNull();

      // Should have no active sessions
      sessions = await refreshTokenService.getUserRefreshSessions(userEntityRef);
      expect(sessions).toHaveLength(0);
    },
  );

  it.each(databases.eachSupportedId())(
    'should cleanup expired sessions, %p',
    async databaseId => {
      const { refreshTokenService, knex } = await createServices(databaseId);

      const userEntityRef = 'user:default/expireduser';
      const claims = {
        sub: userEntityRef,
        ent: [userEntityRef],
      };

      // Create an expired session by directly inserting into database
      const expiredSessionId = 'expired-session-id';
      const expiredToken = 'bsr_expired_token';
      const tokenHash = require('crypto').createHash('sha256').update(expiredToken).digest('hex');

      await knex('refresh_sessions').insert({
        session_id: expiredSessionId,
        user_entity_ref: userEntityRef,
        token_hash: tokenHash,
        session_data: JSON.stringify({
          sessionId: expiredSessionId,
          userEntityRef,
          claims,
          createdAt: new Date(),
          expiresAt: DateTime.utc().minus({ days: 1 }).toJSDate(),
          revoked: false,
        }),
        created_at: DateTime.utc().minus({ days: 2 }).toSQL({ includeOffset: false }),
        expires_at: DateTime.utc().minus({ days: 1 }).toSQL({ includeOffset: false }),
        revoked: false,
      });

      // Create a valid session
      await refreshTokenService.issueRefreshToken({
        userEntityRef,
        claims,
      });

      // Should have 2 sessions total before cleanup
      const totalBefore = await knex('refresh_sessions').count('* as count');
      expect(totalBefore[0].count).toBe(2);

      // Cleanup expired sessions
      const cleanedUp = await refreshTokenService.cleanupExpiredSessions();
      expect(cleanedUp).toBe(1);

      // Should have 1 session remaining after cleanup
      const totalAfter = await knex('refresh_sessions').count('* as count');
      expect(totalAfter[0].count).toBe(1);

      // The expired token should not be usable
      expect(await refreshTokenService.exchangeRefreshToken(expiredToken)).toBeNull();
    },
  );

  it.each(databases.eachSupportedId())(
    'should enforce maximum expiration time, %p',
    async databaseId => {
      const { refreshTokenService } = await createServices(databaseId);

      const userEntityRef = 'user:default/maxexpiry';
      const claims = {
        sub: userEntityRef,
        ent: [userEntityRef],
      };

      // Try to issue token with excessive expiration (100 days)
      const excessiveExpiration = 100 * 24 * 60 * 60;
      const maxExpiration = 90 * 24 * 60 * 60; // Service max is 90 days

      const result = await refreshTokenService.issueRefreshToken({
        userEntityRef,
        claims,
        expirationSeconds: excessiveExpiration,
      });

      // Should have been capped at maximum
      const actualExpiration = Math.floor(
        (result.sessionData.expiresAt.getTime() - result.sessionData.createdAt.getTime()) / 1000,
      );

      // Allow some tolerance for timing differences
      expect(actualExpiration).toBeLessThanOrEqual(maxExpiration + 60);
      expect(actualExpiration).toBeGreaterThan(maxExpiration - 60);
    },
  );
});