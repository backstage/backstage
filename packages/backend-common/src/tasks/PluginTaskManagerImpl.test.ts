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

import { TestDatabases } from '@backstage/backend-test-utils';
import { Duration } from 'luxon';
import { migrateBackendCommon } from '../database/migrateBackendCommon';
import { getVoidLogger } from '../logging';
import { PluginTaskManagerImpl } from './PluginTaskManagerImpl';

describe('PluginTaskManagerImpl', () => {
  const databases = TestDatabases.create({
    ids: ['POSTGRES_13', 'POSTGRES_9', 'SQLITE_3'],
  });

  describe('locking', () => {
    it.each(databases.eachSupportedId())(
      'can run the happy path, %p',
      async databaseId => {
        const knex = await databases.init(databaseId);
        await migrateBackendCommon(knex);

        const manager = new PluginTaskManagerImpl(
          async () => knex,
          getVoidLogger(),
        );

        const lock1 = await manager.acquireLock('lock1', {
          timeout: Duration.fromMillis(5000),
        });
        const lock2 = await manager.acquireLock('lock2', {
          timeout: Duration.fromMillis(5000),
        });

        expect(lock1.acquired).toBe(true);
        expect(lock2.acquired).toBe(true);

        await expect(
          manager.acquireLock('lock1', {
            timeout: Duration.fromMillis(5000),
          }),
        ).resolves.toEqual({ acquired: false });

        await (lock1 as any).release();
        await (lock2 as any).release();

        const lock1Again = await manager.acquireLock('lock1', {
          timeout: Duration.fromMillis(5000),
        });
        expect(lock1Again.acquired).toBe(true);
        await (lock1Again as any).release();
      },
    );
  });
});
