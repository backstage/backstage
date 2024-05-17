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
import { Knex } from 'knex';
import { Duration } from 'luxon';
import waitForExpect from 'wait-for-expect';
import { migrateBackendTasks } from '../database/migrateBackendTasks';
import { DB_TASKS_TABLE, DbTasksRow } from '../database/tables';
import { PluginTaskSchedulerJanitor } from './PluginTaskSchedulerJanitor';
import { createTestScopedSignal } from './__testUtils__/createTestScopedSignal';

const insertTask = async (knex: Knex, task: DbTasksRow) => {
  return knex<DbTasksRow>(DB_TASKS_TABLE)
    .insert(task)
    .onConflict('id')
    .merge(['settings_json']);
};

const getTask = async (knex: Knex): Promise<DbTasksRow> => {
  return (await knex<DbTasksRow>(DB_TASKS_TABLE))[0];
};

describe('PluginTaskSchedulerJanitor', () => {
  const logger = getVoidLogger();
  const databases = TestDatabases.create({
    ids: [
      /* 'MYSQL_8' not supported yet */
      'POSTGRES_16',
      'POSTGRES_12',
      'SQLITE_3',
      'MYSQL_8',
    ],
  });
  const testScopedSignal = createTestScopedSignal();

  jest.setTimeout(60_000);

  beforeEach(() => {
    jest.resetAllMocks();
  });

  it.each(databases.eachSupportedId())(
    'Should update date if current_run_expires_at expires, %p',
    async databaseId => {
      const knex = await databases.init(databaseId);
      await migrateBackendTasks(knex);

      const dateYesterday = new Date(
        new Date().setDate(new Date().getDate() - 1),
      );

      await insertTask(knex, {
        id: 'task1',
        settings_json: '',
        next_run_start_at: new Date('2023-03-01 00:00:00'),
        current_run_ticket: 'ticket',
        current_run_started_at: dateYesterday,
        current_run_expires_at: dateYesterday,
      });

      const worker = new PluginTaskSchedulerJanitor({
        waitBetweenRuns: Duration.fromObject({ milliseconds: 20 }),
        knex,
        logger,
      });

      worker.start(testScopedSignal());

      await waitForExpect(async () => {
        await expect(getTask(knex)).resolves.toEqual(
          expect.objectContaining({
            id: 'task1',
            current_run_ticket: null,
            current_run_started_at: null,
            current_run_expires_at: null,
          }),
        );
      });
    },
  );
});
