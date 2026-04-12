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
import { createHash } from 'node:crypto';

const migrationsDir = `${__dirname}/../../migrations`;
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
    'latest version correctly cascades deletions, %p',
    async databaseId => {
      const knex = await databases.init(databaseId);
      await knex.migrate.latest({ directory: migrationsDir });

      await knex
        .insert({
          entity_id: 'i1',
          entity_ref: 'k:ns/n1',
          unprocessed_entity: '{}',
          errors: '[]',
          next_update_at: new Date(),
          last_discovery_at: new Date(),
        })
        .into('refresh_state');
      await knex
        .insert({
          entity_id: 'i2',
          entity_ref: 'k:ns/n2',
          unprocessed_entity: '{}',
          errors: '[]',
          next_update_at: new Date(),
          last_discovery_at: new Date(),
        })
        .into('refresh_state');
      await knex
        .insert({
          entity_id: 'i1',
          hash: 'h',
          final_entity: '{}',
          entity_ref: 'k:ns/n1',
        })
        .into('final_entities');
      await knex
        .insert({ entity_id: 'i1', key: 'k1', value: 'v1' })
        .into('search');
      await knex
        .insert({
          source_entity_ref: 'k:ns/n1',
          target_entity_ref: 'k:ns/n2',
        })
        .into('refresh_state_references');
      await knex
        .insert({
          originating_entity_id: 'i1',
          source_entity_ref: 'k:ns/n1',
          target_entity_ref: 'k:ns/n2',
          type: 't',
        })
        .into('relations');

      await knex.delete().from('refresh_state').where({ entity_id: 'i1' });

      await expect(knex('search')).resolves.toEqual([]);
      await expect(knex('refresh_state_references')).resolves.toEqual([]);
      await expect(knex('relations')).resolves.toEqual([]);
      await expect(knex('final_entities')).resolves.toEqual([]);
    },
  );

  it.each(databases.eachSupportedId())(
    '20221109192547_search_add_original_value_column.js, %p',
    async databaseId => {
      const knex = await databases.init(databaseId);

      await migrateUntilBefore(
        knex,
        '20221109192547_search_add_original_value_column.js',
      );

      await knex
        .insert({
          entity_id: 'i',
          entity_ref: 'k:ns/n',
          unprocessed_entity: '{}',
          errors: '[]',
          next_update_at: new Date(),
          last_discovery_at: new Date(),
        })
        .into('refresh_state');
      await knex
        .insert({ entity_id: 'i', key: 'k1', value: 'v1' })
        .into('search');
      await knex
        .insert({ entity_id: 'i', key: 'k2', value: null })
        .into('search');

      await expect(knex('search')).resolves.toEqual(
        expect.arrayContaining([
          { entity_id: 'i', key: 'k1', value: 'v1' },
          { entity_id: 'i', key: 'k2', value: null },
        ]),
      );

      await migrateUpOnce(knex);

      await expect(knex('search')).resolves.toEqual(
        expect.arrayContaining([
          { entity_id: 'i', key: 'k1', value: 'v1', original_value: 'v1' },
          { entity_id: 'i', key: 'k2', value: null, original_value: null },
        ]),
      );

      await migrateDownOnce(knex);

      await expect(knex('search')).resolves.toEqual(
        expect.arrayContaining([
          { entity_id: 'i', key: 'k1', value: 'v1' },
          { entity_id: 'i', key: 'k2', value: null },
        ]),
      );

      await knex.destroy();
    },
  );

  it.each(databases.eachSupportedId())(
    '20221201085245_add_last_updated_at_in_final_entities.js, %p',
    async databaseId => {
      const knex = await databases.init(databaseId);

      await migrateUntilBefore(
        knex,
        '20221201085245_add_last_updated_at_in_final_entities.js',
      );

      await knex
        .insert([
          {
            entity_id: 'my-id',
            entity_ref: 'k:ns/n',
            unprocessed_entity: JSON.stringify({}),
            processed_entity: JSON.stringify({
              apiVersion: 'a',
              kind: 'k',
              metadata: {
                name: 'n',
                namespace: 'ns',
              },
              spec: {
                k: 'v',
              },
            }),
            errors: '[]',
            next_update_at: knex.fn.now(),
            last_discovery_at: knex.fn.now(),
          },
        ])
        .into('refresh_state');

      await knex
        .insert({
          entity_id: 'my-id',
          hash: 'd1c0c56d5fea4238e4c091d9dde4cb42d05a6b7e',
          stitch_ticket: '52367ed7-120b-405f-b7e0-cdd90f956312',
          final_entity:
            '{"apiVersion":"a","kind":"k","metadata":{"name":"n","namespace":"ns","uid":"my-id","etag":"d1c0c56d5fea4238e4c091d9dde4cb42d05a6b7e"},"spec":{"k":"v"},"relations":[{"type":"looksAt","targetRef":"k:ns/other"}]}',
        })
        .into('final_entities');

      await migrateUpOnce(knex);

      await expect(knex('final_entities')).resolves.toEqual(
        expect.arrayContaining([
          {
            entity_id: 'my-id',
            hash: 'd1c0c56d5fea4238e4c091d9dde4cb42d05a6b7e',
            stitch_ticket: '52367ed7-120b-405f-b7e0-cdd90f956312',
            final_entity:
              '{"apiVersion":"a","kind":"k","metadata":{"name":"n","namespace":"ns","uid":"my-id","etag":"d1c0c56d5fea4238e4c091d9dde4cb42d05a6b7e"},"spec":{"k":"v"},"relations":[{"type":"looksAt","targetRef":"k:ns/other"}]}',
            last_updated_at: null,
          },
        ]),
      );

      await migrateDownOnce(knex);

      await expect(knex('final_entities')).resolves.toEqual(
        expect.arrayContaining([
          {
            entity_id: 'my-id',
            hash: 'd1c0c56d5fea4238e4c091d9dde4cb42d05a6b7e',
            stitch_ticket: '52367ed7-120b-405f-b7e0-cdd90f956312',
            final_entity:
              '{"apiVersion":"a","kind":"k","metadata":{"name":"n","namespace":"ns","uid":"my-id","etag":"d1c0c56d5fea4238e4c091d9dde4cb42d05a6b7e"},"spec":{"k":"v"},"relations":[{"type":"looksAt","targetRef":"k:ns/other"}]}',
          },
        ]),
      );

      await knex.destroy();
    },
  );

  it.each(databases.eachSupportedId())(
    '20230525141717_stitch_queue.js, %p',
    async databaseId => {
      const knex = await databases.init(databaseId);

      await migrateUntilBefore(knex, '20230525141717_stitch_queue.js');

      await knex
        .insert([
          {
            entity_id: 'my-id',
            entity_ref: 'k:ns/n',
            unprocessed_entity: '{}',
            processed_entity: '{}',
            errors: '[]',
            next_update_at: knex.fn.now(),
            last_discovery_at: knex.fn.now(),
          },
        ])
        .into('refresh_state');
      await knex
        .insert({
          entity_id: 'my-id',
          hash: 'd1c0c56d5fea4238e4c091d9dde4cb42d05a6b7e',
          stitch_ticket: '',
          final_entity: '{}',
        })
        .into('final_entities');

      await migrateUpOnce(knex);

      await expect(knex('refresh_state')).resolves.toEqual([
        {
          entity_id: 'my-id',
          entity_ref: 'k:ns/n',
          location_key: null,
          unprocessed_entity: '{}',
          processed_entity: '{}',
          errors: '[]',
          cache: null,
          unprocessed_hash: null,
          result_hash: null,
          next_update_at: expect.anything(),
          next_stitch_at: null,
          next_stitch_ticket: null,
          last_discovery_at: expect.anything(),
        },
      ]);

      await migrateDownOnce(knex);

      await expect(knex('refresh_state')).resolves.toEqual([
        {
          entity_id: 'my-id',
          entity_ref: 'k:ns/n',
          location_key: null,
          unprocessed_entity: '{}',
          processed_entity: '{}',
          errors: '[]',
          cache: null,
          unprocessed_hash: null,
          result_hash: null,
          next_update_at: expect.anything(),
          last_discovery_at: expect.anything(),
        },
      ]);

      await knex.destroy();
    },
  );

  it.each(databases.eachSupportedId())(
    '20241003170511_alter_target_in_locations.js, %p',
    async databaseId => {
      const knex = await databases.init(databaseId);

      await migrateUntilBefore(
        knex,
        '20241003170511_alter_target_in_locations.js',
      );

      // Insert a simple URL before the migration
      await knex
        .insert({
          id: '1f99f7f6-1d87-4e8c-994a-8a2ba1d542f6',
          type: 'url',
          target: 'https://example.com',
        })
        .into('locations');

      await migrateUpOnce(knex);

      // Verify that the target column is now 'text'
      const columnInfo = await knex('locations').columnInfo();
      expect(columnInfo.target.type).toBe('text');

      // Insert a long URL (exceeding 255 characters)
      await knex
        .insert({
          id: '1f99f6f7-1d87-4e8c-994a-2a8ba1d542f6',
          type: 'url',
          target:
            'https://example.com/foo-bar-test-group/very-long-group-name-that-exceeds-255-characters-just-to-test-the-limits-of-url-length-in-the-catalog-info-yaml-file-and-see-how-the-backstage-system-handles-it-making/test-this-alright-1/-/blob/main/catalog-info.yaml',
        })
        .into('locations');

      // Verify that both the simple and long URLs exist after the migration
      await expect(knex('locations').where({ type: 'url' })).resolves.toEqual(
        expect.arrayContaining([
          {
            id: '1f99f7f6-1d87-4e8c-994a-8a2ba1d542f6',
            target: 'https://example.com',
            type: 'url',
          },
          {
            id: '1f99f6f7-1d87-4e8c-994a-2a8ba1d542f6',
            target:
              'https://example.com/foo-bar-test-group/very-long-group-name-that-exceeds-255-characters-just-to-test-the-limits-of-url-length-in-the-catalog-info-yaml-file-and-see-how-the-backstage-system-handles-it-making/test-this-alright-1/-/blob/main/catalog-info.yaml',
            type: 'url',
          },
        ]),
      );

      await expect(migrateDownOnce(knex)).rejects.toThrow(
        `Migration aborted: Found 1 entries with 'target' exceeding 255 characters. Manual intervention required.`,
      );

      // Now remove the long URL
      await knex('locations')
        .where({
          id: '1f99f6f7-1d87-4e8c-994a-2a8ba1d542f6',
        })
        .del();

      // Retry the migration down after removing the long URL
      await migrateDownOnce(knex);

      // Verify that the column type has reverted to varchar
      const revertedColumnInfo = await knex('locations').columnInfo();
      expect(revertedColumnInfo.target.type).toMatch(
        /^(varchar|character varying)$/,
      );

      // Verify that the short URL still exists in the table
      await expect(knex('locations').where({ type: 'url' })).resolves.toEqual(
        expect.arrayContaining([
          {
            id: '1f99f7f6-1d87-4e8c-994a-8a2ba1d542f6',
            target: 'https://example.com',
            type: 'url',
          },
        ]),
      );

      await knex.destroy();
    },
  );

  it.each(databases.eachSupportedId())(
    '20241024104700_add_entity_ref_to_final_entities.js, %p',
    async databaseId => {
      const knex = await databases.init(databaseId);

      await migrateUntilBefore(
        knex,
        '20241024104700_add_entity_ref_to_final_entities.js',
      );

      await knex
        .insert({
          entity_id: 'id1',
          entity_ref: 'k:ns/n',
          unprocessed_entity: '{}',
          processed_entity: '{}',
          errors: '[]',
          next_update_at: knex.fn.now(),
          last_discovery_at: knex.fn.now(),
        })
        .into('refresh_state');
      await knex
        .insert({
          entity_id: 'id2',
          entity_ref: 'k:ns/n2',
          unprocessed_entity: '{}',
          processed_entity: '{}',
          errors: '[]',
          next_update_at: knex.fn.now(),
          last_discovery_at: knex.fn.now(),
        })
        .into('refresh_state');

      // Insert a simple entity before the migration
      await knex
        .insert({
          entity_id: 'id1',
          hash: '3f5a4d6ba8507be297bb7cd87c4b55b63e3f4c14',
          stitch_ticket: '52367ed7-120b-405f-b7e0-cdd90f956312',
          final_entity: '{}',
        })
        .into('final_entities');

      // verify that the entity_ref column is not present
      const preColumnInfo = await knex('final_entities').columnInfo();
      expect(preColumnInfo.entity_ref).toBeUndefined();

      await migrateUpOnce(knex);

      // verify that the entity_ref column has been added
      const afterColumnInfo = await knex('final_entities').columnInfo();
      expect(afterColumnInfo.entity_ref).not.toBeUndefined();

      // verify that the contents of the entity_ref column are correct
      await expect(knex('final_entities')).resolves.toEqual(
        expect.arrayContaining([
          {
            entity_id: 'id1',
            hash: '3f5a4d6ba8507be297bb7cd87c4b55b63e3f4c14',
            stitch_ticket: '52367ed7-120b-405f-b7e0-cdd90f956312',
            final_entity: '{}',
            entity_ref: 'k:ns/n',
            last_updated_at: null,
          },
        ]),
      );

      // Verify that duplicates of entity_ref are not allowed. We lie about the
      // ref to make it easier to trigger the problem. Also using a weak
      // expectation due to sqlite flakiness; it rejects, but not necessarily
      // with a valid error.
      await expect(
        knex
          .insert({
            entity_id: 'id2',
            entity_ref: 'k:ns/n',
            hash: 'other',
            stitch_ticket: 'other',
            final_entity: '{}',
          })
          .into('final_entities'),
      ).rejects.toEqual(expect.anything());

      await migrateDownOnce(knex);

      // verify that the entity_ref column has been removed
      const revertedColumnInfo = await knex('final_entities').columnInfo();
      expect(revertedColumnInfo.entity_ref).toBeUndefined();

      // verify that the contents are correct
      await expect(knex('final_entities')).resolves.toEqual(
        expect.arrayContaining([
          {
            entity_id: 'id1',
            hash: '3f5a4d6ba8507be297bb7cd87c4b55b63e3f4c14',
            stitch_ticket: '52367ed7-120b-405f-b7e0-cdd90f956312',
            final_entity: '{}',
            last_updated_at: null,
          },
        ]),
      );

      await knex.destroy();
    },
  );

  it.each(databases.eachSupportedId())(
    '20241111000000_drop_redundant_indices.js, %p',
    async databaseId => {
      const knex = await databases.init(databaseId);

      await migrateUntilBefore(
        knex,
        '20241111000000_drop_redundant_indices.js',
      );

      await migrateUpOnce(knex);

      await migrateDownOnce(knex);

      expect(true).toBe(true);
      await knex.destroy();
    },
  );

  it.each(databases.eachSupportedId())(
    '20250401200503_update_refresh_state_columns.js, %p',
    async databaseId => {
      const knex = await databases.init(databaseId);

      // Run migrations up to just before the target migration
      await migrateUntilBefore(
        knex,
        '20250401200503_update_refresh_state_columns.js',
      );

      // Insert a row with data into the refresh_state table
      await knex('refresh_state').insert({
        entity_id: 'test-id',
        entity_ref: 'k:ns/test',
        unprocessed_entity: JSON.stringify({ key: 'value' }),
        cache: JSON.stringify({ cacheKey: 'cacheValue' }),
        errors: '[]',
        next_update_at: knex.fn.now(),
        last_discovery_at: knex.fn.now(),
      });

      // Verify the data before the migration
      const preMigrationData = await knex('refresh_state')
        .where({ entity_id: 'test-id' })
        .first();
      expect(preMigrationData).toEqual(
        expect.objectContaining({
          entity_id: 'test-id',
          entity_ref: 'k:ns/test',
          unprocessed_entity: JSON.stringify({ key: 'value' }),
          cache: JSON.stringify({ cacheKey: 'cacheValue' }),
        }),
      );

      // Run the migration
      await migrateUpOnce(knex);

      // Verify the schema after the migration
      const columnInfo = await knex('refresh_state').columnInfo();
      const expectedType = knex.client.config.client.includes('mysql')
        ? 'longtext'
        : 'text';
      expect(columnInfo.unprocessed_entity.type).toBe(expectedType);
      expect(columnInfo.cache.type).toBe(expectedType);

      // Verify the data after the migration
      const postMigrationData = await knex('refresh_state')
        .where({ entity_id: 'test-id' })
        .first();
      expect(postMigrationData).toEqual(
        expect.objectContaining({
          entity_id: 'test-id',
          entity_ref: 'k:ns/test',
          unprocessed_entity: JSON.stringify({ key: 'value' }),
          cache: JSON.stringify({ cacheKey: 'cacheValue' }),
        }),
      );

      // Roll back the migration
      await migrateDownOnce(knex);

      // Verify the schema after rolling back
      const revertedColumnInfo = await knex('refresh_state').columnInfo();
      expect(revertedColumnInfo.unprocessed_entity.type).toBe('text');
      expect(revertedColumnInfo.cache.type).toBe('text');

      // Verify the data after rolling back
      const postRollbackData = await knex('refresh_state')
        .where({ entity_id: 'test-id' })
        .first();
      expect(postRollbackData).toEqual(
        expect.objectContaining({
          entity_id: 'test-id',
          entity_ref: 'k:ns/test',
          unprocessed_entity: JSON.stringify({ key: 'value' }),
          cache: JSON.stringify({ cacheKey: 'cacheValue' }),
        }),
      );

      await knex.destroy();
    },
  );

  it.each(databases.eachSupportedId())(
    '20250514000000_refresh_state_references_big_increments.js, %p',
    async databaseId => {
      const knex = await databases.init(databaseId);

      const read = async () => {
        return await knex('refresh_state_references')
          .orderBy('id')
          .then(rs => rs.map(r => ({ ...r, id: String(r.id) })));
      };

      // Run migrations up to just before the target migration
      await migrateUntilBefore(
        knex,
        '20250514000000_refresh_state_references_big_increments.js',
      );

      await knex('refresh_state').insert({
        entity_id: 'a',
        entity_ref: 'k:ns/a',
        unprocessed_entity: '{}',
        cache: '{}',
        errors: '[]',
        next_update_at: knex.fn.now(),
        last_discovery_at: knex.fn.now(),
      });
      await knex('refresh_state_references').insert({
        source_key: 'before',
        target_entity_ref: 'k:ns/a',
      });

      await migrateUpOnce(knex);

      // can still insert with auto generated id in sequence
      await knex('refresh_state_references').insert({
        source_key: 'after1',
        target_entity_ref: 'k:ns/a',
      });
      await expect(read()).resolves.toEqual([
        {
          id: '1',
          source_key: 'before',
          source_entity_ref: null,
          target_entity_ref: 'k:ns/a',
        },
        {
          id: '2',
          source_key: 'after1',
          source_entity_ref: null,
          target_entity_ref: 'k:ns/a',
        },
      ]);

      await migrateDownOnce(knex);

      // can still insert with auto generated id in sequence
      await knex('refresh_state_references').insert({
        source_key: 'after2',
        target_entity_ref: 'k:ns/a',
      });
      await expect(read()).resolves.toEqual([
        {
          id: '1',
          source_key: 'before',
          source_entity_ref: null,
          target_entity_ref: 'k:ns/a',
        },
        {
          id: '2',
          source_key: 'after1',
          source_entity_ref: null,
          target_entity_ref: 'k:ns/a',
        },
        {
          id: '3',
          source_key: 'after2',
          source_entity_ref: null,
          target_entity_ref: 'k:ns/a',
        },
      ]);

      await knex.destroy();
    },
  );

  it.each(databases.eachSupportedId())(
    '20260214000000_search_fk_final_entities.js, %p',
    async databaseId => {
      const knex = await databases.init(databaseId);

      // Run migrations up to just before the target migration
      await migrateUntilBefore(
        knex,
        '20260214000000_search_fk_final_entities.js',
      );

      // Insert rows into refresh_state
      await knex('refresh_state').insert([
        {
          entity_id: 'id1',
          entity_ref: 'component:default/service-a',
          unprocessed_entity: '{}',
          processed_entity: '{}',
          errors: '[]',
          next_update_at: knex.fn.now(),
          last_discovery_at: knex.fn.now(),
        },
        {
          entity_id: 'id2',
          entity_ref: 'component:default/service-b',
          unprocessed_entity: '{}',
          processed_entity: '{}',
          errors: '[]',
          next_update_at: knex.fn.now(),
          last_discovery_at: knex.fn.now(),
        },
        {
          entity_id: 'id3',
          entity_ref: 'api:default/my-api',
          unprocessed_entity: '{}',
          processed_entity: '{}',
          errors: '[]',
          next_update_at: knex.fn.now(),
          last_discovery_at: knex.fn.now(),
        },
      ]);

      // Insert rows into final_entities (only id1 and id2, not id3 - to test orphan deletion)
      await knex('final_entities').insert([
        {
          entity_id: 'id1',
          entity_ref: 'component:default/service-a',
          hash: 'hash1',
          stitch_ticket: 'ticket1',
          final_entity: '{}',
        },
        {
          entity_id: 'id2',
          entity_ref: 'component:default/service-b',
          hash: 'hash2',
          stitch_ticket: 'ticket2',
          final_entity: '{}',
        },
      ]);

      // Insert rows into search table (with entity_id FK to refresh_state before migration)
      await knex('search').insert([
        {
          entity_id: 'id1',
          key: 'kind',
          value: 'component',
          original_value: 'Component',
        },
        {
          entity_id: 'id1',
          key: 'metadata.name',
          value: 'service-a',
          original_value: 'service-a',
        },
        {
          entity_id: 'id2',
          key: 'kind',
          value: 'component',
          original_value: 'Component',
        },
        {
          entity_id: 'id2',
          key: 'metadata.name',
          value: 'service-b',
          original_value: 'service-b',
        },
        // id3 has no final_entities row, so this should be deleted during migration
        { entity_id: 'id3', key: 'kind', value: 'api', original_value: 'API' },
        {
          entity_id: 'id3',
          key: 'metadata.name',
          value: 'my-api',
          original_value: 'my-api',
        },
        // NULL entity_id row should survive the migration
        {
          entity_id: null,
          key: 'global',
          value: 'setting',
          original_value: 'setting',
        },
      ]);

      // Verify initial state
      const preMigrationCount = await knex('search').count('* as count');
      expect(Number(preMigrationCount[0].count)).toBe(7);

      // Run the migration
      await migrateUpOnce(knex);

      // Verify orphaned rows (id3) were deleted, but NULL entity_id row survived
      const postMigrationRows = await knex('search');
      expect(postMigrationRows).toHaveLength(5);
      expect(postMigrationRows).toEqual(
        expect.arrayContaining([
          {
            entity_id: null,
            key: 'global',
            value: 'setting',
            original_value: 'setting',
          },
          {
            entity_id: 'id1',
            key: 'kind',
            value: 'component',
            original_value: 'Component',
          },
          {
            entity_id: 'id1',
            key: 'metadata.name',
            value: 'service-a',
            original_value: 'service-a',
          },
          {
            entity_id: 'id2',
            key: 'kind',
            value: 'component',
            original_value: 'Component',
          },
          {
            entity_id: 'id2',
            key: 'metadata.name',
            value: 'service-b',
            original_value: 'service-b',
          },
        ]),
      );

      // Verify FK is enforced: inserting with a nonexistent entity_id should be rejected
      await expect(
        knex('search').insert({
          entity_id: 'nonexistent',
          key: 'kind',
          value: 'test',
          original_value: 'test',
        }),
      ).rejects.toEqual(expect.anything());

      // Verify FK cascade works: deleting from final_entities should cascade to search
      await knex('final_entities').where({ entity_id: 'id1' }).delete();
      const searchAfterDelete = await knex('search');
      expect(searchAfterDelete).toHaveLength(3);
      expect(searchAfterDelete).toEqual(
        expect.arrayContaining([
          {
            entity_id: null,
            key: 'global',
            value: 'setting',
            original_value: 'setting',
          },
          {
            entity_id: 'id2',
            key: 'kind',
            value: 'component',
            original_value: 'Component',
          },
          {
            entity_id: 'id2',
            key: 'metadata.name',
            value: 'service-b',
            original_value: 'service-b',
          },
        ]),
      );

      // Restore id1 for down migration test
      await knex('final_entities').insert({
        entity_id: 'id1',
        entity_ref: 'component:default/service-a',
        hash: 'hash1',
        stitch_ticket: 'ticket1',
        final_entity: '{}',
      });
      await knex('search').insert([
        {
          entity_id: 'id1',
          key: 'kind',
          value: 'component',
          original_value: 'Component',
        },
      ]);

      // Delete id1 from refresh_state so it becomes an orphan for the down
      // migration (exists in final_entities but not in refresh_state)
      await knex('refresh_state').where({ entity_id: 'id1' }).delete();

      // Run the down migration
      await migrateDownOnce(knex);

      // Verify id1 search rows were cleaned up (orphan for refresh_state FK),
      // while id2 and the NULL entity_id row survived
      const revertedSearchRows = await knex('search');
      expect(revertedSearchRows).toHaveLength(3);
      expect(revertedSearchRows).toEqual(
        expect.arrayContaining([
          {
            entity_id: null,
            key: 'global',
            value: 'setting',
            original_value: 'setting',
          },
          {
            entity_id: 'id2',
            key: 'kind',
            value: 'component',
            original_value: 'Component',
          },
          {
            entity_id: 'id2',
            key: 'metadata.name',
            value: 'service-b',
            original_value: 'service-b',
          },
        ]),
      );

      // Verify FK is back to refresh_state: deleting from refresh_state should cascade
      await knex('refresh_state').where({ entity_id: 'id2' }).delete();
      const afterRefreshStateDelete = await knex('search');
      expect(afterRefreshStateDelete).toEqual([
        {
          entity_id: null,
          key: 'global',
          value: 'setting',
          original_value: 'setting',
        },
      ]);

      await knex.destroy();
    },
  );

  it.each(databases.eachSupportedId())(
    '20260215000000_move_stitch_queue.js, %p',
    async databaseId => {
      const knex = await databases.init(databaseId);

      // Run migrations up to just before the target migration
      await migrateUntilBefore(knex, '20260215000000_move_stitch_queue.js');

      // Insert rows into refresh_state with stitch queue data
      // Before migration, refresh_state has next_stitch_at and next_stitch_ticket columns
      const stitchTime1 = new Date('2026-01-15T12:00:00.000Z');
      const stitchTime3 = new Date('2026-01-16T12:00:00.000Z');

      await knex('refresh_state').insert([
        {
          entity_id: 'id1',
          entity_ref: 'component:default/with-stitch',
          unprocessed_entity: '{}',
          processed_entity: '{}',
          errors: '[]',
          next_update_at: knex.fn.now(),
          last_discovery_at: knex.fn.now(),
          next_stitch_at: stitchTime1,
          next_stitch_ticket: 'ticket-1',
        },
        {
          entity_id: 'id2',
          entity_ref: 'component:default/no-stitch',
          unprocessed_entity: '{}',
          processed_entity: '{}',
          errors: '[]',
          next_update_at: knex.fn.now(),
          last_discovery_at: knex.fn.now(),
          next_stitch_at: null,
          next_stitch_ticket: null,
        },
        {
          entity_id: 'id3',
          entity_ref: 'component:default/orphan-stitch',
          unprocessed_entity: '{}',
          processed_entity: '{}',
          errors: '[]',
          next_update_at: knex.fn.now(),
          last_discovery_at: knex.fn.now(),
          next_stitch_at: stitchTime3,
          next_stitch_ticket: 'ticket-3',
        },
      ]);

      // Insert final_entities rows (with stitch_ticket column that will be dropped)
      await knex('final_entities').insert([
        {
          entity_id: 'id1',
          entity_ref: 'component:default/with-stitch',
          hash: 'h1',
          stitch_ticket: 'old-ticket-1',
        },
        {
          entity_id: 'id2',
          entity_ref: 'component:default/no-stitch',
          hash: 'h2',
          stitch_ticket: 'old-ticket-2',
        },
      ]);

      // Verify initial state - stitch_queue table should NOT exist yet
      const preTableExists = await knex.schema.hasTable('stitch_queue');
      expect(preTableExists).toBe(false);

      // Run the migration
      await migrateUpOnce(knex);

      // Verify stitch_queue table was created
      const postTableExists = await knex.schema.hasTable('stitch_queue');
      expect(postTableExists).toBe(true);

      // Verify next_stitch_at and next_stitch_ticket columns were removed from refresh_state
      const refreshStateColumnInfo = await knex('refresh_state').columnInfo();
      expect(refreshStateColumnInfo.next_stitch_at).toBeUndefined();
      expect(refreshStateColumnInfo.next_stitch_ticket).toBeUndefined();

      // Verify stitch_ticket column was removed from final_entities
      const finalEntitiesColumnInfo = await knex('final_entities').columnInfo();
      expect(finalEntitiesColumnInfo.stitch_ticket).toBeUndefined();

      // Verify data was migrated correctly to stitch_queue
      const stitchQueueAfterUp = await knex('stitch_queue')
        .orderBy('entity_ref')
        .select('entity_ref', 'stitch_ticket', 'next_stitch_at');

      // Only entities with pending stitches should be in stitch_queue (id1 and id3)
      expect(stitchQueueAfterUp).toEqual([
        {
          entity_ref: 'component:default/orphan-stitch',
          stitch_ticket: 'ticket-3',
          next_stitch_at: expect.anything(),
        },
        {
          entity_ref: 'component:default/with-stitch',
          stitch_ticket: 'ticket-1',
          next_stitch_at: expect.anything(),
        },
      ]);

      // Run the down migration
      await migrateDownOnce(knex);

      // Verify stitch_queue table was dropped
      const revertedTableExists = await knex.schema.hasTable('stitch_queue');
      expect(revertedTableExists).toBe(false);

      // Verify stitch_ticket column was restored to final_entities
      const revertedFinalEntitiesColumnInfo = await knex(
        'final_entities',
      ).columnInfo();
      expect(revertedFinalEntitiesColumnInfo.stitch_ticket).not.toBeUndefined();

      // Verify next_stitch_at and next_stitch_ticket columns were restored to refresh_state
      const revertedRefreshColumnInfo = await knex(
        'refresh_state',
      ).columnInfo();
      expect(revertedRefreshColumnInfo.next_stitch_at).not.toBeUndefined();
      expect(revertedRefreshColumnInfo.next_stitch_ticket).not.toBeUndefined();

      // Verify data was migrated back to refresh_state
      const refreshStateAfterDown = await knex('refresh_state')
        .orderBy('entity_id')
        .select(
          'entity_id',
          'entity_ref',
          'next_stitch_at',
          'next_stitch_ticket',
        );

      // id1 should have stitch data restored
      const id1RefreshRow = refreshStateAfterDown.find(
        r => r.entity_id === 'id1',
      );
      expect(id1RefreshRow?.next_stitch_at).not.toBeNull();
      expect(id1RefreshRow?.next_stitch_ticket).toBe('ticket-1');

      // id2 should have no stitch data
      const id2RefreshRow = refreshStateAfterDown.find(
        r => r.entity_id === 'id2',
      );
      expect(id2RefreshRow?.next_stitch_at).toBeNull();

      await knex.destroy();
    },
  );

  it.each(databases.eachSupportedId())(
    '20260403000000_add_location_entity_ref.js, %p',
    async databaseId => {
      const knex = await databases.init(databaseId);

      await migrateUntilBefore(
        knex,
        '20260403000000_add_location_entity_ref.js',
      );

      // The bootstrap location row was added by an earlier migration; after this
      // migration it will have an empty-string placeholder for location_entity_ref.
      const [bootstrapRow] = await knex('locations').where('type', 'bootstrap');
      expect(bootstrapRow).toBeDefined();

      // Insert a couple of non-bootstrap location rows to verify the backfill.
      await knex('locations').insert([
        {
          id: 'aaaaaaaa-0000-0000-0000-000000000001',
          type: 'url',
          target: 'https://example.com/a/catalog-info.yaml',
        },
        {
          id: 'aaaaaaaa-0000-0000-0000-000000000002',
          type: 'url',
          target: 'https://example.com/b/catalog-info.yaml',
        },
      ]);

      // Verify the column does not yet exist
      const columnsBefore = await knex('locations').columnInfo();
      expect(columnsBefore.location_entity_ref).toBeUndefined();

      await migrateUpOnce(knex);

      // Column should now exist
      const columnsAfter = await knex('locations').columnInfo();
      expect(columnsAfter.location_entity_ref).toBeDefined();

      const rowsAfter = await knex('locations').orderBy('id').select();

      // Helper matching the migration's own logic
      function expectedRef(type: string, target: string): string {
        return `location:default/generated-${createHash('sha1')
          .update(`${type}:${target}`)
          .digest('hex')}`.toLocaleLowerCase('en-US');
      }

      // Non-bootstrap rows get their entity ref backfilled
      const rowA = rowsAfter.find(
        r => r.id === 'aaaaaaaa-0000-0000-0000-000000000001',
      );
      expect(rowA?.location_entity_ref).toBe(
        expectedRef('url', 'https://example.com/a/catalog-info.yaml'),
      );

      const rowB = rowsAfter.find(
        r => r.id === 'aaaaaaaa-0000-0000-0000-000000000002',
      );
      expect(rowB?.location_entity_ref).toBe(
        expectedRef('url', 'https://example.com/b/catalog-info.yaml'),
      );

      // The two targets produce distinct entity refs
      expect(rowA?.location_entity_ref).not.toBe(rowB?.location_entity_ref);

      // The bootstrap row gets an empty string placeholder (it will be removed
      // in a future migration, so a real entity ref is not needed for it)
      const bootstrapRowAfter = rowsAfter.find(r => r.type === 'bootstrap');
      expect(bootstrapRowAfter?.location_entity_ref).toBe('');

      // Rolling back removes the column
      await migrateDownOnce(knex);

      const columnsReverted = await knex('locations').columnInfo();
      expect(columnsReverted.location_entity_ref).toBeUndefined();

      await knex.destroy();
    },
  );
});
