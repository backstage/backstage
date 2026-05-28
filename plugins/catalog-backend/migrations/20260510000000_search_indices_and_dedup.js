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
 * Deduplicates the search table, adds covering indices (including a UNIQUE
 * constraint on (entity_id, key, value)), and drops superseded indices.
 *
 * On PostgreSQL this uses CREATE INDEX CONCURRENTLY which avoids blocking
 * reads/writes but can take several minutes on large tables (13M+ rows).
 * Each step is idempotent: it checks the current state and skips work
 * already done, or cleans up INVALID indices left by an interrupted
 * attempt before retrying. However, an interrupted index build does NOT
 * leave partial progress — each retry starts from scratch. If the
 * Kubernetes liveness probe kills the pod before an index build completes,
 * the next startup will drop the INVALID index and restart the build. On
 * large tables this can repeat indefinitely. To prevent this, either
 * increase the liveness probe timeout for this one-time upgrade, or run
 * the SQL commands below manually before deploying.
 *
 * ## Deduplication strategy
 *
 * The dedup step is skipped entirely if the UNIQUE index already exists and
 * is valid — a valid unique index guarantees no duplicates can be present.
 *
 * When dedup is needed the migration uses a two-phase approach that avoids
 * a full heap scan by leveraging the pre-existing
 * search_key_value_entity_idx (key, value, entity_id) covering index:
 *
 *   Phase 1 (index-only scan):
 *     GROUP BY entity_id, key, value on the covering index — zero heap
 *     fetches — to build a small temp table of only the duplicate groups.
 *
 *   Phase 2 (index scan, dup rows only):
 *     For each duplicate group in the temp table, LATERAL index-scan back
 *     into search to find the per-group ctids, then DELETE them in one
 *     statement. Only the ~2× duplicate rows are touched; clean rows are
 *     never read from the heap.
 *
 * ## Recommended: run manually before deploying (large installations)
 *
 * For PostgreSQL installations with millions of search rows, run these
 * commands against your database BEFORE deploying this version. Each
 * index build takes a few minutes but does not block reads or writes.
 * The migration detects that the indices already exist and skips all work,
 * so startup is instant.
 *
 *   -- 1. Remove duplicate search rows using the same index-friendly
 *   --    two-phase strategy used by the migration itself.
 *   CREATE TEMP TABLE _search_dedup_groups AS
 *     SELECT entity_id, key, value
 *     FROM search
 *     GROUP BY entity_id, key, value
 *     HAVING COUNT(*) > 1;
 *   CREATE INDEX ON _search_dedup_groups (key, value, entity_id);
 *
 *   DELETE FROM search WHERE ctid IN (
 *     SELECT s.ctid FROM _search_dedup_groups g
 *     CROSS JOIN LATERAL (
 *       SELECT ctid FROM (
 *         SELECT ctid,
 *                row_number() OVER (ORDER BY ctid) AS rn
 *         FROM search
 *         WHERE key = g.key AND entity_id = g.entity_id
 *           AND value = g.value
 *       ) sub WHERE rn > 1
 *     ) s WHERE g.value IS NOT NULL
 *     UNION ALL
 *     SELECT s.ctid FROM _search_dedup_groups g
 *     CROSS JOIN LATERAL (
 *       SELECT ctid FROM (
 *         SELECT ctid,
 *                row_number() OVER (ORDER BY ctid) AS rn
 *         FROM search
 *         WHERE key = g.key AND entity_id = g.entity_id
 *           AND value IS NULL
 *       ) sub WHERE rn > 1
 *     ) s WHERE g.value IS NULL
 *   );
 *
 *   DROP TABLE _search_dedup_groups;
 *
 *   -- 2. Create indices (run each separately)
 *   CREATE UNIQUE INDEX CONCURRENTLY IF NOT EXISTS
 *     search_entity_key_value_idx ON search (entity_id, key, value);
 *   CREATE INDEX CONCURRENTLY IF NOT EXISTS
 *     search_key_value_entity_idx ON search (key, value, entity_id);
 *   CREATE INDEX CONCURRENTLY IF NOT EXISTS
 *     search_facets_covering_idx ON search (key, original_value, entity_id)
 *     WHERE original_value IS NOT NULL;
 *
 *   -- 3. Drop old indices
 *   DROP INDEX CONCURRENTLY IF EXISTS search_key_value_idx;
 *   DROP INDEX CONCURRENTLY IF EXISTS search_key_original_value_idx;
 *
 * If these commands have already completed, the migration will detect the
 * existing indices and skip all work — startup will be instant.
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
    // Restore the old indices first so there is no window without coverage,
    // then drop the new ones.
    await knex.raw(
      'CREATE INDEX CONCURRENTLY IF NOT EXISTS search_key_value_idx ON search (key, value)',
    );
    await knex.raw(
      'CREATE INDEX CONCURRENTLY IF NOT EXISTS search_key_original_value_idx ON search (key, original_value)',
    );
    await knex.raw(
      'DROP INDEX CONCURRENTLY IF EXISTS search_entity_key_value_idx',
    );
    await knex.raw(
      'DROP INDEX CONCURRENTLY IF EXISTS search_key_value_entity_idx',
    );
    await knex.raw(
      'DROP INDEX CONCURRENTLY IF EXISTS search_facets_covering_idx',
    );
  } else if (client.includes('mysql')) {
    await knex.schema.alterTable('search', table => {
      table.index(['key', 'value'], 'search_key_value_idx');
      table.index(['key', 'original_value'], 'search_key_original_value_idx');
    });
    await mysqlDropIndexIfExists(knex, 'search_entity_key_value_idx');
    await mysqlDropIndexIfExists(knex, 'search_key_value_entity_idx');
    await mysqlDropIndexIfExists(knex, 'search_facets_covering_idx');
  } else {
    await knex.raw(
      'CREATE INDEX IF NOT EXISTS search_key_value_idx ON search (key, value)',
    );
    await knex.raw(
      'CREATE INDEX IF NOT EXISTS search_key_original_value_idx ON search (key, original_value)',
    );
    await knex.raw('DROP INDEX IF EXISTS search_entity_key_value_idx');
    await knex.raw('DROP INDEX IF EXISTS search_key_value_entity_idx');
    await knex.raw('DROP INDEX IF EXISTS search_facets_covering_idx');
  }
};

