/*
 * Copyright 2022 The Backstage Authors
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

import { LoggerService } from '@backstage/backend-plugin-api';
import { SchedulerServiceTaskFunction } from '@backstage/backend-plugin-api';
import { ConflictError } from '@backstage/errors';
import { CronTime } from 'cron';
import { DateTime, Duration } from 'luxon';
import { TaskSettingsV2, TaskApiTasksResponse } from './types';
import { delegateAbortController, serializeError, sleep } from './util';

/**
 * Implements tasks that run locally without cross-host collaboration.
 *
 * @private
 */
export class LocalTaskWorker {
  private abortWait: AbortController | undefined;
  #taskState: Exclude<TaskApiTasksResponse['taskState'], null> = {
    status: 'idle',
  };
  #workerState: TaskApiTasksResponse['workerState'] = {
    status: 'idle',
  };

  private readonly taskId: string;
  private readonly fn: SchedulerServiceTaskFunction;
  private readonly logger: LoggerService;

  constructor(
    taskId: string,
    fn: SchedulerServiceTaskFunction,
    logger: LoggerService,
  ) {
    this.taskId = taskId;
    this.fn = fn;
    this.logger = logger;
  }

  start(settings: TaskSettingsV2, options: { signal: AbortSignal }) {
    this.logger.info(
      `Registered scheduled task: ${this.taskId}, ${JSON.stringify(settings)}`,
    );

    (async () => {
      let attemptNum = 1;
      for (;;) {
        try {
          await this.performInitialWait(settings, options.signal);

          while (!options.signal.aborted) {
            const startTime = process.hrtime();
            await this.runOnce(settings, options.signal);
            const timeTaken = process.hrtime(startTime);
            await this.waitUntilNext(
              settings,
              (timeTaken[0] + timeTaken[1] / 1e9) * 1000,
              options.signal,
            );
          }

          this.logger.info(`Task worker finished: ${this.taskId}`);
          attemptNum = 0;
          break;
        } catch (e) {
          attemptNum += 1;
          this.logger.warn(
            `Task worker failed unexpectedly, attempt number ${attemptNum}, ${e}`,
          );
          await sleep(Duration.fromObject({ seconds: 1 }));
        }
      }
    })();
  }

  trigger(): void {
    if (!this.abortWait) {
      throw new ConflictError(`Task ${this.taskId} is currently running`);
    }
    this.abortWait.abort();
  }

  taskState(): TaskApiTasksResponse['taskState'] {
    return this.#taskState;
  }

  workerState(): TaskApiTasksResponse['workerState'] {
    return this.#workerState;
  }

  /**
   * Does the once-at-startup initial wait, if configured.
   */
  private async performInitialWait(
    settings: TaskSettingsV2,
    signal: AbortSignal,
  ): Promise<void> {
    if (settings.initialDelayDuration) {
      const parsedDuration = Duration.fromISO(settings.initialDelayDuration);

      this.#taskState = {
        status: 'idle',
        startsAt: DateTime.utc().plus(parsedDuration).toISO()!,
        lastRunEndedAt: this.#taskState.lastRunEndedAt,
        lastRunError: this.#taskState.lastRunError,
      };
      this.#workerState = {
        status: 'initial-wait',
      };

      await this.sleep(parsedDuration, signal);
    }
  }

  /**
   * Makes a single attempt at running the task to completion.
   */
  private async runOnce(
    settings: TaskSettingsV2,
    signal: AbortSignal,
  ): Promise<void> {
    // Abort the task execution either if the worker is stopped, or if the
    // task timeout is hit
    const taskAbortController = delegateAbortController(signal);
    const timeoutDuration = Duration.fromISO(settings.timeoutAfterDuration);
    const timeoutHandle = setTimeout(() => {
      taskAbortController.abort();
    }, timeoutDuration.as('milliseconds'));

    this.#taskState = {
      status: 'running',
      startedAt: DateTime.utc().toISO()!,
      timesOutAt: DateTime.utc().plus(timeoutDuration).toISO()!,
      lastRunEndedAt: this.#taskState.lastRunEndedAt,
      lastRunError: this.#taskState.lastRunError,
    };
    this.#workerState = {
      status: 'running',
    };

    try {
      await this.fn(taskAbortController.signal);
      this.#taskState.lastRunEndedAt = DateTime.utc().toISO()!;
      this.#taskState.lastRunError = undefined;
    } catch (e) {
      this.#taskState.lastRunEndedAt = DateTime.utc().toISO()!;
      this.#taskState.lastRunError = serializeError(e);
    }

    // release resources
    clearTimeout(timeoutHandle);
    taskAbortController.abort();
  }

  /**
   * Sleeps until it's time to run the task again.
   */
  private async waitUntilNext(
    settings: TaskSettingsV2,
    lastRunMillis: number,
    signal: AbortSignal,
  ) {
    if (signal.aborted) {
      return;
    }

    const isCron = !settings.cadence.startsWith('P');
    let dt: number;

    if (isCron) {
      const nextRun = +new CronTime(settings.cadence).sendAt().toJSDate();
      dt = nextRun - Date.now();
    } else {
      dt =
        Duration.fromISO(settings.cadence).as('milliseconds') - lastRunMillis;
    }

    dt = Math.max(dt, 0);
    const startsAt = DateTime.now().plus(Duration.fromMillis(dt));

    this.#taskState = {
      status: 'idle',
      startsAt: startsAt.toISO()!,
      lastRunEndedAt: this.#taskState.lastRunEndedAt,
      lastRunError: this.#taskState.lastRunError,
    };
    this.#workerState = {
      status: 'idle',
    };

    this.logger.debug(
      `task: ${this.taskId} will next occur around ${startsAt}`,
    );

    await this.sleep(Duration.fromMillis(dt), signal);
  }

  private async sleep(
    duration: Duration,
    abortSignal: AbortSignal,
  ): Promise<void> {
    this.abortWait = delegateAbortController(abortSignal);
    await sleep(duration, this.abortWait.signal);
    this.abortWait.abort(); // cleans up resources
    this.abortWait = undefined;
  }
}
