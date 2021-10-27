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
import { v4 as uuid } from 'uuid';
import { Logger } from 'winston';
import { DbTasksRow, DB_TASKS_TABLE } from '../database/tables';
import { CancelToken } from './CancelToken';
import { TaskSettingsV1, taskSettingsV1Schema } from './types';
import { nowPlus } from './util';

const WORK_CHECK_FREQUENCY = Duration.fromObject({ seconds: 5 });

/**
 * Performs the actual work of a task.
 *
 * @private
 */
export class TaskWorker {
  private readonly taskId: string;
  private readonly fn: () => void | Promise<void>;
  private readonly knex: Knex;
  private readonly logger: Logger;
  private readonly cancelToken: CancelToken;

  constructor(
    taskId: string,
    fn: () => void | Promise<void>,
    knex: Knex,
    logger: Logger,
  ) {
    this.taskId = taskId;
    this.fn = fn;
    this.knex = knex;
    this.logger = logger;
    this.cancelToken = CancelToken.create();
  }

  async start(settings: TaskSettingsV1) {
    try {
      await this.persistTask(settings);
    } catch (e) {
      throw new Error(`Failed to persist task, ${e}`);
    }

    this.logger.info(
      `Task worker starting: ${this.taskId}, ${JSON.stringify(settings)}`,
    );

    (async () => {
      try {
        while (!this.cancelToken.isCancelled) {
          const runResult = await this.runOnce();
          if (runResult.result === 'abort') {
            break;
          }
          if (!settings.recurringAtMostEveryDuration) {
            break;
          }

          await this.sleep(WORK_CHECK_FREQUENCY);
        }
        this.logger.info(`Task worker finished: ${this.taskId}`);
      } catch (e) {
        this.logger.warn(`Task worker failed unexpectedly, ${e}`);
      }
    })();
  }

  stop() {
    this.cancelToken.cancel();
  }

  /**
   * Makes a single attempt at running the task to completion, if ready.
   *
   * @returns The outcome of the attempt
   */
  async runOnce(): Promise<
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

    try {
      await this.fn();
    } catch (e) {
      await this.tryReleaseTask(ticket, taskSettings);
      return { result: 'failed' };
    }

    await this.tryReleaseTask(ticket, taskSettings);
    return { result: 'completed' };
  }

  /**
   * Sleep for the given duration, but abort sooner if the cancel token
   * triggers.
   *
   * @param duration - The amount of time to sleep, at most
   */
  private async sleep(duration: Duration): Promise<void> {
    await Promise.race([
      new Promise(resolve => setTimeout(resolve, duration.as('milliseconds'))),
      this.cancelToken.promise,
    ]);
  }

  /**
   * Perform the initial store of the task info
   */
  async persistTask(settings: TaskSettingsV1) {
    // Perform an initial parse to ensure that we will definitely be able to
    // read it back again.
    taskSettingsV1Schema.parse(settings);

    const settingsJson = JSON.stringify(settings);
    const startAt = settings.initialDelayDuration
      ? nowPlus(Duration.fromISO(settings.initialDelayDuration), this.knex)
      : this.knex.fn.now();

    // It's OK if the task already exists; if it does, just replace its
    // settings with the new value and start the loop as usual.
    await this.knex<DbTasksRow>(DB_TASKS_TABLE)
      .insert({
        id: this.taskId,
        settings_json: settingsJson,
        next_run_start_at: startAt,
      })
      .onConflict('id')
      .merge(['settings_json']);
  }

  /**
   * Check if the task is ready to run
   */
  async findReadyTask(): Promise<
    | { result: 'not-ready-yet' }
    | { result: 'abort' }
    | { result: 'ready'; settings: TaskSettingsV1 }
  > {
    const [row] = await this.knex<DbTasksRow>(DB_TASKS_TABLE)
      .where('id', '=', this.taskId)
      .select({
        settingsJson: 'settings_json',
        ready: this.knex.raw(
          `
          CASE
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
      const settings = taskSettingsV1Schema.parse(JSON.parse(row.settingsJson));
      return { result: 'ready', settings };
    } catch (e) {
      this.logger.info(
        'No longer able to parse task settings; aborting and assuming that a ' +
          'newer version of the task has been issued and being handled by ' +
          `other workers, ${e}`,
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
    settings: TaskSettingsV1,
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
    settings: TaskSettingsV1,
  ): Promise<boolean> {
    const { recurringAtMostEveryDuration } = settings;

    // If this is not a recurring task, and we still have the current run
    // ticket, delete it from the table
    if (recurringAtMostEveryDuration === undefined) {
      const rows = await this.knex<DbTasksRow>(DB_TASKS_TABLE)
        .where('id', '=', this.taskId)
        .where('current_run_ticket', '=', ticket)
        .delete();

      return rows === 1;
    }

    // We make an effort to keep the datetime calculations in the database
    // layer, making sure to not have to perform conversions back and forth and
    // leaning on the database as a central clock source
    const dbNull = this.knex.raw('null');
    const dt = Duration.fromISO(recurringAtMostEveryDuration).as('seconds');
    const nextRun =
      this.knex.client.config.client === 'sqlite3'
        ? this.knex.raw('datetime(next_run_start_at, ?)', [`+${dt} seconds`])
        : this.knex.raw(`next_run_start_at + interval '${dt} seconds'`);

    const rows = await this.knex<DbTasksRow>(DB_TASKS_TABLE)
      .where('id', '=', this.taskId)
      .where('current_run_ticket', '=', ticket)
      .update({
        next_run_start_at: nextRun,
        current_run_ticket: dbNull,
        current_run_started_at: dbNull,
        current_run_expires_at: dbNull,
      });

    return rows === 1;
  }
}
