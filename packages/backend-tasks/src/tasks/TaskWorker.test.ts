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
import waitForExpect from 'wait-for-expect';
import { migrateBackendTasks } from '../database/migrateBackendTasks';
import { DbTasksRow, DB_TASKS_TABLE } from '../database/tables';
import { TaskWorker } from './TaskWorker';
import { TaskSettingsV2 } from './types';
import { createTestScopedSignal } from './__testUtils__/createTestScopedSignal';

jest.setTimeout(60_000);

const WAT: Record<string, string> = {
  SQLITE_3: '1',
  MYSQL_8: '2',
  POSTGRES_9: '3',
  POSTGRES_13: '4',
};

describe('TaskWorker', () => {
  const logger = getVoidLogger();
  console.log(`DEBUG: TASK_WORKER_TEST INIT`);
  const databases = TestDatabases.create({
    ids: ['POSTGRES_13', 'POSTGRES_9', 'SQLITE_3', 'MYSQL_8'],
  });
  const testScopedSignal = createTestScopedSignal();

  beforeEach(() => {
    jest.resetAllMocks();
  });

  it.each(databases.eachSupportedId())(
    'goes through the expected states, %p',
    async databaseId => {
      console.log(`DEBUG: TASK_WORKER_TEST INIT GET DB ${databaseId}`);
      const knex = await databases.init(databaseId);
      console.log(`DEBUG: TASK_WORKER_TEST INIT GOT DB ${databaseId}`);
      await migrateBackendTasks(knex);
      console.log(`DEBUG: TASK_WORKER_TEST INIT MIGRATED DB ${databaseId}`);

      const fn = jest.fn(
        async () => new Promise<void>(resolve => setTimeout(resolve, 50)),
      );
      const settings: TaskSettingsV2 = {
        version: 2,
        cadence: `*/2 * * */${WAT[databaseId]} * */10`,
        initialDelayDuration: Duration.fromObject({ seconds: 1 }).toISO()!,
        timeoutAfterDuration: Duration.fromObject({ minutes: 1 }).toISO()!,
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
        cadence: `*/2 * * */${WAT[databaseId]} * */10`,
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
        cadence: `* * * * * */${WAT[databaseId]}1`,
        timeoutAfterDuration: Duration.fromMillis(60000).toISO()!,
      };
      const checkFrequency = Duration.fromObject({ milliseconds: 100 });
      const worker = new TaskWorker('task1', fn, knex, logger, checkFrequency);
      worker.start(settings, { signal: testScopedSignal() });

      await waitForExpect(() => {
        expect(logger.error).toHaveBeenCalled();
      });
    },
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
        cadence: `* * * */${WAT[databaseId]} * */2`,
        timeoutAfterDuration: Duration.fromMillis(60000).toISO()!,
      };
      const checkFrequency = Duration.fromObject({ milliseconds: 100 });
      const worker = new TaskWorker('task1', fn, knex, logger, checkFrequency);
      worker.start(settings, { signal: testScopedSignal() });

      await waitForExpect(() => {
        expect(fn).toHaveBeenCalledTimes(3);
      });
    },
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
        cadence: `* * * */${WAT[databaseId]} * */3`,
        timeoutAfterDuration: Duration.fromMillis(60000).toISO()!,
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
        cadence: `* * * */${WAT[databaseId]} * */4`,
        timeoutAfterDuration: Duration.fromMillis(60000).toISO()!,
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

      expect(fn1).toHaveBeenCalledTimes(0);
      await new Promise(resolve => setTimeout(resolve, 250));
      expect(fn1).toHaveBeenCalledTimes(0);
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
      await worker2.start(settings, { signal: testScopedSignal() });

      // We eventually abort the first worker just to make sure that the second
      // one for sure will get a go at running the task
      setTimeout(() => abortFirst.abort(), 1000);

      const before = fn1.mock.calls.length;
      await promise2;
      expect(fn1.mock.calls.length).toBeGreaterThan(before);

      await knex.destroy();
    },
  );

  it.each(databases.eachSupportedId())(
    'next_run_start_at is always the min between schedule changes, %p',
    async databaseId => {
      const knex = await databases.init(databaseId);
      await migrateBackendTasks(knex);

      const fn = jest.fn(
        async () => new Promise<void>(resolve => setTimeout(resolve, 50)),
      );
      const settings: TaskSettingsV2 = {
        version: 2,
        cadence: `*/15 * * */${WAT[databaseId]} */5`,
        initialDelayDuration: 'PT2M',
        timeoutAfterDuration: 'PT1M',
      };

      const worker = new TaskWorker('task99', fn, knex, logger);
      await worker.persistTask(settings);
      const row1 = (await knex<DbTasksRow>(DB_TASKS_TABLE))[0];

      const settings2 = {
        ...settings,
        cadence: `*/2 * * */${WAT[databaseId]} */6`,
        initialDelayDuration: 'PT1M',
      };
      await worker.persistTask(settings2);
      const row2 = (await knex<DbTasksRow>(DB_TASKS_TABLE))[0];

      expect(row2.next_run_start_at).not.toStrictEqual(row1.next_run_start_at);

      const settings3 = { ...settings };
      await worker.persistTask(settings3);
      const row3 = (await knex<DbTasksRow>(DB_TASKS_TABLE))[0];

      expect(row3.next_run_start_at).toStrictEqual(row2.next_run_start_at);

      await knex.destroy();
    },
  );
});
