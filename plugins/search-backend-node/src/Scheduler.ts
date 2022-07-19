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

import { AbortController } from 'node-abort-controller';
import { Logger } from 'winston';
import { TaskFunction, TaskRunner } from '@backstage/backend-tasks';

type TaskEnvelope = {
  task: TaskFunction;
  scheduledRunner: TaskRunner;
};

/**
 * ScheduleTaskParameters
 * @public
 */
export type ScheduleTaskParameters = {
  id: string;
  task: TaskFunction;
  scheduledRunner: TaskRunner;
};

/**
 * Scheduler responsible for all search tasks.
 * @public
 */
export class Scheduler {
  private logger: Logger;
  private schedule: { [id: string]: TaskEnvelope };
  private abortController: AbortController;
  private isRunning: boolean;

  constructor({ logger }: { logger: Logger }) {
    this.logger = logger;
    this.schedule = {};
    this.abortController = new AbortController();
    this.isRunning = false;
  }

  /**
   * Adds each task and interval to the schedule.
   * When running the tasks, the scheduler waits at least for the time specified
   * in the interval once the task was completed, before running it again.
   */
  addToSchedule({ id, task, scheduledRunner }: ScheduleTaskParameters) {
    if (this.isRunning) {
      throw new Error(
        'Cannot add task to schedule that has already been started.',
      );
    }

    if (this.schedule[id]) {
      throw new Error(`Task with id ${id} already exists.`);
    }

    this.schedule[id] = { task, scheduledRunner };
  }

  /**
   * Starts the scheduling process for each task
   */
  start() {
    this.logger.info('Starting all scheduled search tasks.');
    this.isRunning = true;
    Object.keys(this.schedule).forEach(id => {
      const { task, scheduledRunner } = this.schedule[id];
      scheduledRunner.run({
        id,
        fn: task,
        signal: this.abortController.signal,
      });
    });
  }

  /**
   * Stop all scheduled tasks.
   */
  stop() {
    this.logger.info('Stopping all scheduled search tasks.');
    this.abortController.abort();
    this.isRunning = false;
  }
}
