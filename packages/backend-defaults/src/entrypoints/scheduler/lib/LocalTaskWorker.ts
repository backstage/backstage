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
import { TaskSettingsV2 } from './types';
import { delegateAbortController, sleep } from './util';

/**
 * Implements tasks that run locally without cross-host collaboration.
 *
 * @private
 */
export class LocalTaskWorker {
  private abortWait: AbortController | undefined;

  constructor(
    private readonly taskId: string,
    private readonly fn: SchedulerServiceTaskFunction,
    private readonly logger: LoggerService,
  ) {}

  start(settings: TaskSettingsV2, options?: { signal?: AbortSignal }) {
    this.logger.info(
      `Task worker starting: ${this.taskId}, ${JSON.stringify(settings)}`,
    );

    (async () => {
      let attemptNum = 1;
      for (;;) {
        try {
          if (settings.initialDelayDuration) {
            await this.sleep(
              Duration.fromISO(settings.initialDelayDuration),
              options?.signal,
            );
          }

          while (!options?.signal?.aborted) {
            const startTime = process.hrtime();
            await this.runOnce(settings, options?.signal);
            const timeTaken = process.hrtime(startTime);
            await this.waitUntilNext(
              settings,
              (timeTaken[0] + timeTaken[1] / 1e9) * 1000,
              options?.signal,
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

  /**
   * Makes a single attempt at running the task to completion.
   */
  private async runOnce(
    settings: TaskSettingsV2,
    signal?: AbortSignal,
  ): Promise<void> {
    // Abort the task execution either if the worker is stopped, or if the
    // task timeout is hit
    const taskAbortController = delegateAbortController(signal);
    const timeoutHandle = setTimeout(() => {
      taskAbortController.abort();
    }, Duration.fromISO(settings.timeoutAfterDuration).as('milliseconds'));

    try {
      await this.fn(taskAbortController.signal);
    } catch (e) {
      // ignore intentionally
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
    signal?: AbortSignal,
  ) {
    if (signal?.aborted) {
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

    this.logger.debug(
      `task: ${this.taskId} will next occur around ${DateTime.now().plus(
        Duration.fromMillis(dt),
      )}`,
    );

    await this.sleep(Duration.fromMillis(dt), signal);
  }

  private async sleep(
    duration: Duration,
    abortSignal?: AbortSignal,
  ): Promise<void> {
    this.abortWait = delegateAbortController(abortSignal);
    await sleep(duration, this.abortWait.signal);
    this.abortWait.abort(); // cleans up resources
    this.abortWait = undefined;
  }
}
