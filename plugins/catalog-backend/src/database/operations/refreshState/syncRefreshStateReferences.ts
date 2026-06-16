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
 * - Postgres: Single writable CTE (one round-trip, fully atomic)
 * - MySQL/SQLite: In-memory diff with targeted deletes and inserts
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
  } else {
    await syncSimple(knex, col, uniqueTargets);
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
// Postgres: writable CTE
//
// All CTE branches see the same pre-modification snapshot, so the DELETE
// and INSERT do not interfere with each other. This is a single atomic
// statement — no explicit transaction wrapper needed.
//
// ON CONFLICT uses the matching partial unique index to handle concurrent
// callers that race on the same source:
//   (source_entity_ref, target_entity_ref) WHERE source_entity_ref IS NOT NULL
//   (source_key, target_entity_ref)        WHERE source_key IS NOT NULL
// ---------------------------------------------------------------------------
async function syncPostgres(
  knex: Knex | Knex.Transaction,
  src: SourceColumn,
  targetEntityRefs: string[],
): Promise<void> {
  const col = `"${src.column}"`;
  await knex.raw(
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
}

// ---------------------------------------------------------------------------
// MySQL / SQLite: in-memory diff
//
// Read existing refs, compute the diff, then issue targeted deletes and
// inserts. The data volume per source is small (typically 0-5 rows), so
// the extra SELECT round-trip is negligible.
// ---------------------------------------------------------------------------
async function syncSimple(
  knex: Knex | Knex.Transaction,
  src: SourceColumn,
  targetEntityRefs: string[],
): Promise<void> {
  const existing = new Set(
    (
      await knex('refresh_state_references')
        .where({ [src.column]: src.value })
        .select('target_entity_ref')
    ).map((r: { target_entity_ref: string }) => r.target_entity_ref),
  );

  const desired = new Set(targetEntityRefs);

  const toDelete = [...existing].filter(ref => !desired.has(ref));
  const toInsert = targetEntityRefs.filter(ref => !existing.has(ref));

  if (toDelete.length > 0) {
    await knex('refresh_state_references')
      .where({ [src.column]: src.value })
      .whereIn('target_entity_ref', toDelete)
      .delete();
  }

  if (toInsert.length > 0) {
    await knex.batchInsert(
      'refresh_state_references',
      toInsert.map(ref => ({
        [src.column]: src.value,
        target_entity_ref: ref,
      })),
      BATCH_SIZE,
    );
  }
}
