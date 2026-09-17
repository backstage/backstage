/*
 * Copyright 2023 The Backstage Authors
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
import splitToChunks from 'lodash/chunk';
import { randomUUID as uuid } from 'node:crypto';
import { DbRefreshStateRow, DbStitchQueueRow } from '../../tables';
import { retryOnDeadlock } from '../../util';

const UPDATE_CHUNK_SIZE = 100; // Smaller chunks reduce contention

/**
 * Marks a number of entities for stitching some time in the near
 * future.
 *
 * @remarks
 *
 * If there is no existing stitch_queue entry, a new row is created with
 * next_stitch_at set to now() (immediately eligible). If an entry already
 * exists, only the stitch_ticket is updated — the timestamp is left
 * unchanged. This prevents interrupting an in-progress stitch: the worker
 * that claimed the entry pushed next_stitch_at forward by the timeout
 * duration, and we don't want to yank it back to now() which would allow
 * another worker to claim the same entity and cause overlapping stitches.
 *
 * When the in-progress stitch completes, markDeferredStitchCompleted
 * detects the ticket change and makes the entry immediately eligible for
 * the follow-up stitch.
 */
export async function markForStitching(options: {
  knex: Knex | Knex.Transaction;
  entityRefs?: Iterable<string>;
  entityIds?: Iterable<string>;
}): Promise<void> {
  const entityRefs = sortSplit(options.entityRefs);
  const entityIds = sortSplit(options.entityIds);
  const knex = options.knex;

  // It's OK that this is shared across stitch_queue rows; it just needs to
  // be uniquely generated for every new stitch request.
  const ticket = uuid();

  for (const chunk of entityRefs) {
    await retryOnDeadlock(async () => {
      if (chunk.length > 0) {
        await knex<DbStitchQueueRow>('stitch_queue')
          .insert(
            chunk.map(ref => ({
              entity_ref: ref,
              stitch_ticket: ticket,
              next_stitch_at: knex.fn.now(),
            })),
          )
          .onConflict('entity_ref')
          .merge(['stitch_ticket']);
      }
    }, knex);
  }

  for (const chunk of entityIds) {
    await retryOnDeadlock(async () => {
      // Look up entity_refs from refresh_state by entity_id
      const refreshStateRows = await knex<DbRefreshStateRow>('refresh_state')
        .select('entity_ref')
        .whereIn('entity_id', chunk);

      if (refreshStateRows.length > 0) {
        await knex<DbStitchQueueRow>('stitch_queue')
          .insert(
            refreshStateRows.map(row => ({
              entity_ref: row.entity_ref,
              stitch_ticket: ticket,
              next_stitch_at: knex.fn.now(),
            })),
          )
          .onConflict('entity_ref')
          .merge(['stitch_ticket']);
      }
    }, knex);
  }
}

function sortSplit(input: Iterable<string> | undefined): string[][] {
  if (!input) {
    return [];
  }
  const array = Array.isArray(input) ? input.slice() : [...input];
  array.sort();
  return splitToChunks(array, UPDATE_CHUNK_SIZE);
}
