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

import { LoggerService } from '@backstage/backend-plugin-api';
import { ConflictError, NotFoundError } from '@backstage/errors';
import { CronTime } from 'cron';
import { Knex } from 'knex';
import { DateTime, Duration } from 'luxon';
import { v4 as uuid } from 'uuid';
import { DB_TASKS_TABLE, DbTasksRow } from '../database/tables';
import { TaskSettingsV2, taskSettingsV2Schema } from './types';
import { delegateAbortController, nowPlus, sleep } from './util';
import { SchedulerServiceTaskFunction } from '@backstage/backend-plugin-api';

const DEFAULT_WORK_CHECK_FREQUENCY = Duration.fromObject({ seconds: 5 });

/**
 * Implements tasks that run across worker hosts, with collaborative locking.
 *
 * @private
 */
export class TaskWorker {
  constructor(
    private readonly taskId: string,
    private readonly fn: SchedulerServiceTaskFunction,
    private readonly knex: Knex,
    private readonly logger: LoggerService,
    private readonly workCheckFrequency: Duration = DEFAULT_WORK_CHECK_FREQUENCY,
  ) {}

  async start(settings: TaskSettingsV2, options?: { signal?: AbortSignal }) {
    try {
      await this.persistTask(settings);
    } catch (e) {
      throw new Error(`Failed to persist task, ${e}`);
    }

    this.logger.info(
      `Task worker starting: ${this.taskId}, ${JSON.stringify(settings)}`,
    );

    let workCheckFrequency = this.workCheckFrequency;
    const isCron = !settings?.cadence.startsWith('P');
    if (!isCron) {
      const cadence = Duration.fromISO(settings.cadence);
      if (cadence < workCheckFrequency) {
        workCheckFrequency = cadence;
      }
    }

    let attemptNum = 1;
    (async () => {
      for (;;) {
        try {
          if (settings.initialDelayDuration) {
            await sleep(
              Duration.fromISO(settings.initialDelayDuration),
              options?.signal,
            );
          }

          while (!options?.signal?.aborted) {
            const runResult = await this.runOnce(options?.signal);

            if (runResult.result === 'abort') {
              break;
            }

            await sleep(workCheckFrequency, options?.signal);
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

  static async trigger(knex: Knex, taskId: string): Promise<void> {
    // check if task exists
    const rows = await knex<DbTasksRow>(DB_TASKS_TABLE)
      .select(knex.raw(1))
      .where('id', '=', taskId);
    if (rows.length !== 1) {
      throw new NotFoundError(`Task ${taskId} does not exist`);
    }

    const updatedRows = await knex<DbTasksRow>(DB_TASKS_TABLE)
      .where('id', '=', taskId)
      .whereNull('current_run_ticket')
      .update({
        next_run_start_at: knex.fn.now(),
      });
    if (updatedRows < 1) {
      throw new ConflictError(`Task ${taskId} is currently running`);
    }
  }

  /**
   * Makes a single attempt at running the task to completion, if ready.
   *
   * @returns The outcome of the attempt
   */
  private async runOnce(
    signal?: AbortSignal,
  ): Promise<
    | { result: 'not-ready-yet' }
    | { result: 'abort' }
    | { result: 'failed' }
    | { result: 'completed' }
  > {
    const findResult = await this.findReadyTask();
    if (
      findResult.result === 'not-ready-yet' ||
      findResult.result === 'abort'
    ) {
      return findResult;
    }

    const taskSettings = findResult.settings;
    const ticket = uuid();

    const claimed = await this.tryClaimTask(ticket, taskSettings);
    if (!claimed) {
      return { result: 'not-ready-yet' };
    }

    // Abort the task execution either if the worker is stopped, or if the
    // task timeout is hit
    const taskAbortController = delegateAbortController(signal);
    const timeoutHandle = setTimeout(() => {
      taskAbortController.abort();
    }, Duration.fromISO(taskSettings.timeoutAfterDuration).as('milliseconds'));

    try {
      await this.fn(taskAbortController.signal);
      taskAbortController.abort(); // releases resources
    } catch (e) {
      this.logger.error(e);
      await this.tryReleaseTask(ticket, taskSettings);
      return { result: 'failed' };
    } finally {
      clearTimeout(timeoutHandle);
    }

    await this.tryReleaseTask(ticket, taskSettings);
    return { result: 'completed' };
  }

  /**
   * Perform the initial store of the task info
   */
  async persistTask(settings: TaskSettingsV2) {
    // Perform an initial parse to ensure that we will definitely be able to
    // read it back again.
    taskSettingsV2Schema.parse(settings);

    const isCron = !settings?.cadence.startsWith('P');

    let startAt: Knex.Raw | undefined;
    let nextStartAt: Knex.Raw | undefined;
    if (settings.initialDelayDuration) {
      startAt = nowPlus(
        Duration.fromISO(settings.initialDelayDuration),
        this.knex,
      );
    }

    if (isCron) {
      const time = new CronTime(settings.cadence)
        .sendAt()
        .minus({ seconds: 1 }) // immediately, if "* * * * * *"
        .toUTC();

      nextStartAt = this.nextRunAtRaw(time);
      startAt ||= nextStartAt;
    } else {
      startAt ||= this.knex.fn.now();
      nextStartAt = nowPlus(Duration.fromISO(settings.cadence), this.knex);
    }

    this.logger.debug(`task: ${this.taskId} configured to run at: ${startAt}`);

    // It's OK if the task already exists; if it does, just replace its
    // settings with the new value and start the loop as usual.
    const settingsJson = JSON.stringify(settings);
    await this.knex<DbTasksRow>(DB_TASKS_TABLE)
      .insert({
        id: this.taskId,
        settings_json: settingsJson,
        next_run_start_at: startAt,
      })
      .onConflict('id')
      .merge(
        this.knex.client.config.client.includes('mysql')
          ? {
              settings_json: settingsJson,
              next_run_start_at: this.knex.raw(
                `CASE WHEN ?? < ?? THEN ?? ELSE ?? END`,
                [
                  nextStartAt,
                  'next_run_start_at',
                  nextStartAt,
                  'next_run_start_at',
                ],
              ),
            }
          : {
              settings_json: this.knex.ref('excluded.settings_json'),
              next_run_start_at: this.knex.raw(
                `CASE WHEN ?? < ?? THEN ?? ELSE ?? END`,
                [
                  nextStartAt,
                  `${DB_TASKS_TABLE}.next_run_start_at`,
                  nextStartAt,
                  `${DB_TASKS_TABLE}.next_run_start_at`,
                ],
              ),
            },
      );
  }

  /**
   * Check if the task is ready to run
   */
  async findReadyTask(): Promise<
    | { result: 'not-ready-yet' }
    | { result: 'abort' }
    | { result: 'ready'; settings: TaskSettingsV2 }
  > {
    const [row] = await this.knex<DbTasksRow>(DB_TASKS_TABLE)
      .where('id', '=', this.taskId)
      .select({
        settingsJson: 'settings_json',
        ready: this.knex.raw(
          `CASE
            WHEN next_run_start_at <= ? AND current_run_ticket IS NULL THEN TRUE
            ELSE FALSE
          END`,
          [this.knex.fn.now()],
        ),
      });

    if (!row) {
      this.logger.info(
        'No longer able to find task; aborting and assuming that it has been unregistered or expired',
      );
      return { result: 'abort' };
    } else if (!row.ready) {
      return { result: 'not-ready-yet' };
    }

    try {
      const obj = JSON.parse(row.settingsJson);
      const settings = taskSettingsV2Schema.parse(obj);
      return { result: 'ready', settings };
    } catch (e) {
      this.logger.info(
        `Task "${this.taskId}" is no longer able to parse task settings; aborting and assuming that a ` +
          `newer version of the task has been issued and being handled by other workers, ${e}`,
      );
      return { result: 'abort' };
    }
  }

  /**
   * Attempts to claim a task that's ready for execution, on this worker's
   * behalf. We should not attempt to perform the work unless the claim really
   * goes through.
   *
   * @param ticket - A globally unique string that changes for each invocation
   * @param settings - The settings of the task to claim
   * @returns True if it was successfully claimed
   */
  async tryClaimTask(
    ticket: string,
    settings: TaskSettingsV2,
  ): Promise<boolean> {
    const startedAt = this.knex.fn.now();
    const expiresAt = settings.timeoutAfterDuration
      ? nowPlus(Duration.fromISO(settings.timeoutAfterDuration), this.knex)
      : this.knex.raw('null');

    const rows = await this.knex<DbTasksRow>(DB_TASKS_TABLE)
      .where('id', '=', this.taskId)
      .whereNull('current_run_ticket')
      .update({
        current_run_ticket: ticket,
        current_run_started_at: startedAt,
        current_run_expires_at: expiresAt,
      });

    return rows === 1;
  }

  async tryReleaseTask(
    ticket: string,
    settings: TaskSettingsV2,
  ): Promise<boolean> {
    const isCron = !settings?.cadence.startsWith('P');

    let nextRun: Knex.Raw;
    if (isCron) {
      const time = new CronTime(settings.cadence).sendAt().toUTC();
      this.logger.debug(`task: ${this.taskId} will next occur around ${time}`);

      nextRun = this.nextRunAtRaw(time);
    } else {
      const dt = Duration.fromISO(settings.cadence).as('seconds');
      this.logger.debug(
        `task: ${this.taskId} will next occur around ${DateTime.now().plus({
          seconds: dt,
        })}`,
      );

      if (this.knex.client.config.client.includes('sqlite3')) {
        nextRun = this.knex.raw(
          `max(datetime(next_run_start_at, ?), datetime('now'))`,
          [`+${dt} seconds`],
        );
      } else if (this.knex.client.config.client.includes('mysql')) {
        nextRun = this.knex.raw(
          `greatest(next_run_start_at + interval ${dt} second, now())`,
        );
      } else {
        nextRun = this.knex.raw(
          `greatest(next_run_start_at + interval '${dt} seconds', now())`,
        );
      }
    }

    const rows = await this.knex<DbTasksRow>(DB_TASKS_TABLE)
      .where('id', '=', this.taskId)
      .where('current_run_ticket', '=', ticket)
      .update({
        next_run_start_at: nextRun,
        current_run_ticket: this.knex.raw('null'),
        current_run_started_at: this.knex.raw('null'),
        current_run_expires_at: this.knex.raw('null'),
      });

    return rows === 1;
  }

  private nextRunAtRaw(time: DateTime): Knex.Raw {
    if (this.knex.client.config.client.includes('sqlite3')) {
      return this.knex.raw('datetime(?)', [time.toISO()]);
    } else if (this.knex.client.config.client.includes('mysql')) {
      return this.knex.raw(`?`, [time.toSQL({ includeOffset: false })]);
    }
    return this.knex.raw(`?`, [time.toISO()]);
  }
}
