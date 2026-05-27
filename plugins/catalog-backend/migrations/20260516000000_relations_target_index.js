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
 * Adds an index on `relations.target_entity_ref`.
 *
 * The `relations` table had indexes on `originating_entity_id` and
 * `source_entity_ref` but none on `target_entity_ref`. Several query
 * paths (orphan deletion, entity ancestry, eager pruning) join or
 * filter on `target_entity_ref`, causing full sequential scans of the
 * table (~3.5M rows, ~714 MB heap).
 *
 * On PostgreSQL this uses CREATE INDEX CONCURRENTLY to avoid blocking
 * reads and writes. The index is ~141 MB based on the column's average
 * width of ~35 bytes across ~3.5M rows.
 */

/**
 * @param {import('knex').Knex} knex
 */
exports.up = async function up(knex) {
  const client = knex.client.config.client;

  if (client.includes('pg')) {
    // Check if index already exists in the current schema (idempotent).
    // The pg_class lookup is scoped via pg_namespace to handle
    // schema-division mode where each plugin has its own schema.
    const result = await knex.raw(
      `SELECT c.oid, i.indisvalid
       FROM pg_class c
       JOIN pg_namespace n ON n.oid = c.relnamespace
       LEFT JOIN pg_index i ON i.indexrelid = c.oid
       WHERE c.relname = ?
         AND c.relkind = 'i'
         AND n.nspname = current_schema()`,
      ['relations_target_entity_ref_idx'],
    );

    if (result.rows.length > 0) {
      if (result.rows[0].indisvalid) {
        return; // Already exists and valid
      }
      // Invalid — drop and recreate
      await knex.raw(
        'DROP INDEX CONCURRENTLY IF EXISTS relations_target_entity_ref_idx',
      );
    }

    await knex.raw(
      'CREATE INDEX CONCURRENTLY relations_target_entity_ref_idx ON relations (target_entity_ref)',
    );
  } else {
    // SQLite / MySQL — simple CREATE INDEX
    await knex.schema.alterTable('relations', table => {
      table.index(['target_entity_ref'], 'relations_target_entity_ref_idx');
    });
  }
};

/**
 * @param {import('knex').Knex} knex
 */
exports.down = async function down(knex) {
  const client = knex.client.config.client;

  if (client.includes('pg')) {
    await knex.raw(
      'DROP INDEX CONCURRENTLY IF EXISTS relations_target_entity_ref_idx',
    );
  } else {
    await knex.schema.alterTable('relations', table => {
      table.dropIndex([], 'relations_target_entity_ref_idx');
    });
  }
};

exports.config = { transaction: false };
