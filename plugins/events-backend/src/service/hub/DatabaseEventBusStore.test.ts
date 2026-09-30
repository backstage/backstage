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

jest.setTimeout(60_000);

const logger = mockServices.logger.mock();

const databases = TestDatabases.create({
  ids: ['POSTGRES_14', 'POSTGRES_18'],
});

describe.each(databases.eachSupportedId())(
  'DatabaseEventBusStore, %p',
  databaseId => {
    it('should clean up old events', async () => {
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
    });

    it('should always clean up events outside the max age window', async () => {
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
    });

    it('should not clean up events within the min age window', async () => {
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
    });

    it('should drain expired events in bounded transactions and skip locked rows', async () => {
      const db = await databases.init(databaseId);
      const store = await DatabaseEventBusStore.forTest({ logger, db });

      await db.raw(`
        INSERT INTO event_bus_events (id, created_by, topic, data_json, created_at)
        SELECT id, 'abc', 'test', '{}', now() - interval '1 day'
        FROM generate_series(1, 2505) AS id
      `);
      const locked = await db.transaction();
      await locked('event_bus_events').where({ id: 1 }).forUpdate();

      const batches: number[] = [];
      const onResponse = (
        response: { rowCount?: number },
        query: { sql: string },
      ) => {
        if (query.sql.includes('WITH count_cutoff')) {
          batches.push(response.rowCount!);
        }
      };
      db.on('query-response', onResponse);
      try {
        await store.clean();
        expect(batches).toEqual([1000, 1000, 504]);
        expect(await db('event_bus_events').pluck('id')).toEqual(['1']);
      } finally {
        db.removeListener('query-response', onResponse);
        await locked.rollback();
      }

      await store.clean();
      expect(await db('event_bus_events')).toEqual([]);
      expect((await db.raw('SHOW statement_timeout')).rows).toEqual([
        { statement_timeout: '0' },
      ]);
    });

    it.each(['abort', 'budget'] as const)(
      'should stop between batches on %s and resume on the next run',
      async reason => {
        const db = await databases.init(databaseId);
        const store = await DatabaseEventBusStore.forTest({ logger, db });
        await db.raw(`
          INSERT INTO event_bus_events (id, created_by, topic, data_json, created_at)
          SELECT id, 'abc', 'test', '{}', now() - interval '1 day'
          FROM generate_series(1, 2505) AS id
        `);
        await store.upsertSubscription(
          'tester',
          ['test'],
          mockCredentials.service(),
        );
        await db('event_bus_subscriptions').update({
          read_until: 0,
          updated_at: new Date(0),
        });

        const controller = new AbortController();
        const now = Date.now();
        const clock = jest.spyOn(Date, 'now').mockReturnValue(now);
        const onResponse = (_response: unknown, query: { sql: string }) => {
          if (query.sql.includes('WITH count_cutoff')) {
            if (reason === 'abort') {
              controller.abort();
            } else {
              clock.mockReturnValue(now + 12 * 60_000);
            }
          }
        };
        db.on('query-response', onResponse);
        try {
          await store.clean(controller.signal);
          expect(await db('event_bus_events').count()).toEqual([
            { count: '1505' },
          ]);
          expect(await db('event_bus_subscriptions').pluck('id')).toEqual([
            'tester',
          ]);
        } finally {
          db.removeListener('query-response', onResponse);
          clock.mockRestore();
        }

        await store.clean();
        expect(await db('event_bus_events')).toEqual([]);
        expect(await db('event_bus_subscriptions')).toEqual([]);
      },
    );

    it('should schedule global cleanup and honor an already aborted signal', async () => {
      const db = await databases.init(databaseId);
      const scheduler = mockServices.scheduler.mock();
      await DatabaseEventBusStore.create({
        database: mockServices.database.mock({ getClient: async () => db }),
        logger,
        scheduler,
        lifecycle: mockServices.lifecycle.mock(),
      });
      const [task] = scheduler.scheduleTask.mock.calls[0];
      expect(task).toMatchObject({
        scope: 'global',
        frequency: { minutes: 10 },
        timeout: { minutes: 15 },
      });
      const controller = new AbortController();
      controller.abort();
      const queries = jest.fn();
      db.on('query', queries);
      try {
        if (typeof task.fn !== 'function') {
          throw new Error('Expected a task function');
        }
        await task.fn(controller.signal);
        expect(queries).not.toHaveBeenCalled();
      } finally {
        db.removeListener('query', queries);
      }
    });

    it('should perform well when looking up events by topic', async () => {
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
    });
  },
);
