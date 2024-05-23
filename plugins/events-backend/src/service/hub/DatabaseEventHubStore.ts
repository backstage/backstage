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
import { EventParams } from '@backstage/plugin-events-node';
import { EventHubStore } from './types';
import { Knex } from 'knex';
import {
  DatabaseService,
  LoggerService,
  resolvePackagePath,
} from '@backstage/backend-plugin-api';

const MAX_BATCH_SIZE = 10;

const TABLE_EVENTS = 'event_bus_events';
const TABLE_SUBSCRIPTIONS = 'event_bus_subscriptions';

type EventsRow = {
  id: string;
  created_at: Date;
  topic: string;
  data_json: string;
  consumed_by: string[];
};

type SubscriptionsRow = {
  id: string;
  created_at: Date;
  updated_at: Date;
  read_until: string;
  topics: string[];
};

const migrationsDir = resolvePackagePath(
  '@backstage/plugin-events-backend',
  'migrations',
);

export class DatabaseEventHubStore implements EventHubStore {
  static async create(options: {
    database: DatabaseService;
    logger: LoggerService;
  }): Promise<DatabaseEventHubStore> {
    const db = await options.database.getClient();

    if (db.client.config.client !== 'pg') {
      throw new Error(
        `DatabaseEventHubStore only supports PostgreSQL, got '${db.client.config.client}'`,
      );
    }

    if (!options.database.migrations?.skip) {
      await db.migrate.latest({
        directory: migrationsDir,
      });
      options.logger.info('DatabaseEventHubStore migrations ran successfully');
    }

    return new DatabaseEventHubStore(db);
  }

  readonly #db: Knex;

  private constructor(db: Knex) {
    this.#db = db;
  }

  async publish(options: {
    params: EventParams;
    subscriberIds: string[];
  }): Promise<{ id: string }> {
    const result = await this.#db<EventsRow>(TABLE_EVENTS)
      .insert({
        topic: options.params.topic,
        data_json: JSON.stringify({
          payload: options.params.eventPayload,
          metadata: options.params.metadata,
        }),
        consumed_by: options.subscriberIds,
      })
      .returning('id');

    if (result.length !== 1) {
      throw new Error(`Failed to insert event, updated ${result.length} rows`);
    }

    const { id } = result[0];

    // TODO: notify

    return { id };
  }

  async upsertSubscription(id: string, topics: string[]): Promise<void> {
    const result = await this.#db<SubscriptionsRow>(TABLE_SUBSCRIPTIONS)
      .insert({
        id,
        updated_at: this.#db.fn.now(),
        topics,
        read_until: this.#db<EventsRow>(TABLE_EVENTS).max('id') as any, // TODO: figure out TS,
      })
      .onConflict('id')
      .merge(['topics', 'updated_at'])
      .returning('*');

    if (result.length !== 1) {
      throw new Error(
        `Failed to upsert subscription, updated ${result.length} rows`,
      );
    }
  }

  async readSubscription(id: string): Promise<{ events: EventParams[] }> {
    const result = await this.#db<SubscriptionsRow>(TABLE_SUBSCRIPTIONS)
      // Read the target subscription so that we can use the read marker and topics
      .with('sub', q => q.select().from(TABLE_SUBSCRIPTIONS).where({ id }))
      // Read the next batch of events for the subscription from its read marker
      .with('events', q =>
        q
          .select('event.*')
          .from({ event: 'event_bus_events', sub: 'sub' })
          // For each event, check if it matches any of the topics that we're subscribed to
          .where(
            'event.topic',
            '=',
            this.#db.ref('topics').withSchema('sub').wrap('ANY(', ')'),
          )
          // Skip events that have already been consumed by this subscription
          .where(
            this.#db.raw('?', id),
            '<>',
            this.#db.ref('consumed_by').withSchema('event').wrap('ANY(', ')'),
          )
          .where('event.id', '>', this.#db.ref('read_until').withSchema('sub'))
          .orderBy('event.id', 'asc')
          .limit(MAX_BATCH_SIZE),
      )
      // Find the ID of the last event in the batch, for use as the new read_until marker
      .with('last_event_id', q => q.max({ last_event_id: 'id' }).from('events'))
      // Aggregate the events into a JSON array so that we can return all of them with the UPDATE
      .with('events_array', q =>
        q
          .select({ events: this.#db.raw('json_agg(row_to_json(events))') })
          .from('events'),
      )
      // Update the read_until marker to the ID of the last event, or if no
      // events where read, the last ID out of all events
      .update({
        read_until: this.#db.raw(
          'COALESCE(last_event_id, (SELECT MAX(id) FROM event_bus_events))',
        ),
      })
      .updateFrom({
        events_array: 'events_array',
        last_event_id: 'last_event_id',
      })
      .where(`${TABLE_SUBSCRIPTIONS}.id`, id)
      .returning<[{ events: EventsRow[] }]>('events_array.events');

    if (result.length !== 1) {
      throw new Error(
        `Failed to upsert subscription, updated ${result.length} rows`,
      );
    }

    const rows = result[0].events;
    if (!rows || rows.length === 0) {
      return { events: [] };
    }

    return {
      events: result[0].events.map(row => {
        const { payload, metadata } = JSON.parse(row.data_json);
        return {
          topic: row.topic,
          eventPayload: payload,
          metadata,
        };
      }),
    };
  }

  async listen(
    _subscriptionId: string,
    _onNotify: (topicId: string) => void,
  ): Promise<() => void> {
    // TODO
    return () => {};
  }
}
