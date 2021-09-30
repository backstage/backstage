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
import { DbMutexesRow, DB_MUTEXES_TABLE } from '../database/tables';
import { PluginTaskManagerJanitor } from './PluginTaskManagerJanitor';
import { TaskWorker } from './TaskWorker';
import { PluginTaskManager } from './types';
import { nowPlus, validateId } from './util';

/**
 * Implements the actual task management.
 */
export class PluginTaskManagerImpl implements PluginTaskManager {
  private janitor: PluginTaskManagerJanitor | undefined;

  constructor(
    private readonly databaseFactory: () => Promise<Knex>,
    private readonly logger: Logger,
  ) {}

  async acquireLock(
    id: string,
    options: {
      timeout: Duration;
    },
  ): Promise<
    | { acquired: false }
    | { acquired: true; release: () => void | Promise<void> }
  > {
    validateId(id);

    const knex = await this.databaseFactory();
    await this.ensureJanitor(knex);

    const ticket = uuid();

    async function release() {
      try {
        await knex<DbMutexesRow>(DB_MUTEXES_TABLE)
          .where('id', '=', id)
          .where('current_lock_ticket', '=', ticket)
          .delete();
      } catch {
        // fail silently
      }
    }

    // First try to overwrite an existing lock, that has timed out
    const stolen = await knex<DbMutexesRow>(DB_MUTEXES_TABLE)
      .where('id', '=', id)
      .whereNotNull('current_lock_ticket')
      .where('current_lock_expires_at', '<', knex.fn.now())
      .update({
        current_lock_ticket: ticket,
        current_lock_acquired_at: knex.fn.now(),
        current_lock_expires_at: nowPlus(options.timeout, knex),
      });

    if (stolen) {
      return { acquired: true, release };
    }

    try {
      await knex<DbMutexesRow>(DB_MUTEXES_TABLE).insert({
        id,
        current_lock_ticket: ticket,
        current_lock_acquired_at: knex.fn.now(),
        current_lock_expires_at: nowPlus(options.timeout, knex),
      });
      return { acquired: true, release };
    } catch {
      return { acquired: false };
    }
  }

  async scheduleTask(
    id: string,
    options: {
      timeout?: Duration;
      frequency?: Duration;
      initialDelay?: Duration;
    },
    fn: () => void | Promise<void>,
  ): Promise<{ unschedule: () => Promise<void> }> {
    validateId(id);

    const knex = await this.databaseFactory();
    await this.ensureJanitor(knex);

    const task = new TaskWorker(id, fn, knex, this.logger);
    await task.start({
      version: 1,
      initialDelayDuration: options.initialDelay?.toISO(),
      recurringAtMostEveryDuration: options.frequency?.toISO(),
      timeoutAfterDuration: options.timeout?.toISO(),
    });

    return {
      async unschedule() {
        await task.stop();
      },
    };
  }

  private async ensureJanitor(knex: Knex) {
    if (!this.janitor) {
      this.janitor = new PluginTaskManagerJanitor({
        knex,
        waitBetweenRuns: Duration.fromObject({ minutes: 1 }),
        logger: this.logger,
      });
      this.janitor.start();
    }
  }
}
