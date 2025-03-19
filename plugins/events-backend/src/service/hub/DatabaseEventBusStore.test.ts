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

import {
  TestDatabases,
  mockCredentials,
  mockServices,
} from '@backstage/backend-test-utils';
import { DatabaseEventBusStore } from './DatabaseEventBusStore';

const logger = mockServices.logger.mock();

const databases = TestDatabases.create({
  ids: ['POSTGRES_13', 'POSTGRES_17'],
});

const maybeDescribe =
  databases.eachSupportedId().length > 0 ? describe : describe.skip;

maybeDescribe('DatabaseEventBusStore', () => {
  it.each(databases.eachSupportedId())(
    'should clean up old events, %p',
    async databaseId => {
      const db = await databases.init(databaseId);
      const store = await DatabaseEventBusStore.forTest({ logger, db });

      await store.upsertSubscription(
        'tester-1',
        ['test'],
        mockCredentials.service(),
      );
      await store.upsertSubscription(
        'tester-2',
        ['test'],
        mockCredentials.service(),
      );

      for (let i = 0; i < 10; ++i) {
        await store.publish({
          event: { topic: 'test', eventPayload: { n: i } },
          credentials: mockCredentials.service(),
        });
      }

      const { events: events1 } = await store.readSubscription('tester-1');
      expect(events1.length).toBe(10);

      await store.clean();

      await expect(store.readSubscription('tester-2')).rejects.toThrow(
        "Subscription with ID 'tester-2' not found",
      );

      await store.upsertSubscription(
        'tester-3',
        ['test'],
        mockCredentials.service(),
      );

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

      await store.upsertSubscription(
        'tester-1',
        ['test'],
        mockCredentials.service(),
      );
      await store.upsertSubscription(
        'tester-2',
        ['test'],
        mockCredentials.service(),
      );

      for (let i = 0; i < 10; ++i) {
        await store.publish({
          event: { topic: 'test', eventPayload: { n: i } },
          credentials: mockCredentials.service(),
        });
      }

      const { events: events1 } = await store.readSubscription('tester-1');
      expect(events1.length).toBe(10);

      await store.clean();

      await expect(store.readSubscription('tester-2')).rejects.toThrow(
        "Subscription with ID 'tester-2' not found",
      );

      await store.upsertSubscription(
        'tester-3',
        ['test'],
        mockCredentials.service(),
      );

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

      await store.upsertSubscription(
        'tester-1',
        ['test'],
        mockCredentials.service(),
      );

      for (let i = 0; i < 10; ++i) {
        await store.publish({
          event: { topic: 'test', eventPayload: { n: i } },
          credentials: mockCredentials.service(),
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
        INSERT INTO event_bus_events (id, created_by, topic, data_json)
        SELECT id, 'abc', 'test', '{}'
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

  it.each(databases.eachSupportedId())(
    'should perform well when looking up events by topic, %p',
    async databaseId => {
      const db = await databases.init(databaseId);
      const store = await DatabaseEventBusStore.forTest({
        logger,
        db,
      });

      const COUNT = '100000';

      // Insert 100,000 events, a lot more than we'd expect to ever have
      // in a real-world scenario given our count window size is 10,000.
      await db.raw(`
        INSERT INTO event_bus_events (id, created_by, topic, data_json, notified_subscribers)
        SELECT id, 'abc', CONCAT('test-', MOD(id, 10)), CONCAT('{"payload":{"id":"', id, '"}}'), '{"${String(
          Math.random(),
        ).slice(2, 6)}"}'
        FROM generate_series(1, ${COUNT}) AS id
      `);
      await db('event_bus_subscriptions').insert({
        id: 'tester',
        created_by: 'abc',
        read_until: 0,
        topics: ['test-5'],
      });

      const start = Date.now();
      const { events } = await store.readSubscription('tester');
      const duration = Date.now() - start;

      expect(events).toEqual([
        { topic: 'test-5', eventPayload: { id: '5' } },
        { topic: 'test-5', eventPayload: { id: '15' } },
        { topic: 'test-5', eventPayload: { id: '25' } },
        { topic: 'test-5', eventPayload: { id: '35' } },
        { topic: 'test-5', eventPayload: { id: '45' } },
        { topic: 'test-5', eventPayload: { id: '55' } },
        { topic: 'test-5', eventPayload: { id: '65' } },
        { topic: 'test-5', eventPayload: { id: '75' } },
        { topic: 'test-5', eventPayload: { id: '85' } },
        { topic: 'test-5', eventPayload: { id: '95' } },
      ]);

      expect(duration).toBeLessThan(20);
    },
  );
});
