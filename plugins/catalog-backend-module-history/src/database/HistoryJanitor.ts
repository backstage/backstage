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

import {
  RootConfigService,
  SchedulerService,
} from '@backstage/backend-plugin-api';
import { readDurationFromConfig } from '@backstage/config';
import { HumanDuration, durationToMilliseconds } from '@backstage/types';
import { Knex } from 'knex';

export class HistoryJanitor {
  #knexPromise: Promise<Knex>;
  #maxRetentionTime?: HumanDuration;
  #retentionTimeAfterDeletion?: HumanDuration;

  static async create(options: {
    knexPromise: Promise<Knex>;
    config: RootConfigService;
    scheduler: SchedulerService;
  }): Promise<HistoryJanitor> {
    const maxRetentionTimeKey = 'catalog.history.maxRetentionTime';
    const maxRetentionTime = options.config.has(maxRetentionTimeKey)
      ? readDurationFromConfig(options.config, { key: maxRetentionTimeKey })
      : undefined;

    const retentionTimeAfterDeletionKey =
      'catalog.history.retentionTimeAfterDeletion';
    const retentionTimeAfterDeletion = options.config.has(
      retentionTimeAfterDeletionKey,
    )
      ? readDurationFromConfig(options.config, {
          key: retentionTimeAfterDeletionKey,
        })
      : undefined;

    const janitor = new HistoryJanitor({
      knexPromise: options.knexPromise,
      maxRetentionTime,
      retentionTimeAfterDeletion,
    });

    await options.scheduler.scheduleTask({
      id: 'catalog-history-janitor',
      frequency: { minutes: 10 },
      timeout: { minutes: 10 },
      fn: janitor.runOnce.bind(janitor),
    });

    return janitor;
  }

  constructor(options: {
    knexPromise: Promise<Knex>;
    maxRetentionTime?: HumanDuration;
    retentionTimeAfterDeletion?: HumanDuration;
  }) {
    this.#knexPromise = options.knexPromise;
    this.#maxRetentionTime = options.maxRetentionTime;
    this.#retentionTimeAfterDeletion = options.retentionTimeAfterDeletion;
  }

  async runOnce(signal?: AbortSignal): Promise<void> {
    if (signal?.aborted) {
      return;
    }

    const knex = await this.#knexPromise;

    if (this.#maxRetentionTime) {
      const deadline = new Date(
        Date.now() - durationToMilliseconds(this.#maxRetentionTime),
      );
      await knex('module_history__events')
        .where('event_at', '<', deadline)
        .delete();
    }

    if (this.#retentionTimeAfterDeletion) {
      const deadline = new Date(
        Date.now() - durationToMilliseconds(this.#retentionTimeAfterDeletion),
      );
      await knex
        .with(
          'deleted',
          ['entity_ref', 'newest_event_at'],
          deleted =>
            deleted
              .select(
                'module_history__events.entity_ref',
                knex.raw(
                  'max(module_history__events.event_at) as newest_event_at',
                ),
              )
              .from('module_history__events')
              .groupBy('module_history__events.entity_ref')
              .leftOuterJoin(
                'final_entities',
                'final_entities.entity_ref',
                'module_history__events.entity_ref',
              )
              .whereNotNull('module_history__events.entity_ref')
              .whereNull('final_entities.final_entity'), // either missing row, or actual NULL column
        )
        .from('module_history__events')
        .whereIn('entity_ref', inner =>
          inner
            .select('deleted.entity_ref')
            .from('deleted')
            .where('deleted.newest_event_at', '<', deadline),
        )
        .delete();
    }
  }
}
