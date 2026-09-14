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

const BATCH_SIZE = 50;

/**
 * Identifies the source of a set of refresh_state_references rows.
 *
 * - `sourceKey`: an entity provider (stored in the `source_key` column)
 * - `sourceEntityRef`: a parent entity during processing (stored in the
 *   `source_entity_ref` column)
 */
export type RefreshStateReferenceSource =
  | { sourceKey: string }
  | { sourceEntityRef: string };

/**
 * Synchronizes the refresh_state_references rows for a given source,
 * applying only the minimal set of changes needed. Rows that already exist
 * are left untouched, new rows are inserted, and stale rows are deleted —
 * minimizing write churn, dead tuples, and WAL traffic.
 *
 * Crucially, this function ONLY touches rows owned by the given source.
 * References from other sources are never modified, which is correct for
 * multi-parent scenarios where several entities or providers legitimately
 * reference the same child.
 *
 * Uses database-specific strategies:
 * - Postgres: Source lock followed by a writable CTE
 * - MySQL: Temporary table merge in a transaction
 * - SQLite: Transactional diff
 */
export async function syncRefreshStateReferences(
  knex: Knex | Knex.Transaction,
  source: RefreshStateReferenceSource,
  targetEntityRefs: string[],
): Promise<void> {
  const client = knex.client.config.client;
  const col = sourceColumn(source);
  const uniqueTargets = [...new Set(targetEntityRefs)];

  if (client === 'pg') {
    await syncPostgres(knex, col, uniqueTargets);
  } else if (client.includes('mysql')) {
    await syncMysql(knex, col, uniqueTargets);
  } else {
    await syncTransactionalDiff(knex, col, uniqueTargets);
  }
}

// ---------------------------------------------------------------------------
// Internals
// ---------------------------------------------------------------------------

interface SourceColumn {
  column: 'source_key' | 'source_entity_ref';
  value: string;
}

function sourceColumn(source: RefreshStateReferenceSource): SourceColumn {
  if ('sourceKey' in source) {
    return { column: 'source_key', value: source.sourceKey };
  }
  return { column: 'source_entity_ref', value: source.sourceEntityRef };
}

// ---------------------------------------------------------------------------
// Postgres: source serialization + writable CTE
//
// The advisory transaction lock serializes updates to each source. It is
// acquired in a separate statement so a caller that waits for the lock gets
// a fresh READ COMMITTED snapshot for the CTE. All CTE branches then see that
// same snapshot, so the DELETE and INSERT do not interfere with each other.
//
// ON CONFLICT uses the matching partial unique index as an integrity guard:
//   (source_entity_ref, target_entity_ref) WHERE source_entity_ref IS NOT NULL
//   (source_key, target_entity_ref)        WHERE source_key IS NOT NULL
// ---------------------------------------------------------------------------
async function syncPostgres(
  knex: Knex | Knex.Transaction,
  src: SourceColumn,
  targetEntityRefs: string[],
): Promise<void> {
  await knex.transaction(async trx => {
    await trx.raw(
      'SELECT pg_advisory_xact_lock(hashtextextended(?::text, 0))',
      [`refresh_state_references:${src.column}:${src.value}`],
    );

    const col = `"${src.column}"`;
    await trx.raw(
      `
      WITH desired(target_entity_ref) AS (
        SELECT unnest(?::text[])
      ),
      deleted AS (
        DELETE FROM refresh_state_references r
        WHERE r.${col} = ?
          AND NOT EXISTS (
            SELECT 1 FROM desired d
            WHERE d.target_entity_ref = r.target_entity_ref
          )
      )
      INSERT INTO refresh_state_references (${col}, target_entity_ref)
      SELECT ?, d.target_entity_ref
      FROM desired d
      WHERE NOT EXISTS (
        SELECT 1 FROM refresh_state_references r
        WHERE r.${col} = ?
          AND r.target_entity_ref = d.target_entity_ref
      )
      ON CONFLICT (${col}, target_entity_ref)
        WHERE ${col} IS NOT NULL
      DO NOTHING
      `,
      [targetEntityRefs, src.value, src.value, src.value],
    );
  });
}

// ---------------------------------------------------------------------------
// MySQL: temporary table merge
// ---------------------------------------------------------------------------
async function syncMysql(
  knex: Knex | Knex.Transaction,
  src: SourceColumn,
  targetEntityRefs: string[],
): Promise<void> {
  await knex.transaction(async trx => {
    await trx.raw(
      'CREATE TEMPORARY TABLE IF NOT EXISTS `_desired_refresh_state_references` (' +
        '`target_entity_ref` VARCHAR(255) NOT NULL PRIMARY KEY' +
        ')',
    );
    await trx.raw('DELETE FROM `_desired_refresh_state_references`');

    if (targetEntityRefs.length > 0) {
      await trx.batchInsert(
        '_desired_refresh_state_references',
        targetEntityRefs.map(targetEntityRef => ({
          target_entity_ref: targetEntityRef,
        })),
        BATCH_SIZE,
      );
    }

    await trx.raw(
      `DELETE r FROM refresh_state_references r
           WHERE r.?? = ?
             AND NOT EXISTS (
               SELECT 1 FROM _desired_refresh_state_references d
               WHERE d.target_entity_ref = r.target_entity_ref
             )`,
      [src.column, src.value],
    );

    await trx.raw(
      `INSERT INTO refresh_state_references (??, target_entity_ref)
           SELECT ?, d.target_entity_ref
           FROM _desired_refresh_state_references d
           WHERE NOT EXISTS (
             SELECT 1 FROM refresh_state_references r
             WHERE r.?? = ?
               AND r.target_entity_ref = d.target_entity_ref
           )`,
      [src.column, src.value, src.column, src.value],
    );
  });
}

// ---------------------------------------------------------------------------
// SQLite (and fallback): transactional diff
// ---------------------------------------------------------------------------
async function syncTransactionalDiff(
  knex: Knex | Knex.Transaction,
  src: SourceColumn,
  targetEntityRefs: string[],
): Promise<void> {
  await knex.transaction(async trx => {
    const existing = new Set(
      (
        await trx('refresh_state_references')
          .where({ [src.column]: src.value })
          .select('target_entity_ref')
      ).map((row: { target_entity_ref: string }) => row.target_entity_ref),
    );

    const desired = new Set(targetEntityRefs);
    const stale = [...existing].filter(ref => !desired.has(ref));
    const missing = targetEntityRefs.filter(ref => !existing.has(ref));

    if (stale.length > 0) {
      await trx('refresh_state_references')
        .where({ [src.column]: src.value })
        .whereIn('target_entity_ref', stale)
        .delete();
    }
    if (missing.length > 0) {
      await trx.batchInsert(
        'refresh_state_references',
        missing.map(ref => ({
          [src.column]: src.value,
          target_entity_ref: ref,
        })),
        BATCH_SIZE,
      );
    }
  });
}
