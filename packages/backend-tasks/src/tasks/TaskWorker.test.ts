/*
 * Copyright 2021 The Backstage Authors
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

import { getVoidLogger } from '@backstage/backend-common';
import { TestDatabases } from '@backstage/backend-test-utils';
import { Duration } from 'luxon';
import { AbortController } from 'node-abort-controller';
import waitForExpect from 'wait-for-expect';
import { migrateBackendTasks } from '../database/migrateBackendTasks';
import { DbTasksRow, DB_TASKS_TABLE } from '../database/tables';
import { TaskWorker } from './TaskWorker';
import { TaskSettingsV2 } from './types';

describe('TaskWorker', () => {
  const logger = getVoidLogger();
  const databases = TestDatabases.create({
    ids: ['POSTGRES_13', 'POSTGRES_9', 'SQLITE_3'],
  });

  beforeEach(() => {
    jest.resetAllMocks();
  });

  it.each(databases.eachSupportedId())(
    'goes through the expected states, %p',
    async databaseId => {
      const knex = await databases.init(databaseId);
      await migrateBackendTasks(knex);

      const fn = jest.fn(
        async () => new Promise<void>(resolve => setTimeout(resolve, 50)),
      );
      const settings: TaskSettingsV2 = {
        version: 2,
        cadence: '*/2 * * * * *',
        initialDelayDuration: Duration.fromObject({ seconds: 1 }).toISO(),
        timeoutAfterDuration: Duration.fromObject({ minutes: 1 }).toISO(),
      };

      const worker = new TaskWorker('task1', fn, knex, logger);
      await worker.persistTask(settings);

      let row = (await knex<DbTasksRow>(DB_TASKS_TABLE))[0];
      expect(row).toEqual(
        expect.objectContaining({
          id: 'task1',
          current_run_ticket: null,
          current_run_started_at: null,
          current_run_expires_at: null,
        }),
      );
      expect(JSON.parse(row.settings_json)).toEqual({
        version: 2,
        cadence: '*/2 * * * * *',
        initialDelayDuration: 'PT1S',
        timeoutAfterDuration: 'PT1M',
      });

      await expect(worker.findReadyTask()).resolves.toEqual({
        result: 'not-ready-yet',
      });

      await waitForExpect(async () => {
        await expect(worker.findReadyTask()).resolves.toEqual({
          result: 'ready',
          settings,
        });
      });

      row = (await knex<DbTasksRow>(DB_TASKS_TABLE))[0];
      expect(row).toEqual(
        expect.objectContaining({
          id: 'task1',
          current_run_ticket: null,
          current_run_started_at: null,
          current_run_expires_at: null,
        }),
      );

      await expect(worker.tryClaimTask('ticket', settings)).resolves.toBe(true);

      row = (await knex<DbTasksRow>(DB_TASKS_TABLE))[0];
      expect(row).toEqual(
        expect.objectContaining({
          id: 'task1',
          current_run_ticket: 'ticket',
          current_run_started_at: expect.anything(),
          current_run_expires_at: expect.anything(),
        }),
      );

      await expect(worker.tryReleaseTask('ticket', settings)).resolves.toBe(
        true,
      );

      row = (await knex<DbTasksRow>(DB_TASKS_TABLE))[0];
      expect(row).toEqual(
        expect.objectContaining({
          id: 'task1',
          current_run_ticket: null,
          current_run_started_at: null,
          current_run_expires_at: null,
        }),
      );
    },
    60_000,
  );

  it.each(databases.eachSupportedId())(
    'logs error when the task throws, %p',
    async databaseId => {
      const knex = await databases.init(databaseId);
      await migrateBackendTasks(knex);

      jest.spyOn(logger, 'error');
      const fn = jest.fn().mockRejectedValue(new Error('failed'));
      const settings: TaskSettingsV2 = {
        version: 2,
        initialDelayDuration: undefined,
        cadence: '* * * * * *',
        timeoutAfterDuration: Duration.fromMillis(60000).toISO(),
      };
      const checkFrequency = Duration.fromObject({ milliseconds: 100 });
      const worker = new TaskWorker('task1', fn, knex, logger, checkFrequency);
      worker.start(settings);

      await waitForExpect(() => {
        expect(logger.error).toBeCalled();
      });
    },
    60_000,
  );

  it.each(databases.eachSupportedId())(
    'runs tasks more than once even when the task throws, %p',
    async databaseId => {
      const knex = await databases.init(databaseId);
      await migrateBackendTasks(knex);

      const fn = jest.fn().mockRejectedValue(new Error('failed'));
      const settings: TaskSettingsV2 = {
        version: 2,
        initialDelayDuration: undefined,
        cadence: '* * * * * *',
        timeoutAfterDuration: Duration.fromMillis(60000).toISO(),
      };
      const checkFrequency = Duration.fromObject({ milliseconds: 100 });
      const worker = new TaskWorker('task1', fn, knex, logger, checkFrequency);
      worker.start(settings);

      await waitForExpect(() => {
        expect(fn).toBeCalledTimes(3);
      });
    },
    60_000,
  );

  it.each(databases.eachSupportedId())(
    'does not clobber ticket lock when stolen, %p',
    async databaseId => {
      const knex = await databases.init(databaseId);
      await migrateBackendTasks(knex);

      const fn = jest.fn(
        async () => new Promise<void>(resolve => setTimeout(resolve, 50)),
      );
      const settings: TaskSettingsV2 = {
        version: 2,
        initialDelayDuration: undefined,
        cadence: '* * * * * *',
        timeoutAfterDuration: Duration.fromMillis(60000).toISO(),
      };

      const worker = new TaskWorker('task1', fn, knex, logger);
      await worker.persistTask(settings);

      await waitForExpect(async () => {
        await expect(worker.findReadyTask()).resolves.toEqual({
          result: 'ready',
          settings,
        });
      });

      await expect(worker.tryClaimTask('ticket', settings)).resolves.toBe(true);

      let row = (await knex<DbTasksRow>(DB_TASKS_TABLE))[0];
      expect(row).toEqual(
        expect.objectContaining({
          id: 'task1',
          current_run_ticket: 'ticket',
          current_run_started_at: expect.anything(),
          current_run_expires_at: expect.anything(),
        }),
      );

      await knex<DbTasksRow>(DB_TASKS_TABLE)
        .where('id', '=', 'task1')
        .update({ current_run_ticket: 'stolen' });

      await expect(worker.tryReleaseTask('ticket', settings)).resolves.toBe(
        false,
      );

      row = (await knex<DbTasksRow>(DB_TASKS_TABLE))[0];
      expect(row).toEqual(
        expect.objectContaining({
          id: 'task1',
          current_run_ticket: 'stolen',
          current_run_started_at: expect.anything(),
          current_run_expires_at: expect.anything(),
        }),
      );
    },
    60_000,
  );

  it.each(databases.eachSupportedId())(
    'gracefully handles a disappeared task row, %p',
    async databaseId => {
      const knex = await databases.init(databaseId);
      await migrateBackendTasks(knex);

      const fn = jest.fn(async () => {});
      const settings: TaskSettingsV2 = {
        version: 2,
        initialDelayDuration: undefined,
        cadence: '* * * * * *',
        timeoutAfterDuration: Duration.fromMillis(60000).toISO(),
      };

      const worker1 = new TaskWorker('task1', fn, knex, logger);
      await worker1.persistTask(settings);
      await knex<DbTasksRow>(DB_TASKS_TABLE).where('id', '=', 'task1').delete();
      await expect(worker1.findReadyTask()).resolves.toEqual({
        result: 'abort',
      });

      const worker2 = new TaskWorker('task2', fn, knex, logger);
      await worker2.persistTask(settings);

      await waitForExpect(async () => {
        await expect(worker2.findReadyTask()).resolves.toEqual({
          result: 'ready',
          settings,
        });
      });

      await knex<DbTasksRow>(DB_TASKS_TABLE).where('id', '=', 'task2').delete();
      await expect(worker2.tryClaimTask('ticket', settings)).resolves.toBe(
        false,
      );

      const worker3 = new TaskWorker('task3', fn, knex, logger);
      await worker3.persistTask(settings);

      await waitForExpect(async () => {
        await expect(worker3.findReadyTask()).resolves.toEqual({
          result: 'ready',
          settings,
        });
      });

      await expect(worker3.tryClaimTask('ticket', settings)).resolves.toBe(
        true,
      );
      await knex<DbTasksRow>(DB_TASKS_TABLE).where('id', '=', 'task3').delete();
      await expect(worker3.tryReleaseTask('ticket', settings)).resolves.toBe(
        false,
      );
    },
    60_000,
  );

  it.each(databases.eachSupportedId())(
    'respects initialDelayDuration per worker, %p',
    async databaseId => {
      const knex = await databases.init(databaseId);
      await migrateBackendTasks(knex);

      const abortFirst = new AbortController();
      const settings: TaskSettingsV2 = {
        version: 2,
        initialDelayDuration: 'PT0.3S',
        cadence: 'PT0.1S',
        timeoutAfterDuration: 'PT10S',
      };

      // Start a single worker and make sure it waits and then goes to work
      const fn1 = jest.fn(async () => {});
      const worker1 = new TaskWorker(
        'task1',
        fn1,
        knex,
        logger,
        Duration.fromMillis(10),
      );
      await worker1.start(settings, { signal: abortFirst.signal });

      expect(fn1).toBeCalledTimes(0);
      await new Promise(resolve => setTimeout(resolve, 250));
      expect(fn1).toBeCalledTimes(0);
      await new Promise(resolve => setTimeout(resolve, 100));
      expect(fn1.mock.calls.length).toBeGreaterThan(0);

      // Start a second worker and make sure it waits but the first worker still works along
      const fn2 = jest.fn();
      const promise2 = new Promise(resolve => fn2.mockImplementation(resolve));
      const worker2 = new TaskWorker(
        'task1',
        fn2,
        knex,
        logger,
        Duration.fromMillis(10),
      );
      await worker2.start(settings);

      // We eventually abort the first worker just to make sure that the second
      // one for sure will get a go at running the task
      setTimeout(() => abortFirst.abort(), 1000);

      const before = fn1.mock.calls.length;
      await promise2;
      expect(fn1.mock.calls.length).toBeGreaterThan(before);
    },
    60_000,
  );
});
