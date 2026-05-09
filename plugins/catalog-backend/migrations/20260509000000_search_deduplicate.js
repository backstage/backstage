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
 * Removes duplicate rows from the search table and adds a UNIQUE constraint
 * on (entity_id, key, value) so that duplicates cannot recur. The constraint
 * is enforced "softly" via ON CONFLICT DO NOTHING in the write path
 * (syncSearchRows), so violating inserts are silently skipped rather than
 * causing hard errors.
 *
 * Background: the old search-row write path (DELETE all + INSERT all) could
 * race between concurrent stitchers, producing duplicate rows. The newer
 * syncSearchRows upsert logic mostly prevents this, but a narrow window
 * remains when two pods stitch the same entity simultaneously. The UNIQUE
 * constraint closes that window.
 *
 * On PostgreSQL, if the covering index search_entity_key_value_idx already
 * exists (e.g. from the deferred index creation in a prior release), it is
 * dropped and replaced by a UNIQUE version under the same name. The brief
 * window without the index during the CONCURRENTLY rebuild is acceptable
 * because the migration runs during startup before the pod serves traffic.
 */

/**
 * @param {import('knex').Knex} knex
 */
exports.up = async function up(knex) {
  const client = knex.client.config.client;

  if (client.includes('pg')) {
    await dedupPostgres(knex);
    await ensureUniqueIndexPostgres(knex);
  } else if (client.includes('mysql')) {
    await dedupMysql(knex);
    await ensureUniqueIndexMysql(knex);
  } else {
    await dedupSqlite(knex);
    await ensureUniqueIndexSqlite(knex);
  }
};

/**
 * @param {import('knex').Knex} knex
 */
exports.down = async function down(knex) {
  const client = knex.client.config.client;

  if (client.includes('pg')) {
    // Check if it's a unique index/constraint — if so, replace with non-unique
    const [{ is_unique }] = (
      await knex.raw(`
        SELECT indisunique AS is_unique
        FROM pg_index
        WHERE indexrelid = 'search_entity_key_value_idx'::regclass
      `)
    ).rows;
    if (is_unique) {
      await knex.raw(
        `DROP INDEX CONCURRENTLY IF EXISTS search_entity_key_value_idx`,
      );
      await knex.raw(`
        CREATE INDEX CONCURRENTLY search_entity_key_value_idx
        ON search (entity_id, key, value)
      `);
    }
  } else {
    // MySQL/SQLite: drop the unique index if it exists, recreate as non-unique
    await knex.schema.alterTable('search', table => {
      table.dropIndex(
        ['entity_id', 'key', 'value'],
        'search_entity_key_value_idx',
      );
    });
    await knex.schema.alterTable('search', table => {
      table.index(['entity_id', 'key', 'value'], 'search_entity_key_value_idx');
    });
  }
};

// Disable the default transaction wrapper — the batched deletes and
// CONCURRENTLY operations cannot run inside a transaction.
exports.config = {
  transaction: false,
};

// ---------------------------------------------------------------------------
// PostgreSQL
// ---------------------------------------------------------------------------

/**
 * @param {import('knex').Knex} knex
 */
async function dedupPostgres(knex) {
  // Window-function dedup: partition by (entity_id, key, value), delete all
  // but the first row in each group. The PARTITION BY treats NULLs as equal,
  // so this handles both NULL-value and non-NULL-value duplicates.
  await knex.raw(`
    WITH cte AS (
      SELECT ctid,
             row_number() OVER (PARTITION BY entity_id, key, value) AS rn
      FROM search
    )
    DELETE FROM search
    USING cte
    WHERE search.ctid = cte.ctid AND cte.rn > 1
  `);
}

/**
 * @param {import('knex').Knex} knex
 */
async function ensureUniqueIndexPostgres(knex) {
  // Check current state of the index
  const result = await knex.raw(`
    SELECT indisunique, indisvalid
    FROM pg_index
    WHERE indexrelid = (
      SELECT oid FROM pg_class
      WHERE relname = 'search_entity_key_value_idx'
    )
  `);

  if (result.rows.length > 0) {
    const { indisunique, indisvalid } = result.rows[0];

    if (indisunique && indisvalid) {
      return; // Already a valid unique index — nothing to do
    }

    // Either non-unique or invalid — drop and recreate as unique
    await knex.raw(
      `DROP INDEX CONCURRENTLY IF EXISTS search_entity_key_value_idx`,
    );
  }

  await knex.raw(`
    CREATE UNIQUE INDEX CONCURRENTLY search_entity_key_value_idx
    ON search (entity_id, key, value)
  `);
}

// ---------------------------------------------------------------------------
// MySQL
// ---------------------------------------------------------------------------

/**
 * @param {import('knex').Knex} knex
 */
async function dedupMysql(knex) {
  // MySQL doesn't support ctid. Use a self-join on the auto-increment
  // surrogate or a temp table approach. Since search has no auto-increment
  // PK, we use a temp table to hold the keepers.
  await knex.transaction(async trx => {
    await trx.raw(
      'CREATE TEMPORARY TABLE IF NOT EXISTS `_search_keep` (' +
        '`entity_id` VARCHAR(255), ' +
        '`key` VARCHAR(255), ' +
        '`value` VARCHAR(255), ' +
        '`original_value` VARCHAR(255)' +
        ')',
    );
    await trx.raw('DELETE FROM `_search_keep`');

    // Keep one row per (entity_id, key, value) group
    await trx.raw(
      'INSERT INTO `_search_keep` ' +
        'SELECT `entity_id`, `key`, `value`, MAX(`original_value`) ' +
        'FROM `search` ' +
        'GROUP BY `entity_id`, `key`, `value`',
    );

    await trx.raw('DELETE FROM `search`');
    await trx.raw(
      'INSERT INTO `search` (`entity_id`, `key`, `value`, `original_value`) ' +
        'SELECT * FROM `_search_keep`',
    );

    await trx.raw('DROP TEMPORARY TABLE `_search_keep`');
  });
}

/**
 * @param {import('knex').Knex} knex
 */
async function ensureUniqueIndexMysql(knex) {
  // Check if index exists
  const [rows] = await knex.raw(
    "SHOW INDEX FROM `search` WHERE Key_name = 'search_entity_key_value_idx'",
  );

  if (rows.length > 0) {
    // Drop existing (may be non-unique)
    await knex.schema.alterTable('search', table => {
      table.dropIndex(
        ['entity_id', 'key', 'value'],
        'search_entity_key_value_idx',
      );
    });
  }

  await knex.schema.alterTable('search', table => {
    table.unique(['entity_id', 'key', 'value'], 'search_entity_key_value_idx');
  });
}

// ---------------------------------------------------------------------------
// SQLite
// ---------------------------------------------------------------------------

/**
 * @param {import('knex').Knex} knex
 */
async function dedupSqlite(knex) {
  await knex.transaction(async trx => {
    // SQLite: delete duplicates keeping the one with the lowest rowid
    await trx.raw(`
      DELETE FROM search
      WHERE rowid NOT IN (
        SELECT MIN(rowid)
        FROM search
        GROUP BY entity_id, key, value
      )
    `);
  });
}

/**
 * @param {import('knex').Knex} knex
 */
async function ensureUniqueIndexSqlite(knex) {
  // SQLite doesn't support adding a unique index if one with the same name
  // already exists (non-unique). Drop first if present.
  await knex.raw(`DROP INDEX IF EXISTS search_entity_key_value_idx`);
  await knex.raw(`
    CREATE UNIQUE INDEX search_entity_key_value_idx
    ON search (entity_id, key, value)
  `);
}
