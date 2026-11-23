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
 * anti-join. The cursor lives in memory and wraps around after a full pass;
 * a run that lands on another instance starts its own pass.
 */
export function createMissingStitchRepair(options: {
  knex: Knex;
  logger: LoggerService;
  batchSize?: number;
  maxBatchesPerRun?: number;
}): (signal: AbortSignal) => Promise<void> {
  const { knex, logger, batchSize = 1000, maxBatchesPerRun = 20 } = options;
  let cursor: string | undefined;

  return async signal => {
    for (let i = 0; i < maxBatchesPerRun && !signal.aborted; i++) {
      const after = cursor;
      const batch = knex<DbFinalEntitiesRow>('final_entities')
        .select({
          entity_id: 'entity_id',
          entity_ref: 'entity_ref',
          winner_id: knex.raw('COALESCE(winner_candidate_id, entity_id)'),
          is_live: knex.raw('CASE WHEN final_entity IS NULL THEN 0 ELSE 1 END'),
        })
        .modify(qb => {
          if (after !== undefined) qb.where('entity_id', '>', after);
        })
        .orderBy('entity_id')
        .limit(batchSize)
        .as('b');
      const rows: Array<{
        entity_id: string;
        entity_ref: string;
        is_live: number | string;
        candidate_id: string | null;
      }> = await knex
        .from(batch)
        .leftJoin('refresh_state as r', 'r.entity_id', 'b.winner_id')
        .select(
          'b.entity_id',
          'b.entity_ref',
          'b.is_live',
          'r.entity_id as candidate_id',
        )
        .orderBy('b.entity_id')
        .timeout(30_000);

      cursor = rows.length < batchSize ? undefined : rows.at(-1)!.entity_id;

      const flagged = rows
        .filter(row => Number(row.is_live) && !row.candidate_id)
        .map(row => row.entity_ref);
      if (flagged.length && !signal.aborted) {
        const enqueued = await retryOnDeadlock(
          () => enqueueMissing(knex, flagged),
          knex,
        );
        if (enqueued.length) {
          logger.warn(
            'Found published catalog entities whose candidate is gone without a pending stitch; ' +
              'enqueued them for reconciliation. Outside of a rolling upgrade this indicates ' +
              'a bug or manual database changes.',
            { count: enqueued.length, entityRefs: enqueued.join(', ') },
          );
        }
      }

      if (cursor === undefined) {
        return;
      }
    }
  };
}

/**
 * Enqueues the refs that have no pending stitch, and returns those refs.
 * Existing requests are left alone, including their leases, since they will
 * reconcile the row anyway.
 */
async function enqueueMissing(knex: Knex, refs: string[]): Promise<string[]> {
  const queued = new Set(
    await knex<DbStitchQueueRow>('stitch_queue')
      .whereIn('entity_ref', refs)
      .pluck('entity_ref'),
  );
  const missing = refs.filter(ref => !queued.has(ref)).sort();
  if (!missing.length) {
    return [];
  }
  const ticket = randomUUID();
  await knex<DbStitchQueueRow>('stitch_queue')
    .insert(
      missing.map(entity_ref => ({
        entity_ref,
        stitch_ticket: ticket,
        failure_count: 0,
        next_stitch_at: knex.fn.now(),
      })),
    )
    .onConflict('entity_ref')
    .ignore()
    .timeout(30_000);
  return missing;
}
