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
import { DbRefreshStateRow } from '../../tables';

/**
 * Marks a single entity as having been stitched.
 *
 * @remarks
 *
 * This assumes that the stitching strategy is set to deferred.
 *
 * The timestamp and ticket are only reset if the ticket hasn't changed. If it
 * has, it means that a new stitch request has been made, and the entity should
 * be stitched once more some time in the future - or is indeed already being
 * stitched concurrently with ourselves.
 */
export async function markDeferredStitchCompleted(option: {
  knex: Knex | Knex.Transaction;
  entityRef: string;
  stitchTicket: string;
}): Promise<void> {
  const { knex, entityRef, stitchTicket } = option;

  await knex<DbRefreshStateRow>('refresh_state')
    .update({
      next_stitch_at: null,
      next_stitch_ticket: null,
    })
    .where('entity_ref', '=', entityRef)
    .andWhere('next_stitch_ticket', '=', stitchTicket);
}
