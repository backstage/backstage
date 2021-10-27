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
import { TestDatabaseId, TestDatabases } from '@backstage/backend-test-utils';
import { Duration } from 'luxon';
import waitForExpect from 'wait-for-expect';
import { migrateBackendTasks } from '../database/migrateBackendTasks';
import { PluginTaskManagerImpl } from './PluginTaskManagerImpl';

describe('PluginTaskManagerImpl', () => {
  const databases = TestDatabases.create({
    ids: ['POSTGRES_13', 'POSTGRES_9', 'SQLITE_3'],
  });

  async function init(databaseId: TestDatabaseId) {
    const knex = await databases.init(databaseId);
    await migrateBackendTasks(knex);
    const manager = new PluginTaskManagerImpl(
      async () => knex,
      getVoidLogger(),
    );
    return { knex, manager };
  }

  // This is just to test the wrapper code; most of the actual tests are in
  // TaskWorker.test.ts
  describe('scheduleTask', () => {
    it.each(databases.eachSupportedId())(
      'can run the happy path, %p',
      async databaseId => {
        const { manager } = await init(databaseId);

        const fn = jest.fn();
        const { unschedule } = await manager.scheduleTask({
          id: 'task1',
          timeout: Duration.fromMillis(5000),
          frequency: Duration.fromMillis(5000),
          fn,
        });

        await waitForExpect(() => {
          expect(fn).toBeCalled();
        });

        await unschedule();
      },
    );
  });
});
