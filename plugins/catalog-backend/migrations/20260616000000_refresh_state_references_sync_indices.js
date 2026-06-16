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
 * Adds partial unique indices on refresh_state_references to support the
 * diff-based sync CTE (syncRefreshStateReferences) and drops the old
 * single-column indices that are made redundant by the new composites.
 *
 * ## Indices added
 *
 * - (source_entity_ref, target_entity_ref) WHERE source_entity_ref IS NOT NULL
 *   Enforces one reference per (source entity, target entity) pair. The
 *   leading column covers lookups previously served by the old
 *   source_entity_ref single-column index, and the unique constraint
 *   enables ON CONFLICT DO NOTHING in the Postgres sync CTE.
 *
 * - (source_key, target_entity_ref) WHERE source_key IS NOT NULL
 *   Same treatment for provider-to-entity references. The leading column
 *   covers lookups previously served by the old source_key single-column
 *   index.
 *
 * ## Indices dropped
 *
 * - refresh_state_references_source_entity_ref_idx  (superseded)
 * - refresh_state_references_source_key_idx         (superseded)
 *
 * The target_entity_ref index is retained — no new index has that column
 * as the leading key, and it is needed for orphan detection and FK cascade
 * deletes.
 *
 * ## Deduplication
 *
 * Before creating the unique indices, any existing duplicate rows are
 * removed. Under normal operation duplicates should not exist (the current
 * code runs delete-all + reinsert inside a transaction), but we clean up
 * defensively in case of past bugs or races.
 *
 * ## Operator fast path
 *
 * If the unique indices already exist (e.g. the operator ran the DDL by
 * hand), both the dedup and index creation are skipped — startup is
 * instant.
 *
 * ## Cost
 *
 * - Postgres: CREATE INDEX CONCURRENTLY on a ~490K row table takes a few
 *   seconds. The dedup self-join is similarly cheap. DROP INDEX
 *   CONCURRENTLY is instant.
 * - MySQL: regular CREATE/DROP INDEX, briefly locks the table.
 * - SQLite: instant.
 */

/**
 * @param {import('knex').Knex} knex
 */
exports.up = async function up(knex) {
  const client = knex.client.config.client;

  if (client.includes('pg')) {
    await upPostgres(knex);
  } else if (client.includes('mysql')) {
    await upMysql(knex);
  } else {
    await upSqlite(knex);
  }
};

/**
 * @param {import('knex').Knex} knex
 */
exports.down = async function down(knex) {
  const client = knex.client.config.client;

  if (client.includes('pg')) {
    await downPostgres(knex);
  } else if (client.includes('mysql')) {
    await downMysql(knex);
  } else {
    await downSqlite(knex);
  }
};

// CREATE/DROP INDEX CONCURRENTLY cannot run inside a transaction.
exports.config = { transaction: false };

// ---------------------------------------------------------------------------
// Postgres
// ---------------------------------------------------------------------------

/** @param {import('knex').Knex} knex */
async function upPostgres(knex) {
  // Fast path: if both unique indices are already valid, skip everything.
  const entityIdx = await pgIndexIsValid(
    knex,
    'refresh_state_references_source_entity_target_uniq',
  );
  const keyIdx = await pgIndexIsValid(
    knex,
    'refresh_state_references_source_key_target_uniq',
  );

  if (!entityIdx) {
    // Deduplicate source_entity_ref rows before creating the unique index.
    await knex.raw(`
      DELETE FROM refresh_state_references a
      USING refresh_state_references b
      WHERE a.id > b.id
        AND a.source_entity_ref IS NOT NULL
        AND a.source_entity_ref = b.source_entity_ref
        AND a.target_entity_ref = b.target_entity_ref
    `);
    await knex.raw(`
      CREATE UNIQUE INDEX CONCURRENTLY IF NOT EXISTS
        refresh_state_references_source_entity_target_uniq
        ON refresh_state_references (source_entity_ref, target_entity_ref)
        WHERE source_entity_ref IS NOT NULL
    `);
  }

  if (!keyIdx) {
    // Deduplicate source_key rows before creating the unique index.
    await knex.raw(`
      DELETE FROM refresh_state_references a
      USING refresh_state_references b
      WHERE a.id > b.id
        AND a.source_key IS NOT NULL
        AND a.source_key = b.source_key
        AND a.target_entity_ref = b.target_entity_ref
    `);
    await knex.raw(`
      CREATE UNIQUE INDEX CONCURRENTLY IF NOT EXISTS
        refresh_state_references_source_key_target_uniq
        ON refresh_state_references (source_key, target_entity_ref)
        WHERE source_key IS NOT NULL
    `);
  }

  // Drop old single-column indices that the new composites supersede.
  await knex.raw(
    'DROP INDEX CONCURRENTLY IF EXISTS refresh_state_references_source_entity_ref_idx',
  );
  await knex.raw(
    'DROP INDEX CONCURRENTLY IF EXISTS refresh_state_references_source_key_idx',
  );
}

