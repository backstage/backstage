/*
 * Copyright 2024 The Backstage Authors
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

import { LoggerService, SchedulerService } from '@backstage/backend-plugin-api';
import { Knex } from 'knex';
import { ensureStateQueueIsPopulated } from './operations/refreshState/ensureStateQueueIsPopulated';
import { ProcessingIntervalFunction } from '../processing/refresh';

/**
 * Keeps the database model in checm.
 */
export class DatabaseJanitor {
  readonly #knex: Knex;
  readonly #processingIntervalSeconds: number;

  private constructor(knex: Knex, processingIntervalSeconds: number) {
    this.#knex = knex;
    this.#processingIntervalSeconds = processingIntervalSeconds;
  }

  static async create(options: {
    knex: Knex;
    processingInterval: ProcessingIntervalFunction;
    logger: LoggerService;
    scheduler: SchedulerService;
  }): Promise<DatabaseJanitor> {
    // Find some reasonable max interval. Not beautiful, but I don't want to
    // refactor the interval stuff quite yet.
    let processingIntervalSeconds = 0;
    for (let i = 0; i < 100; ++i) {
      processingIntervalSeconds = Math.max(
        processingIntervalSeconds,
        options.processingInterval(),
      );
    }

    const janitor = new DatabaseJanitor(
      options.knex,
      processingIntervalSeconds,
    );

    await janitor.runOnce().then(async () => {
      await options.scheduler.scheduleTask({
        id: 'database-janitor',
        frequency: { minutes: 1 },
        timeout: { minutes: 1 },
        initialDelay: { minutes: 1 },
        fn: () => janitor.runOnce(),
      });
    });

    return janitor;
  }

  async runOnce(): Promise<void> {
    try {
      await ensureStateQueueIsPopulated(
        this.#knex,
        this.#processingIntervalSeconds,
      );
    } catch (error) {
      console.error('Failed to run janitor', error);
    }
  }

  async stop(): Promise<void> {
    // Nothing to do yet, task scheduling stops automatically
  }
}
