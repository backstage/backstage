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

import { Knex } from 'knex';
import { streamEventsTableRows } from '../database/streamEventsTableRows';
import { EventsTableRow } from '../database/tables';
import {
  HistoryConsumer,
  HistoryConsumerConnection,
  SubscriptionEvent,
  SubscriptionOptions,
} from './types';

export async function connectConsumers(options: {
  consumers: HistoryConsumer[];
  knex: Knex;
  signal: AbortSignal;
}): Promise<void> {
  const subscriptionIdToConsumerId = new Map<string, string>();

  function ensureUnique(
    consumer: HistoryConsumer,
    subscription: SubscriptionOptions,
  ) {
    if (subscriptionIdToConsumerId.has(subscription.subscriptionId)) {
      const current = consumer.getConsumerName();
      const previous = subscriptionIdToConsumerId.get(
        subscription.subscriptionId,
      );
      const offender =
        current === previous
          ? `by consumer '${current}'`
          : `first by consumer '${previous}', then '${current}'`;
      throw new Error(
        `Catalog history subscription ID '${subscription.subscriptionId}' was used more than once during startup (${offender}), which is not permitted.`,
      );
    }
    subscriptionIdToConsumerId.set(
      subscription.subscriptionId,
      consumer.getConsumerName(),
    );
  }

  for (const consumer of options.consumers) {
    const connection: HistoryConsumerConnection = {
      async *subscribe(
        subscription: SubscriptionOptions,
      ): AsyncGenerator<SubscriptionEvent[]> {
        ensureUnique(consumer, subscription);

        for await (const rows of streamEventsTableRows({
          subscription,
          consumerName: consumer.getConsumerName(),
          knex: options.knex,
          signal: options.signal,
        })) {
          yield rows.map(databaseRowToSubscriptionEvent);
          if (options.signal.aborted) {
            break;
          }
        }
      },
    };

    consumer.connect(connection);
  }
}

function databaseRowToSubscriptionEvent(
  row: EventsTableRow,
): SubscriptionEvent {
  return {
    id: String(row.id),
    eventAt:
      typeof row.event_at === 'string' ? new Date(row.event_at) : row.event_at,
    eventType: row.event_type,
    entityRef: row.entity_ref ?? undefined,
    entityJson: row.entity_json ?? undefined,
  };
}
