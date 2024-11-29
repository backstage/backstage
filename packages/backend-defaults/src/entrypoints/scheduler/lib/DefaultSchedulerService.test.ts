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

import { TestDatabases, mockServices } from '@backstage/backend-test-utils';
import { Duration } from 'luxon';
import waitForExpect from 'wait-for-expect';
import { DefaultSchedulerService } from './DefaultSchedulerService';
import { createTestScopedSignal } from './__testUtils__/createTestScopedSignal';

jest.setTimeout(60_000);

describe('TaskScheduler', () => {
  const logger = mockServices.logger.mock();
  const databases = TestDatabases.create();
  const testScopedSignal = createTestScopedSignal();

  it.each(databases.eachSupportedId())(
    'can return a working v1 plugin impl, %p',
    async databaseId => {
      const knex = await databases.init(databaseId);
      const database = mockServices.database({ knex });

      const manager = DefaultSchedulerService.create({ database, logger });
      const fn = jest.fn();

      await manager.scheduleTask({
        id: 'task1',
        timeout: Duration.fromMillis(5000),
        frequency: Duration.fromMillis(5000),
        signal: testScopedSignal(),
        fn,
      });

      await waitForExpect(() => {
        expect(fn).toHaveBeenCalled();
      });
    },
  );

  it.each(databases.eachSupportedId())(
    'can return a working v2 plugin impl, %p',
    async databaseId => {
      const knex = await databases.init(databaseId);
      const database = mockServices.database({ knex });

      const manager = DefaultSchedulerService.create({ database, logger });
      const fn = jest.fn();

      await manager.scheduleTask({
        id: 'task2',
        timeout: Duration.fromMillis(5000),
        frequency: { cron: '* * * * * *' },
        signal: testScopedSignal(),
        fn,
      });

      await waitForExpect(() => {
        expect(fn).toHaveBeenCalled();
      });
    },
  );
});
