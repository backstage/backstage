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
import lodash from 'lodash';
import { DbRelationsRow } from '../../tables';

const BATCH_SIZE = 50;

type RelationKey = {
  source_entity_ref: string;
  type: string;
  target_entity_ref: string;
};

export type SyncRelationsResult = {
  deleted: RelationKey[];
  inserted: RelationKey[];
};

function relationKey(r: RelationKey): string {
  return `${r.source_entity_ref}\0${r.type}\0${r.target_entity_ref}`;
}

/**
 * Synchronizes the relations for a given originating entity, applying only
 * the minimal set of changes needed. Rows that already exist are left
 * untouched, new rows are inserted, and stale rows are deleted.
 *
 * Returns the deleted and inserted rows so the caller can compute the
 * exact set of entities that need stitching.
 *
 * Uses database-specific strategies:
 * - Postgres: Single writable CTE (one round-trip, fully atomic)
 * - MySQL/SQLite: In-memory diff with targeted deletes and inserts
 */
export async function syncRelations(
  knex: Knex | Knex.Transaction,
  originatingEntityId: string,
  desired: DbRelationsRow[],
): Promise<SyncRelationsResult> {
  const client = knex.client.config.client;
  const deduped = deduplicateRelations(desired);

  if (client === 'pg') {
    return syncPostgres(knex, originatingEntityId, deduped);
  }
  return syncSimple(knex, originatingEntityId, deduped);
}

function deduplicateRelations(rows: DbRelationsRow[]): DbRelationsRow[] {
  const seen = new Set<string>();
  return rows.filter(r => {
    const key = relationKey(r);
    if (seen.has(key)) {
      return false;
    }
    seen.add(key);
    return true;
  });
}

// ---------------------------------------------------------------------------
// Postgres: writable CTE
//
// All CTE branches see the same pre-modification snapshot, so the DELETE
// and INSERT do not interfere. This is a single atomic statement.
//
// Processing for a given entity is serialized (one processor claims it
// at a time), so concurrent inserts are not a concern and we do not
// need a unique constraint — NOT EXISTS is sufficient.
// ---------------------------------------------------------------------------
async function syncPostgres(
  knex: Knex | Knex.Transaction,
  originatingEntityId: string,
  desired: DbRelationsRow[],
): Promise<SyncRelationsResult> {
  if (desired.length === 0) {
    const { rows: deleted } = await knex.raw<{ rows: RelationKey[] }>(
      `DELETE FROM relations
       WHERE originating_entity_id = ?
       RETURNING source_entity_ref, type, target_entity_ref`,
      [originatingEntityId],
    );
    return { deleted, inserted: [] };
  }

  // Build arrays for unnest: one array per column
  const sources: string[] = [];
  const types: string[] = [];
  const targets: string[] = [];
  for (const r of desired) {
    sources.push(r.source_entity_ref);
    types.push(r.type);
    targets.push(r.target_entity_ref);
  }

  const { rows } = await knex.raw<{ rows: (RelationKey & { op: string })[] }>(
    `
    WITH desired AS (
      SELECT * FROM unnest(?::text[], ?::text[], ?::text[])
        AS t(source_entity_ref, type, target_entity_ref)
    ),
    deleted AS (
      DELETE FROM relations r
      WHERE r.originating_entity_id = ?
        AND NOT EXISTS (
          SELECT 1 FROM desired d
          WHERE d.source_entity_ref = r.source_entity_ref
            AND d.type = r.type
            AND d.target_entity_ref = r.target_entity_ref
        )
      RETURNING r.source_entity_ref, r.type, r.target_entity_ref
    ),
    inserted AS (
      INSERT INTO relations (originating_entity_id, source_entity_ref, type, target_entity_ref)
      SELECT ?, d.source_entity_ref, d.type, d.target_entity_ref
      FROM desired d
      WHERE NOT EXISTS (
        SELECT 1 FROM relations r
        WHERE r.originating_entity_id = ?
          AND r.source_entity_ref = d.source_entity_ref
          AND r.type = d.type
          AND r.target_entity_ref = d.target_entity_ref
      )
      RETURNING source_entity_ref, type, target_entity_ref
    )
    SELECT 'd' AS op, source_entity_ref, type, target_entity_ref FROM deleted
    UNION ALL
    SELECT 'i' AS op, source_entity_ref, type, target_entity_ref FROM inserted
    `,
    [
      sources,
      types,
      targets,
      originatingEntityId,
      originatingEntityId,
      originatingEntityId,
    ],
  );

  const deleted: RelationKey[] = [];
  const inserted: RelationKey[] = [];
  for (const row of rows) {
    const key = {
      source_entity_ref: row.source_entity_ref,
      type: row.type,
      target_entity_ref: row.target_entity_ref,
    };
    if (row.op === 'd') {
      deleted.push(key);
    } else {
      inserted.push(key);
    }
  }

  return { deleted, inserted };
}

// ---------------------------------------------------------------------------
// MySQL / SQLite: in-memory diff
// ---------------------------------------------------------------------------
async function syncSimple(
  knex: Knex | Knex.Transaction,
  originatingEntityId: string,
  desired: DbRelationsRow[],
): Promise<SyncRelationsResult> {
  const existing = await knex<DbRelationsRow>('relations')
    .where({ originating_entity_id: originatingEntityId })
    .select('source_entity_ref', 'type', 'target_entity_ref');

  const existingSet = new Map(existing.map(r => [relationKey(r), r]));
  const desiredSet = new Map(desired.map(r => [relationKey(r), r]));

  const toDelete = [...existingSet.entries()]
    .filter(([key]) => !desiredSet.has(key))
    .map(([, row]) => row);
  const toInsert = [...desiredSet.entries()]
    .filter(([key]) => !existingSet.has(key))
    .map(([, row]) => row);

  if (toDelete.length > 0) {
    // Delete in chunks to avoid query size limits
    for (const chunk of lodash(toDelete).chunk(BATCH_SIZE).value()) {
      await knex('relations')
        .where({ originating_entity_id: originatingEntityId })
        .andWhere(function matchChunk() {
          for (const r of chunk) {
            this.orWhere({
              source_entity_ref: r.source_entity_ref,
              type: r.type,
              target_entity_ref: r.target_entity_ref,
            });
          }
        })
        .delete();
    }
  }

  if (toInsert.length > 0) {
    await knex.batchInsert(
      'relations',
      toInsert.map(r => ({
        originating_entity_id: originatingEntityId,
        source_entity_ref: r.source_entity_ref,
        type: r.type,
        target_entity_ref: r.target_entity_ref,
      })),
      BATCH_SIZE,
    );
  }

  return {
    deleted: toDelete.map(r => ({
      source_entity_ref: r.source_entity_ref,
      type: r.type,
      target_entity_ref: r.target_entity_ref,
    })),
    inserted: toInsert.map(r => ({
      source_entity_ref: r.source_entity_ref,
      type: r.type,
      target_entity_ref: r.target_entity_ref,
    })),
  };
}
