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
import { knexRawNowMinus } from './util';

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
    if (signal?.aborted) {
      return;
    }

    const knex = await this.#knexPromise;

    if (this.#historyConfig.eventMaxRetentionTime) {
      const deadline = knexRawNowMinus(
        knex,
        this.#historyConfig.eventMaxRetentionTime,
      );
      await knex('module_history__events')
        .where('event_at', '<', deadline)
        .delete();
    }

    if (this.#historyConfig.eventRetentionTimeAfterDeletion) {
      const deadline = knexRawNowMinus(
        knex,
        this.#historyConfig.eventRetentionTimeAfterDeletion,
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

    // If a receiver did not acknowledge completion of a set of events, we
    // consider it a failed delivery and consider re-sending them to a different
    // receiver.
    await knex('module_history__subscriptions')
      .update({
        state: 'idle',
        ack_id: null,
        ack_timeout_at: null,
      })
      .where('state', '=', 'waiting')
      .andWhere('ack_timeout_at', '<', knex.fn.now());

    // Delete subscriptions that have been inactive for a while
    if (this.#historyConfig.subscriptionRetentionTimeAfterInactive) {
      const deadline = knexRawNowMinus(
        knex,
        this.#historyConfig.subscriptionRetentionTimeAfterInactive,
      );
      await knex('module_history__subscriptions')
        .where('state', '=', 'idle')
        .andWhere('active_at', '<', deadline)
        .delete();
    }
  }
}
