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
import { Knex } from 'knex';
import { RefreshSessionDatabase } from './RefreshSessionDatabase';
import { AuthDatabase } from './AuthDatabase';
import { DateTime } from 'luxon';

const migrationsDir = resolvePackagePath(
  '@backstage/plugin-auth-backend',
  'migrations',
);

jest.setTimeout(60_000);

describe('RefreshSessionDatabase', () => {
  const databases = TestDatabases.create();

  async function createDatabaseHandler(databaseId: TestDatabaseId) {
    const knex = await databases.init(databaseId);

    await knex.migrate.latest({
      directory: migrationsDir,
    });

    return {
      knex,
      dbHandler: await RefreshSessionDatabase.create({
        database: AuthDatabase.create({
          getClient: async () => knex,
        }),
      }),
    };
  }

  it.each(databases.eachSupportedId())(
    'should create and retrieve refresh session, %p',
    async databaseId => {
      const { dbHandler } = await createDatabaseHandler(databaseId);

      const userEntityRef = 'user:default/test';
      const claims = { sub: userEntityRef, ent: [userEntityRef] };
      const expiresAt = DateTime.utc().plus({ days: 30 }).toJSDate();

      const { sessionData, refreshToken } = await dbHandler.createRefreshSession({
        userEntityRef,
        claims,
        expiresAt,
      });

      expect(sessionData.userEntityRef).toBe(userEntityRef);
      expect(sessionData.claims).toEqual(claims);
      expect(sessionData.revoked).toBe(false);
      expect(refreshToken).toMatch(/^bsr_/);

      const retrievedSession = await dbHandler.getRefreshSession(refreshToken);
      expect(retrievedSession).toBeDefined();
      expect(retrievedSession!.sessionId).toBe(sessionData.sessionId);
      expect(retrievedSession!.userEntityRef).toBe(userEntityRef);
      expect(retrievedSession!.claims).toEqual(claims);
    },
  );

  it.each(databases.eachSupportedId())(
    'should return undefined for invalid token, %p',
    async databaseId => {
      const { dbHandler } = await createDatabaseHandler(databaseId);

      const result = await dbHandler.getRefreshSession('invalid_token');
      expect(result).toBeUndefined();
    },
  );

  it.each(databases.eachSupportedId())(
    'should return undefined for expired session, %p',
    async databaseId => {
      const { dbHandler } = await createDatabaseHandler(databaseId);

      const userEntityRef = 'user:default/test';
      const claims = { sub: userEntityRef, ent: [userEntityRef] };
      const expiresAt = DateTime.utc().minus({ days: 1 }).toJSDate(); // expired

      const { refreshToken } = await dbHandler.createRefreshSession({
        userEntityRef,
        claims,
        expiresAt,
      });

      const result = await dbHandler.getRefreshSession(refreshToken);
      expect(result).toBeUndefined();
    },
  );

  it.each(databases.eachSupportedId())(
    'should revoke refresh session, %p',
    async databaseId => {
      const { dbHandler } = await createDatabaseHandler(databaseId);

      const userEntityRef = 'user:default/test';
      const claims = { sub: userEntityRef, ent: [userEntityRef] };
      const expiresAt = DateTime.utc().plus({ days: 30 }).toJSDate();

      const { refreshToken } = await dbHandler.createRefreshSession({
        userEntityRef,
        claims,
        expiresAt,
      });

      // Token should be valid initially
      let session = await dbHandler.getRefreshSession(refreshToken);
      expect(session).toBeDefined();

      // Revoke the token
      const revoked = await dbHandler.revokeRefreshSession(refreshToken);
      expect(revoked).toBe(true);

      // Token should no longer be valid
      session = await dbHandler.getRefreshSession(refreshToken);
      expect(session).toBeUndefined();
    },
  );

  it.each(databases.eachSupportedId())(
    'should update last used timestamp, %p',
    async databaseId => {
      const { dbHandler } = await createDatabaseHandler(databaseId);

      const userEntityRef = 'user:default/test';
      const claims = { sub: userEntityRef, ent: [userEntityRef] };
      const expiresAt = DateTime.utc().plus({ days: 30 }).toJSDate();

      const { refreshToken } = await dbHandler.createRefreshSession({
        userEntityRef,
        claims,
        expiresAt,
      });

      // Initially last used should be undefined
      let session = await dbHandler.getRefreshSession(refreshToken);
      expect(session!.lastUsedAt).toBeUndefined();

      // Update last used
      await dbHandler.updateLastUsed(refreshToken);

      // Now last used should be set
      session = await dbHandler.getRefreshSession(refreshToken);
      expect(session!.lastUsedAt).toBeDefined();
      expect(session!.lastUsedAt!.getTime()).toBeCloseTo(Date.now(), -2000); // within 2 seconds
    },
  );

  it.each(databases.eachSupportedId())(
    'should get user sessions, %p',
    async databaseId => {
      const { dbHandler } = await createDatabaseHandler(databaseId);

      const userEntityRef = 'user:default/test';
      const claims = { sub: userEntityRef, ent: [userEntityRef] };
      const expiresAt = DateTime.utc().plus({ days: 30 }).toJSDate();

      // Create multiple sessions for the user
      await dbHandler.createRefreshSession({
        userEntityRef,
        claims,
        expiresAt,
      });
      await dbHandler.createRefreshSession({
        userEntityRef,
        claims,
        expiresAt,
      });

      const sessions = await dbHandler.getUserSessions(userEntityRef);
      expect(sessions).toHaveLength(2);
      expect(sessions[0].userEntityRef).toBe(userEntityRef);
      expect(sessions[1].userEntityRef).toBe(userEntityRef);
    },
  );

  it.each(databases.eachSupportedId())(
    'should revoke all user sessions, %p',
    async databaseId => {
      const { dbHandler } = await createDatabaseHandler(databaseId);

      const userEntityRef = 'user:default/test';
      const claims = { sub: userEntityRef, ent: [userEntityRef] };
      const expiresAt = DateTime.utc().plus({ days: 30 }).toJSDate();

      // Create multiple sessions for the user
      const { refreshToken: token1 } = await dbHandler.createRefreshSession({
        userEntityRef,
        claims,
        expiresAt,
      });
      const { refreshToken: token2 } = await dbHandler.createRefreshSession({
        userEntityRef,
        claims,
        expiresAt,
      });

      // Both tokens should be valid
      expect(await dbHandler.getRefreshSession(token1)).toBeDefined();
      expect(await dbHandler.getRefreshSession(token2)).toBeDefined();

      // Revoke all sessions for the user
      const revokedCount = await dbHandler.revokeAllUserSessions(userEntityRef);
      expect(revokedCount).toBe(2);

      // Both tokens should now be invalid
      expect(await dbHandler.getRefreshSession(token1)).toBeUndefined();
      expect(await dbHandler.getRefreshSession(token2)).toBeUndefined();
    },
  );

  it.each(databases.eachSupportedId())(
    'should cleanup expired sessions, %p',
    async databaseId => {
      const { dbHandler, knex } = await createDatabaseHandler(databaseId);

      const userEntityRef = 'user:default/test';
      const claims = { sub: userEntityRef, ent: [userEntityRef] };

      // Create expired session
      await dbHandler.createRefreshSession({
        userEntityRef,
        claims,
        expiresAt: DateTime.utc().minus({ days: 1 }).toJSDate(),
      });

      // Create active session
      await dbHandler.createRefreshSession({
        userEntityRef,
        claims,
        expiresAt: DateTime.utc().plus({ days: 30 }).toJSDate(),
      });

      // Check we have 2 sessions total
      const totalBefore = await knex('refresh_sessions').count('* as count');
      expect(totalBefore[0].count).toBe(2);

      // Cleanup expired sessions
      const cleanedUp = await dbHandler.cleanupExpiredSessions();
      expect(cleanedUp).toBe(1);

      // Check we have 1 session remaining
      const totalAfter = await knex('refresh_sessions').count('* as count');
      expect(totalAfter[0].count).toBe(1);
    },
  );
});