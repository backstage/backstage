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

import { HumanDuration, durationToMilliseconds } from '@backstage/types';
import { Knex } from 'knex';
import { SubscriptionOptions } from '../consumers/types';
import { EventsTableRow, SubscriptionsTableRow } from './tables';

// Some reasonable number that the page sizes should not exceed (to avoid overly
// heavy operations and risking timeouts / memory issues). So even if callers
// request more than this, we clamp it.
const MAX_PAGE_SIZE = 50;

const DEFAULT_POLL_FREQUENCY: HumanDuration =
  process.env.NODE_ENV === 'test' ? { milliseconds: 50 } : { seconds: 1 };

export async function* streamEventsTableRows(options: {
  subscription: SubscriptionOptions;
  consumerName: string;
  knex: Knex;
  signal: AbortSignal;
  pollFrequency?: HumanDuration;
}): AsyncGenerator<EventsTableRow[]> {
  const { knex, consumerName } = options;
  const { subscriptionId, startAt } = options.subscription;
  const pageSize = Math.min(
    MAX_PAGE_SIZE,
    options.subscription.maxPageSize ?? MAX_PAGE_SIZE,
  );
  const pollFrequencyMillis = durationToMilliseconds(
    options.pollFrequency ?? DEFAULT_POLL_FREQUENCY,
  );

  // Ensure that there's a consumer row that can keep track of our progress
  await knex<SubscriptionsTableRow>('module_history__subscriptions')
    .insert({
      id: subscriptionId,
      consumer_name: consumerName,
      updated_at: knex.fn.now(),
      last_event_id:
        startAt === 'beginning'
          ? '0'
          : knex.raw(
              `(SELECT COALESCE(MAX(id), 0) FROM module_history__events)`,
            ),
    })
    .onConflict('id')
    .merge(['consumer_name', 'updated_at']);

  while (!options.signal.aborted) {
    // The below query selects the consumer we're reading for, locks it for
    // an update, reads events for the consumer up to the limit, and then
    // updates the pointer to the last read event.
    //
    // This is written as a plain SQL query to spare us all the horrors of
    // expressing this in knex.

    const { rows: result } = await knex.raw<{
      rows: [] | [{ events: EventsTableRow[] | null }];
    }>(
      `
      WITH consumer AS (
        SELECT last_event_id
        FROM module_history__subscriptions
        WHERE id = :consumerId
        FOR UPDATE
      ),
      selected_events AS (
        SELECT module_history__events.*
        FROM module_history__events, consumer
        WHERE module_history__events.id > consumer.last_event_id
        ORDER BY module_history__events.id ASC LIMIT :pageSize
      ),
      last_event_id AS (
        SELECT max(id) AS last_event_id
        FROM selected_events
      ),
      events_array AS (
        SELECT json_agg(row_to_json(selected_events)) AS events
        FROM selected_events
      )
      UPDATE module_history__subscriptions
      SET last_event_id = last_event_id.last_event_id
      FROM events_array, last_event_id
      WHERE module_history__subscriptions.id = :consumerId
      AND (SELECT COUNT(*) FROM selected_events) > 0
      RETURNING events_array.events
    `,
      { consumerId: subscriptionId, pageSize },
    );

    if (result.length > 1) {
      throw new Error(
        `Failed to read events for consumer '${subscriptionId}', unexpectedly updated ${result.length} rows`,
      );
    }

    const rows = result[0]?.events;
    if (rows?.length) {
      yield rows;
    }

    if (rows?.length !== pageSize) {
      await new Promise(resolve => setTimeout(resolve, pollFrequencyMillis));
    }
  }
}
