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
import { TaskSettingsV1 } from './types';

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
      const settings: TaskSettingsV1 = {
        version: 1,
        initialDelayDuration: Duration.fromMillis(1000).toISO(),
        recurringAtMostEveryDuration: Duration.fromMillis(2000).toISO(),
        timeoutAfterDuration: Duration.fromMillis(60000).toISO(),
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
        version: 1,
        initialDelayDuration: 'PT1S',
        recurringAtMostEveryDuration: 'PT2S',
        timeoutAfterDuration: 'PT60S',
      });

      await expect(worker.findReadyTask()).resolves.toEqual({
        result: 'not-ready-yet',
      });

      waitForExpect(async () => {
        await expect(worker.findReadyTask()).resolves.toEqual({
          result: 'ready',
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
    'runs tasks more than once even when the task throws, %p',
    async databaseId => {
      const knex = await databases.init(databaseId);
      await migrateBackendTasks(knex);

      const fn = jest.fn().mockRejectedValue(new Error('failed'));
      const settings: TaskSettingsV1 = {
        version: 1,
        initialDelayDuration: undefined,
        recurringAtMostEveryDuration: Duration.fromMillis(0).toISO(),
        timeoutAfterDuration: Duration.fromMillis(60000).toISO(),
      };

      const worker = new TaskWorker('task1', fn, knex, logger);
      worker.start(settings);

      waitForExpect(() => {
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
      const settings: TaskSettingsV1 = {
        version: 1,
        recurringAtMostEveryDuration: Duration.fromMillis(0).toISO(),
        timeoutAfterDuration: Duration.fromMillis(60000).toISO(),
      };

      const worker = new TaskWorker('task1', fn, knex, logger);
      await worker.persistTask(settings);
      await expect(worker.findReadyTask()).resolves.toEqual({
        result: 'ready',
        settings,
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
      const settings: TaskSettingsV1 = {
        version: 1,
        recurringAtMostEveryDuration: Duration.fromMillis(0).toISO(),
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
      await expect(worker2.findReadyTask()).resolves.toEqual({
        result: 'ready',
        settings,
      });
      await knex<DbTasksRow>(DB_TASKS_TABLE).where('id', '=', 'task2').delete();
      await expect(worker2.tryClaimTask('ticket', settings)).resolves.toBe(
        false,
      );

      const worker3 = new TaskWorker('task3', fn, knex, logger);
      await worker3.persistTask(settings);
      await expect(worker3.findReadyTask()).resolves.toEqual({
        result: 'ready',
        settings,
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
});
