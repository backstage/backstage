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
import { DbStitchQueueRow } from '../../tables';

/**
 * Marks a single entity as having been stitched.
 *
 * @remarks
 *
 * If the ticket still matches, the stitch_queue entry is deleted — no
 * further stitching is needed.
 *
 * If the ticket changed (a new stitch was requested while this one was
 * in progress), the entry is kept and its next_stitch_at is bumped to
 * now() so the re-stitch becomes immediately eligible for pickup.
 *
 * The `result` parameter controls how the bump behaves when the ticket
 * doesn't match:
 *
 * - `'succeeded'`: The worker wrote its result successfully. A ticket
 *   mismatch means a re-stitch was requested. Bump to now()
 *   unconditionally — we're done, the next worker should start ASAP.
 *
 * - `'abandoned'`: The worker's write was blocked by a stale ticket.
 *   We can't tell whether the ticket changed because of a re-stitch
 *   request (nobody else is active) or because we timed out and
 *   another worker claimed the entry. Bump to now() only if the
 *   timestamp hasn't moved past what we'd have set — i.e. only move
 *   it earlier, never later. This prevents extending the timeout
 *   window of an active worker, while still making overdue entries
 *   eligible immediately.
 */
export async function markDeferredStitchCompleted(option: {
  knex: Knex | Knex.Transaction;
  entityRef: string;
  stitchTicket: string;
  result: 'succeeded' | 'abandoned';
}): Promise<void> {
  const { knex, entityRef, stitchTicket, result } = option;

  const deleted = await knex<DbStitchQueueRow>('stitch_queue')
    .where('entity_ref', '=', entityRef)
    .andWhere('stitch_ticket', '=', stitchTicket)
    .delete();

  if (!deleted) {
    const update = knex<DbStitchQueueRow>('stitch_queue')
      .where('entity_ref', '=', entityRef)
      .update({ next_stitch_at: knex.fn.now() });

    if (result === 'abandoned') {
      // Only move the timestamp earlier, never later — if another
      // worker pushed it forward, we don't want to undercut their
      // timeout window.
      update.where('next_stitch_at', '>', knex.fn.now());
    }

    await update;
  }
}
