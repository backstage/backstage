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
import { Logger } from 'winston';
import { TaskWorker } from './TaskWorker';
import { PluginTaskScheduler, TaskDefinition } from './types';
import { validateId } from './util';

/**
 * Implements the actual task management.
 */
export class PluginTaskSchedulerImpl implements PluginTaskScheduler {
  constructor(
    private readonly databaseFactory: () => Promise<Knex>,
    private readonly logger: Logger,
  ) {}

  async scheduleTask(task: TaskDefinition): Promise<void> {
    validateId(task.id);

    const knex = await this.databaseFactory();

    const worker = new TaskWorker(task.id, task.fn, knex, this.logger);
    await worker.start(
      {
        version: 1,
        initialDelayDuration: task.initialDelay?.toISO(),
        recurringAtMostEveryDuration: task.frequency.toISO(),
        timeoutAfterDuration: task.timeout.toISO(),
      },
      {
        signal: task.signal,
      },
    );
  }
}
