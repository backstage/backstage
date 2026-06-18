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

// @ts-check

/**
 * Drops the legacy `search_entity_id_idx` index on the `search` table.
 *
 * This single-column index on `entity_id` was created by the original
 * migration (20210302150147) and served as the supporting index for the
 * foreign key on `search.entity_id`. It is now fully redundant: the
 * UNIQUE index `search_entity_key_value_idx` (entity_id, key, value),
 * introduced in 20260510000000, has `entity_id` as its leading column
 * and covers both FK cascade checks and all entity_id lookups.
 *
 * Worse, the old index actively harms performance. Because it is 4.4x
 * smaller than the covering index, the PostgreSQL planner prefers it
 * for entity_id lookups in correlated EXISTS subqueries. This forces a
 * read-all-then-filter-by-key pattern (~28 rows per entity) instead of
 * a direct (entity_id, key) seek on the covering index (1 row). On
 * catalog list queries with multiple sort-field EXISTS checks, this
 * causes minutes-long execution times.
 *
 * ## Cost
 *
 * - **PostgreSQL**: `DROP INDEX CONCURRENTLY` — non-blocking for
 *   reads and writes, but may wait for concurrent transactions to
 *   finish. Reclaims ~384 MB on a 490K-entity catalog.
 * - **MySQL / SQLite**: standard `DROP INDEX`. Reclaims proportionally
 *   less space on smaller catalogs.
 *
 * This migration is safe to run manually before deploying — the
 * `IF EXISTS` / idempotent checks ensure it is a no-op if the index
 * has already been removed.
 */

/**
 * @param {import('knex').Knex} knex
 */
exports.up = async function up(knex) {
  const client = knex.client.config.client;

  if (client.includes('pg')) {
    const result = await knex.raw(
      `SELECT 1 FROM pg_class WHERE relname = 'search_entity_id_idx' AND relkind = 'i'`,
    );
    if (result.rows.length > 0) {
      await knex.raw('DROP INDEX CONCURRENTLY IF EXISTS search_entity_id_idx');
    }
  } else if (client.includes('mysql')) {
    const [rows] = await knex.raw(
      `SHOW INDEX FROM \`search\` WHERE Key_name = 'search_entity_id_idx'`,
    );
    if (rows.length > 0) {
      await knex.schema.alterTable('search', table => {
        table.dropIndex([], 'search_entity_id_idx');
      });
    }
  } else {
    await knex.raw('DROP INDEX IF EXISTS search_entity_id_idx');
  }
};

/**
 * @param {import('knex').Knex} knex
 */
exports.down = async function down(knex) {
  const client = knex.client.config.client;

  if (client.includes('pg')) {
    await knex.raw(
      'CREATE INDEX CONCURRENTLY IF NOT EXISTS search_entity_id_idx ON search (entity_id)',
    );
  } else if (client.includes('mysql')) {
    const [rows] = await knex.raw(
      `SHOW INDEX FROM \`search\` WHERE Key_name = 'search_entity_id_idx'`,
    );
    if (rows.length === 0) {
      await knex.schema.alterTable('search', table => {
        table.index(['entity_id'], 'search_entity_id_idx');
      });
    }
  } else {
    await knex.raw(
      'CREATE INDEX IF NOT EXISTS search_entity_id_idx ON search (entity_id)',
    );
  }
};

exports.config = { transaction: false };