/** @param {import('knex').Knex} knex */
async function downPostgres(knex) {
  // Restore old single-column indices before dropping the new ones.
  await knex.raw(`
    CREATE INDEX CONCURRENTLY IF NOT EXISTS
      refresh_state_references_source_entity_ref_idx
      ON refresh_state_references (source_entity_ref)
  `);
  await knex.raw(`
    CREATE INDEX CONCURRENTLY IF NOT EXISTS
      refresh_state_references_source_key_idx
      ON refresh_state_references (source_key)
  `);
  await knex.raw(
    'DROP INDEX CONCURRENTLY IF EXISTS refresh_state_references_source_entity_target_uniq',
  );
  await knex.raw(
    'DROP INDEX CONCURRENTLY IF EXISTS refresh_state_references_source_key_target_uniq',
  );
}

/**
 * @param {import('knex').Knex} knex
 * @param {string} name
 * @returns {Promise<boolean>}
 */
async function pgIndexIsValid(knex, name) {
  const result = await knex.raw(
    `SELECT indisvalid
     FROM pg_index
     WHERE indexrelid = (
       SELECT oid FROM pg_class WHERE relname = ? AND relkind = 'i'
     ) AND indisunique = true`,
    [name],
  );
  return result.rows[0]?.indisvalid === true;
}

// ---------------------------------------------------------------------------
// MySQL
// ---------------------------------------------------------------------------

/** @param {import('knex').Knex} knex */
async function upMysql(knex) {
  // MySQL treats NULLs as distinct in unique indices, so a regular
  // (non-partial) unique index works correctly: it prevents duplicates
  // for non-NULL source values while allowing multiple NULL rows.

  const hasEntityIdx = await mysqlIndexExists(
    knex,
    'refresh_state_references_source_entity_target_uniq',
  );
  if (!hasEntityIdx) {
    // Deduplicate
    await knex.raw(`
      DELETE a FROM refresh_state_references a
      INNER JOIN refresh_state_references b
      ON a.id > b.id
        AND a.source_entity_ref IS NOT NULL
        AND a.source_entity_ref = b.source_entity_ref
        AND a.target_entity_ref = b.target_entity_ref
    `);
    await knex.schema.alterTable('refresh_state_references', table => {
      table.unique(
        ['source_entity_ref', 'target_entity_ref'],
        'refresh_state_references_source_entity_target_uniq',
      );
    });
  }

  const hasKeyIdx = await mysqlIndexExists(
    knex,
    'refresh_state_references_source_key_target_uniq',
  );
  if (!hasKeyIdx) {
    await knex.raw(`
      DELETE a FROM refresh_state_references a
      INNER JOIN refresh_state_references b
      ON a.id > b.id
        AND a.source_key IS NOT NULL
        AND a.source_key = b.source_key
        AND a.target_entity_ref = b.target_entity_ref
    `);
    await knex.schema.alterTable('refresh_state_references', table => {
      table.unique(
        ['source_key', 'target_entity_ref'],
        'refresh_state_references_source_key_target_uniq',
      );
    });
  }

  // Drop old single-column indices.
  await mysqlDropIndexIfExists(
    knex,
    'refresh_state_references_source_entity_ref_idx',
  );
  await mysqlDropIndexIfExists(knex, 'refresh_state_references_source_key_idx');
}

