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
import catalogBackend from '@backstage/plugin-catalog-backend';
import { Knex } from 'knex';
import { createMockEntityProvider } from '../../__fixtures__/createMockEntityProvider';
import { applyDatabaseMigrations } from '../../database/migrations';
import { getSubscription } from '../../database/operations/getSubscription';
import { UpsertSubscriptionModelImpl } from './UpsertSubscription.model';

jest.setTimeout(60_000);

describe('UpsertSubscriptionModelImpl', () => {
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

  it.each(databases.eachSupportedId())(
    'can create a new subscription both with a given and a generated id, %p',
    async databaseId => {
      const { knex, backend } = await init(databaseId);

      const model = new UpsertSubscriptionModelImpl({
        knexPromise: Promise.resolve(knex),
      });

      let subscription = await model.upsertSubscription({
        subscriptionSpec: {},
      });
      expect(subscription).toEqual({
        subscriptionId: expect.any(String),
        createdAt: expect.any(String),
        lastActiveAt: expect.any(String),
      });

      await expect(
        getSubscription(knex, subscription.subscriptionId),
      ).resolves.toEqual({
        subscriptionId: expect.stringMatching(
          /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/,
        ),
        activeAt: expect.any(Date),
        createdAt: expect.any(Date),
        state: 'idle',
        lastAcknowledgedEventId: '0',
        lastSentEventId: '0',
      });

      subscription = await model.upsertSubscription({
        subscriptionSpec: {
          subscriptionId: 'test',
          entityRef: 'r',
          entityId: 'i',
        },
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
        subscriptionId: 'test',
        activeAt: expect.any(Date),
        createdAt: expect.any(Date),
        state: 'idle',
        lastAcknowledgedEventId: '0',
        lastSentEventId: '0',
        filterEntityRef: 'r',
        filterEntityId: 'i',
      });

      await backend.stop();
    },
  );

  it.each(databases.eachSupportedId())(
    'can insert and then update a subscription, %p',
    async databaseId => {
      const { knex, backend } = await init(databaseId);

      const model = new UpsertSubscriptionModelImpl({
        knexPromise: Promise.resolve(knex),
      });

      let subscription = await model.upsertSubscription({
        subscriptionSpec: {
          subscriptionId: 'test',
        },
      });
      expect(subscription).toEqual({
        subscriptionId: 'test',
        createdAt: expect.any(String),
        lastActiveAt: expect.any(String),
      });

      await expect(
        getSubscription(knex, subscription.subscriptionId),
      ).resolves.toEqual({
        subscriptionId: 'test',
        activeAt: expect.any(Date),
        createdAt: expect.any(Date),
        state: 'idle',
        lastAcknowledgedEventId: '0',
        lastSentEventId: '0',
      });

      subscription = await model.upsertSubscription({
        subscriptionSpec: {
          subscriptionId: 'test',
          entityRef: 'r',
          entityId: 'i',
        },
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
        subscriptionId: 'test',
        activeAt: expect.any(Date),
        createdAt: expect.any(Date),
        state: 'idle',
        lastAcknowledgedEventId: '0',
        lastSentEventId: '0',
        filterEntityRef: 'r',
        filterEntityId: 'i',
      });

      await backend.stop();
    },
  );

  it.each(databases.eachSupportedId())(
    'supports all valid forms of "afterEventId" values and rejects invalid ones, %p',
    async databaseId => {
      const { knex, backend } = await init(databaseId);

      const model = new UpsertSubscriptionModelImpl({
        knexPromise: Promise.resolve(knex),
      });

      await knex('history_events').insert([
        { event_type: 'type1' },
        { event_type: 'type2' },
        { event_type: 'type3' },
      ]);

      let subscription = await model.upsertSubscription({
        subscriptionSpec: {
          subscriptionId: 'beginning',
          afterEventId: '0',
        },
      });
      expect(subscription).toEqual({
        subscriptionId: 'beginning',
        createdAt: expect.any(String),
        lastActiveAt: expect.any(String),
      });

      await expect(
        getSubscription(knex, subscription.subscriptionId),
      ).resolves.toEqual({
        subscriptionId: 'beginning',
        activeAt: expect.any(Date),
        createdAt: expect.any(Date),
        state: 'idle',
        lastAcknowledgedEventId: '0',
        lastSentEventId: '0',
      });

      subscription = await model.upsertSubscription({
        subscriptionSpec: {
          subscriptionId: 'now',
          afterEventId: 'last',
        },
      });
      expect(subscription).toEqual({
        subscriptionId: 'now',
        createdAt: expect.any(String),
        lastActiveAt: expect.any(String),
      });

      await expect(
        getSubscription(knex, subscription.subscriptionId),
      ).resolves.toEqual({
        subscriptionId: 'now',
        activeAt: expect.any(Date),
        createdAt: expect.any(Date),
        state: 'idle',
        lastAcknowledgedEventId: '3',
        lastSentEventId: '3',
      });

      subscription = await model.upsertSubscription({
        subscriptionSpec: {
          subscriptionId: 'number',
          afterEventId: '2',
        },
      });
      expect(subscription).toEqual({
        subscriptionId: 'number',
        createdAt: expect.any(String),
        lastActiveAt: expect.any(String),
      });

      await expect(
        getSubscription(knex, subscription.subscriptionId),
      ).resolves.toEqual({
        subscriptionId: 'number',
        activeAt: expect.any(Date),
        createdAt: expect.any(Date),
        state: 'idle',
        lastAcknowledgedEventId: '2',
        lastSentEventId: '2',
      });

      await expect(
        model.upsertSubscription({
          subscriptionSpec: {
            subscriptionId: 'wrong',
            afterEventId: 'blah',
          },
        }),
      ).rejects.toThrowErrorMatchingInlineSnapshot(
        `"Invalid afterEventId value, expected a string of digits or "last", got "blah""`,
      );

      await backend.stop();
    },
  );
});
