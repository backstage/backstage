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
import {
  DbMutexesRow,
  DbTasksRow,
  DB_MUTEXES_TABLE,
  DB_TASKS_TABLE,
} from '../database/tables';
import { CancelToken } from './CancelToken';

/**
 * Makes sure to auto-expire and clean up things that time out or for other
 * reasons should not be left lingering.
 */
export class PluginTaskManagerJanitor {
  private readonly knex: Knex;
  private readonly waitBetweenRuns: Duration;
  private readonly logger: Logger;
  private readonly cancelToken: CancelToken;

  constructor(options: {
    knex: Knex;
    waitBetweenRuns: Duration;
    logger: Logger;
  }) {
    this.knex = options.knex;
    this.waitBetweenRuns = options.waitBetweenRuns;
    this.logger = options.logger;
    this.cancelToken = CancelToken.create();
  }

  async start() {
    while (!this.cancelToken.isCancelled) {
      try {
        await this.runOnce();
      } catch (e) {
        this.logger.warn(`Error while performing janitorial tasks, ${e}`);
      }

      await this.sleep(this.waitBetweenRuns);
    }
  }

  async stop() {
    this.cancelToken.cancel();
  }

  private async runOnce() {
    // SQLite currently (Oct 1 2021) returns a number for returning()
    // statements, effectively ignoring them and instead returning the outcome
    // of the delete() - and knex also emits a warning about that fact, which
    // is why we avoid that entirely for the sqlite3 driver.
    // https://github.com/knex/knex/issues/4370
    // https://github.com/mapbox/node-sqlite3/issues/1453

    const mutexesQuery = this.knex<DbMutexesRow>(DB_MUTEXES_TABLE)
      .where('current_lock_expires_at', '<', this.knex.fn.now())
      .delete();

    if (this.knex.client.config.client === 'sqlite3') {
      const mutexes = await mutexesQuery;
      if (mutexes > 0) {
        this.logger.warn(`${mutexes} mutex locks timed out and were lost`);
      }
    } else {
      const mutexes = await mutexesQuery.returning(['id']);
      for (const { id } of mutexes) {
        this.logger.warn(`Mutex lock timed out and was lost: ${id}`);
      }
    }

    const tasksQuery = this.knex<DbTasksRow>(DB_TASKS_TABLE)
      .where('current_run_expires_at', '<', this.knex.fn.now())
      .delete();

    if (this.knex.client.config.client === 'sqlite3') {
      const tasks = await tasksQuery;
      this.logger.warn(`${tasks} tasks timed out and were lost`);
    } else {
      const tasks = await tasksQuery.returning(['id']);
      for (const { id } of tasks) {
        this.logger.warn(`Task timed out and was lost: ${id}`);
      }
    }
  }

  /**
   * Sleeps for the given duration, but aborts sooner if the cancel token
   * triggers.
   */
  private async sleep(duration: Duration) {
    await Promise.race([
      new Promise(resolve => setTimeout(resolve, duration.as('milliseconds'))),
      this.cancelToken.promise,
    ]);
  }
}