/** @param {import('knex').Knex} knex */
async function downMysql(knex) {
  await knex.schema.alterTable('refresh_state_references', table => {
    table.index(
      ['source_entity_ref'],
      'refresh_state_references_source_entity_ref_idx',
    );
    table.index(['source_key'], 'refresh_state_references_source_key_idx');
  });
  await mysqlDropIndexIfExists(
    knex,
    'refresh_state_references_source_entity_target_uniq',
  );
  await mysqlDropIndexIfExists(
    knex,
    'refresh_state_references_source_key_target_uniq',
  );
}

/**
 * @param {import('knex').Knex} knex
 * @param {string} name
 * @returns {Promise<boolean>}
 */
async function mysqlIndexExists(knex, name) {
  const [rows] = await knex.raw(
    `SHOW INDEX FROM refresh_state_references WHERE Key_name = ?`,
    [name],
  );
  return rows.length > 0;
}

/**
 * @param {import('knex').Knex} knex
 * @param {string} name
 */
async function mysqlDropIndexIfExists(knex, name) {
  const exists = await mysqlIndexExists(knex, name);
  if (exists) {
    await knex.schema.alterTable('refresh_state_references', table => {
      table.dropIndex([], name);
    });
  }
}

// ---------------------------------------------------------------------------
// SQLite
// ---------------------------------------------------------------------------

/** @param {import('knex').Knex} knex */
async function upSqlite(knex) {
  // SQLite treats NULLs as distinct in unique indices, same as MySQL.
  // Dedup is unlikely to be needed (dev/test only) but done for safety.

  await knex.raw(`
    DELETE FROM refresh_state_references
    WHERE id NOT IN (
      SELECT MIN(id) FROM refresh_state_references
      WHERE source_entity_ref IS NOT NULL
      GROUP BY source_entity_ref, target_entity_ref
    ) AND source_entity_ref IS NOT NULL
  `);
  await knex.raw(`
    DELETE FROM refresh_state_references
    WHERE id NOT IN (
      SELECT MIN(id) FROM refresh_state_references
      WHERE source_key IS NOT NULL
      GROUP BY source_key, target_entity_ref
    ) AND source_key IS NOT NULL
  `);

  await knex.raw(`
    CREATE UNIQUE INDEX IF NOT EXISTS
      refresh_state_references_source_entity_target_uniq
      ON refresh_state_references (source_entity_ref, target_entity_ref)
      WHERE source_entity_ref IS NOT NULL
  `);
  await knex.raw(`
    CREATE UNIQUE INDEX IF NOT EXISTS
      refresh_state_references_source_key_target_uniq
      ON refresh_state_references (source_key, target_entity_ref)
      WHERE source_key IS NOT NULL
  `);

  // Drop old indices.
  await knex.raw(
    'DROP INDEX IF EXISTS refresh_state_references_source_entity_ref_idx',
  );
  await knex.raw(
    'DROP INDEX IF EXISTS refresh_state_references_source_key_idx',
  );
}

/** @param {import('knex').Knex} knex */
async function downSqlite(knex) {
  await knex.raw(`
    CREATE INDEX IF NOT EXISTS refresh_state_references_source_entity_ref_idx
      ON refresh_state_references (source_entity_ref)
  `);
  await knex.raw(`
    CREATE INDEX IF NOT EXISTS refresh_state_references_source_key_idx
      ON refresh_state_references (source_key)
  `);
  await knex.raw(
    'DROP INDEX IF EXISTS refresh_state_references_source_entity_target_uniq',
  );
  await knex.raw(
    'DROP INDEX IF EXISTS refresh_state_references_source_key_target_uniq',
  );
}
