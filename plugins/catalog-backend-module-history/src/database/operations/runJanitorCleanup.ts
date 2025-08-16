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

import { Knex } from 'knex';
import { HistoryConfig } from '../../config';
import { knexRawNowMinus } from '../util';

export async function runJanitorCleanup(
  knex: Knex,
  historyConfig: HistoryConfig,
) {
  if (historyConfig.eventMaxRetentionTime) {
    const deadline = knexRawNowMinus(knex, historyConfig.eventMaxRetentionTime);
    await knex('history_events')
      .where('event_at', '<', deadline)
      .whereNotIn('event_id', inner =>
        inner.select('event_id').from('history_summary'),
      )
      .delete();
  }

  if (historyConfig.eventRetentionTimeAfterDeletion) {
    const deadline = knexRawNowMinus(
      knex,
      historyConfig.eventRetentionTimeAfterDeletion,
    );
    await knex
      .with(
        'deleted',
        ['entity_ref', 'newest_event_at'],
        deleted =>
          deleted
            .select(
              'history_events.entity_ref',
              knex.raw('max(history_events.event_at) as newest_event_at'),
            )
            .from('history_events')
            .groupBy('history_events.entity_ref')
            .leftOuterJoin(
              'final_entities',
              'final_entities.entity_ref',
              'history_events.entity_ref',
            )
            .whereNotNull('history_events.entity_ref')
            .whereNull('final_entities.final_entity'), // either missing row, or actual NULL column
      )
      .from('history_events')
      .whereIn('entity_ref', inner =>
        inner
          .select('deleted.entity_ref')
          .from('deleted')
          .where('deleted.newest_event_at', '<', deadline),
      )
      .whereNotIn('history_events.event_id', inner =>
        inner.select('history_summary.event_id').from('history_summary'),
      )
      .delete();
  }

  // If a receiver did not acknowledge completion of a set of events, we
  // consider it a failed delivery and consider re-sending them to a different
  // receiver.
  await knex('history_subscriptions')
    .update({
      state: 'idle',
      ack_id: null,
      ack_timeout_at: null,
    })
    .where('state', '=', 'waiting')
    .andWhere('ack_timeout_at', '<', knex.fn.now());

  // Delete subscriptions that have been inactive for a while
  if (historyConfig.subscriptionRetentionTimeAfterInactive) {
    const deadline = knexRawNowMinus(
      knex,
      historyConfig.subscriptionRetentionTimeAfterInactive,
    );
    await knex('history_subscriptions')
      .where('state', '=', 'idle')
      .andWhere('active_at', '<', deadline)
      .delete();
  }
}
