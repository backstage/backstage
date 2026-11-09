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
import { DbStitchQueueRow } from '../../tables';
import { StitchLeaseExpiresAt } from './getDeferredStitchableEntities';

/**
 * Records a failed attempt only while its claim still owns the queued request.
 * New requests keep their fresh retry budget and become eligible after this
 * attempt settles. Reclaimed leases must never be changed by a stale failure.
 */
export async function markDeferredStitchFailed(options: {
  knex: Knex | Knex.Transaction;
  entityRef: string;
  stitchTicket: string;
  stitchLeaseExpiresAt: StitchLeaseExpiresAt;
}): Promise<void> {
  const { knex, entityRef, stitchTicket, stitchLeaseExpiresAt } = options;
  const updated = await knex<DbStitchQueueRow>('stitch_queue')
    .where('entity_ref', entityRef)
    .where('stitch_ticket', stitchTicket)
    .where('next_stitch_at', stitchLeaseExpiresAt)
    .increment('failure_count', 1);

  if (!updated) {
    await knex<DbStitchQueueRow>('stitch_queue')
      .where('entity_ref', entityRef)
      .whereNot('stitch_ticket', stitchTicket)
      .where('next_stitch_at', stitchLeaseExpiresAt)
      .update({ next_stitch_at: knex.fn.now() });
  }
}
