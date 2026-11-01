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

import { TestDatabases } from '@backstage/backend-test-utils';
import { ConflictError, NotFoundError } from '@backstage/errors';
import { applyDatabaseMigrations } from '../../migrations';
import { parseEntityChangeScope } from './scope';
import {
  ackEntityChangeSubscription,
  cleanUpEntityChangeSubscriptions,
  nackEntityChangeSubscription,
  sendEntityChangeSubscription,
  skipEntityChangeSubscription,
  touchEntityChangeSubscription,
  upsertEntityChangeSubscription,
} from './subscriptions';

jest.setTimeout(60_000);
const databases = TestDatabases.create();
const owner = 'service:plugin:test';

describe.each(databases.eachSupportedId())('subscriptions, %p', id => {
  it('creates subscriptions once, with a fixed position and scope', async () => {
    const knex = await databases.init(id);
    await applyDatabaseMigrations(knex);
    await knex('final_entities').insert({
      entity_id: 'a',
      entity_ref: 'component:default/a',
      hash: 'h',
      final_entity: '{}',
      generation: 7,
    });

    const random = await upsertEntityChangeSubscription(knex, { owner });
    expect(random.subscriptionId).toMatch(/^[0-9a-f-]{36}$/);
    expect(random.lastAcknowledgedGeneration).toBe('7');
    expect(random.scope).toBeUndefined();

    const scope = parseEntityChangeScope(['group', 'user']);
    const created = await upsertEntityChangeSubscription(knex, {
      owner,
      subscriptionId: 'mirror',
      afterGeneration: '3',
      scope,
    });
    expect(created).toEqual(
      expect.objectContaining({
        subscriptionId: 'mirror',
        state: 'idle',
        lastAcknowledgedGeneration: '3',
        scope,
      }),
    );

    // The position is only used on creation, and the scope can't change
    await expect(
      upsertEntityChangeSubscription(knex, {
        owner,
        subscriptionId: 'mirror',
        afterGeneration: 'last',
        scope: parseEntityChangeScope(['user', 'group', 'user']),
      }),
    ).resolves.toEqual(
      expect.objectContaining({ lastAcknowledgedGeneration: '3' }),
    );
    await expect(
      upsertEntityChangeSubscription(knex, {
        owner,
        subscriptionId: 'mirror',
        scope: parseEntityChangeScope(['user']),
      }),
    ).rejects.toThrow(ConflictError);
    await expect(
      upsertEntityChangeSubscription(knex, { owner, subscriptionId: 'mirror' }),
    ).rejects.toThrow(ConflictError);

    await expect(
      touchEntityChangeSubscription(knex, 'missing', owner),
    ).rejects.toThrow(NotFoundError);

    // Only the owner can use a subscription
    await expect(
      upsertEntityChangeSubscription(knex, {
        owner: 'user:default/other',
        subscriptionId: 'mirror',
        scope,
      }),
    ).rejects.toThrow(ConflictError);
    await expect(
      touchEntityChangeSubscription(knex, 'mirror', 'user:default/other'),
    ).rejects.toThrow(NotFoundError);
  });

  it('hands each batch to one reader and moves on only when acknowledged', async () => {
    const knex = await databases.init(id);
    await applyDatabaseMigrations(knex);
    await upsertEntityChangeSubscription(knex, {
      owner,
      subscriptionId: 's',
      afterGeneration: '0',
    });

    const send = (fromGeneration: string, toGeneration: string) =>
      sendEntityChangeSubscription(knex, {
        subscriptionId: 's',
        fromGeneration,
        toGeneration,
        ackTimeout: { minutes: 1 },
      });

    // Two readers that both saw position 0: only one gets the batch
    const [first, second] = await Promise.all([send('0', '5'), send('0', '5')]);
    const ackId = first ?? second;
    expect(ackId).toBeDefined();
    expect([first, second].filter(Boolean)).toHaveLength(1);

    let subscription = await touchEntityChangeSubscription(knex, 's', owner);
    expect(subscription).toEqual(
      expect.objectContaining({
        state: 'waiting',
        ackId,
        lastAcknowledgedGeneration: '0',
      }),
    );
    expect(await send('0', '5')).toBeUndefined();
    expect(
      await ackEntityChangeSubscription(knex, {
        subscriptionId: 's',
        owner: 'user:default/other',
        ackId: ackId!,
      }),
    ).toBe(false);

    // A nack releases the batch without moving the position
    expect(
      await nackEntityChangeSubscription(knex, {
        subscriptionId: 's',
        owner,
        ackId: ackId!,
      }),
    ).toBe(true);
    expect(
      await ackEntityChangeSubscription(knex, {
        subscriptionId: 's',
        owner,
        ackId: ackId!,
      }),
    ).toBe(false);
    subscription = await touchEntityChangeSubscription(knex, 's', owner);
    expect(subscription.state).toBe('idle');
    expect(subscription.lastAcknowledgedGeneration).toBe('0');

    const again = await send('0', '5');
    expect(
      await ackEntityChangeSubscription(knex, {
        subscriptionId: 's',
        owner,
        ackId: again!,
      }),
    ).toBe(true);
    subscription = await touchEntityChangeSubscription(knex, 's', owner);
    expect(subscription.state).toBe('idle');
    expect(subscription.lastAcknowledgedGeneration).toBe('5');

    // Skipping needs the same position as was read
    expect(
      await skipEntityChangeSubscription(knex, {
        subscriptionId: 's',
        fromGeneration: '0',
        toGeneration: '9',
      }),
    ).toBe(false);
    expect(
      await skipEntityChangeSubscription(knex, {
        subscriptionId: 's',
        fromGeneration: '5',
        toGeneration: '9',
      }),
    ).toBe(true);
    expect(
      (await touchEntityChangeSubscription(knex, 's', owner))
        .lastAcknowledgedGeneration,
    ).toBe('9');
  });

  it('releases timed out batches and deletes unused subscriptions', async () => {
    const knex = await databases.init(id);
    await applyDatabaseMigrations(knex);
    for (const subscriptionId of ['timed-out', 'unused', 'kept']) {
      await upsertEntityChangeSubscription(knex, {
        owner,
        subscriptionId,
        afterGeneration: '0',
      });
    }
    const timedOut = await sendEntityChangeSubscription(knex, {
      subscriptionId: 'timed-out',
      fromGeneration: '0',
      toGeneration: '2',
      ackTimeout: { seconds: 0 },
    });
    expect(timedOut).toBeDefined();
    await knex('entity_change_subscriptions')
      .where('subscription_id', 'unused')
      .update({ active_at: new Date(Date.now() - 31 * 24 * 3600 * 1000) });

    // MySQL stores whole seconds, so move the deadlines into the past
    const expire = () =>
      knex('entity_change_subscriptions')
        .where('state', 'waiting')
        .update({ ack_timeout_at: new Date(Date.now() - 60_000) });

    // Reading a subscription releases its own timed out batch right away
    await expire();
    expect(
      (await touchEntityChangeSubscription(knex, 'timed-out', owner)).state,
    ).toBe('idle');
    expect(
      await ackEntityChangeSubscription(knex, {
        subscriptionId: 'timed-out',
        owner,
        ackId: timedOut!,
      }),
    ).toBe(false);

    await sendEntityChangeSubscription(knex, {
      subscriptionId: 'kept',
      fromGeneration: '0',
      toGeneration: '2',
      ackTimeout: { seconds: 0 },
    });
    await expire();
    await cleanUpEntityChangeSubscriptions(knex, {
      retentionAfterInactive: { days: 30 },
    });

    const rows = await knex('entity_change_subscriptions')
      .select('subscription_id', 'state')
      .orderBy('subscription_id');
    expect(rows).toEqual([
      { subscription_id: 'kept', state: 'idle' },
      { subscription_id: 'timed-out', state: 'idle' },
    ]);
  });
});
