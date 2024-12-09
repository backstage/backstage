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

import { TestDatabases, mockServices } from '@backstage/backend-test-utils';
import { DatabaseJanitor } from './DatabaseJanitor';
import { applyDatabaseMigrations } from './migrations';
import { ensureStateQueueIsPopulated } from './operations/refreshState/ensureStateQueueIsPopulated';

jest.mock('./operations/refreshState/ensureStateQueueIsPopulated', () => ({
  ensureStateQueueIsPopulated: jest.fn(),
}));

describe('DatabaseJanitor', () => {
  const databases = TestDatabases.create();

  it('runs at startup', async () => {
    const knex = await databases.init('SQLITE_3');
    await applyDatabaseMigrations(knex);

    const processingInterval = jest.fn().mockReturnValue(100);
    const logger = mockServices.logger.mock();
    const scheduler = mockServices.scheduler.mock();

    await DatabaseJanitor.create({
      knex,
      processingInterval,
      logger,
      scheduler,
    });

    expect(processingInterval).toHaveBeenCalled();
    expect(scheduler.scheduleTask).toHaveBeenCalled();
    expect(ensureStateQueueIsPopulated).toHaveBeenCalledWith(
      knex,
      expect.any(Number),
    );
  });
});
