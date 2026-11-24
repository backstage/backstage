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

type SweepRow = {
  entity_id: string;
  entity_ref: string;
  is_live: number | string;
  candidate_id: string | null;
};

/**
 * A permanent, normally dormant integrity sweep. It finds live final rows
 * whose winner candidate no longer exists and has no pending stitch, and
 * only enqueues their refs for ordinary stitching. It never tombstones or
 * picks a winner itself.
 *
 * Candidate deletion and its stitch request commit together, so a full pass
 * is expected to find nothing. A finding means that something consumed the
 * request without reconciling the row: an older stitcher during a rolling
 * upgrade, a missing trigger, or manual changes to the database.
 *
 * Each batch is a primary key range of final rows followed by at most one
 * primary key probe per row into the candidates, never an unbounded
 * anti-join. The cursor lives in memory and wraps around after the last row.
 * Each process starts at a random position, since slot IDs are random UUIDs,
 * so that every row is eventually visited however often processes restart.
 */
export function createMissingStitchRepair(options: {
  knex: Knex;
  logger: LoggerService;
  batchSize?: number;
  maxBatchesPerRun?: number;
  /** Where the first batch starts; null for the beginning. Defaults to random. */
  startAfter?: string | null;
}): (signal: AbortSignal) => Promise<void> {
  const { knex, logger, batchSize = 1000, maxBatchesPerRun = 20 } = options;
  let cursor: string | undefined =
    options.startAfter === undefined
      ? randomUUID()
      : options.startAfter ?? undefined;

  return async signal => {
    for (let i = 0; i < maxBatchesPerRun && !signal.aborted; i++) {
      const rows = await readBatch(knex, cursor, batchSize);
      const flagged = rows.filter(isMissingStitch).map(row => row.entity_ref);
      if (flagged.length) {
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
      }

      if (signal.aborted) {
        // The batch may be partly handled. Leave the cursor so that the next
        // run handles it again; already queued refs are skipped.
        return;
      }
      // Only advance once the batch has been handled.
      if (rows.length < batchSize) {
        cursor = undefined;
        return;
      }
      cursor = rows[rows.length - 1].entity_id;
    }
  };
}

function summarizeRefs(refs: string[]): string {
  const listed = refs.slice(0, loggedRefLimit).join(', ');
  return refs.length > loggedRefLimit
    ? `${listed}, and ${refs.length - loggedRefLimit} more`
    : listed;
}

function isMissingStitch(row: SweepRow): boolean {
  return Boolean(Number(row.is_live)) && !row.candidate_id;
}

function sweepQuery(knex: Knex, inner: Knex.QueryBuilder) {
  return knex
    .from(inner.as('b'))
    .leftJoin('refresh_state as r', 'r.entity_id', 'b.winner_id')
    .select(
      'b.entity_id',
      'b.entity_ref',
      'b.is_live',
      'r.entity_id as candidate_id',
    )
    .orderBy('b.entity_id')
    .timeout(30_000);
}

function finalRows(knex: Knex) {
  return knex<DbFinalEntitiesRow>('final_entities').select({
    entity_id: 'entity_id',
    entity_ref: 'entity_ref',
    winner_id: knex.raw('COALESCE(winner_candidate_id, entity_id)'),
    is_live: knex.raw('CASE WHEN final_entity IS NULL THEN 0 ELSE 1 END'),
  });
}

async function readBatch(
  knex: Knex,
  after: string | undefined,
  batchSize: number,
): Promise<SweepRow[]> {
  return sweepQuery(
    knex,
    finalRows(knex)
      .modify(qb => {
        if (after !== undefined) qb.where('entity_id', '>', after);
      })
      .orderBy('entity_id')
      .limit(batchSize),
  );
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
  // row or been requested since the batch was read.
  const stillMissing = new Set(
    (await sweepQuery(knex, finalRows(knex).whereIn('entity_ref', chunk)))
      .filter(isMissingStitch)
      .map(row => row.entity_ref),
  );
  if (!stillMissing.size || signal.aborted) {
    return { count: 0, refs: [] };
  }
  for (const queued of await knex<DbStitchQueueRow>('stitch_queue')
    .whereIn('entity_ref', [...stillMissing])
    .pluck('entity_ref')) {
    stillMissing.delete(queued);
  }
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
