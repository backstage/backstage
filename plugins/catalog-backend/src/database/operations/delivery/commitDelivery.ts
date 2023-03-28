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
import { v4 as uuid } from 'uuid';

export const internals = {
  /**
   * Commits a `replace` type delivery so as to remove all entities that weren't
   * in the delivery.
   */
  async commitReplacementDelivery(
    tx: Knex.Transaction,
    providerName: string,
    deliveryId: string,
  ): Promise<{ deletedRefs: string[] }> {
    const result = await tx
      .table('provider_state')
      .update({
        deleted: true,
        deleted_by_delivery_id: deliveryId,
      })
      .where('provider_name', '=', providerName)
      .whereNotIn('entity_ref', refs =>
        refs
          .select('entity_ref')
          .from('delivery_entries')
          .where('delivery_id', '=', deliveryId)
          .where('action', '=', 'upsert'),
      );
    return { deletedRefs: [] };
  },
};

/**
 * Commits (finalizes) a single delivery.
 */
export async function commitDelivery(options: {
  tx: Knex.Transaction;
  deliveryId: string;
}): Promise<void> {
  const { tx, deliveryId } = options;

  // "acquire" the delivery for committing with a unique ticket
  const ticket = uuid();
  const count = await tx
    .table('deliveries')
    .update({
      status: 'committing',
      commit_ticket: ticket,
      commit_started_at: tx.fn.now(),
    })
    .where('id', '=', deliveryId);

  // If the delivery was removed, just complete silently.
  if (count === 0) {
    return;
  }
}