exports.config = { transaction: false };

// ---------------------------------------------------------------------------
// PostgreSQL
// ---------------------------------------------------------------------------

/** @param {import('knex').Knex} knex */
async function upPostgres(knex) {
  // Step 1: Ensure the covering index exists before deduplication.
  // This non-unique index on (key, value, entity_id) covers all three dedup
  // columns, enabling an index-only GROUP BY scan with zero heap fetches in
  // Phase 1 of the dedup. Creating it here guarantees this is true even on
  // vanilla installations that have never run any preparatory SQL manually.
  await ensurePgIndex(knex, {
    name: 'search_key_value_entity_idx',
    columns: '(key, value, entity_id)',
    unique: false,
  });

  // Step 2: Remove duplicate search rows.
  //
  // Fast path: if the UNIQUE index already exists and is valid, Postgres has
  // been enforcing uniqueness since the index was created, so there are no
  // duplicates. Skip dedup entirely — this makes restarts essentially free
  // for installations that created the index manually beforehand.
  //
  // Slow path (index absent or invalid): two-phase approach.
  //   Phase 1: index-only GROUP BY scan over search_key_value_entity_idx
  //            (key, value, entity_id) — zero heap fetches — to build a
  //            temp table of only the duplicate groups.
  //   Phase 2: LATERAL + index scan to find ctids within each group, then
  //            a single DELETE. Only the duplicate rows (~2× their count)
  //            are ever read from the heap; the full table is never scanned.
  const uniqueCheck = await knex.raw(
    `SELECT indisvalid
     FROM pg_index
     WHERE indexrelid = (
       SELECT oid FROM pg_class WHERE relname = ? AND relkind = 'i'
     ) AND indisunique = true`,
    ['search_entity_key_value_idx'],
  );
  const needsDedup = !uniqueCheck.rows[0]?.indisvalid;

  if (needsDedup) {
    // Phase 1: index-only GROUP BY scan — no heap fetches.
    // search_key_value_entity_idx (key, value, entity_id) covers all three
    // dedup columns, so PostgreSQL resolves COUNT(*) without touching the
    // heap at all (Heap Fetches: 0 in EXPLAIN). The result is a small temp
    // table of only the duplicate (entity_id, key, value) groups.
    await knex.raw(`
      CREATE TEMP TABLE _search_dedup_groups AS
      SELECT entity_id, key, value
      FROM search
      GROUP BY entity_id, key, value
      HAVING COUNT(*) > 1
    `);
    await knex.raw(
      `CREATE INDEX ON _search_dedup_groups (key, value, entity_id)`,
    );

    // Phase 2: for each duplicate group, LATERAL-join back into search via
    // the covering index (Nested Loop + Index Scan), row_number within that
    // tiny per-group result, then DELETE rows where rn > 1. Only the ~2×
    // duplicate rows are ever read from the heap; all clean rows are skipped.
    //
    // NULL values need a separate arm because `value = NULL` is always false
    // in SQL — `value IS NULL` is required for the index condition.
    await knex.raw(`
      DELETE FROM search WHERE ctid IN (
        SELECT s.ctid FROM _search_dedup_groups g
        CROSS JOIN LATERAL (
          SELECT ctid FROM (
            SELECT ctid,
                   row_number() OVER (ORDER BY ctid) AS rn
            FROM search
            WHERE key = g.key AND entity_id = g.entity_id
              AND value = g.value
          ) sub WHERE rn > 1
        ) s WHERE g.value IS NOT NULL

        UNION ALL

        SELECT s.ctid FROM _search_dedup_groups g
        CROSS JOIN LATERAL (
          SELECT ctid FROM (
            SELECT ctid,
                   row_number() OVER (ORDER BY ctid) AS rn
            FROM search
            WHERE key = g.key AND entity_id = g.entity_id
              AND value IS NULL
          ) sub WHERE rn > 1
        ) s WHERE g.value IS NULL
      )
    `);

    await knex.raw('DROP TABLE IF EXISTS _search_dedup_groups');
  }

  // Step 3: Create remaining covering indices. Each call is idempotent —
  // it checks the index state and only does work if needed.
  // search_key_value_entity_idx was already created in Step 1.
  await ensurePgIndex(knex, {
    name: 'search_entity_key_value_idx',
    columns: '(entity_id, key, value)',
    unique: true,
  });
  await ensurePgIndex(knex, {
    name: 'search_facets_covering_idx',
    columns: '(key, original_value, entity_id)',
    where: 'WHERE original_value IS NOT NULL',
    unique: false,
  });

  // Step 4: Drop superseded indices.
  await dropPgIndexIfExists(knex, 'search_key_value_idx');
  await dropPgIndexIfExists(knex, 'search_key_original_value_idx');
}

