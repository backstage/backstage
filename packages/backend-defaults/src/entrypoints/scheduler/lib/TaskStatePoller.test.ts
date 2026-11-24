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

import { TestDatabases, mockServices } from '@backstage/backend-test-utils';
import { getEventListeners } from 'node:events';
import { Knex } from 'knex';
import { Duration } from 'luxon';
import { migrateBackendTasks } from '../database/migrateBackendTasks';
import { DB_TASKS_TABLE, DbTasksRow } from '../database/tables';
import { TaskStatePoller } from './TaskStatePoller';
import { nowPlus } from './util';

jest.setTimeout(60_000);

const databases = TestDatabases.create();

describe.each(databases.eachSupportedId())(
  'TaskStatePoller, %p',
  databaseId => {
    const pollInterval = Duration.fromMillis(100);
    let knex: Knex;

    beforeEach(async () => {
      knex = await databases.init(databaseId);
      await migrateBackendTasks(knex);
    });

    const defaultSettings = {
      version: 2,
      cadence: 'PT5S',
      timeoutAfterDuration: 'PT30S',
    };

    async function insertTask(id: string, opts: { ready?: boolean } = {}) {
      await knex<DbTasksRow>(DB_TASKS_TABLE).insert({
        id,
        settings_json: JSON.stringify(defaultSettings),
        next_run_start_at: opts.ready
          ? nowPlus(Duration.fromObject({ minutes: -1 }), knex)
          : nowPlus(Duration.fromObject({ hours: 1 }), knex),
      });
    }

    function createPoller(logger = mockServices.logger.mock()) {
      return new TaskStatePoller({ knex, logger });
    }

    function waitForTask(
      poller: TaskStatePoller,
      taskId: string,
      controller: AbortController,
      interval = pollInterval,
    ) {
      return poller.waitForTask(taskId, {
        signal: controller.signal,
        pollInterval: interval,
      });
    }

    function waitForNextReadinessQuery() {
      return new Promise<void>(resolve => {
        const onQueryResponse = (
          _response: unknown,
          query: { sql: string },
        ) => {
          if (
            query.sql.includes(DB_TASKS_TABLE) &&
            query.sql.toLowerCase().startsWith('select')
          ) {
            knex.off('query-response', onQueryResponse);
            resolve();
          }
        };
        knex.on('query-response', onQueryResponse);
      });
    }

    it('batches task outcomes into one query and preserves diagnostics', async () => {
      await insertTask('task-ready', { ready: true });
      await insertTask('task-invalid', { ready: true });
      await knex<DbTasksRow>(DB_TASKS_TABLE)
        .where('id', 'task-invalid')
        .update({ settings_json: '{}' });

      const logger = mockServices.logger.mock();
      const poller = createPoller(logger);
      const readyController = new AbortController();
      const invalidController = new AbortController();
      const missingController = new AbortController();
      const readinessQueries: string[] = [];
      const onQuery = (query: { sql: string }) => {
        if (
          query.sql.includes(DB_TASKS_TABLE) &&
          query.sql.toLowerCase().startsWith('select')
        ) {
          readinessQueries.push(query.sql);
        }
      };
      knex.on('query', onQuery);

      try {
        const results = Promise.all([
          waitForTask(poller, 'task-ready', readyController),
          waitForTask(poller, 'task-invalid', invalidController),
          waitForTask(poller, 'task-missing', missingController),
        ]);
        await expect(results).resolves.toEqual([
          {
            result: 'ready',
            settings: defaultSettings,
          },
          { result: 'abort' },
          { result: 'abort' },
        ]);
        expect(readinessQueries).toHaveLength(1);
        expect(logger.info).toHaveBeenCalledWith(
          expect.stringContaining(
            'Task "task-invalid" is no longer able to parse task settings',
          ),
        );
        expect(logger.info).toHaveBeenCalledWith(
          expect.stringContaining('No longer able to find task "task-missing"'),
        );
      } finally {
        knex.off('query', onQuery);
      }
    });

    it('logs query failures with error details and retries', async () => {
      await insertTask('task-query-retry', { ready: true });
      const unavailableTable = `${DB_TASKS_TABLE}_unavailable`;
      await knex.schema.renameTable(DB_TASKS_TABLE, unavailableTable);

      const logger = mockServices.logger.mock();
      const warning = new Promise<[string, unknown]>(resolve => {
        logger.warn.mockImplementation((message, error) => {
          resolve([message, error]);
        });
      });
      const poller = createPoller(logger);
      const controller = new AbortController();
      let tableRestored = false;

      try {
        const promise = waitForTask(poller, 'task-query-retry', controller);
        const [message, error] = await warning;
        await knex.schema.renameTable(unavailableTable, DB_TASKS_TABLE);
        tableRestored = true;

        expect(message).toBe('Task state poll failed');
        expect(error).toEqual(
          expect.objectContaining({
            message: expect.any(String),
            stack: expect.any(String),
          }),
        );
        await expect(promise).resolves.toMatchObject({ result: 'ready' });
      } finally {
        controller.abort();
        if (!tableRestored) {
          await knex.schema.renameTable(unavailableTable, DB_TASKS_TABLE);
        }
      }
    });

    it('keeps waiting until tasks become ready and idle', async () => {
      await insertTask('task-future', { ready: false });
      await insertTask('task-running', { ready: true });
      await knex<DbTasksRow>(DB_TASKS_TABLE)
        .where('id', 'task-running')
        .update({ current_run_ticket: 'some-ticket' });

      const poller = createPoller();
      const futureController = new AbortController();
      const runningController = new AbortController();
      const firstPoll = waitForNextReadinessQuery();
      let futureResolved = false;
      let runningResolved = false;
      const futurePromise = waitForTask(
        poller,
        'task-future',
        futureController,
      ).then(result => {
        futureResolved = true;
        return result;
      });
      const runningPromise = waitForTask(
        poller,
        'task-running',
        runningController,
      ).then(result => {
        runningResolved = true;
        return result;
      });

      await firstPoll;
      expect(futureResolved).toBe(false);
      expect(runningResolved).toBe(false);

      await knex<DbTasksRow>(DB_TASKS_TABLE)
        .where('id', 'task-future')
        .update({
          next_run_start_at: nowPlus(
            Duration.fromObject({ minutes: -1 }),
            knex,
          ),
        });
      await knex<DbTasksRow>(DB_TASKS_TABLE)
        .where('id', 'task-running')
        .update({ current_run_ticket: knex.raw('null') });
      const readyPoll = waitForNextReadinessQuery();
      await readyPoll;

      await expect(
        Promise.all([futurePromise, runningPromise]),
      ).resolves.toEqual([
        { result: 'ready', settings: defaultSettings },
        { result: 'ready', settings: defaultSettings },
      ]);
    });

    it('cleans up waits and timers when workers stop', async () => {
      const stoppedController = new AbortController();
      stoppedController.abort();
      await expect(
        waitForTask(createPoller(), 'task-stopped', stoppedController),
      ).resolves.toEqual({ result: 'abort' });
      expect(getEventListeners(stoppedController.signal, 'abort')).toHaveLength(
        0,
      );

      await insertTask('task-aborted-before-poll', { ready: false });
      await insertTask('task-after-early-abort', { ready: true });
      const reusablePoller = createPoller();
      const earlyController = new AbortController();
      const earlyPromise = waitForTask(
        reusablePoller,
        'task-aborted-before-poll',
        earlyController,
      );
      earlyController.abort();
      await expect(earlyPromise).resolves.toEqual({ result: 'abort' });
      await Promise.resolve();

      const nextController = new AbortController();
      const nextPoll = waitForNextReadinessQuery();
      const nextPromise = waitForTask(
        reusablePoller,
        'task-after-early-abort',
        nextController,
      );
      await nextPoll;
      await expect(nextPromise).resolves.toMatchObject({ result: 'ready' });

      await insertTask('task-pending', { ready: false });
      const pendingController = new AbortController();
      const setTimeoutSpy = jest.spyOn(global, 'setTimeout');
      const clearTimeoutSpy = jest.spyOn(global, 'clearTimeout');
      try {
        const pendingPoll = waitForNextReadinessQuery();
        const pendingPromise = waitForTask(
          createPoller(),
          'task-pending',
          pendingController,
        );
        await pendingPoll;
        await new Promise(resolve => setImmediate(resolve));
        const pollTimers = setTimeoutSpy.mock.results
          .filter(
            (_, index) =>
              setTimeoutSpy.mock.calls[index][1] ===
              pollInterval.as('milliseconds'),
          )
          .map(result => result.value);

        pendingController.abort();

        await expect(pendingPromise).resolves.toEqual({ result: 'abort' });
        expect(
          getEventListeners(pendingController.signal, 'abort'),
        ).toHaveLength(0);
        expect(pollTimers).not.toHaveLength(0);
        expect(
          pollTimers.some(timer =>
            clearTimeoutSpy.mock.calls.some(([value]) => value === timer),
          ),
        ).toBe(true);
      } finally {
        pendingController.abort();
        setTimeoutSpy.mockRestore();
        clearTimeoutSpy.mockRestore();
      }
    });

    it('rejects invalid polling intervals without registering a waiter', () => {
      const controller = new AbortController();
      const poller = createPoller();

      for (const interval of [
        Duration.fromMillis(0),
        Duration.fromMillis(-1),
      ]) {
        expect(() =>
          waitForTask(poller, 'task-invalid-interval', controller, interval),
        ).toThrow('pollInterval must be a finite positive duration');
      }

      expect(getEventListeners(controller.signal, 'abort')).toHaveLength(0);
    });

    it('does not poll more often than every 100 milliseconds', async () => {
      await insertTask('task-minimum-poll-interval', { ready: false });
      const controller = new AbortController();
      const readinessQueries: string[] = [];
      const onQuery = (query: { sql: string }) => {
        if (
          query.sql.includes(DB_TASKS_TABLE) &&
          query.sql.toLowerCase().startsWith('select')
        ) {
          readinessQueries.push(query.sql);
        }
      };
      knex.on('query', onQuery);
      jest.useFakeTimers({ doNotFake: ['nextTick', 'setImmediate'] });

      try {
        const firstPoll = waitForNextReadinessQuery();
        const promise = waitForTask(
          createPoller(),
          'task-minimum-poll-interval',
          controller,
          Duration.fromMillis(1),
        );
        await firstPoll;
        await new Promise(resolve => setImmediate(resolve));
        expect(readinessQueries).toHaveLength(1);

        jest.advanceTimersByTime(99);
        await new Promise(resolve => setImmediate(resolve));
        expect(readinessQueries).toHaveLength(1);

        jest.advanceTimersByTime(1);
        await new Promise(resolve => setImmediate(resolve));
        expect(readinessQueries).toHaveLength(2);

        controller.abort();
        await expect(promise).resolves.toEqual({ result: 'abort' });
      } finally {
        controller.abort();
        knex.off('query', onQuery);
        jest.useRealTimers();
      }
    });

    it('uses a task requested interval while waiting', async () => {
      await insertTask('task-fast-poll', { ready: false });
      const controller = new AbortController();
      const poller = createPoller();
      const firstPoll = waitForNextReadinessQuery();
      const promise = waitForTask(poller, 'task-fast-poll', controller);

      await firstPoll;
      await knex<DbTasksRow>(DB_TASKS_TABLE)
        .where('id', 'task-fast-poll')
        .update({
          next_run_start_at: nowPlus(
            Duration.fromObject({ minutes: -1 }),
            knex,
          ),
        });
      const readyPoll = waitForNextReadinessQuery();
      const waitStartedAt = Date.now();
      await readyPoll;

      expect(Date.now() - waitStartedAt).toBeLessThan(4_000);
      await expect(promise).resolves.toMatchObject({ result: 'ready' });
    });

    it('waits one interval before polling again after a ready result', async () => {
      await insertTask('task-ready-cooldown', { ready: true });
      const controller = new AbortController();
      const interval = Duration.fromObject({ seconds: 5 });
      const readinessQueries: string[] = [];
      const onQuery = (query: { sql: string }) => {
        if (
          query.sql.includes(DB_TASKS_TABLE) &&
          query.sql.toLowerCase().startsWith('select')
        ) {
          readinessQueries.push(query.sql);
        }
      };
      knex.on('query', onQuery);
      jest.useFakeTimers({ doNotFake: ['nextTick', 'setImmediate'] });

      try {
        const poller = createPoller();
        const firstPromise = waitForTask(
          poller,
          'task-ready-cooldown',
          controller,
          interval,
        );
        await firstPromise;
        await new Promise(resolve => setImmediate(resolve));
        expect(readinessQueries).toHaveLength(1);

        let secondResolved = false;
        const secondPromise = waitForTask(
          poller,
          'task-ready-cooldown',
          controller,
          interval,
        ).then(result => {
          secondResolved = true;
          return result;
        });

        await new Promise(resolve => setImmediate(resolve));
        jest.advanceTimersByTime(4_999);
        expect(secondResolved).toBe(false);
        expect(readinessQueries).toHaveLength(1);

        jest.advanceTimersByTime(1);
        await new Promise(resolve => setImmediate(resolve));
        expect(readinessQueries).toHaveLength(2);
        await expect(secondPromise).resolves.toMatchObject({ result: 'ready' });
      } finally {
        controller.abort();
        knex.off('query', onQuery);
        jest.useRealTimers();
      }
    });

    it('pulls a scheduled poll forward for a faster waiter', async () => {
      await insertTask('task-slow-poll', { ready: false });
      await insertTask('task-fast-late-poll', { ready: true });
      const slowController = new AbortController();
      const fastController = new AbortController();
      const readinessQueries: string[] = [];
      const onQuery = (query: { sql: string }) => {
        if (
          query.sql.includes(DB_TASKS_TABLE) &&
          query.sql.toLowerCase().startsWith('select')
        ) {
          readinessQueries.push(query.sql);
        }
      };
      knex.on('query', onQuery);
      jest.useFakeTimers({ doNotFake: ['nextTick', 'setImmediate'] });

      try {
        const poller = createPoller();
        const firstPoll = waitForNextReadinessQuery();
        const slowPromise = waitForTask(
          poller,
          'task-slow-poll',
          slowController,
          Duration.fromObject({ seconds: 50 }),
        );
        await firstPoll;
        await new Promise(resolve => setImmediate(resolve));

        const fastPromise = waitForTask(
          poller,
          'task-fast-late-poll',
          fastController,
          Duration.fromObject({ seconds: 5 }),
        );

        jest.advanceTimersByTime(4_999);
        expect(readinessQueries).toHaveLength(1);

        jest.advanceTimersByTime(1);
        await new Promise(resolve => setImmediate(resolve));
        expect(readinessQueries).toHaveLength(2);
        await expect(fastPromise).resolves.toMatchObject({ result: 'ready' });
        await new Promise(resolve => setImmediate(resolve));

        jest.advanceTimersByTime(49_999);
        expect(readinessQueries).toHaveLength(2);

        slowController.abort();
        await slowPromise;
      } finally {
        slowController.abort();
        fastController.abort();
        knex.off('query', onQuery);
        jest.useRealTimers();
      }
    });
  },
);
