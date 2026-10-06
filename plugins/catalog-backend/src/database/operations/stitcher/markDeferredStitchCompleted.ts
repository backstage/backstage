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
import { StitchLeaseExpiresAt } from './getDeferredStitchableEntities';

/**
 * Marks a single entity as having been stitched.
 *
 * @remarks
 *
 * If the ticket and captured lease still match, the stitch_queue entry is
 * deleted — no further stitching is needed. Both guards are needed during
 * mixed-version rollouts: old workers reclaim without replacing the ticket.
 *
 * A changed ticket with the same lease means a new request arrived during this
 * attempt. Make it immediately eligible, whether this attempt succeeded or was
 * abandoned. A changed lease belongs to a successor and must not be disturbed.
 * The captured lease is opaque and must be passed through unchanged from
 * getDeferredStitchableEntities, not reconstructed from a Date or ISO string.
 */
export async function markDeferredStitchCompleted(option: {
  knex: Knex | Knex.Transaction;
  entityRef: string;
  stitchTicket: string;
  stitchLeaseExpiresAt: StitchLeaseExpiresAt;
}): Promise<void> {
  const { knex, entityRef, stitchTicket, stitchLeaseExpiresAt } = option;

  const deleted = await knex<DbStitchQueueRow>('stitch_queue')
    .where('entity_ref', '=', entityRef)
    .andWhere('stitch_ticket', '=', stitchTicket)
    .andWhere('next_stitch_at', '=', stitchLeaseExpiresAt)
    .delete();

  if (!deleted) {
    const update = knex<DbStitchQueueRow>('stitch_queue')
      .where('entity_ref', '=', entityRef)
      .update({ next_stitch_at: knex.fn.now() });

    update.where('next_stitch_at', '=', stitchLeaseExpiresAt);

    await update;
  }
}
