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
import { EventBusStore } from './types';
import { Knex } from 'knex';
import {
  DatabaseService,
  LoggerService,
  resolvePackagePath,
} from '@backstage/backend-plugin-api';
import { NotFoundError } from '@backstage/errors';

const MAX_BATCH_SIZE = 10;
const LISTENER_CONNECTION_TIMEOUT_MS = 10_000;

const TABLE_EVENTS = 'event_bus_events';
const TABLE_SUBSCRIPTIONS = 'event_bus_subscriptions';
const TOPIC_PUBLISH = 'event_bus_publish';

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

interface InternalDbClient {
  acquireRawConnection(): Promise<InternalDbConnection>;
  destroyRawConnection(conn: InternalDbConnection): Promise<void>;
}

interface InternalDbConnection {
  query(sql: string): Promise<void>;
  end(): Promise<void>;
  on(
    event: 'notification',
    listener: (event: { channel: string; payload: string }) => void,
  ): void;
  on(event: 'error', listener: (error: Error) => void): void;
  on(event: 'end', listener: (error?: Error) => void): void;
  removeAllListeners(): void;
}

// This internal class manages a single connection to the database that all listeners share
class DatabaseEventBusListener {
  readonly #client: InternalDbClient;
  readonly #logger: LoggerService;

  readonly #listeners = new Set<{
    topics: Set<string>;
    onNotify: (topicId: string) => void;
    onError: () => void;
  }>();

  #connPromise?: Promise<InternalDbConnection>;
  #connTimeout?: NodeJS.Timeout;

  constructor(client: InternalDbClient, logger: LoggerService) {
    this.#client = client;
    this.#logger = logger.child({ type: 'DatabaseEventBusListener' });
  }

  async listen(
    topics: Set<string>,
    onNotify: (topicId: string) => void,
    onError: () => void,
  ): Promise<() => void> {
    if (this.#connTimeout) {
      clearTimeout(this.#connTimeout);
      this.#connTimeout = undefined;
    }
    await this.#ensureConnection();

    const listener = { topics, onNotify, onError };
    this.#listeners.add(listener);

    return () => {
      this.#listeners.delete(listener);

      // We don't use any heartbeats for the connection, as clients will be
      // driving that for us. We do however need to make sure we don't sit
      // idle for too long without any listeners
      if (this.#listeners.size === 0) {
        this.#connTimeout = setTimeout(() => {
          this.#connPromise?.then(conn => {
            this.#logger.info('Listener connection timed out');
            this.#connPromise = undefined;
            this.#destroyConnection(conn);
          });
        }, LISTENER_CONNECTION_TIMEOUT_MS);
      }
    };
  }

  #handleNotify(topic: string) {
    this.#logger.info(`Listener received notification for topic '${topic}'`);
    for (const l of this.#listeners) {
      if (l.topics.has(topic)) {
        l.onNotify(topic);
      }
    }
  }

  // We don't try to reconnect on error, instead we notify all listeners and let them try to establish a new connection
  #handleError(error: Error) {
    this.#logger.error(
      `Listener connection failed, notifying all listeners`,
      error,
    );
    for (const l of this.#listeners) {
      l.onError();
    }
  }

  #destroyConnection(conn: InternalDbConnection) {
    this.#client.destroyRawConnection(conn).catch(error => {
      this.#logger.error(`Listener failed to destroy connection`, error);
    });
    conn.removeAllListeners();
  }

  async #ensureConnection() {
    if (this.#connPromise) {
      await this.#connPromise;
      return;
    }
    this.#connPromise = Promise.resolve().then(async () => {
      const conn = await this.#client.acquireRawConnection();

      try {
        await conn.query(`LISTEN ${TOPIC_PUBLISH}`);

        conn.on('notification', event => {
          this.#handleNotify(event.payload);
        });
        conn.on('error', error => {
          this.#connPromise = undefined;
          this.#destroyConnection(conn);
          this.#handleError(error);
        });
        conn.on('end', error => {
          this.#connPromise = undefined;
          this.#destroyConnection(conn);
          this.#handleError(
            error ?? new Error('Connection ended unexpectedly'),
          );
        });
        return conn;
      } catch (error) {
        this.#destroyConnection(conn);
        throw error;
      }
    });
    try {
      await this.#connPromise;
    } catch (error) {
      this.#connPromise = undefined;
      throw error;
    }
  }
}

