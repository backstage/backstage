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
  createServiceFactory,
  SchedulerService,
  SchedulerServiceTaskDescriptor,
  SchedulerServiceTaskInvocationDefinition,
  SchedulerServiceTaskRunner,
  SchedulerServiceTaskScheduleDefinition,
} from '@backstage/backend-plugin-api';
import { createDeferred, DeferredPromise } from '@backstage/types';

export class MockSchedulerService implements SchedulerService {
  readonly #tasks = new Map<
    string,
    SchedulerServiceTaskInvocationDefinition &
      SchedulerServiceTaskScheduleDefinition & {
        descriptor: SchedulerServiceTaskDescriptor;
        abortControllers: AbortController;
      }
  >();
  readonly #runningTasks = new Set<string>();
  readonly #deferredTaskCompletions = new Map<string, DeferredPromise<void>>();

  /**
   * Creates a service factory for this mock scheduler instance, which can be installed in a test backend
   */
  factory(options?: {
    skipTaskRunOnStartup?: boolean;
    includeManualTasksOnStartup?: boolean;
    includeInitialDelayedTasksOnStartup?: boolean;
  }) {
    return createServiceFactory({
      service: coreServices.scheduler,
      deps: { lifecycle: coreServices.lifecycle },
      factory: async ({ lifecycle }) => {
        if (!options?.skipTaskRunOnStartup) {
          lifecycle.addStartupHook(async () => {
            await this.#triggerAllTasks({
              includeManualTasks: options?.includeManualTasksOnStartup,
              includeInitialDelayedTasks:
                options?.includeInitialDelayedTasksOnStartup,
            });
          });
        }
        lifecycle.addShutdownHook(async () => {
          await this.#shutdownAllTasks();
        });
        return this;
      },
    });
  }

  createScheduledTaskRunner(
    schedule: SchedulerServiceTaskScheduleDefinition,
  ): SchedulerServiceTaskRunner {
    return {
      run: async task => {
        await this.scheduleTask({ ...task, ...schedule });
      },
    };
  }

  async getScheduledTasks(): Promise<SchedulerServiceTaskDescriptor[]> {
    return Array.from(this.#tasks.values()).map(({ descriptor }) => descriptor);
  }

  async scheduleTask(
    task: SchedulerServiceTaskScheduleDefinition &
      SchedulerServiceTaskInvocationDefinition,
  ): Promise<void> {
    this.#tasks.set(task.id, {
      ...task,
      descriptor: {
        id: task.id,
        scope: task.scope ?? 'global',
        settings: { version: 1 },
      },
      abortControllers: new AbortController(),
    });
  }

  async triggerTask(id: string): Promise<void> {
    const task = this.#tasks.get(id);
    if (!task) {
      throw new Error(`Task ${id} not found`);
    }
    if (this.#runningTasks.has(id)) {
      return;
    }
    this.#runningTasks.add(id);
    try {
      await task.fn(task.abortControllers.signal);
      this.#deferredTaskCompletions.get(id)?.resolve();
    } catch (error) {
      this.#deferredTaskCompletions.get(id)?.reject(error);
    } finally {
      this.#deferredTaskCompletions.delete(id);
      this.#runningTasks.delete(id);
    }
  }

  /**
   * Trigger all tasks that match the given options, and wait for them to complete.
   *
   * @param options - The options to filter the tasks to trigger
   */
  async #triggerAllTasks(options?: {
    scope?: 'all' | 'global' | 'local';
    includeInitialDelayedTasks?: boolean;
    includeManualTasks?: boolean;
  }): Promise<void> {
    const {
      scope = 'all',
      includeManualTasks = false,
      includeInitialDelayedTasks = false,
    } = options ?? {};

    const selectedTaskIds = new Array<string>();
    for (const task of this.#tasks.values()) {
      if (task.initialDelay && !includeInitialDelayedTasks) {
        continue;
      }
      if (
        'trigger' in task.frequency &&
        task.frequency.trigger === 'manual' &&
        !includeManualTasks
      ) {
        continue;
      }
      if (scope === 'all' || scope === task.scope) {
        selectedTaskIds.push(task.id);
      }
    }

    await Promise.all(selectedTaskIds.map(id => this.triggerTask(id)));
  }

  async #shutdownAllTasks() {
    for (const task of this.#tasks.values()) {
      task.abortControllers.abort();
    }
  }

  /**
   * Wait for the task with the given ID to complete.
   *
   * If the task has not yet been scheduled or started, this will wait for it to be scheduled, started, and completed
   *
   * @param id - The task ID to wait for
   * @returns A promise that resolves when the task is completed
   */
  async waitForTask(id: string): Promise<void> {
    const existing = this.#deferredTaskCompletions.get(id);
    if (existing) {
      return existing;
    }
    const deferred = createDeferred<void>();
    this.#deferredTaskCompletions.set(id, deferred);
    return deferred;
  }
}
