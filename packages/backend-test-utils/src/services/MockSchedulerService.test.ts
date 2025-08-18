/*
 * Copyright 2025 The Backstage Authors
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
  coreServices,
  createBackendPlugin,
} from '@backstage/backend-plugin-api';
import { startTestBackend } from '../wiring';
import { MockSchedulerService } from './MockSchedulerService';
import { mockServices } from './mockServices';
import { setTimeout } from 'timers/promises';

const baseOpts = {
  frequency: { seconds: 10 },
  timeout: { seconds: 10 },
};

describe('MockSchedulerService', () => {
  it('should run a task', async () => {
    const scheduler = new MockSchedulerService();
    expect(scheduler).toBeDefined();

    const taskFn = jest.fn();
    scheduler.scheduleTask({
      ...baseOpts,
      id: 'test',
      fn: taskFn,
    });

    expect(taskFn).not.toHaveBeenCalled();

    await scheduler.triggerTask('test');

    expect(taskFn).toHaveBeenCalled();
  });

  it('should run tasks on startup', async () => {
    const testFnPlain = jest.fn();
    const testFnInitialDelay = jest.fn();
    const testFnManual = jest.fn();
    const testFnLocal = jest.fn();

    // Relying on the fact that the mock scheduler service is used by default
    await startTestBackend({
      features: [
        createBackendPlugin({
          pluginId: 'tester',
          register(reg) {
            reg.registerInit({
              deps: { scheduler: coreServices.scheduler },
              async init({ scheduler }) {
                scheduler.scheduleTask({
                  ...baseOpts,
                  id: 'test-plain',
                  fn: testFnPlain,
                });
                scheduler.scheduleTask({
                  ...baseOpts,
                  id: 'test-local',
                  scope: 'local',
                  fn: testFnLocal,
                });

                // Should not run by default
                scheduler.scheduleTask({
                  ...baseOpts,
                  id: 'test-with-initial-delay',
                  initialDelay: { seconds: 1 },
                  fn: testFnInitialDelay,
                });
                scheduler.scheduleTask({
                  ...baseOpts,
                  id: 'test-manual',
                  frequency: { trigger: 'manual' },
                  fn: testFnManual,
                });
              },
            });
          },
        }),
      ],
    });

    expect(testFnPlain).toHaveBeenCalled();
    expect(testFnLocal).toHaveBeenCalled();
    expect(testFnInitialDelay).not.toHaveBeenCalled();
    expect(testFnManual).not.toHaveBeenCalled();
  });

  it('should not run tasks on startup if skipped', async () => {
    const testFnPlain = jest.fn();

    await startTestBackend({
      features: [
        new MockSchedulerService().factory({ skipTaskRunOnStartup: true }),
        createBackendPlugin({
          pluginId: 'tester',
          register(reg) {
            reg.registerInit({
              deps: { scheduler: coreServices.scheduler },
              async init({ scheduler }) {
                scheduler.scheduleTask({
                  ...baseOpts,
                  id: 'test-plain',
                  fn: testFnPlain,
                });
              },
            });
          },
        }),
      ],
    });

    expect(testFnPlain).not.toHaveBeenCalled();
  });

  it('should run all tasks on startup if configured', async () => {
    const testFnPlain = jest.fn();
    const testFnInitialDelay = jest.fn();
    const testFnManual = jest.fn();
    const testFnLocal = jest.fn();

    await startTestBackend({
      features: [
        mockServices.scheduler.factory({
          includeManualTasksOnStartup: true,
          includeInitialDelayedTasksOnStartup: true,
        }),
        createBackendPlugin({
          pluginId: 'tester',
          register(reg) {
            reg.registerInit({
              deps: { scheduler: coreServices.scheduler },
              async init({ scheduler }) {
                scheduler.scheduleTask({
                  ...baseOpts,
                  id: 'test-plain',
                  fn: testFnPlain,
                });
                scheduler.scheduleTask({
                  ...baseOpts,
                  id: 'test-local',
                  scope: 'local',
                  fn: testFnLocal,
                });

                // Should not run by default
                scheduler.scheduleTask({
                  ...baseOpts,
                  id: 'test-with-initial-delay',
                  initialDelay: { seconds: 1 },
                  fn: testFnInitialDelay,
                });
                scheduler.scheduleTask({
                  ...baseOpts,
                  id: 'test-manual',
                  frequency: { trigger: 'manual' },
                  fn: testFnManual,
                });
              },
            });
          },
        }),
      ],
    });

    expect(testFnPlain).toHaveBeenCalled();
    expect(testFnLocal).toHaveBeenCalled();
    expect(testFnInitialDelay).toHaveBeenCalled();
    expect(testFnManual).toHaveBeenCalled();
  });

  it('should wait for a specific task to complete', async () => {
    const scheduler = new MockSchedulerService();
    const taskFn = jest.fn();
    scheduler.scheduleTask({
      ...baseOpts,
      id: 'test',
      fn: taskFn,
    });

    const wait = scheduler.waitForTask('test');

    const isDone = () =>
      Promise.race([wait.then(() => true), setTimeout(1, false)]);

    expect(taskFn).not.toHaveBeenCalled();
    await expect(isDone()).resolves.toBe(false);

    await scheduler.triggerTask('test');

    expect(taskFn).toHaveBeenCalled();
    await expect(isDone()).resolves.toBe(true);
  });

  it('should abort tasks when shutting down', async () => {
    let taskSignal: AbortSignal | undefined;

    const backend = await startTestBackend({
      features: [
        mockServices.scheduler.factory({
          includeManualTasksOnStartup: true,
          includeInitialDelayedTasksOnStartup: true,
        }),
        createBackendPlugin({
          pluginId: 'tester',
          register(reg) {
            reg.registerInit({
              deps: { scheduler: coreServices.scheduler },
              async init({ scheduler }) {
                scheduler.scheduleTask({
                  ...baseOpts,
                  id: 'test-plain',
                  fn: async signal => {
                    taskSignal = signal;
                  },
                });
              },
            });
          },
        }),
      ],
    });

    expect(taskSignal).toBeDefined();
    expect(taskSignal?.aborted).toBe(false);
    await backend.stop();
    expect(taskSignal?.aborted).toBe(true);
  });
});
