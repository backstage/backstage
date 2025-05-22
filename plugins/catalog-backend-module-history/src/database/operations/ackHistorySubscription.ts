/*
 * Copyright 2025 The Backstage Authors
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
import { SubscriptionsTableRow } from '../tables';

export async function ackHistorySubscription(
  knex: Knex,
  options: {
    subscriptionId: string;
    ackId: string;
  },
): Promise<boolean> {
  const count = await knex<SubscriptionsTableRow>(
    'module_history__subscriptions',
  )
    .update({
      state: 'idle',
      ack_id: null,
      ack_timeout_at: null,
      last_acknowledged_event_id: knex.ref('last_sent_event_id'),
    })
    .where('subscription_id', '=', options.subscriptionId)
    .andWhere('state', '=', 'waiting')
    .andWhere('ack_id', '=', options.ackId);

  return count === 1;
}
