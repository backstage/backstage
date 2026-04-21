/*
 * Copyright 2026 The Backstage Authors
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

import { TestDatabases, mockServices } from '@backstage/backend-test-utils';
import { Knex } from 'knex';
import { ensureDeferredIndices } from './deferredIndices';

const migrationsDir = `${__dirname}/../../migrations`;

jest.setTimeout(120_000);

describe('ensureDeferredIndices', () => {
  const databases = TestDatabases.create();
  const logger = mockServices.logger.mock();

  function isPg(databaseId: string) {
    return databaseId.startsWith('POSTGRES');
  }

  async function initDatabase(databaseId: string): Promise<Knex> {
    const knex = await databases.init(databaseId as any);
    await knex.migrate.latest({ directory: migrationsDir });
    return knex;
  }

  async function getIndexNames(knex: Knex, tableName: string) {
    const result = await knex.raw(
      `SELECT indexname FROM pg_indexes WHERE tablename = ?`,
      [tableName],
    );
    return result.rows.map((r: any) => r.indexname) as string[];
  }

  async function isIndexValid(knex: Knex, indexName: string) {
    const result = await knex.raw(
      `SELECT i.indisvalid
         FROM pg_class c
         JOIN pg_index i ON i.indexrelid = c.oid
        WHERE c.relname = ?`,
      [indexName],
    );
    return result.rows.length > 0 && result.rows[0].indisvalid;
  }

  it.each(databases.eachSupportedId())(
    'creates all deferred indices on a fresh database, %p',
    async databaseId => {
      if (!isPg(databaseId)) {
        return;
      }

      const knex = await initDatabase(databaseId);
      try {
        await ensureDeferredIndices(knex, logger);

        const indices = await getIndexNames(knex, 'search');

        expect(indices).toContain('search_entity_key_value_idx');
        expect(indices).toContain('search_key_value_entity_idx');
        expect(indices).toContain('search_facets_covering_idx');

        expect(await isIndexValid(knex, 'search_entity_key_value_idx')).toBe(
          true,
        );
        expect(await isIndexValid(knex, 'search_key_value_entity_idx')).toBe(
          true,
        );
        expect(await isIndexValid(knex, 'search_facets_covering_idx')).toBe(
          true,
        );

        expect(indices).not.toContain('search_key_value_idx');
        expect(indices).not.toContain('search_key_original_value_idx');
      } finally {
        await knex.destroy();
      }
    },
  );

  it.each(databases.eachSupportedId())(
    'skips already-existing valid indices on second run, %p',
    async databaseId => {
      if (!isPg(databaseId)) {
        return;
      }

      const knex = await initDatabase(databaseId);
      try {
        await ensureDeferredIndices(knex, logger);
        await ensureDeferredIndices(knex, logger);

        const indices = await getIndexNames(knex, 'search');
        expect(indices).toContain('search_entity_key_value_idx');
        expect(indices).toContain('search_key_value_entity_idx');
        expect(indices).toContain('search_facets_covering_idx');
      } finally {
        await knex.destroy();
      }
    },
  );

  it.each(databases.eachSupportedId())(
    'cleans up INVALID indices and recreates them, %p',
    async databaseId => {
      if (!isPg(databaseId)) {
        return;
      }

      const knex = await initDatabase(databaseId);
      try {
        // Create a valid index first, then mark it invalid via pg_index to
        // simulate an interrupted CREATE INDEX CONCURRENTLY.
        await knex.raw(
          'CREATE INDEX CONCURRENTLY IF NOT EXISTS search_entity_key_value_idx ON search (entity_id, key, value)',
        );
        await knex.raw(
          `UPDATE pg_index SET indisvalid = false
            WHERE indexrelid = 'search_entity_key_value_idx'::regclass`,
        );
        expect(await isIndexValid(knex, 'search_entity_key_value_idx')).toBe(
          false,
        );

        await ensureDeferredIndices(knex, logger);

        expect(await isIndexValid(knex, 'search_entity_key_value_idx')).toBe(
          true,
        );
        expect(await isIndexValid(knex, 'search_key_value_entity_idx')).toBe(
          true,
        );
        expect(await isIndexValid(knex, 'search_facets_covering_idx')).toBe(
          true,
        );
      } finally {
        await knex.destroy();
      }
    },
  );

  it.each(databases.eachSupportedId())(
    'does not leave advisory locks held after completion, %p',
    async databaseId => {
      if (!isPg(databaseId)) {
        return;
      }

      const knex = await initDatabase(databaseId);
      try {
        await ensureDeferredIndices(knex, logger);

        // Verify no advisory locks are still held by querying pg_locks
        const result = await knex.raw(
          `SELECT count(*) AS count FROM pg_locks
            WHERE locktype = 'advisory'
              AND classid = ? AND objid = ?`,
          [202604, 15],
        );
        expect(Number(result.rows[0].count)).toBe(0);
      } finally {
        await knex.destroy();
      }
    },
  );

  it.each(databases.eachSupportedId())(
    'is a no-op on non-PostgreSQL engines, %p',
    async databaseId => {
      if (isPg(databaseId)) {
        return;
      }

      const knex = await initDatabase(databaseId);
      try {
        await ensureDeferredIndices(knex, logger);
      } finally {
        await knex.destroy();
      }
    },
  );
});