/**
 * Creates or replaces an index on the search table, handling all edge cases:
 * - Already valid with correct uniqueness: skip
 * - Exists but INVALID (interrupted CREATE): drop and recreate
 * - Exists but wrong uniqueness (e.g. non-unique but we need unique): drop and recreate
 * - Missing: create from scratch
 *
 * @param {import('knex').Knex} knex
 * @param {{ name: string; columns: string; unique: boolean; where?: string }} opts
 */
async function ensurePgIndex(knex, opts) {
  const { name, columns, unique, where } = opts;

  const result = await knex.raw(
    `
    SELECT indisunique, indisvalid
    FROM pg_index
    WHERE indexrelid = (
      SELECT oid FROM pg_class WHERE relname = ? AND relkind = 'i'
    )
  `,
    [name],
  );

  if (result.rows.length > 0) {
    const { indisunique, indisvalid } = result.rows[0];
    if (indisvalid && indisunique === unique) {
      return; // Already correct
    }
    // Wrong state — drop and recreate
    await knex.raw(`DROP INDEX CONCURRENTLY IF EXISTS "${name}"`);
  }

  const uniqueKw = unique ? 'UNIQUE' : '';
  const whereClause = where || '';
  await knex.raw(
    `CREATE ${uniqueKw} INDEX CONCURRENTLY "${name}" ON search ${columns} ${whereClause}`,
  );
}

