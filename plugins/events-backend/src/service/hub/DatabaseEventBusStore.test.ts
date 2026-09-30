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

const nonPostgresDatabases = TestDatabases.create({
  ids: ['SQLITE_3', 'MYSQL_8'],
});

describe.each(nonPostgresDatabases.eachSupportedId())(
  'DatabaseEventBusStore, %p',
  databaseId => {
    it('rejects a database engine that does not support the event bus SQL', async () => {
      const db = await nonPostgresDatabases.init(databaseId);
      const scheduler = mockServices.scheduler.mock();

      await expect(
        DatabaseEventBusStore.create({
          database: mockServices.database.mock({ getClient: async () => db }),
          logger,
          scheduler,
          lifecycle: mockServices.lifecycle.mock(),
        }),
      ).rejects.toThrow('DatabaseEventBusStore only supports PostgreSQL');
      expect(scheduler.scheduleTask).not.toHaveBeenCalled();
    });
  },
);

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

      await db('event_bus_events').update({
        created_at: new Date(Date.now() - 1000),
      });
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

    it('should clean up a large number of events', async () => {
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

      // Local testing shows this takes about 80ms, but CI containers can
      // be significantly slower under load.
      expect(Date.now() - start).toBeLessThan(2000);

      await expect(db('event_bus_events').count()).resolves.toEqual([
        { count: '5' },
      ]);
    });

    it('deletes a backlog in bounded transactions', async () => {
      const db = await databases.init(databaseId);
      const store = await DatabaseEventBusStore.forTest({ logger, db });

      await db.raw(`
        INSERT INTO event_bus_events (id, created_by, topic, data_json)
        SELECT id, 'abc', 'test', '{}'
        FROM generate_series(1, 2505) AS id
      `);

      const deletedPerStatement: number[] = [];
      const onResponse = (response: unknown, query: { sql: string }) => {
        if (!/delete from "?event_bus_events"?/i.test(query.sql)) {
          return;
        }
        if (typeof response === 'number') {
          deletedPerStatement.push(response);
        } else if (
          response &&
          typeof response === 'object' &&
          'rowCount' in response &&
          typeof response.rowCount === 'number'
        ) {
          deletedPerStatement.push(response.rowCount);
        }
      };

      db.on('query-response', onResponse);
      try {
        await store.clean();
      } finally {
        db.off('query-response', onResponse);
      }

      expect(deletedPerStatement.length).toBeGreaterThanOrEqual(3);
      expect(Math.max(...deletedPerStatement)).toBeLessThanOrEqual(1000);
      await expect(db('event_bus_events').count()).resolves.toEqual([
        { count: '5' },
      ]);
    });

    it('skips locked events and leaves the statement timeout unchanged', async () => {
      const db = await databases.init(databaseId);
      const store = await DatabaseEventBusStore.forTest({ logger, db });
      await db.raw(`
        INSERT INTO event_bus_events (id, created_by, topic, data_json, created_at)
        SELECT id, 'abc', 'test', '{}', now() - interval '1 day'
        FROM generate_series(1, 2505) AS id
      `);

      const locked = await db.transaction();
      await locked('event_bus_events').where({ id: 1 }).forUpdate().first();
      try {
        await store.clean();
        await expect(db('event_bus_events').pluck('id')).resolves.toEqual([
          '1',
        ]);
        await expect(db.raw('SHOW statement_timeout')).resolves.toMatchObject({
          rows: [{ statement_timeout: '0' }],
        });
      } finally {
        await locked.rollback();
      }

      await store.clean();
      await expect(db('event_bus_events').count()).resolves.toEqual([
        { count: '0' },
      ]);
    });

    it.each(['abort', 'budget'] as const)(
      'stops between batches on %s and resumes on the next run',
      async reason => {
        const db = await databases.init(databaseId);
        const store = await DatabaseEventBusStore.forTest({ logger, db });
        await db.raw(`
          INSERT INTO event_bus_events (id, created_by, topic, data_json, created_at)
          SELECT id, 'abc', 'test', '{}', now() - interval '1 day'
          FROM generate_series(1, 2505) AS id
        `);

        const controller = new AbortController();
        const now = Date.now();
        const clock = jest.spyOn(Date, 'now').mockReturnValue(now);
        let deleteStatements = 0;
        const onResponse = (_response: unknown, query: { sql: string }) => {
          if (/delete from event_bus_events/i.test(query.sql)) {
            deleteStatements++;
            if (reason === 'abort') {
              controller.abort();
            } else {
              clock.mockReturnValue(now + 50_001);
            }
          }
        };
        db.on('query-response', onResponse);
        try {
          await store.clean(controller.signal);
        } finally {
          db.off('query-response', onResponse);
          clock.mockRestore();
        }

        expect(deleteStatements).toBe(1);
        await expect(db('event_bus_events').count()).resolves.toEqual([
          { count: '1505' },
        ]);
        await store.clean();
        await expect(db('event_bus_events').count()).resolves.toEqual([
          { count: '0' },
        ]);
      },
    );

    it('schedules cleanup globally and honors an aborted signal', async () => {
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
        frequency: { minutes: 1 },
        timeout: { minutes: 1 },
      });
      const controller = new AbortController();
      controller.abort();
      const onQuery = jest.fn();
      db.on('query', onQuery);
      try {
        if (typeof task.fn !== 'function') {
          throw new Error('Expected a task function');
        }
        await task.fn(controller.signal);
        expect(onQuery).not.toHaveBeenCalled();
      } finally {
        db.off('query', onQuery);
      }
    });

    it('reads multiple topics in event order without duplicates', async () => {
      const db = await databases.init(databaseId);
      const store = await DatabaseEventBusStore.forTest({ logger, db });

      await db('event_bus_events').insert(
        Array.from({ length: 15 }, (_, index) => ({
          id: index + 1,
          created_by: 'abc',
          topic: ['first', 'second', 'ignored'][index % 3],
          data_json: JSON.stringify({ payload: { id: index + 1 } }),
          notified_subscribers: index === 7 ? ['tester'] : [],
        })),
      );
      await db('event_bus_subscriptions').insert({
        id: 'tester',
        created_by: 'abc',
        read_until: 0,
        topics: ['first', 'second', 'first'],
      });

      const { events } = await store.readSubscription('tester');
      expect(
        events.map(event => (event.eventPayload as { id: number }).id),
      ).toEqual([1, 2, 4, 5, 7, 10, 11, 13, 14]);
      await expect(store.readSubscription('tester')).resolves.toEqual({
        events: [],
      });
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

      await db('event_bus_subscriptions')
        .where({ id: 'tester' })
        .update({ read_until: 99000 });

      let readQuery: { sql: string; bindings: (string | number)[] } | undefined;
      const onQuery = (query: {
        sql: string;
        bindings: (string | number)[];
      }) => {
        if (query.sql.includes('WITH subscription AS')) {
          readQuery = query;
        }
      };
      db.on('query', onQuery);
      let tailEvents;
      try {
        ({ events: tailEvents } = await store.readSubscription('tester'));
      } finally {
        db.off('query', onQuery);
      }

      expect(
        tailEvents.map(event => (event.eventPayload as { id: string }).id),
      ).toEqual(Array.from({ length: 10 }, (_, i) => String(99005 + i * 10)));

      expect(readQuery).toBeDefined();
      const { rows } = await db.raw(
        `EXPLAIN (FORMAT JSON) ${readQuery!.sql.replace(/\$\d+/g, '?')}`,
        readQuery!.bindings,
      );
      expect(JSON.stringify(rows[0]['QUERY PLAN'])).toContain(
        'event_bus_events_topic_id_idx',
      );
    });
  },
);
