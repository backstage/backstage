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
import { migrateBackendTasks } from '../database/migrateBackendTasks';
import { PluginTaskSchedulerImpl } from './PluginTaskSchedulerImpl';
import { ConflictError, NotFoundError } from '@backstage/errors';
import { AbortSignal } from 'node-abort-controller';

jest.useFakeTimers();

function defer() {
  let resolve = () => {};
  const promise = new Promise<void>(_resolve => {
    resolve = _resolve;
  });
  return { promise, resolve };
}

describe('PluginTaskManagerImpl', () => {
  const databases = TestDatabases.create({
    ids: ['POSTGRES_13', 'POSTGRES_9', 'SQLITE_3'],
  });

  async function init(databaseId: TestDatabaseId) {
    const knex = await databases.init(databaseId);
    await migrateBackendTasks(knex);
    const manager = new PluginTaskSchedulerImpl(
      async () => knex,
      getVoidLogger(),
    );
    return { knex, manager };
  }

  // This is just to test the wrapper code; most of the actual tests are in
  // TaskWorker.test.ts
  describe('scheduleTask', () => {
    it.each(databases.eachSupportedId())(
      'can run the v1 happy path, %p',
      async databaseId => {
        const { manager } = await init(databaseId);

        const fn = jest.fn();
        const promise = new Promise(resolve => fn.mockImplementation(resolve));
        await manager.scheduleTask({
          id: 'task1',
          timeout: Duration.fromMillis(5000),
          frequency: Duration.fromMillis(5000),
          fn,
        });

        await promise;
        expect(fn).toHaveBeenCalledWith(expect.any(AbortSignal));
      },
      60_000,
    );

    it.each(databases.eachSupportedId())(
      'can run the v2 happy path, %p',
      async databaseId => {
        const { manager } = await init(databaseId);

        const fn = jest.fn();
        const promise = new Promise(resolve => fn.mockImplementation(resolve));
        await manager.scheduleTask({
          id: 'task2',
          timeout: Duration.fromMillis(5000),
          frequency: { cron: '* * * * * *' },
          fn,
        });

        await promise;
        expect(fn).toHaveBeenCalledWith(expect.any(AbortSignal));
      },
      60_000,
    );
  });

  describe('triggerTask', () => {
    it.each(databases.eachSupportedId())(
      'can manually trigger a task, %p',
      async databaseId => {
        const { manager } = await init(databaseId);

        const fn = jest.fn();
        const promise = new Promise(resolve => fn.mockImplementation(resolve));
        await manager.scheduleTask({
          id: 'task1',
          timeout: Duration.fromMillis(5000),
          frequency: Duration.fromObject({ years: 1 }),
          initialDelay: Duration.fromObject({ years: 1 }),
          fn,
        });

        await manager.triggerTask('task1');
        jest.advanceTimersByTime(5000);

        await promise;
        expect(fn).toHaveBeenCalledWith(expect.any(AbortSignal));
      },
      60_000,
    );

    it.each(databases.eachSupportedId())(
      'cant trigger a non-existent task, %p',
      async databaseId => {
        const { manager } = await init(databaseId);

        const fn = jest.fn();
        await manager.scheduleTask({
          id: 'task1',
          timeout: Duration.fromMillis(5000),
          frequency: Duration.fromObject({ years: 1 }),
          fn,
        });

        await expect(() => manager.triggerTask('task2')).rejects.toThrow(
          NotFoundError,
        );
      },
      60_000,
    );

    it.each(databases.eachSupportedId())(
      'cant trigger a running task, %p',
      async databaseId => {
        const { manager } = await init(databaseId);

        const { promise, resolve } = defer();

        await manager.scheduleTask({
          id: 'task1',
          timeout: Duration.fromMillis(5000),
          frequency: Duration.fromObject({ years: 1 }),
          fn: async () => {
            resolve();
            await new Promise(r => setTimeout(r, 20000));
          },
        });

        await promise;
        await expect(() => manager.triggerTask('task1')).rejects.toThrow(
          ConflictError,
        );
      },
      60_000,
    );
  });

  // This is just to test the wrapper code; most of the actual tests are in
  // TaskWorker.test.ts
  describe('createScheduledTaskRunner', () => {
    it.each(databases.eachSupportedId())(
      'can run the happy path, %p',
      async databaseId => {
        const { manager } = await init(databaseId);

        const fn = jest.fn();
        const promise = new Promise(resolve => fn.mockImplementation(resolve));
        await manager
          .createScheduledTaskRunner({
            timeout: Duration.fromMillis(5000),
            frequency: Duration.fromMillis(5000),
          })
          .run({
            id: 'task1',
            fn,
          });

        await promise;
        expect(fn).toHaveBeenCalledWith(expect.any(AbortSignal));
      },
      60_000,
    );
  });
});
