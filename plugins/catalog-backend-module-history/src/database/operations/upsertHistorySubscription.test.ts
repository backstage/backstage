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

import {
  mockServices,
  startTestBackend,
  TestBackend,
  TestDatabaseId,
  TestDatabases,
} from '@backstage/backend-test-utils';
import { NotFoundError } from '@backstage/errors';
import catalogBackend from '@backstage/plugin-catalog-backend';
import { Knex } from 'knex';
import { createMockEntityProvider } from '../../__fixtures__/createMockEntityProvider';
import { applyDatabaseMigrations } from '../migrations';
import { upsertHistorySubscription } from './upsertHistorySubscription';

jest.setTimeout(60_000);

describe('upsertHistorySubscription', () => {
  const databases = TestDatabases.create();

  // Helper to ensure the catalog is started and our migrations are applied
  async function init(databaseId: TestDatabaseId): Promise<{
    knex: Knex;
    backend: TestBackend;
  }> {
    const knex = await databases.init(databaseId);
    const provider = createMockEntityProvider();
    const backend = await startTestBackend({
      features: [
        mockServices.database.factory({ knex }),
        catalogBackend,
        provider,
      ],
    });
    await provider.ready;
    await applyDatabaseMigrations(knex);
    return { knex, backend };
  }

  async function getSubscription(knex: Knex, subscriptionId: string) {
    const [subscription] = await knex('module_history__subscriptions').where(
      'subscription_id',
      '=',
      subscriptionId,
    );
    if (!subscription) {
      throw new NotFoundError(`Subscription ${subscriptionId} not found`);
    }
    if (typeof subscription.last_sent_event_id === 'number') {
      subscription.last_sent_event_id = String(subscription.last_sent_event_id);
    }
    if (typeof subscription.last_acknowledged_event_id === 'number') {
      subscription.last_acknowledged_event_id = String(
        subscription.last_acknowledged_event_id,
      );
    }
    return subscription;
  }

  it.each(databases.eachSupportedId())(
    'can create a new subscription both with a given and a generated id, %p',
    async databaseId => {
      const { knex, backend } = await init(databaseId);

      let subscription = await upsertHistorySubscription(knex, {});
      expect(subscription).toEqual({
        subscriptionId: expect.any(String),
        createdAt: expect.any(String),
        lastActiveAt: expect.any(String),
      });

      await expect(
        getSubscription(knex, subscription.subscriptionId),
      ).resolves.toEqual({
        subscription_id: expect.stringMatching(
          /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/,
        ),
        active_at: expect.anything(),
        created_at: expect.anything(),
        state: 'idle',
        ack_id: null,
        ack_timeout_at: null,
        last_sent_event_id: '0',
        last_acknowledged_event_id: '0',
        filter_entity_ref: null,
        filter_entity_id: null,
      });

      subscription = await upsertHistorySubscription(knex, {
        subscriptionId: 'test',
        entityRef: 'r',
        entityId: 'i',
      });
      expect(subscription).toEqual({
        subscriptionId: 'test',
        createdAt: expect.any(String),
        lastActiveAt: expect.any(String),
        entityRef: 'r',
        entityId: 'i',
      });

      await expect(
        getSubscription(knex, subscription.subscriptionId),
      ).resolves.toEqual({
        subscription_id: 'test',
        active_at: expect.anything(),
        created_at: expect.anything(),
        state: 'idle',
        ack_id: null,
        ack_timeout_at: null,
        last_sent_event_id: '0',
        last_acknowledged_event_id: '0',
        filter_entity_ref: 'r',
        filter_entity_id: 'i',
      });

      await backend.stop();
    },
  );

  it.each(databases.eachSupportedId())(
    'can insert and then update a subscription, %p',
    async databaseId => {
      const { knex, backend } = await init(databaseId);

      let subscription = await upsertHistorySubscription(knex, {
        subscriptionId: 'test',
      });
      expect(subscription).toEqual({
        subscriptionId: 'test',
        createdAt: expect.any(String),
        lastActiveAt: expect.any(String),
      });

      await expect(
        getSubscription(knex, subscription.subscriptionId),
      ).resolves.toEqual({
        subscription_id: 'test',
        active_at: expect.anything(),
        created_at: expect.anything(),
        state: 'idle',
        ack_id: null,
        ack_timeout_at: null,
        last_sent_event_id: '0',
        last_acknowledged_event_id: '0',
        filter_entity_ref: null,
        filter_entity_id: null,
      });

      subscription = await upsertHistorySubscription(knex, {
        subscriptionId: 'test',
        entityRef: 'r',
        entityId: 'i',
      });
      expect(subscription).toEqual({
        subscriptionId: 'test',
        createdAt: expect.any(String),
        lastActiveAt: expect.any(String),
        entityRef: 'r',
        entityId: 'i',
      });

      await expect(
        getSubscription(knex, subscription.subscriptionId),
      ).resolves.toEqual({
        subscription_id: 'test',
        active_at: expect.anything(),
        created_at: expect.anything(),
        state: 'idle',
        ack_id: null,
        ack_timeout_at: null,
        last_sent_event_id: '0',
        last_acknowledged_event_id: '0',
        filter_entity_ref: 'r',
        filter_entity_id: 'i',
      });

      await backend.stop();
    },
  );

  it.each(databases.eachSupportedId())(
    'supports all valid forms of "afterEventId" values and rejects invalid ones, %p',
    async databaseId => {
      const { knex, backend } = await init(databaseId);

      await knex('module_history__events').insert([
        { event_type: 'type1' },
        { event_type: 'type2' },
        { event_type: 'type3' },
      ]);

      let subscription = await upsertHistorySubscription(knex, {
        subscriptionId: 'beginning',
        afterEventId: '0',
      });
      expect(subscription).toEqual({
        subscriptionId: 'beginning',
        createdAt: expect.any(String),
        lastActiveAt: expect.any(String),
      });

      await expect(
        getSubscription(knex, subscription.subscriptionId),
      ).resolves.toEqual({
        subscription_id: 'beginning',
        active_at: expect.anything(),
        created_at: expect.anything(),
        state: 'idle',
        ack_id: null,
        ack_timeout_at: null,
        last_sent_event_id: '0',
        last_acknowledged_event_id: '0',
        filter_entity_ref: null,
        filter_entity_id: null,
      });

      subscription = await upsertHistorySubscription(knex, {
        subscriptionId: 'now',
        afterEventId: 'last',
      });
      expect(subscription).toEqual({
        subscriptionId: 'now',
        createdAt: expect.any(String),
        lastActiveAt: expect.any(String),
      });

      await expect(
        getSubscription(knex, subscription.subscriptionId),
      ).resolves.toEqual({
        subscription_id: 'now',
        active_at: expect.anything(),
        created_at: expect.anything(),
        state: 'idle',
        ack_id: null,
        ack_timeout_at: null,
        last_sent_event_id: '3',
        last_acknowledged_event_id: '3',
        filter_entity_ref: null,
        filter_entity_id: null,
      });

      subscription = await upsertHistorySubscription(knex, {
        subscriptionId: 'number',
        afterEventId: '2',
      });
      expect(subscription).toEqual({
        subscriptionId: 'number',
        createdAt: expect.any(String),
        lastActiveAt: expect.any(String),
      });

      await expect(
        getSubscription(knex, subscription.subscriptionId),
      ).resolves.toEqual({
        subscription_id: 'number',
        active_at: expect.anything(),
        created_at: expect.anything(),
        state: 'idle',
        ack_id: null,
        ack_timeout_at: null,
        last_sent_event_id: '2',
        last_acknowledged_event_id: '2',
        filter_entity_ref: null,
        filter_entity_id: null,
      });

      await expect(
        upsertHistorySubscription(knex, {
          subscriptionId: 'wrong',
          afterEventId: 'blah',
        }),
      ).rejects.toThrowErrorMatchingInlineSnapshot(
        `"Invalid afterEventId value, expected a string of digits or "last", got "blah""`,
      );

      await backend.stop();
    },
  );
});
