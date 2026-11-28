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

import {
  TestDatabases,
  mockServices,
  startTestBackend,
} from '@backstage/backend-test-utils';
import { Duration } from 'luxon';
import waitForExpect from 'wait-for-expect';
import { DefaultSchedulerService } from './DefaultSchedulerService';
import { createTestScopedSignal } from './__testUtils__/createTestScopedSignal';
import {
  coreServices,
  createBackendPlugin,
  PluginMetadataService,
} from '@backstage/backend-plugin-api';
import { createDeferred } from '@backstage/types';
import { schedulerServiceFactory } from '../schedulerServiceFactory';
import { rootLifecycleServiceFactory } from '../../rootLifecycle/rootLifecycleServiceFactory';
import { lifecycleServiceFactory } from '../../lifecycle/lifecycleServiceFactory';
import { PluginTaskSchedulerJanitor } from './PluginTaskSchedulerJanitor';
import { metricsServiceMock } from '@backstage/backend-test-utils/alpha';

jest.setTimeout(60_000);

const databases = TestDatabases.create();

describe.each(databases.eachSupportedId())('TaskScheduler, %p', databaseId => {
  const logger = mockServices.logger.mock();
  const rootLifecycle = mockServices.rootLifecycle.mock();
  const httpRouter = mockServices.httpRouter.mock();
  const pluginMetadata = {
    getId: () => 'test',
  } satisfies PluginMetadataService;
  const testScopedSignal = createTestScopedSignal();
  const metrics = metricsServiceMock.mock();

  it('can return a working v1 plugin impl', async () => {
    const knex = await databases.init(databaseId);
    const database = mockServices.database({ knex });

    const manager = DefaultSchedulerService.create({
      database,
      logger,
      metrics,
      rootLifecycle,
      httpRouter,
      pluginMetadata,
    });
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
  });

  it('can return a working v2 plugin impl', async () => {
    const knex = await databases.init(databaseId);
    const database = mockServices.database({ knex });

    const manager = DefaultSchedulerService.create({
      database,
      logger,
      metrics,
      rootLifecycle,
      httpRouter,
      pluginMetadata,
    });
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
  });
});

describe('shutdown', () => {
  it.each(['global', 'local'] as const)(
    'stops %s tasks before plugin shutdown hooks drain',
    async scope => {
      const knex = await databases.init('SQLITE_3');
      const taskStarted = createDeferred<AbortSignal>();
      const finishTask = createDeferred<void>();
      const taskFinished = jest.fn();
      const activeTask = jest.fn(async (signal: AbortSignal) => {
        taskStarted.resolve(signal);
        await finishTask;
        taskFinished();
      });
      const waitingTask = jest.fn();
      const pluginShutdownStarted = createDeferred<void>();
      const finishPluginShutdown = createDeferred<void>();
      const rootShutdown = jest.fn();
      jest.useFakeTimers({ doNotFake: ['nextTick', 'setImmediate'] });

      const backend = await startTestBackend({
        features: [
          schedulerServiceFactory,
          rootLifecycleServiceFactory,
          lifecycleServiceFactory,
          mockServices.database.factory({ knex }),
          createBackendPlugin({
            pluginId: 'test',
            register(reg) {
              reg.registerInit({
                deps: {
                  scheduler: coreServices.scheduler,
                  lifecycle: coreServices.lifecycle,
                  rootLifecycle: coreServices.rootLifecycle,
                },
                async init({ scheduler, lifecycle, rootLifecycle }) {
                  rootLifecycle.addShutdownHook(rootShutdown);
                  lifecycle.addShutdownHook(async () => {
                    pluginShutdownStarted.resolve();
                    await finishPluginShutdown;
                    finishTask.resolve();
                  });
                  await scheduler.scheduleTask({
                    id: 'active',
                    scope,
                    frequency: { seconds: 1 },
                    timeout: { minutes: 5 },
                    fn: activeTask,
                  });
                  await scheduler.scheduleTask({
                    id: 'waiting',
                    scope,
                    initialDelay: { seconds: 30 },
                    frequency: { seconds: 1 },
                    timeout: { minutes: 5 },
                    fn: waitingTask,
                  });
                },
              });
            },
          }),
        ],
      });

      const signal = await taskStarted;
      expect(signal.aborted).toBe(false);
      const stopping = backend.stop();
      try {
        await pluginShutdownStarted;
        expect(signal.aborted).toBe(true);
        expect(taskFinished).not.toHaveBeenCalled();
        expect(rootShutdown).not.toHaveBeenCalled();

        const queries = jest.fn();
        knex.on('query', queries);
        try {
          await jest.advanceTimersByTimeAsync(60_000);
          expect(activeTask).toHaveBeenCalledTimes(1);
          expect(waitingTask).not.toHaveBeenCalled();
          expect(queries).not.toHaveBeenCalled();
        } finally {
          knex.off('query', queries);
        }
      } finally {
        finishPluginShutdown.resolve();
        finishTask.resolve();
        await stopping;
        jest.useRealTimers();
      }
      expect(taskFinished).toHaveBeenCalledTimes(1);
      expect(rootShutdown).toHaveBeenCalledTimes(1);
    },
  );

  it('stops the janitor during before-shutdown', async () => {
    const knex = await databases.init('SQLITE_3');
    const rootLifecycle = mockServices.rootLifecycle.mock();
    const start = jest
      .spyOn(PluginTaskSchedulerJanitor.prototype, 'start')
      .mockResolvedValue(undefined);
    const env = process.env as Record<string, string | undefined>;
    const previousNodeEnv = env.NODE_ENV;
    try {
      env.NODE_ENV = 'production';
      const scheduler = DefaultSchedulerService.create({
        database: mockServices.database({ knex }),
        logger: mockServices.logger.mock(),
        metrics: metricsServiceMock.mock(),
        rootLifecycle,
        httpRouter: mockServices.httpRouter.mock(),
        pluginMetadata: { getId: () => 'test' },
      });
      const signal = new AbortController();
      signal.abort();
      await scheduler.scheduleTask({
        id: 'test',
        frequency: { trigger: 'manual' },
        timeout: { minutes: 1 },
        signal: signal.signal,
        fn: jest.fn(),
      });
      expect(start).toHaveBeenCalledTimes(1);
      const janitorSignal = start.mock.calls[0][0]!;
      expect(janitorSignal.aborted).toBe(false);
      for (const [hook] of rootLifecycle.addBeforeShutdownHook.mock.calls) {
        await hook();
      }
      expect(janitorSignal.aborted).toBe(true);
      expect(rootLifecycle.addShutdownHook).not.toHaveBeenCalled();
    } finally {
      env.NODE_ENV = previousNodeEnv;
      start.mockRestore();
    }
  });
});
