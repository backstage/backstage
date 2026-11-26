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

import { LoggerService } from '@backstage/backend-plugin-api';
import { Knex } from 'knex';
import { randomUUID } from 'node:crypto';
import { DbFinalEntitiesRow, DbStitchQueueRow } from '../../tables';
import { retryOnDeadlock } from '../../util';

// SQLite compiles a multi-row insert into a compound SELECT, which is limited
// to 500 terms by default.
const insertChunkSize = 500;

// How many refs a warning lists by name.
const loggedRefLimit = 20;

/**
 * A permanent, normally dormant integrity sweep. It finds live final rows
 * whose winner candidate no longer exists and has no pending stitch, and
 * only enqueues their refs for ordinary stitching. It never tombstones or
 * picks a winner itself.
 *
 * Candidate deletion and its stitch request commit together, so a run is
 * expected to find nothing. A finding means that something consumed the
 * request without reconciling the row: an older stitcher during a rolling
 * upgrade, a missing trigger, or manual changes to the database.
 *
 * Each run is one anti-join over all final rows, which databases execute as
 * a single hash join or as one primary key probe per row. Do not add a limit
 * to it: the planner expects many matches, so a limit makes it choose a
 * nested loop that is much slower than reading the whole result. A
 * materialized CTE would avoid that, but only PostgreSQL supports it, so the
 * findings are instead enqueued in chunks.
 */
export function createMissingStitchRepair(options: {
  knex: Knex;
  logger: LoggerService;
}): (signal: AbortSignal) => Promise<void> {
  const { knex, logger } = options;

  return async signal => {
    if (signal.aborted) {
      return;
    }
    const flagged = await findMissing(knex);
    if (!flagged.length) {
      return;
    }
    const enqueued = await enqueueMissing(knex, flagged, signal);
    if (enqueued.count) {
      logger.warn(
        'Found published catalog entities whose candidate is gone without a pending stitch; ' +
          'enqueued them for reconciliation. Outside of a rolling upgrade this indicates ' +
          'a bug or manual database changes.',
        {
          count: enqueued.count,
          entityRefs: summarizeRefs(enqueued.refs),
        },
      );
    }
  };
}

function summarizeRefs(refs: string[]): string {
  const listed = refs.slice(0, loggedRefLimit).join(', ');
  return refs.length > loggedRefLimit
    ? `${listed}, and ${refs.length - loggedRefLimit} more`
    : listed;
}

/**
 * Returns the refs of live final rows whose winner candidate is gone and
 * that have no pending stitch, optionally only among the given refs.
 */
async function findMissing(knex: Knex, among?: string[]): Promise<string[]> {
  return knex<DbFinalEntitiesRow>('final_entities as f')
    .whereNotNull('f.final_entity')
    .whereNotExists(
      knex('refresh_state as r')
        .select(knex.raw('1'))
        .where(
          'r.entity_id',
          knex.raw('COALESCE(??, ??)', [
            'f.winner_candidate_id',
            'f.entity_id',
          ]),
        ),
    )
    .whereNotExists(
      knex('stitch_queue as q')
        .select(knex.raw('1'))
        .where('q.entity_ref', knex.ref('f.entity_ref')),
    )
    .modify(qb => {
      if (among) qb.whereIn('f.entity_ref', among);
    })
    .timeout(30_000)
    .pluck('f.entity_ref');
}

/**
 * Enqueues the refs that still need it and have no pending stitch, in
 * chunks. Existing requests are left alone, including their leases, since
 * they will reconcile the row anyway. Returns what was actually inserted.
 */
async function enqueueMissing(
  knex: Knex,
  flagged: string[],
  signal: AbortSignal,
): Promise<{ count: number; refs: string[] }> {
  let count = 0;
  const refs: string[] = [];
  const sorted = [...flagged].sort();
  for (let i = 0; i < sorted.length && !signal.aborted; i += insertChunkSize) {
    const chunk = sorted.slice(i, i + insertChunkSize);
    const inserted = await retryOnDeadlock(
      () => enqueueChunk(knex, chunk, signal),
      knex,
    );
    count += inserted.count;
    refs.push(...inserted.refs);
  }
  return { count, refs };
}

async function enqueueChunk(
  knex: Knex,
  chunk: string[],
  signal: AbortSignal,
): Promise<{ count: number; refs: string[] }> {
  if (signal.aborted) {
    return { count: 0, refs: [] };
  }
  // Check again just before inserting: a normal stitch may have reconciled a
  // row or been requested since the sweep read it.
  const stillMissing = new Set(await findMissing(knex, chunk));
  const refs = chunk.filter(ref => stillMissing.has(ref));
  if (!refs.length || signal.aborted) {
    return { count: 0, refs: [] };
  }

  const ticket = randomUUID();
  const insert = knex<DbStitchQueueRow>('stitch_queue')
    .insert(
      refs.map(entity_ref => ({
        entity_ref,
        stitch_ticket: ticket,
        failure_count: 0,
        next_stitch_at: knex.fn.now(),
      })),
    )
    .onConflict('entity_ref')
    .ignore();

  if (String(knex.client.config.client).includes('mysql')) {
    // MySQL cannot return the inserted rows, only how many there were. The
    // refs are those attempted.
    const { sql, bindings } = insert.toSQL();
    const [result] = await knex.raw(sql, bindings).timeout(30_000);
    return { count: result.affectedRows, refs };
  }
  const rows = await insert.returning('entity_ref').timeout(30_000);
  return {
    count: rows.length,
    refs: rows.map((row: { entity_ref: string }) => row.entity_ref),
  };
}
