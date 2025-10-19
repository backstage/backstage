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

import { TestDatabaseId, TestDatabases } from '@backstage/backend-test-utils';
import { Knex } from 'knex';
import { resolvePackagePath } from '@backstage/backend-plugin-api';
import { OfflineSessionDatabase } from './OfflineSessionDatabase';
import { DateTime } from 'luxon';

jest.setTimeout(60_000);

describe('OfflineSessionDatabase', () => {
  const databases = TestDatabases.create();
  const TOKEN_LIFETIME_SECONDS = 30 * 24 * 60 * 60; // 30 days
  const MAX_ROTATION_LIFETIME_SECONDS = 365 * 24 * 60 * 60; // 1 year

  async function createDatabase(databaseId: TestDatabaseId) {
    const knex = await databases.init(databaseId);

    await knex.migrate.latest({
      directory: resolvePackagePath(
        '@backstage/plugin-auth-backend',
        'migrations',
      ),
    });

    // Create an OIDC client for testing foreign key relationships
    await knex('oidc_clients').insert({
      client_id: 'test-client',
      client_name: 'Test Client',
      client_secret: 'test-secret',
      response_types: JSON.stringify(['code']),
      grant_types: JSON.stringify(['authorization_code']),
      redirect_uris: JSON.stringify(['http://localhost']),
    });

    return {
      knex,
      db: new OfflineSessionDatabase(
        knex,
        TOKEN_LIFETIME_SECONDS,
        MAX_ROTATION_LIFETIME_SECONDS,
      ),
    };
  }

  describe.each(databases.eachSupportedId())('%p', databaseId => {
    let knex: Knex;
    let db: OfflineSessionDatabase;

    beforeEach(async () => {
      ({ knex, db } = await createDatabase(databaseId));
    });

    describe('createSession', () => {
      it('should create a new session', async () => {
        const session = await db.createSession({
          id: 'session-1',
          userEntityRef: 'user:default/test',
          oidcClientId: 'test-client',
          tokenHash: 'hash-1',
        });

        expect(session).toMatchObject({
          id: 'session-1',
          userEntityRef: 'user:default/test',
          oidcClientId: 'test-client',
          tokenHash: 'hash-1',
        });
        expect(session.createdAt).toBeInstanceOf(Date);
        expect(session.lastUsedAt).toBeInstanceOf(Date);
      });

      it('should create session without oidcClientId', async () => {
        const session = await db.createSession({
          id: 'session-2',
          userEntityRef: 'user:default/test',
          tokenHash: 'hash-2',
        });

        expect(session).toMatchObject({
          id: 'session-2',
          userEntityRef: 'user:default/test',
          oidcClientId: null,
          tokenHash: 'hash-2',
        });
      });

      it('should replace existing session for same oidc_client_id', async () => {
        await db.createSession({
          id: 'session-1',
          userEntityRef: 'user:default/test',
          oidcClientId: 'test-client',
          tokenHash: 'hash-1',
        });

        await db.createSession({
          id: 'session-2',
          userEntityRef: 'user:default/test',
          oidcClientId: 'test-client',
          tokenHash: 'hash-2',
        });

        const session1 = await db.getSessionById('session-1');
        const session2 = await db.getSessionById('session-2');

        expect(session1).toBeUndefined();
        expect(session2).toBeDefined();
      });

      it('should enforce per-user limit of 20 tokens', async () => {
        // Create 22 sessions for the same user
        for (let i = 0; i < 22; i++) {
          await db.createSession({
            id: `session-${i}`,
            userEntityRef: 'user:default/test',
            tokenHash: `hash-${i}`,
          });
        }

        // Check that only 20 sessions exist
        const sessions = await knex('offline_sessions')
          .where('user_entity_ref', 'user:default/test')
          .select('id');

        expect(sessions).toHaveLength(20);

        // The oldest sessions should be deleted (LRU)
        const session0 = await db.getSessionById('session-0');
        const session1 = await db.getSessionById('session-1');
        const session21 = await db.getSessionById('session-21');

        expect(session0).toBeUndefined();
        expect(session1).toBeUndefined();
        expect(session21).toBeDefined();
      });
    });

    describe('getSessionById', () => {
      it('should retrieve a session by ID', async () => {
        await db.createSession({
          id: 'session-1',
          userEntityRef: 'user:default/test',
          tokenHash: 'hash-1',
        });

        const session = await db.getSessionById('session-1');
        expect(session).toMatchObject({
          id: 'session-1',
          userEntityRef: 'user:default/test',
          tokenHash: 'hash-1',
        });
      });

      it('should return undefined for non-existent session', async () => {
        const session = await db.getSessionById('non-existent');
        expect(session).toBeUndefined();
      });
    });

    describe('rotateToken', () => {
      it('should update token hash and last_used_at', async () => {
        const initialSession = await db.createSession({
          id: 'session-1',
          userEntityRef: 'user:default/test',
          tokenHash: 'hash-1',
        });

        // Wait a bit to ensure timestamp difference
        await new Promise(resolve => setTimeout(resolve, 1100));

        await db.rotateToken('session-1', 'hash-2');

        const updatedSession = await db.getSessionById('session-1');
        expect(updatedSession?.tokenHash).toBe('hash-2');
        expect(updatedSession?.lastUsedAt.getTime()).toBeGreaterThanOrEqual(
          initialSession.lastUsedAt.getTime(),
        );
      });
    });

    describe('deleteSession', () => {
      it('should delete a session by ID', async () => {
        await db.createSession({
          id: 'session-1',
          userEntityRef: 'user:default/test',
          tokenHash: 'hash-1',
        });

        await db.deleteSession('session-1');

        const session = await db.getSessionById('session-1');
        expect(session).toBeUndefined();
      });
    });

    describe('deleteSessionsByUserEntityRef', () => {
      it('should delete all sessions for a user', async () => {
        await db.createSession({
          id: 'session-1',
          userEntityRef: 'user:default/test',
          tokenHash: 'hash-1',
        });

        await db.createSession({
          id: 'session-2',
          userEntityRef: 'user:default/test',
          tokenHash: 'hash-2',
        });

        await db.createSession({
          id: 'session-3',
          userEntityRef: 'user:default/other',
          tokenHash: 'hash-3',
        });

        const deletedCount = await db.deleteSessionsByUserEntityRef(
          'user:default/test',
        );

        expect(deletedCount).toBe(2);

        const session1 = await db.getSessionById('session-1');
        const session2 = await db.getSessionById('session-2');
        const session3 = await db.getSessionById('session-3');

        expect(session1).toBeUndefined();
        expect(session2).toBeUndefined();
        expect(session3).toBeDefined();
      });
    });

    describe('deleteSessionByClientId', () => {
      it('should delete session by OIDC client ID', async () => {
        await db.createSession({
          id: 'session-1',
          userEntityRef: 'user:default/test',
          oidcClientId: 'test-client',
          tokenHash: 'hash-1',
        });

        await db.deleteSessionByClientId('test-client');

        const session = await db.getSessionById('session-1');
        expect(session).toBeUndefined();
      });
    });

    describe('cleanupExpiredSessions', () => {
      it('should delete sessions expired by token lifetime', async () => {
        // Create a session with old last_used_at
        await knex('offline_sessions').insert({
          id: 'expired-session',
          user_entity_ref: 'user:default/test',
          token_hash: 'hash-1',
          created_at: DateTime.now().toJSDate(),
          last_used_at: DateTime.now()
            .minus({ seconds: TOKEN_LIFETIME_SECONDS + 1 })
            .toJSDate(),
        });

        await knex('offline_sessions').insert({
          id: 'valid-session',
          user_entity_ref: 'user:default/test',
          token_hash: 'hash-2',
          created_at: DateTime.now().toJSDate(),
          last_used_at: DateTime.now().toJSDate(),
        });

        const deletedCount = await db.cleanupExpiredSessions();
        expect(deletedCount).toBeGreaterThan(0);

        const expiredSession = await db.getSessionById('expired-session');
        const validSession = await db.getSessionById('valid-session');

        expect(expiredSession).toBeUndefined();
        expect(validSession).toBeDefined();
      });

      it('should delete sessions expired by max rotation lifetime', async () => {
        // Create a session with old created_at
        await knex('offline_sessions').insert({
          id: 'expired-session',
          user_entity_ref: 'user:default/test',
          token_hash: 'hash-1',
          created_at: DateTime.now()
            .minus({ seconds: MAX_ROTATION_LIFETIME_SECONDS + 1 })
            .toJSDate(),
          last_used_at: DateTime.now().toJSDate(),
        });

        await knex('offline_sessions').insert({
          id: 'valid-session',
          user_entity_ref: 'user:default/test',
          token_hash: 'hash-2',
          created_at: DateTime.now().toJSDate(),
          last_used_at: DateTime.now().toJSDate(),
        });

        const deletedCount = await db.cleanupExpiredSessions();
        expect(deletedCount).toBeGreaterThan(0);

        const expiredSession = await db.getSessionById('expired-session');
        const validSession = await db.getSessionById('valid-session');

        expect(expiredSession).toBeUndefined();
        expect(validSession).toBeDefined();
      });
    });

    describe('isSessionExpired', () => {
      it('should return true for session expired by token lifetime', () => {
        const session = {
          id: 'session-1',
          userEntityRef: 'user:default/test',
          oidcClientId: null,
          tokenHash: 'hash-1',
          createdAt: DateTime.now().toJSDate(),
          lastUsedAt: DateTime.now()
            .minus({ seconds: TOKEN_LIFETIME_SECONDS + 1 })
            .toJSDate(),
        };

        expect(db.isSessionExpired(session)).toBe(true);
      });

      it('should return true for session expired by max rotation lifetime', () => {
        const session = {
          id: 'session-1',
          userEntityRef: 'user:default/test',
          oidcClientId: null,
          tokenHash: 'hash-1',
          createdAt: DateTime.now()
            .minus({ seconds: MAX_ROTATION_LIFETIME_SECONDS + 1 })
            .toJSDate(),
          lastUsedAt: DateTime.now().toJSDate(),
        };

        expect(db.isSessionExpired(session)).toBe(true);
      });

      it('should return false for valid session', () => {
        const session = {
          id: 'session-1',
          userEntityRef: 'user:default/test',
          oidcClientId: null,
          tokenHash: 'hash-1',
          createdAt: DateTime.now().toJSDate(),
          lastUsedAt: DateTime.now().toJSDate(),
        };

        expect(db.isSessionExpired(session)).toBe(false);
      });
    });
  });
});
