/*
 * Copyright 2022 The Backstage Authors
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

import { Knex } from 'knex';
import { TestDatabases } from '@backstage/backend-test-utils';
import fs from 'node:fs';

const migrationsDir = `${__dirname}/../migrations`;
const migrationsFiles = fs.readdirSync(migrationsDir).sort();

async function migrateUpOnce(knex: Knex): Promise<void> {
  await knex.migrate.up({ directory: migrationsDir });
}

async function migrateDownOnce(knex: Knex): Promise<void> {
  await knex.migrate.down({ directory: migrationsDir });
}

async function migrateUntilBefore(knex: Knex, target: string): Promise<void> {
  const index = migrationsFiles.indexOf(target);
  if (index === -1) {
    throw new Error(`Migration ${target} not found`);
  }
  for (let i = 0; i < index; i++) {
    await migrateUpOnce(knex);
  }
}

jest.setTimeout(60_000);

describe('migrations', () => {
  const databases = TestDatabases.create();

  it.each(databases.eachSupportedId())(
    '20230428155633_sessions.js, %p',
    async databaseId => {
      const knex = await databases.init(databaseId);

      await migrateUntilBefore(knex, '20230428155633_sessions.js');
      await migrateUpOnce(knex);

      // Ensure that large cookies are supported
      const data = `{"cookie":"${'a'.repeat(100_000)}"}`;
      await knex
        .insert({ sid: 'abc', expired: knex.fn.now(), sess: data })
        .into('sessions');
      await knex
        .insert({ sid: 'def', expired: knex.fn.now(), sess: data })
        .into('sessions');

      await expect(knex('sessions').orderBy('sid', 'asc')).resolves.toEqual([
        { sid: 'abc', expired: expect.anything(), sess: data },
        { sid: 'def', expired: expect.anything(), sess: data },
      ]);

      await migrateDownOnce(knex);

      await knex.destroy();
    },
  );

  it.each(databases.eachSupportedId())(
    '20240510120825_user_info.js, %p',
    async databaseId => {
      const knex = await databases.init(databaseId);

      await migrateUntilBefore(knex, '20240510120825_user_info.js');
      await migrateUpOnce(knex);

      const user_info = JSON.stringify({
        claims: {
          ent: ['group:default/group1', 'group:default/group2'],
        },
      });

      await knex
        .insert({
          user_entity_ref: 'user:default/backstage-user',
          user_info,
          exp: knex.fn.now(),
        })
        .into('user_info');

      await expect(knex('user_info')).resolves.toEqual([
        {
          user_entity_ref: 'user:default/backstage-user',
          user_info,
          exp: expect.anything(),
        },
      ]);

      await migrateDownOnce(knex);

      await knex.destroy();
    },
  );

  it.each(databases.eachSupportedId())(
    '20250707164600_user_created_at.js, %p',
    async databaseId => {
      const knex = await databases.init(databaseId);
      await migrateUntilBefore(knex, '20250707164600_user_created_at.js');

      if (knex.client.config.client.includes('sqlite')) {
        // Sqlite doesn't support adding a column with non-constant default when table has data
        // so we just test that the migration runs without errors
        await migrateUpOnce(knex);

        return;
      }

      const user_info = JSON.stringify({
        claims: {
          ent: ['group:default/group1', 'group:default/group2'],
        },
      });

      await knex
        .insert({
          user_entity_ref: 'user:default/backstage-user',
          user_info,
          exp: knex.fn.now(),
        })
        .into('user_info');

      const { exp } = await knex('user_info').first();

      await migrateUpOnce(knex);

      const { created_at, updated_at } = await knex('user_info').first();

      expect(updated_at).toEqual(exp);
      expect(created_at).toBeDefined();

      await knex
        .insert({
          user_entity_ref: 'user:default/backstage-user',
          user_info,
          updated_at: knex.fn.now(),
        })
        .into('user_info')
        .onConflict(['user_entity_ref'])
        .merge();

      await knex
        .insert({
          user_entity_ref: 'user:default/backstage-user-2',
          user_info,
          updated_at: knex.fn.now(),
        })
        .into('user_info');

      await expect(
        knex('user_info').select('created_at', 'updated_at'),
      ).resolves.toEqual([
        {
          created_at: expect.any(Date),
          updated_at: expect.any(Date),
        },
        {
          created_at: expect.any(Date),
          updated_at: expect.any(Date),
        },
      ]);

      await migrateDownOnce(knex);

      await expect(knex('user_info').select('exp')).resolves.toEqual([
        { exp: expect.any(Date) },
        { exp: expect.any(Date) },
      ]);

      await knex.destroy();
    },
  );

  it.each(databases.eachSupportedId())(
    '20250909120000_oidc_client_registration.js, %p',
    async databaseId => {
      const knex = await databases.init(databaseId);

      await migrateUntilBefore(
        knex,
        '20250909120000_oidc_client_registration.js',
      );
      await migrateUpOnce(knex);

      await knex
        .insert({
          client_id: 'test-client-id',
          client_secret: 'test-client-secret',
          client_name: 'Test Client',
          response_types: JSON.stringify(['code']),
          grant_types: JSON.stringify(['authorization_code']),
          redirect_uris: JSON.stringify(['https://example.com/callback']),
          scope: 'openid profile',
          metadata: JSON.stringify({ description: 'Test client' }),
        })
        .into('oidc_clients');

      await expect(
        knex('oidc_clients').where('client_id', 'test-client-id').first(),
      ).resolves.toEqual({
        client_id: 'test-client-id',
        client_secret: 'test-client-secret',
        client_name: 'Test Client',
        response_types: JSON.stringify(['code']),
        grant_types: JSON.stringify(['authorization_code']),
        redirect_uris: JSON.stringify(['https://example.com/callback']),
        scope: 'openid profile',
        metadata: JSON.stringify({ description: 'Test client' }),
      });

      await knex
        .insert({
          id: 'test-session-id',
          client_id: 'test-client-id',
          user_entity_ref: 'user:default/test-user',
          redirect_uri: 'https://example.com/callback',
          scope: 'openid',
          state: 'test-state',
          response_type: 'code',
          code_challenge: 'test-challenge',
          code_challenge_method: 'S256',
          nonce: 'test-nonce',
          status: 'pending',
          expires_at: new Date(Date.now() + 3600000),
        })
        .into('oauth_authorization_sessions');

      await expect(
        knex('oauth_authorization_sessions')
          .where('id', 'test-session-id')
          .first(),
      ).resolves.toEqual(
        expect.objectContaining({
          id: 'test-session-id',
          client_id: 'test-client-id',
          user_entity_ref: 'user:default/test-user',
          redirect_uri: 'https://example.com/callback',
          scope: 'openid',
          state: 'test-state',
          response_type: 'code',
          code_challenge: 'test-challenge',
          code_challenge_method: 'S256',
          nonce: 'test-nonce',
          status: 'pending',
        }),
      );

      await knex
        .insert({
          code: 'test-auth-code',
          session_id: 'test-session-id',
          expires_at: new Date(Date.now() + 600000),
          used: false,
        })
        .into('oidc_authorization_codes');

      await expect(
        knex('oidc_authorization_codes')
          .where('code', 'test-auth-code')
          .first(),
      ).resolves.toEqual(
        expect.objectContaining({
          code: 'test-auth-code',
          session_id: 'test-session-id',
        }),
      );

      await knex('oauth_authorization_sessions')
        .where('id', 'test-session-id')
        .del();

      await expect(
        knex('oidc_authorization_codes').where('session_id', 'test-session-id'),
      ).resolves.toHaveLength(0);

      await migrateDownOnce(knex);

      const tables = [
        'oidc_clients',
        'oauth_authorization_sessions',
        'oidc_authorization_codes',
      ];

      for (const table of tables) {
        await expect(knex.schema.hasTable(table)).resolves.toBe(false);
      }

      await knex.destroy();
    },
  );

  it.each(databases.eachSupportedId())(
    '20251118120000_oauth_state_text.js, %p',
    async databaseId => {
      const knex = await databases.init(databaseId);

      await migrateUntilBefore(knex, '20251118120000_oauth_state_text.js');

      // First create a client for the foreign key constraint
      await knex
        .insert({
          client_id: 'test-client-id',
          client_secret: 'test-client-secret',
          client_name: 'Test Client',
          response_types: JSON.stringify(['code']),
          grant_types: JSON.stringify(['authorization_code']),
          redirect_uris: JSON.stringify(['https://example.com/callback']),
        })
        .into('oidc_clients');

      // Insert a session with state before migration
      const existingState = 'existing-short-state';
      await knex
        .insert({
          id: 'test-existing-session',
          client_id: 'test-client-id',
          redirect_uri: 'https://example.com/callback',
          state: existingState,
          response_type: 'code',
          status: 'pending',
          expires_at: new Date(Date.now() + 3600000),
        })
        .into('oauth_authorization_sessions');

      // Apply the migration that changes state to TEXT
      await migrateUpOnce(knex);

      // Verify existing state persists after migration
      await expect(
        knex('oauth_authorization_sessions')
          .where('id', 'test-existing-session')
          .first(),
      ).resolves.toEqual(
        expect.objectContaining({
          id: 'test-existing-session',
          state: existingState,
        }),
      );

      // Test inserting a state parameter longer than 255 characters
      // This is based on the real-world example from the issue
      const longState = 'a'.repeat(280);

      await knex
        .insert({
          id: 'test-long-state-session',
          client_id: 'test-client-id',
          redirect_uri: 'https://example.com/callback',
          state: longState,
          response_type: 'code',
          status: 'pending',
          expires_at: new Date(Date.now() + 3600000),
        })
        .into('oauth_authorization_sessions');

      await expect(
        knex('oauth_authorization_sessions')
          .where('id', 'test-long-state-session')
          .first(),
      ).resolves.toEqual(
        expect.objectContaining({
          id: 'test-long-state-session',
          state: longState,
        }),
      );

      await migrateDownOnce(knex);

      await knex.destroy();
    },
  );

  it.each(databases.eachSupportedId())(
    '20251217120000_drop_oidc_clients_fk.js, %p',
    async databaseId => {
      const knex = await databases.init(databaseId);

      await migrateUntilBefore(knex, '20251217120000_drop_oidc_clients_fk.js');

      // Create a client for DCR sessions
      await knex
        .insert({
          client_id: 'dcr-client-id',
          client_secret: 'test-client-secret',
          client_name: 'DCR Client',
          response_types: JSON.stringify(['code']),
          grant_types: JSON.stringify(['authorization_code']),
          redirect_uris: JSON.stringify(['https://example.com/callback']),
        })
        .into('oidc_clients');

      // Create a DCR session (has matching client in oidc_clients)
      await knex
        .insert({
          id: 'dcr-session',
          client_id: 'dcr-client-id',
          redirect_uri: 'https://example.com/callback',
          response_type: 'code',
          status: 'pending',
          expires_at: new Date(Date.now() + 3600000),
        })
        .into('oauth_authorization_sessions');

      // Apply migration - drops FK constraint
      await migrateUpOnce(knex);

      // Now we can insert a CIMD session (URL-based client_id not in oidc_clients)
      await knex
        .insert({
          id: 'cimd-session',
          client_id: 'https://example.com/.well-known/oauth-client/cli',
          redirect_uri: 'http://localhost:8080/callback',
          response_type: 'code',
          status: 'pending',
          expires_at: new Date(Date.now() + 3600000),
        })
        .into('oauth_authorization_sessions');

      // Verify both sessions exist
      await expect(
        knex('oauth_authorization_sessions').select('id').orderBy('id'),
      ).resolves.toEqual([{ id: 'cimd-session' }, { id: 'dcr-session' }]);

      // Rollback - should delete CIMD sessions and re-add FK
      await migrateDownOnce(knex);

      // CIMD session should be deleted, DCR session should remain
      await expect(
        knex('oauth_authorization_sessions').select('id'),
      ).resolves.toEqual([{ id: 'dcr-session' }]);

      await knex.destroy();
    },
  );
});
