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
import { Entity } from '@backstage/catalog-model';
import { Knex } from 'knex';
import { randomUUID } from 'node:crypto';
import { setImmediate } from 'node:timers/promises';
import {
  DbFinalEntitiesRow,
  DbRefreshStateRow,
  DbStitchQueueRow,
} from '../../tables';
import { retryOnDeadlock } from '../../util';

const repairWindowMs = 60 * 60_000;

/**
 * Temporary repair for upgrades that introduce retained final entity slots.
 * An old stitcher can acknowledge a deletion ticket without clearing the
 * published body. Restore missing tickets so the new stitcher can reconcile
 * those slots, without replacing work already queued by normal operations.
 * This is a recovery measure, not a fence against mixed-version writes.
 * The task stops after one hour or when it reaches its repair limit, whichever
 * comes first. Both limits apply per processing-engine start.
 *
 * TODO: Remove this task when upgrades from before the retained-slot migration
 * are no longer supported, or when the upgrade procedure handles this repair.
 * Retire or replace this check before allowing multiple candidates per ref.
 */
export function createMissingStitchRepair(options: {
  knex: Knex;
  logger: LoggerService;
  pageSize?: number;
  maxRepairs?: number;
}): (signal: AbortSignal) => Promise<void> {
  const { knex, logger, pageSize = 500, maxRepairs = 500 } = options;
  const deadline = Date.now() + repairWindowMs;
  let remaining = maxRepairs;

  return async signal => {
    const shouldStop = () =>
      signal.aborted || Date.now() >= deadline || remaining === 0;
    let cursor: string | undefined;
    let enqueued = 0;

    try {
      while (!shouldStop()) {
        const query = knex<DbFinalEntitiesRow>('final_entities as f')
          .select('f.entity_id', 'f.entity_ref', 'f.final_entity')
          .whereNotNull('f.final_entity')
          .whereNotExists(
            knex('refresh_state as r')
              .select(1)
              .where('r.entity_id', '=', knex.ref('f.entity_id')),
          )
          .whereNotExists(
            knex('stitch_queue as q')
              .select(1)
              .where('q.entity_ref', '=', knex.ref('f.entity_ref')),
          )
          .orderBy('f.entity_id')
          .limit(pageSize)
          .timeout(30_000);
        if (cursor !== undefined) query.where('f.entity_id', '>', cursor);
        const page = await query;
        if (shouldStop() || !page.length) return;

        // Healthy revived slots also lack their original candidate. Check the
        // published UID before deciding that a slot actually needs repair.
        const uids = new Map<string, string | undefined>();
        for (const [index, row] of page.entries()) {
          if (index % 16 === 0) {
            await setImmediate();
            if (shouldStop()) return;
          }
          const entity = JSON.parse(row.final_entity!) as Entity;
          uids.set(row.entity_ref, entity.metadata.uid);
        }

        const candidates = await knex<DbRefreshStateRow>('refresh_state')
          .select('entity_id', 'entity_ref')
          .whereIn('entity_ref', [...uids.keys()])
          .timeout(30_000);
        if (shouldStop()) return;
        for (const candidate of candidates) {
          if (uids.get(candidate.entity_ref) === candidate.entity_id) {
            uids.delete(candidate.entity_ref);
          }
        }

        const refs = [...uids.keys()].sort().slice(0, remaining);
        if (refs.length) {
          const inserted = await retryOnDeadlock(async () => {
            if (shouldStop()) return 0;
            return enqueueMissing(knex, refs);
          }, knex);
          remaining -= inserted;
          enqueued += inserted;
        }

        if (page.length < pageSize) return;
        cursor = page[page.length - 1].entity_id;
      }
    } finally {
      if (enqueued) {
        logger.warn(
          'Re-enqueued missing catalog stitches during rollout repair',
          {
            count: enqueued,
            repairLimitReached: remaining === 0,
          },
        );
      }
    }
  };
}

async function enqueueMissing(knex: Knex, refs: string[]): Promise<number> {
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
    // Knex's MySQL insert builder returns the insert ID, not the row count.
    const { sql, bindings } = insert.toSQL();
    const [result] = await knex.raw(sql, bindings).timeout(30_000);
    return result.affectedRows;
  }
  const rows = await insert.returning('entity_ref').timeout(30_000);
  return rows.length;
}