export class DatabaseEventBusStore implements EventBusStore {
  static async create(options: {
    database: DatabaseService;
    logger: LoggerService;
  }): Promise<DatabaseEventBusStore> {
    const db = await options.database.getClient();

    if (db.client.config.client !== 'pg') {
      throw new Error(
        `DatabaseEventBusStore only supports PostgreSQL, got '${db.client.config.client}'`,
      );
    }

    if (!options.database.migrations?.skip) {
      await db.migrate.latest({
        directory: migrationsDir,
      });
      options.logger.info('DatabaseEventBusStore migrations ran successfully');
    }

    return new DatabaseEventBusStore(db, options.logger);
  }

  readonly #db: Knex;
  readonly #logger: LoggerService;
  readonly #listener: DatabaseEventBusListener;

  private constructor(db: Knex, logger: LoggerService) {
    this.#db = db;
    this.#logger = logger;
    this.#listener = new DatabaseEventBusListener(db.client, logger);
  }

  async publish(options: {
    params: EventParams;
    subscriberIds: string[];
  }): Promise<{ id: string } | undefined> {
    const topic = options.params.topic;
    // This query inserts a new event into the database, but only if there are
    // subscribers to the topic that have not already been notified
    const result = await this.#db
      // There's no clean way to create a INSERT INTO .. SELECT with knex, so we end up with quite a lot of .raw(...)
      .into(
        this.#db.raw('?? (??, ??, ??)', [
          TABLE_EVENTS,
          // These are the rows that we insert, and should match the SELECT below
          'topic',
          'data_json',
          'consumed_by',
        ]),
      )
      .insert<EventsRow>(
        (q: Knex.QueryBuilder) =>
          q
            // We're not reading data to insert from anywhere else, just raw data
            .select(
              this.#db.raw('?', [topic]),
              this.#db.raw('?', [
                JSON.stringify({
                  payload: options.params.eventPayload,
                  metadata: options.params.metadata,
                }),
              ]),
              this.#db.raw('?', [options.subscriberIds]),
            )
            // The rest of this query is to check whether there are any
            // subscribers that have not been notified yet
            .from(TABLE_SUBSCRIPTIONS)
            .whereNotIn('id', options.subscriberIds) // Skip notified subscribers
            .andWhere(this.#db.raw('? = ANY(topics)', [topic])) // Match topic
            .having(this.#db.raw('count(*)'), '>', 0), // Check if there are any results
      )
      .returning<{ id: string }[]>('id');

    if (result.length === 0) {
      return undefined;
    }
    if (result.length > 1) {
      throw new Error(
        `Failed to insert event, unexpectedly updated ${result.length} rows`,
      );
    }

    const [{ id }] = result;

    // Notify other event bus instances that an event is available on the topic
    const notifyResult = await this.#db.select(
      this.#db.raw(`pg_notify(?, ?)`, [TOPIC_PUBLISH, topic]),
    );
    if (notifyResult?.length !== 1) {
      this.#logger.warn(
        `Failed to notify subscribers of event with ID '${id}' on topic '${topic}'`,
      );
    }

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

    if (result.length === 0) {
      throw new NotFoundError(`Subscription with ID '${id}' not found`);
    } else if (result.length > 1) {
      throw new Error(
        `Failed to read subscription, unexpectedly updated ${result.length} rows`,
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
    subscriptionId: string,
    listeners: {
      onNotify: (topicId: string) => void;
      onError: () => void;
    },
  ): Promise<{ cancel(): void }> {
    const result = await this.#db<SubscriptionsRow>(TABLE_SUBSCRIPTIONS)
      .select('topics')
      .where({ id: subscriptionId })
      .first();
    console.log(`DEBUG: result=`, result);
    if (!result) {
      throw new NotFoundError(
        `Subscription with ID '${subscriptionId}' not found`,
      );
    }
    const topics = new Set(result.topics ?? []);
    const cancel = await this.#listener.listen(
      topics,
      listeners.onNotify,
      listeners.onError,
    );
    return { cancel };
  }
}
