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
import { v4 as uuid } from 'uuid';
import { Logger } from 'winston';
import { isDatabaseConflictError } from '../database';
import { DbMutexesRow, DB_MUTEXES_TABLE } from '../database/tables';
import { TaskWorker } from './TaskWorker';
import { LockOptions, PluginTaskManager, TaskOptions } from './types';
import { nowPlus, validateId } from './util';

/**
 * Implements the actual task management.
 */
export class PluginTaskManagerImpl implements PluginTaskManager {
  constructor(
    private readonly databaseFactory: () => Promise<Knex>,
    private readonly logger: Logger,
  ) {}

  async acquireLock(
    id: string,
    options: LockOptions,
  ): Promise<
    { acquired: false } | { acquired: true; release(): Promise<void> }
  > {
    validateId(id);

    const knex = await this.databaseFactory();
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

    const record: Knex.DbRecord<DbMutexesRow> = {
      current_lock_ticket: ticket,
      current_lock_acquired_at: knex.fn.now(),
      current_lock_expires_at: options.timeout
        ? nowPlus(options.timeout, knex)
        : knex.raw('null'),
    };

    // First try to overwrite an existing lock, that has timed out
    const stolen = await knex<DbMutexesRow>(DB_MUTEXES_TABLE)
      .where('id', '=', id)
      .whereNotNull('current_lock_ticket')
      .where('current_lock_expires_at', '<', knex.fn.now())
      .update(record);

    if (stolen) {
      return { acquired: true, release };
    }

    try {
      await knex<DbMutexesRow>(DB_MUTEXES_TABLE).insert({ id, ...record });
      return { acquired: true, release };
    } catch (e) {
      if (!isDatabaseConflictError(e)) {
        this.logger.warn(`Failed to acquire lock, ${e}`);
      }
      return { acquired: false };
    }
  }

  async scheduleTask(
    id: string,
    options: TaskOptions,
    fn: () => void | Promise<void>,
  ): Promise<{ unschedule: () => Promise<void> }> {
    validateId(id);

    const knex = await this.databaseFactory();

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
}
