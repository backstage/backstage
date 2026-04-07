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

import { Knex } from 'knex';
import { DbSearchRow } from '../../tables';
import { BATCH_SIZE } from './util';

// The Postgres sync uses COALESCE(x, NULL_SENTINEL) to allow Postgres to
// include nullable columns in the Hash Cond of anti-joins (IS NOT DISTINCT
// FROM prevents this). As a consequence, values that are exactly this
// sentinel character are not searchable — they would be treated as NULL.
// This is the SOH (Start of Heading) control character which does not
// appear in real entity metadata.
const NULL_SENTINEL = '\x01';

function filterSentinelValues(entries: DbSearchRow[]): DbSearchRow[] {
  return entries.filter(
    r => r.value !== NULL_SENTINEL && r.original_value !== NULL_SENTINEL,
  );
}

/**
 * Synchronizes the search table rows for a given entity, applying only the
 * minimal set of changes needed. Rows that already exist with the correct
 * values are left untouched, new rows are inserted, and stale rows are
 * deleted — minimizing write churn, dead tuples, and WAL traffic.
 *
 * Uses database-specific strategies:
 * - Postgres: Single writable CTE with unnest (one round-trip, no DDL)
 * - MySQL: Temporary table merge (two queries in a transaction)
 * - SQLite: Simple bulk replace (sufficient for dev/test)
 */
export async function syncSearchRows(
  knex: Knex | Knex.Transaction,
  entityId: string,
  searchEntries: DbSearchRow[],
): Promise<void> {
  const client = knex.client.config.client;

  if (client === 'pg') {
    await syncPostgres(knex, entityId, searchEntries);
  } else if (client.includes('mysql')) {
    await syncMysql(knex, entityId, searchEntries);
  } else {
    await syncBulkReplace(knex, entityId, searchEntries);
  }
}

// ---------------------------------------------------------------------------
// Postgres: writable CTE + unnest
//
// All CTE branches see the same pre-modification snapshot, so the DELETE
// and INSERT do not interfere with each other. This is a single atomic
// statement — no explicit transaction wrapper needed.
//
// Nullable columns use COALESCE(x, chr(1)) instead of IS NOT DISTINCT FROM
// so that Postgres can include all three columns in the Hash Cond of the
// anti-join, rather than pushing nullable comparisons into a Join Filter
// that degrades to O(n*m) when many rows share the same key. chr(1) (SOH
// control character) is used as the NULL sentinel — it cannot appear in
// real entity values since they are human-readable strings.
// ---------------------------------------------------------------------------
async function syncPostgres(
  knex: Knex | Knex.Transaction,
  entityId: string,
  searchEntries: DbSearchRow[],
): Promise<void> {
  const filtered = filterSentinelValues(searchEntries);
  const keys = filtered.map(r => r.key);
  const values = filtered.map(r => r.value);
  const originalValues = filtered.map(r => r.original_value);

  await knex.raw(
    `
    WITH desired AS (
      SELECT *
      FROM unnest(?::text[], ?::text[], ?::text[])
        AS d(key, value, original_value)
    ),
    deleted AS (
      DELETE FROM "search" s
      WHERE s.entity_id = ?
        AND NOT EXISTS (
          SELECT 1 FROM desired d
          WHERE d.key = s.key
            AND COALESCE(d.value, chr(1)) = COALESCE(s.value, chr(1))
            AND COALESCE(d.original_value, chr(1)) = COALESCE(s.original_value, chr(1))
        )
    )
    INSERT INTO "search" (entity_id, key, value, original_value)
    SELECT ?, d.key, d.value, d.original_value
    FROM desired d
    WHERE NOT EXISTS (
      SELECT 1 FROM "search" s
      WHERE s.entity_id = ?
        AND s.key = d.key
        AND COALESCE(s.value, chr(1)) = COALESCE(d.value, chr(1))
        AND COALESCE(s.original_value, chr(1)) = COALESCE(d.original_value, chr(1))
    )
    `,
    [keys, values, originalValues, entityId, entityId, entityId],
  );
}

