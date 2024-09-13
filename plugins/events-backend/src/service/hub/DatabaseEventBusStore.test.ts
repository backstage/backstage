/*
 * Copyright 2024 The Backstage Authors
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

import { TestDatabases, mockServices } from '@backstage/backend-test-utils';
import { DatabaseEventBusStore } from './DatabaseEventBusStore';

const logger = mockServices.logger.mock();

const databases = TestDatabases.create({
  ids: ['POSTGRES_9', 'POSTGRES_13', 'POSTGRES_16'],
});

describe('DatabaseEventBusStore', () => {
  it.each(databases.eachSupportedId())(
    'should clean up old events, %p',
    async databaseId => {
      const db = await databases.init(databaseId);
      const store = await DatabaseEventBusStore.forTest({ logger, db });

      await store.upsertSubscription('tester-1', ['test']);
      await store.upsertSubscription('tester-2', ['test']);

      for (let i = 0; i < 10; ++i) {
        await store.publish({
          params: { topic: 'test', eventPayload: { n: i } },
        });
      }

      const { events: events1 } = await store.readSubscription('tester-1');
      expect(events1.length).toBe(10);

      await store.clean();

      await expect(store.readSubscription('tester-2')).rejects.toThrow(
        "Subscription with ID 'tester-2' not found",
      );

      await store.upsertSubscription('tester-3', ['test']);

      // Reset read pointer to read form the beginning
      await db('event_bus_subscriptions').select({ id: 'tester-3' }).update({
        read_until: 0,
      });

      const { events: events3 } = await store.readSubscription('tester-3');
      expect(events3.length).toBe(5);
    },
  );

  it.each(databases.eachSupportedId())(
    'should always clean up events outside the max age window, %p',
    async databaseId => {
      const db = await databases.init(databaseId);
      const store = await DatabaseEventBusStore.forTest({
        logger,
        db,
        maxAge: 0,
      });

      await store.upsertSubscription('tester-1', ['test']);
      await store.upsertSubscription('tester-2', ['test']);

      for (let i = 0; i < 10; ++i) {
        await store.publish({
          params: { topic: 'test', eventPayload: { n: i } },
        });
      }

      const { events: events1 } = await store.readSubscription('tester-1');
      expect(events1.length).toBe(10);

      await store.clean();

      await expect(store.readSubscription('tester-2')).rejects.toThrow(
        "Subscription with ID 'tester-2' not found",
      );

      await store.upsertSubscription('tester-3', ['test']);

      // Reset read pointer to read form the beginning
      await db('event_bus_subscriptions').select({ id: 'tester-3' }).update({
        read_until: 0,
      });

      const { events: events3 } = await store.readSubscription('tester-3');
      expect(events3.length).toBe(0);
    },
  );

  it.each(databases.eachSupportedId())(
    'should not clean up events within the min age window, %p',
    async databaseId => {
      const db = await databases.init(databaseId);
      const store = await DatabaseEventBusStore.forTest({
        logger,
        db,
        minAge: 1000,
      });

      await store.upsertSubscription('tester-1', ['test']);

      for (let i = 0; i < 10; ++i) {
        await store.publish({
          params: { topic: 'test', eventPayload: { n: i } },
        });
      }

      await store.clean();

      const { events: events1 } = await store.readSubscription('tester-1');
      expect(events1.length).toBe(10);
    },
  );

  it.each(databases.eachSupportedId())(
    'should clean up a large number of events, %p',
    async databaseId => {
      const db = await databases.init(databaseId);
      const store = await DatabaseEventBusStore.forTest({
        logger,
        db,
      });

      const COUNT = '100000';

      await db.raw(`
        INSERT INTO event_bus_events (id, topic, data_json)
        SELECT id, 'test', '{}'
        FROM generate_series(1, ${COUNT}) AS id
      `);

      await expect(db('event_bus_events').count()).resolves.toEqual([
        { count: COUNT },
      ]);

      const start = Date.now();

      await store.clean();

      // Local testing shows this takes about 80ms, but if this is flaky we can
      // reduce the count down to 10_000.
      expect(Date.now() - start).toBeLessThan(500);

      await expect(db('event_bus_events').count()).resolves.toEqual([
        { count: '5' },
      ]);
    },
  );
});
