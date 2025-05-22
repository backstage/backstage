/*
 * Copyright 2025 The Backstage Authors
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

import { SchedulerService } from '@backstage/backend-plugin-api';
import { Knex } from 'knex';
import { HistoryConfig } from '../config';
import { runJanitorCleanup } from './operations/runJanitorCleanup';

export class HistoryJanitor {
  #knexPromise: Promise<Knex>;
  #historyConfig: HistoryConfig;

  static async create(options: {
    knexPromise: Promise<Knex>;
    historyConfig: HistoryConfig;
    scheduler: SchedulerService;
  }): Promise<HistoryJanitor> {
    const janitor = new HistoryJanitor({
      knexPromise: options.knexPromise,
      historyConfig: options.historyConfig,
    });

    await options.scheduler.scheduleTask({
      id: 'catalog-history-janitor',
      frequency: { seconds: 30 },
      timeout: { minutes: 10 },
      fn: janitor.runOnce.bind(janitor),
    });

    return janitor;
  }

  constructor(options: {
    knexPromise: Promise<Knex>;
    historyConfig: HistoryConfig;
  }) {
    this.#knexPromise = options.knexPromise;
    this.#historyConfig = options.historyConfig;
  }

  async runOnce(signal?: AbortSignal): Promise<void> {
    const knex = await this.#knexPromise;
    if (signal?.aborted) {
      return;
    }
    await runJanitorCleanup(knex, this.#historyConfig);
  }
}
