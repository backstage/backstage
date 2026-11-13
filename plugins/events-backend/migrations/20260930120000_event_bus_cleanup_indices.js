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
 * The event bus currently creates its tables only for PostgreSQL. Build these
 * indexes concurrently so upgrading a busy event bus does not block writes.
 * The old topic index is replaced by (topic, id), which also serves topic-only
 * lookups while letting subscription reads start at their cursor.
 *
 * This migration runs outside a transaction because PostgreSQL forbids
 * CREATE/DROP INDEX CONCURRENTLY inside one. An interrupted concurrent build
 * can leave an invalid index, so retries repair it before continuing.
 */

/**
 * @param {import('knex').Knex} knex
 * @param {string} name
 * @param {string[]} columns
 */
async function ensureIndex(knex, name, columns) {
  const { rows } = await knex.raw(
    `SELECT i.indisvalid, i.indisunique,
            pg_get_indexdef(i.indexrelid, 1, true) AS first_column,
            pg_get_indexdef(i.indexrelid, 2, true) AS second_column
     FROM pg_class index_table
     JOIN pg_namespace namespace ON namespace.oid = index_table.relnamespace
     JOIN pg_index i ON i.indexrelid = index_table.oid
     JOIN pg_class event_table ON event_table.oid = i.indrelid
     WHERE index_table.relname = ?
       AND namespace.nspname = current_schema()
       AND event_table.relname = 'event_bus_events'`,
    [name],
  );

  if (rows.length > 0) {
    const index = rows[0];
    if (index.indisvalid) {
      const actualColumns = [index.first_column, index.second_column].filter(
        Boolean,
      );
      if (index.indisunique || actualColumns.join(',') !== columns.join(',')) {
        throw new Error(`Existing index ${name} has an unexpected definition`);
      }
      return;
    }

    await knex.raw(`DROP INDEX CONCURRENTLY IF EXISTS ${name}`);
  }

  await knex.raw(
    `CREATE INDEX CONCURRENTLY ${name} ON event_bus_events (${columns.join(
      ', ',
    )})`,
  );
}

/** @param {import('knex').Knex} knex */
exports.up = async function up(knex) {
  if (knex.client.config.client !== 'pg') {
    return;
  }

  await ensureIndex(knex, 'event_bus_events_created_at_id_idx', [
    'created_at',
    'id',
  ]);
  await ensureIndex(knex, 'event_bus_events_topic_id_idx', ['topic', 'id']);
  await knex.raw(
    'DROP INDEX CONCURRENTLY IF EXISTS event_bus_events_topic_idx',
  );
};

/** @param {import('knex').Knex} knex */
exports.down = async function down(knex) {
  if (knex.client.config.client !== 'pg') {
    return;
  }

  await ensureIndex(knex, 'event_bus_events_topic_idx', ['topic']);
  await knex.raw(
    'DROP INDEX CONCURRENTLY IF EXISTS event_bus_events_topic_id_idx',
  );
  await knex.raw(
    'DROP INDEX CONCURRENTLY IF EXISTS event_bus_events_created_at_id_idx',
  );
};

exports.config = { transaction: false };
