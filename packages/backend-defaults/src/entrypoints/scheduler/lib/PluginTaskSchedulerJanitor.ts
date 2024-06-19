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
import { Knex } from 'knex';
import { Duration } from 'luxon';
import { DB_TASKS_TABLE, DbTasksRow } from '../database/tables';
import { sleep } from './util';

/**
 * Makes sure to auto-expire and clean up things that time out or for other
 * reasons should not be left lingering.
 */
export class PluginTaskSchedulerJanitor {
  private readonly knex: Knex;
  private readonly waitBetweenRuns: Duration;
  private readonly logger: LoggerService;

  constructor(options: {
    knex: Knex;
    waitBetweenRuns: Duration;
    logger: LoggerService;
  }) {
    this.knex = options.knex;
    this.waitBetweenRuns = options.waitBetweenRuns;
    this.logger = options.logger;
  }

  async start(abortSignal?: AbortSignal) {
    while (!abortSignal?.aborted) {
      try {
        await this.runOnce();
      } catch (e) {
        this.logger.warn(`Error while performing janitorial tasks, ${e}`);
      }

      await sleep(this.waitBetweenRuns, abortSignal);
    }
  }

  private async runOnce() {
    const dbNull = this.knex.raw('null');
    const configClient = this.knex.client.config.client;

    let tasks: Array<{ id: string }>;
    if (configClient.includes('sqlite3') || configClient.includes('mysql')) {
      tasks = await this.knex<DbTasksRow>(DB_TASKS_TABLE)
        .select('id')
        .where('current_run_expires_at', '<', this.knex.fn.now());
      await this.knex<DbTasksRow>(DB_TASKS_TABLE)
        .whereIn(
          'id',
          tasks.map(t => t.id),
        )
        .update({
          current_run_ticket: dbNull,
          current_run_started_at: dbNull,
          current_run_expires_at: dbNull,
        });
    } else {
      tasks = await this.knex<DbTasksRow>(DB_TASKS_TABLE)
        .where('current_run_expires_at', '<', this.knex.fn.now())
        .update({
          current_run_ticket: dbNull,
          current_run_started_at: dbNull,
          current_run_expires_at: dbNull,
        })
        .returning(['id']);
    }

    // In rare cases, knex drivers may ignore "returning", and return the number
    // of rows changed instead
    if (typeof tasks === 'number') {
      if (tasks > 0) {
        this.logger.warn(`${tasks} tasks timed out and were lost`);
      }
    } else {
      for (const { id } of tasks) {
        this.logger.warn(`Task timed out and was lost: ${id}`);
      }
    }
  }
}
