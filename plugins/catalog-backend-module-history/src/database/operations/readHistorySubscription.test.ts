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
import { getHistoryConfig } from '../../config';
import { applyDatabaseMigrations } from '../migrations';
import { readHistorySubscription } from './readHistorySubscription';

jest.setTimeout(60_000);

describe('readHistorySubscription', () => {
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
    'throws NotFound when there is no such subscription, %p',
    async databaseId => {
      const { knex, backend } = await init(databaseId);

      await expect(
        readHistorySubscription(knex, {
          subscriptionId: 'test',
          operation: 'read',
          limit: 10,
          historyConfig: getHistoryConfig(),
        }),
      ).rejects.toThrow(NotFoundError);

      await backend.stop();
    },
  );

  it.each(databases.eachSupportedId())(
    'reads events as expected, %p',
    async databaseId => {
      const { knex, backend } = await init(databaseId);

      await knex('module_history__subscriptions').insert({
        subscription_id: 'test',
        state: 'idle',
        last_sent_event_id: 0,
        last_acknowledged_event_id: 0,
      });

      await knex('module_history__events').insert([
        { event_type: 'type1' },
        { event_type: 'type2' },
        { event_type: 'type3' },
      ]);

      // First peek succeeds
      await expect(
        readHistorySubscription(knex, {
          subscriptionId: 'test',
          operation: 'peek',
          limit: 1,
          historyConfig: getHistoryConfig(),
        }),
      ).resolves.toEqual({
        events: [
          {
            eventId: '1',
            eventType: 'type1',
            eventAt: expect.any(Date),
          },
        ],
        ackId: expect.any(String),
      });

      // And then the subscription stays intact
      await expect(getSubscription(knex, 'test')).resolves.toEqual({
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

      // First read succeeds
      await expect(
        readHistorySubscription(knex, {
          subscriptionId: 'test',
          operation: 'read',
          limit: 1,
          historyConfig: getHistoryConfig(),
        }),
      ).resolves.toEqual({
        events: [
          {
            eventId: '1',
            eventType: 'type1',
            eventAt: expect.any(Date),
          },
        ],
        ackId: expect.any(String),
      });

      // Which moves forward the subscription and marks it as waiting
      await expect(getSubscription(knex, 'test')).resolves.toEqual({
        subscription_id: 'test',
        active_at: expect.anything(),
        created_at: expect.anything(),
        state: 'waiting',
        ack_id: expect.any(String),
        ack_timeout_at: expect.anything(),
        last_sent_event_id: '1',
        last_acknowledged_event_id: '0',
        filter_entity_ref: null,
        filter_entity_id: null,
      });

      // Immediate following read fails because the subscription is not idle
      await expect(
        readHistorySubscription(knex, {
          subscriptionId: 'test',
          operation: 'read',
          limit: 1,
          historyConfig: getHistoryConfig(),
        }),
      ).resolves.toBeUndefined();

      // And also peek
      await expect(
        readHistorySubscription(knex, {
          subscriptionId: 'test',
          operation: 'peek',
          limit: 1,
          historyConfig: getHistoryConfig(),
        }),
      ).resolves.toBeUndefined();

      // And then the subscription stays intact
      await expect(getSubscription(knex, 'test')).resolves.toEqual({
        subscription_id: 'test',
        active_at: expect.anything(),
        created_at: expect.anything(),
        state: 'waiting',
        ack_id: expect.any(String),
        ack_timeout_at: expect.anything(),
        last_sent_event_id: '1',
        last_acknowledged_event_id: '0',
        filter_entity_ref: null,
        filter_entity_id: null,
      });

      // Manually acknowledge
      await knex('module_history__subscriptions')
        .update({
          state: 'idle',
          ack_id: null,
          ack_timeout_at: null,
          last_acknowledged_event_id: knex.ref('last_sent_event_id'),
        })
        .where('subscription_id', '=', 'test');

      // Now read succeeds
      await expect(
        readHistorySubscription(knex, {
          subscriptionId: 'test',
          operation: 'read',
          limit: 3,
          historyConfig: getHistoryConfig(),
        }),
      ).resolves.toEqual({
        events: [
          {
            eventId: '2',
            eventType: 'type2',
            eventAt: expect.any(Date),
          },
          {
            eventId: '3',
            eventType: 'type3',
            eventAt: expect.any(Date),
          },
        ],
        ackId: expect.any(String),
      });

      // And then the subscription moved forward
      await expect(getSubscription(knex, 'test')).resolves.toEqual({
        subscription_id: 'test',
        active_at: expect.anything(),
        created_at: expect.anything(),
        state: 'waiting',
        ack_id: expect.any(String),
        ack_timeout_at: expect.anything(),
        last_sent_event_id: '3',
        last_acknowledged_event_id: '1',
        filter_entity_ref: null,
        filter_entity_id: null,
      });

      await backend.stop();
    },
  );
});