/**
 * @param {import('knex').Knex} knex
 * @param {string} name
 */
async function dropPgIndexIfExists(knex, name) {
  const result = await knex.raw(
    `
    SELECT 1 FROM pg_class WHERE relname = ? AND relkind = 'i'
  `,
    [name],
  );
  if (result.rows.length > 0) {
    await knex.raw(`DROP INDEX CONCURRENTLY IF EXISTS "${name}"`);
  }
}

// ---------------------------------------------------------------------------
// MySQL
// ---------------------------------------------------------------------------

/** @param {import('knex').Knex} knex */
async function upMysql(knex) {
  // Dedup via temp table
  await knex.transaction(async trx => {
    await trx.raw(
      'CREATE TEMPORARY TABLE IF NOT EXISTS `_search_keep` (' +
        '`entity_id` VARCHAR(255), `key` VARCHAR(255), ' +
        '`value` VARCHAR(255), `original_value` VARCHAR(255))',
    );
    await trx.raw('DELETE FROM `_search_keep`');
    await trx.raw(
      'INSERT INTO `_search_keep` ' +
        'SELECT `entity_id`, `key`, `value`, MAX(`original_value`) ' +
        'FROM `search` GROUP BY `entity_id`, `key`, `value`',
    );
    await trx.raw('DELETE FROM `search`');
    await trx.raw(
      'INSERT INTO `search` (`entity_id`, `key`, `value`, `original_value`) ' +
        'SELECT * FROM `_search_keep`',
    );
    await trx.raw('DROP TEMPORARY TABLE `_search_keep`');
  });

  // Drop old indices if present, then create new ones
  await mysqlDropIndexIfExists(knex, 'search_key_value_idx');
  await mysqlDropIndexIfExists(knex, 'search_key_original_value_idx');
  await mysqlDropIndexIfExists(knex, 'search_entity_key_value_idx');
  await mysqlDropIndexIfExists(knex, 'search_key_value_entity_idx');
  await mysqlDropIndexIfExists(knex, 'search_facets_covering_idx');

  await knex.schema.alterTable('search', table => {
    table.unique(['entity_id', 'key', 'value'], 'search_entity_key_value_idx');
    table.index(['key', 'value', 'entity_id'], 'search_key_value_entity_idx');
  });
  // MySQL doesn't support partial indices — create a full one
  await knex.schema.alterTable('search', table => {
    table.index(
      ['key', 'original_value', 'entity_id'],
      'search_facets_covering_idx',
    );
  });
}

/** @param {import('knex').Knex} knex @param {string} name */
async function mysqlDropIndexIfExists(knex, name) {
  const [rows] = await knex.raw(
    `SHOW INDEX FROM \`search\` WHERE Key_name = ?`,
    [name],
  );
  if (rows.length > 0) {
    await knex.schema.alterTable('search', t => {
      t.dropIndex([], name);
    });
  }
}

// ---------------------------------------------------------------------------
// SQLite
// ---------------------------------------------------------------------------

/** @param {import('knex').Knex} knex */
async function upSqlite(knex) {
  await knex.transaction(async trx => {
    await trx.raw(`
      DELETE FROM search
      WHERE rowid NOT IN (
        SELECT MIN(rowid) FROM search GROUP BY entity_id, key, value
      )
    `);
  });

  // Drop old, create new — SQLite is fast on small tables
  await knex.raw('DROP INDEX IF EXISTS search_key_value_idx');
  await knex.raw('DROP INDEX IF EXISTS search_key_original_value_idx');
  await knex.raw('DROP INDEX IF EXISTS search_entity_key_value_idx');
  await knex.raw('DROP INDEX IF EXISTS search_key_value_entity_idx');
  await knex.raw('DROP INDEX IF EXISTS search_facets_covering_idx');

  await knex.raw(
    'CREATE UNIQUE INDEX search_entity_key_value_idx ON search (entity_id, key, value)',
  );
  await knex.raw(
    'CREATE INDEX search_key_value_entity_idx ON search (key, value, entity_id)',
  );
  await knex.raw(
    'CREATE INDEX search_facets_covering_idx ON search (key, original_value, entity_id)',
  );
}
