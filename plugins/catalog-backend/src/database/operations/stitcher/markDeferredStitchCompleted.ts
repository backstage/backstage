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
 * A changed ticket with the same lease means a new request arrived during this
 * attempt. Make it immediately eligible, whether this attempt succeeded or was
 * abandoned. A changed lease belongs to a successor and must not be disturbed.
 * Without a captured lease, only already-due entries can be rescheduled.
 */
export async function markDeferredStitchCompleted(option: {
  knex: Knex | Knex.Transaction;
  entityRef: string;
  stitchTicket: string;
  stitchLeaseExpiresAt?: DbStitchQueueRow['next_stitch_at'];
  result: 'succeeded' | 'abandoned';
}): Promise<void> {
  const { knex, entityRef, stitchTicket, stitchLeaseExpiresAt } = option;

  const deleted = await knex<DbStitchQueueRow>('stitch_queue')
    .where('entity_ref', '=', entityRef)
    .andWhere('stitch_ticket', '=', stitchTicket)
    .delete();

  if (!deleted) {
    const update = knex<DbStitchQueueRow>('stitch_queue')
      .where('entity_ref', '=', entityRef)
      .update({ next_stitch_at: knex.fn.now() });

    if (stitchLeaseExpiresAt !== undefined) {
      update.where('next_stitch_at', '=', stitchLeaseExpiresAt);
    } else {
      update.where('next_stitch_at', '<=', knex.fn.now());
    }

    await update;
  }
}
