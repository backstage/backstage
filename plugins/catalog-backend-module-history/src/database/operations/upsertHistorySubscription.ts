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

import { randomUUID } from 'crypto';
import { Knex } from 'knex';
import {
  Subscription,
  SubscriptionSpec,
} from '../../schema/openapi/generated/models';
import { getMaxEventId } from './getMaxEventId';
import { SubscriptionsTableRow } from '../tables';

export async function upsertHistorySubscription(
  knex: Knex,
  subscription: SubscriptionSpec,
): Promise<Subscription> {
  if (!subscription.subscriptionId) {
    return await createSubscription(knex, {
      ...subscription,
      subscriptionId: randomUUID(),
    });
  }

  // We go through the trouble of checking if the subscription exists, because
  // computing the max event id is much more expensive than the indexed
  // subscription lookup, so we try to avoid doing that unless necessary
  const exists = await knex('history_subscriptions')
    .where('subscription_id', '=', subscription.subscriptionId)
    .first()
    .then(Boolean);

  if (!exists) {
    return await createSubscription(knex, subscription);
  }

  const query = knex<SubscriptionsTableRow>('history_subscriptions')
    .where('subscription_id', '=', subscription.subscriptionId)
    .update({
      active_at: knex.fn.now(),
      filter_entity_ref: subscription.entityRef,
      filter_entity_id: subscription.entityId,
    });

  // Use the database as the source for these
  let createdAt: string;
  let lastActiveAt: string;
  if (knex.client.config.client === 'pg') {
    const result = await query.returning(['created_at', 'active_at']);
    createdAt = new Date(result[0].created_at).toISOString();
    lastActiveAt = new Date(result[0].active_at).toISOString();
  } else {
    await query;
    const result = await knex<SubscriptionsTableRow>('history_subscriptions')
      .where('subscription_id', '=', subscription.subscriptionId)
      .first();
    createdAt = new Date(result?.created_at ?? Date.now()).toISOString();
    lastActiveAt = new Date(result?.active_at ?? Date.now()).toISOString();
  }

  return {
    subscriptionId: subscription.subscriptionId,
    createdAt,
    lastActiveAt,
    entityRef: subscription.entityRef,
    entityId: subscription.entityId,
  };
}

async function createSubscription(
  knex: Knex,
  subscription: SubscriptionSpec,
): Promise<Subscription> {
  const subscriptionId = subscription.subscriptionId!;
  const eventId = await getStartingEventId(knex, subscription);

  const query = knex<SubscriptionsTableRow>('history_subscriptions').insert({
    subscription_id: subscriptionId,
    state: 'idle',
    last_sent_event_id: eventId,
    last_acknowledged_event_id: eventId,
    filter_entity_ref: subscription.entityRef,
    filter_entity_id: subscription.entityId,
  });

  // Use the database as the source for these
  let createdAt: string;
  let lastActiveAt: string;
  if (knex.client.config.client === 'pg') {
    const result = await query.returning(['created_at', 'active_at']);
    createdAt = new Date(result[0].created_at).toISOString();
    lastActiveAt = new Date(result[0].active_at).toISOString();
  } else {
    await query;
    const result = await knex<SubscriptionsTableRow>('history_subscriptions')
      .where('subscription_id', '=', subscriptionId)
      .first();
    createdAt = new Date(result?.created_at ?? Date.now()).toISOString();
    lastActiveAt = new Date(result?.active_at ?? Date.now()).toISOString();
  }

  return {
    subscriptionId,
    createdAt,
    lastActiveAt,
    entityRef: subscription.entityRef,
    entityId: subscription.entityId,
  };
}

async function getStartingEventId(
  knex: Knex,
  subscription: SubscriptionSpec,
): Promise<string> {
  const afterEventId = subscription.afterEventId ?? 'last';

  if (afterEventId === 'last') {
    return await getMaxEventId(knex);
  }

  if (!afterEventId.match(/^\d+$/)) {
    throw new Error(
      `Invalid afterEventId value, expected a string of digits or "last", got "${afterEventId}"`,
    );
  }

  return afterEventId;
}
