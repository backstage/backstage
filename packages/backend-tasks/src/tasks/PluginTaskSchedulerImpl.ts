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

import { Knex } from 'knex';
import { Duration } from 'luxon';
import { Logger } from 'winston';
import { LocalTaskWorker } from './LocalTaskWorker';
import { TaskWorker } from './TaskWorker';
import {
  PluginTaskScheduler,
  TaskInvocationDefinition,
  TaskRunner,
  TaskScheduleDefinition,
} from './types';
import { validateId } from './util';

/**
 * Implements the actual task management.
 */
export class PluginTaskSchedulerImpl implements PluginTaskScheduler {
  private readonly localTasksById = new Map<string, LocalTaskWorker>();

  constructor(
    private readonly databaseFactory: () => Promise<Knex>,
    private readonly logger: Logger,
  ) {}

  async triggerTask(id: string): Promise<void> {
    const localTask = this.localTasksById.get(id);
    if (localTask) {
      localTask.trigger();
      return;
    }

    const knex = await this.databaseFactory();
    await TaskWorker.trigger(knex, id);
  }

  async scheduleTask(
    task: TaskScheduleDefinition & TaskInvocationDefinition,
  ): Promise<void> {
    validateId(task.id);
    const scope = task.scope ?? 'global';

    if (scope === 'global') {
      const knex = await this.databaseFactory();
      const worker = new TaskWorker(
        task.id,
        task.fn,
        knex,
        this.logger.child({ task: task.id }),
      );

      await worker.start(
        {
          version: 2,
          cadence: parseDuration(task.frequency),
          initialDelayDuration:
            task.initialDelay && parseDuration(task.initialDelay),
          timeoutAfterDuration: parseDuration(task.timeout),
        },
        {
          signal: task.signal,
        },
      );
    } else {
      const worker = new LocalTaskWorker(task.id, task.fn, this.logger);

      worker.start(
        {
          version: 2,
          cadence: parseDuration(task.frequency),
          initialDelayDuration:
            task.initialDelay && parseDuration(task.initialDelay),
          timeoutAfterDuration: parseDuration(task.timeout),
        },
        {
          signal: task.signal,
        },
      );

      this.localTasksById.set(task.id, worker);
    }
  }

  createScheduledTaskRunner(schedule: TaskScheduleDefinition): TaskRunner {
    return {
      run: async task => {
        await this.scheduleTask({ ...task, ...schedule });
      },
    };
  }
}

export function parseDuration(
  frequency: TaskScheduleDefinition['frequency'],
): string {
  if ('cron' in frequency) {
    return frequency.cron;
  }

  if (Duration.isDuration(frequency)) {
    return frequency.toISO();
  }

  return Duration.fromObject(frequency).toISO();
}
