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
 * Adds covering indices to the search table that include entity_id, enabling
 * index-only scans for the EXISTS subqueries used in entity filtering.
 *
 * - (entity_id, key, value): Optimal for correlated EXISTS subqueries where
 *   the outer query provides entity_id and the inner query filters by key/value.
 * - (key, value, entity_id): Replaces the old (key, value) index; enables
 *   index-only scans when scanning by key+value and returning entity_id.
 *
 * @param { import("knex").Knex } knex
 */
exports.up = async function up(knex) {
  if (knex.client.config.client === 'pg') {
    // Covering index for EXISTS correlated subqueries (probe by entity_id)
    await knex.raw(
      'CREATE INDEX CONCURRENTLY IF NOT EXISTS search_entity_key_value_idx ON search (entity_id, key, value)',
    );
    // Covering replacement for the old (key, value) index
    await knex.raw(
      'CREATE INDEX CONCURRENTLY IF NOT EXISTS search_key_value_entity_idx ON search (key, value, entity_id)',
    );
    // Drop the old non-covering index, now superseded
    await knex.raw('DROP INDEX CONCURRENTLY IF EXISTS search_key_value_idx');
  } else {
    // The search_key_value_idx only existed on pg, so no need to drop it here
    await knex.schema.alterTable('search', table => {
      table.index(['entity_id', 'key', 'value'], 'search_entity_key_value_idx');
      table.index(['key', 'value', 'entity_id'], 'search_key_value_entity_idx');
    });
  }
};

/**
 * @param { import("knex").Knex } knex
 */
exports.down = async function down(knex) {
  if (knex.client.config.client === 'pg') {
    // Restore the original index
    await knex.raw(
      'CREATE INDEX CONCURRENTLY IF NOT EXISTS search_key_value_idx ON search (key, value)',
    );
    // Drop the new indices
    await knex.raw(
      'DROP INDEX CONCURRENTLY IF EXISTS search_key_value_entity_idx',
    );
    await knex.raw(
      'DROP INDEX CONCURRENTLY IF EXISTS search_entity_key_value_idx',
    );
  } else {
    await knex.schema.alterTable('search', table => {
      table.index(['key', 'value'], 'search_key_value_idx');
      table.dropIndex([], 'search_key_value_entity_idx');
      table.dropIndex([], 'search_entity_key_value_idx');
    });
  }
};

exports.config = {
  transaction: false,
};
