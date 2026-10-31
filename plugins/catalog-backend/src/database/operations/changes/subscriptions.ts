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

import { ConflictError, NotFoundError } from '@backstage/errors';
import { durationToMilliseconds, HumanDuration } from '@backstage/types';
import { Knex } from 'knex';
import { randomUUID } from 'node:crypto';
import { DbEntityChangeSubscriptionsRow } from '../../tables';
import { generationAsText, getMaxGeneration } from './readEntityChanges';
import { EntityChangeScopeEntry } from './scope';

const TABLE = 'entity_change_subscriptions';

type SubscriptionRow = Omit<
  DbEntityChangeSubscriptionsRow,
  'last_sent_generation'
>;

export type EntityChangeSubscription = {
  subscriptionId: string;
  createdAt: Date;
  activeAt: Date;
  state: 'idle' | 'waiting';
  ackId?: string;
  /** The acknowledged position, which reads continue from. */
  lastAcknowledgedGeneration: string;
  scope?: EntityChangeScopeEntry[];
};

/**
 * Creates a subscription, or marks an existing one as active.
 *
 * @remarks
 *
 * The position and scope are set when the subscription is created and can't
 * be changed later. Asking for a different scope is a conflict, so that a
 * consumer whose configuration changed doesn't silently follow the old scope.
 */
export async function upsertEntityChangeSubscription(
  knex: Knex,
  options: {
    subscriptionId?: string;
    afterGeneration?: string;
    scope?: EntityChangeScopeEntry[];
  },
): Promise<EntityChangeSubscription> {
  const subscriptionId = options.subscriptionId ?? randomUUID();
  const scope = options.scope?.length ? JSON.stringify(options.scope) : null;

  // Touching an existing row first avoids reading the maximum generation,
  // which only matters on creation
  let existing = await touch(knex, subscriptionId);
  if (!existing) {
    const position =
      !options.afterGeneration || options.afterGeneration === 'last'
        ? await getMaxGeneration(knex)
        : options.afterGeneration;
    await knex<DbEntityChangeSubscriptionsRow>(TABLE)
      .insert({
        subscription_id: subscriptionId,
        created_at: new Date(),
        active_at: new Date(),
        state: 'idle',
        last_sent_generation: position,
        last_acknowledged_generation: position,
        scope,
      })
      .onConflict('subscription_id')
      .ignore();
    existing = await get(knex, subscriptionId);
    if (!existing) {
      throw new NotFoundError(`Subscription ${subscriptionId} not found`);
    }
  }

  if (existing.scope !== scope) {
    throw new ConflictError(
      `Subscription ${subscriptionId} already exists with a different scope`,
    );
  }

  return toSubscription(existing);
}

/**
 * Reads a subscription without marking it as active.
 */
export async function getEntityChangeSubscription(
  knex: Knex,
  subscriptionId: string,
): Promise<EntityChangeSubscription | undefined> {
  const row = await get(knex, subscriptionId);
  return row ? toSubscription(row) : undefined;
}

/**
 * Reads a subscription and marks it as active. Throws if it doesn't exist.
 *
 * @remarks
 *
 * A batch whose acknowledgement deadline has passed is released first, so
 * that redelivery doesn't depend on when the janitor last ran.
 */
export async function touchEntityChangeSubscription(
  knex: Knex,
  subscriptionId: string,
): Promise<EntityChangeSubscription> {
  await knex<DbEntityChangeSubscriptionsRow>(TABLE)
    .where('subscription_id', subscriptionId)
    .where('state', 'waiting')
    .where('ack_timeout_at', '<', new Date())
    .update({ state: 'idle', ack_id: null, ack_timeout_at: null });

  const row = await touch(knex, subscriptionId);
  if (!row) {
    throw new NotFoundError(`Subscription ${subscriptionId} not found`);
  }
  return toSubscription(row);
}

/**
 * Moves an idle subscription forward without sending anything, because every
 * row in the scanned window was filtered out. Returns false if another reader
 * got there first.
 */
export async function skipEntityChangeSubscription(
  knex: Knex,
  options: {
    subscriptionId: string;
    fromGeneration: string;
    toGeneration: string;
  },
): Promise<boolean> {
  const count = await knex<DbEntityChangeSubscriptionsRow>(TABLE)
    .where('subscription_id', options.subscriptionId)
    .where('state', 'idle')
    .where('last_acknowledged_generation', options.fromGeneration)
    .update({
      last_sent_generation: options.toGeneration,
      last_acknowledged_generation: options.toGeneration,
    });
  return count === 1;
}

/**
 * Hands out a batch: marks an idle subscription as waiting for an
 * acknowledgement. The compare-and-set on the position ensures that two
 * concurrent readers never get the same batch. Returns the ack ID, or
 * undefined if another reader got there first.
 */
