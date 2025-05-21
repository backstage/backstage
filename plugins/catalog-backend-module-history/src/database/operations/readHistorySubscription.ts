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

import { NotFoundError } from '@backstage/errors';
import { Knex } from 'knex';
import { randomUUID } from 'node:crypto';
import { HistoryConfig } from '../../config';
import { CatalogEvent } from '../../service/endpoints/types';
import { SubscriptionsTableRow } from '../tables';
import { knexRawNowPlus } from '../util';
import { readHistoryEvents } from './readHistoryEvents';

export interface ReadHistorySubscriptionOptions {
  /**
   * The ID of the subscription to read from.
   */
  subscriptionId: string;
  /**
   * If 'read', the subscription will be advanced if there were events to read.
   * If 'peek', the subscription will not be advanced.
   */
  operation: 'read' | 'peek';
  /**
   * The maximum number of events to read.
   */
  limit: number;
  /**
   * The configuration for the history module.
   */
  historyConfig: HistoryConfig;
}

/**
 * Attempts to read from a subscription.
 *
 * @remarks
 *
 * The subscription's active timestamp is always touched by this.
 *
 * Returns undefined if the subscription was not in an idle state, or if there
 * were no more events to read.
 */
export async function readHistorySubscription(
  knex: Knex,
  options: ReadHistorySubscriptionOptions,
): Promise<{ events: CatalogEvent[]; ackId: string } | undefined> {
  const { subscriptionId, limit, operation, historyConfig } = options;

  // "Touch" the subscription and get its metadata
  let subscriptions: SubscriptionsTableRow[];
  const columns = [
    'state',
    'last_acknowledged_event_id',
    'filter_entity_ref',
    'filter_entity_id',
  ] as const;
  if (knex.client.config.client.includes('pg')) {
    subscriptions = await knex<SubscriptionsTableRow>(
      'module_history__subscriptions',
    )
      .update({ active_at: knex.fn.now() })
      .where('subscription_id', '=', subscriptionId)
      .returning(columns);
  } else {
    await knex<SubscriptionsTableRow>('module_history__subscriptions')
      .update({ active_at: knex.fn.now() })
      .where('subscription_id', '=', subscriptionId);
    subscriptions = await knex
      .select(...columns)
      .from<SubscriptionsTableRow>('module_history__subscriptions')
      .where('subscription_id', '=', subscriptionId);
  }

  if (subscriptions.length !== 1) {
    throw new NotFoundError(`Subscription ${subscriptionId} not found`);
  }

  const {
    state,
    last_acknowledged_event_id,
    filter_entity_ref,
    filter_entity_id,
  } = subscriptions[0];

  // We can only read idle subscriptions. If it is not idle, another operation
  // is pending for it, most likely waiting for another reader to acknowledge
  // reception of events.
  if (state !== 'idle') {
    return undefined;
  }

  const events = await readHistoryEvents(knex, {
    afterEventId: String(last_acknowledged_event_id),
    order: 'asc',
    limit,
    entityRef: filter_entity_ref ?? undefined,
    entityId: filter_entity_id ?? undefined,
  });

  if (events.length === 0) {
    return undefined;
  }

  let ackId: string = '';
  if (operation === 'read') {
    // Move the subscription forward and mark it as waiting for acknowledgement,
    // but only if it's still untouched since the operation started
    ackId = randomUUID();
    const ackDeadline = knexRawNowPlus(
      knex,
      historyConfig.subscriptionAckTimeout,
    );
    const count = await knex<SubscriptionsTableRow>(
      'module_history__subscriptions',
    )
      .update({
        state: 'waiting',
        ack_id: ackId,
        ack_timeout_at: ackDeadline,
        last_sent_event_id: events[events.length - 1].eventId,
      })
      .where('subscription_id', '=', subscriptionId)
      .andWhere('state', '=', 'idle')
      .andWhere(
        'last_acknowledged_event_id',
        '=',
        String(last_acknowledged_event_id),
      );

    // If we could not move the subscription forward, just bail out because
    // either the subscription was deleted, or someone else made an
    // overlapping read and "won". In that case we do not want to also send
    // the same events.
    if (count !== 1) {
      return undefined;
    }
  }

  return {
    events,
    ackId,
  };
}