// ---------------------------------------------------------------------------
// MySQL: temporary table merge with deadlock retry
//
// MySQL does not support data-modifying CTEs, so we materialize the desired
// state into a session-scoped temporary table and then merge it into the
// real table with two queries. The temp table is created inside the
// transaction to guarantee it exists on the same pooled connection.
// CREATE/DROP TEMPORARY TABLE does not cause an implicit commit in MySQL
// (unlike regular DDL), so this is transaction-safe.
//
// InnoDB's next-key (gap) locking can cause deadlocks between concurrent
// transactions operating on different entity_ids when their gap locks
// overlap on shared index pages. We retry on deadlock (error 1213) since
// the operation is idempotent.
// ---------------------------------------------------------------------------
const MYSQL_DEADLOCK_MAX_RETRIES = 3;

async function syncMysql(
  knex: Knex | Knex.Transaction,
  entityId: string,
  searchEntries: DbSearchRow[],
): Promise<void> {
  for (let attempt = 1; ; attempt++) {
    try {
      await knex.transaction(async trx => {
        // Create the temp table inside the transaction so it's guaranteed
        // to be on the same pooled connection as the merge queries.
        // CREATE TEMPORARY TABLE does not cause an implicit commit in
        // MySQL (unlike regular CREATE TABLE), so this is safe.
        await trx.raw(
          'CREATE TEMPORARY TABLE IF NOT EXISTS `_desired_search` (' +
            '`key` VARCHAR(255) NOT NULL, ' +
            '`value` VARCHAR(255) NULL, ' +
            '`original_value` VARCHAR(255) NULL' +
            ')',
        );
        // Clear stale data from any previous call on this connection.
        // Uses DELETE (DML) instead of TRUNCATE (DDL) to avoid an
        // implicit commit that would break transaction atomicity.
        await trx.raw('DELETE FROM `_desired_search`');

        if (searchEntries.length > 0) {
          await trx.batchInsert(
            '_desired_search',
            searchEntries.map(r => ({
              key: r.key,
              value: r.value,
              original_value: r.original_value,
            })),
            BATCH_SIZE,
          );
        }

        // Delete rows that are no longer in the desired set
        await trx.raw(
          'DELETE s FROM `search` s ' +
            'WHERE s.entity_id = ? ' +
            'AND NOT EXISTS (' +
            '  SELECT 1 FROM `_desired_search` d' +
            '  WHERE d.`key` = s.`key`' +
            '    AND d.`value` <=> s.`value`' +
            '    AND BINARY d.`original_value` <=> BINARY s.`original_value`' +
            ')',
          [entityId],
        );

        // Insert rows that are new in the desired set. The original_value
        // column preserves the original casing and must be compared with
        // BINARY to avoid MySQL's default case-insensitive collation
        // treating e.g. "Team-A" and "team-a" as equal.
        await trx.raw(
          'INSERT INTO `search` (entity_id, `key`, `value`, `original_value`) ' +
            'SELECT ?, d.`key`, d.`value`, d.`original_value` ' +
            'FROM `_desired_search` d ' +
            'WHERE NOT EXISTS (' +
            '  SELECT 1 FROM `search` s' +
            '  WHERE s.entity_id = ?' +
            '    AND s.`key` = d.`key`' +
            '    AND s.`value` <=> d.`value`' +
            '    AND BINARY s.`original_value` <=> BINARY d.`original_value`' +
            ')',
          [entityId, entityId],
        );
      });
      return;
    } catch (error) {
      // MySQL error 1213: ER_LOCK_DEADLOCK
      if (
        (error as any)?.errno === 1213 &&
        attempt < MYSQL_DEADLOCK_MAX_RETRIES
      ) {
        continue;
      }
      throw error;
    }
  }
}

// ---------------------------------------------------------------------------
// SQLite (and fallback): bulk replace
// ---------------------------------------------------------------------------
async function syncBulkReplace(
  knex: Knex | Knex.Transaction,
  entityId: string,
  searchEntries: DbSearchRow[],
): Promise<void> {
  await knex.transaction(async trx => {
    await trx<DbSearchRow>('search').where({ entity_id: entityId }).delete();
    await trx.batchInsert('search', searchEntries, BATCH_SIZE);
  });
}