export async function sendEntityChangeSubscription(
  knex: Knex,
  options: {
    subscriptionId: string;
    fromGeneration: string;
    toGeneration: string;
    ackTimeout: HumanDuration;
  },
): Promise<string | undefined> {
  const ackId = randomUUID();
  const count = await knex<DbEntityChangeSubscriptionsRow>(TABLE)
    .where('subscription_id', options.subscriptionId)
    .where('state', 'idle')
    .where('last_acknowledged_generation', options.fromGeneration)
    .update({
      state: 'waiting',
      ack_id: ackId,
      ack_timeout_at: new Date(
        Date.now() + durationToMilliseconds(options.ackTimeout),
      ),
      last_sent_generation: options.toGeneration,
    });
  return count === 1 ? ackId : undefined;
}

/**
 * Acknowledges the batch that was last sent, moving the position past it.
 * Returns false if the ack ID doesn't match, for example because the batch
 * timed out and was released.
 */
export async function ackEntityChangeSubscription(
  knex: Knex,
  options: { subscriptionId: string; ackId: string },
): Promise<boolean> {
  const count = await knex<DbEntityChangeSubscriptionsRow>(TABLE)
    .where('subscription_id', options.subscriptionId)
    .where('state', 'waiting')
    .where('ack_id', options.ackId)
    .update({
      state: 'idle',
      ack_id: null,
      ack_timeout_at: null,
      last_acknowledged_generation: knex.ref('last_sent_generation'),
    });
  return count === 1;
}

/**
 * Releases the batch that was last sent without moving the position, so that
 * it can be read again right away.
 */
export async function nackEntityChangeSubscription(
  knex: Knex,
  options: { subscriptionId: string; ackId: string },
): Promise<boolean> {
  const count = await knex<DbEntityChangeSubscriptionsRow>(TABLE)
    .where('subscription_id', options.subscriptionId)
    .where('state', 'waiting')
    .where('ack_id', options.ackId)
    .update({ state: 'idle', ack_id: null, ack_timeout_at: null });
  return count === 1;
}

/**
 * Releases batches whose acknowledgement deadline has passed, and deletes
 * subscriptions that haven't been used for a while.
 */
export async function cleanUpEntityChangeSubscriptions(
  knex: Knex,
  options: { retentionAfterInactive: HumanDuration },
): Promise<void> {
  await knex<DbEntityChangeSubscriptionsRow>(TABLE)
    .where('state', 'waiting')
    .where('ack_timeout_at', '<', new Date())
    .update({ state: 'idle', ack_id: null, ack_timeout_at: null });

  await knex<DbEntityChangeSubscriptionsRow>(TABLE)
    .where('state', 'idle')
    .where(
      'active_at',
      '<',
      new Date(
        Date.now() - durationToMilliseconds(options.retentionAfterInactive),
      ),
    )
    .delete();
}

// Timestamps are written and compared as application time throughout, since
// SQLite stores bound dates differently from its own CURRENT_TIMESTAMP.
async function touch(
  knex: Knex,
  subscriptionId: string,
): Promise<SubscriptionRow | undefined> {
  // MySQL reports unchanged rows as unaffected, so the count can't be used
  // to tell whether the subscription exists.
  await knex<DbEntityChangeSubscriptionsRow>(TABLE)
    .where('subscription_id', subscriptionId)
    .update({ active_at: new Date() });
  return get(knex, subscriptionId);
}

async function get(
  knex: Knex,
  subscriptionId: string,
): Promise<SubscriptionRow | undefined> {
  return knex<DbEntityChangeSubscriptionsRow>(TABLE)
    .where('subscription_id', subscriptionId)
    .select(
      'subscription_id',
      'created_at',
      'active_at',
      'state',
      'ack_id',
      'ack_timeout_at',
      'scope',
      generationAsText(
        knex,
        'last_acknowledged_generation',
        'last_acknowledged_generation',
      ),
    )
    .first() as Promise<SubscriptionRow | undefined>;
}

function toSubscription(row: SubscriptionRow): EntityChangeSubscription {
  return {
    subscriptionId: row.subscription_id,
    createdAt: toDate(row.created_at),
    activeAt: toDate(row.active_at),
    state: row.state,
    ...(row.ack_id && { ackId: row.ack_id }),
    lastAcknowledgedGeneration: String(row.last_acknowledged_generation),
    ...(row.scope && { scope: JSON.parse(row.scope) }),
  };
}

// SQLite returns the stored dates as milliseconds
function toDate(value: string | number | Date): Date {
  return value instanceof Date ? value : new Date(value);
}
