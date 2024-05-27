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
  LifecycleService,
  LoggerService,
  SchedulerService,
  resolvePackagePath,
} from '@backstage/backend-plugin-api';
import { ForwardedError, NotFoundError } from '@backstage/errors';
import { HumanDuration, durationToMilliseconds } from '@backstage/types';

const WINDOW_SIZE_DEFAULT = 10000;
const WINDOW_MIN_AGE_DEFAULT = { minutes: 10 };
const WINDOW_MAX_AGE_DEFAULT = { days: 1 };

const MAX_BATCH_SIZE = 10;
const LISTENER_CONNECTION_TIMEOUT_MS = 60_000;
const KEEPALIVE_INTERVAL_MS = 60_000;

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
    resolve: (result: { topic: string }) => void;
    reject: (error: Error) => void;
  }>();

  #isShuttingDown = false;
  #connPromise?: Promise<InternalDbConnection>;
  #connTimeout?: NodeJS.Timeout;
  #keepaliveInterval?: NodeJS.Timeout;

  constructor(client: InternalDbClient, logger: LoggerService) {
    this.#client = client;
    this.#logger = logger.child({ type: 'DatabaseEventBusListener' });
  }

  async setupListener(
    topics: Set<string>,
    signal: AbortSignal,
  ): Promise<{ waitForUpdate(): Promise<{ topic: string }> }> {
    if (this.#connTimeout) {
      clearTimeout(this.#connTimeout);
      this.#connTimeout = undefined;
    }

    await this.#ensureConnection();

    const updatePromise = new Promise<{ topic: string }>((resolve, reject) => {
      const listener = { topics, resolve, reject };
      this.#listeners.add(listener);

      signal.addEventListener('abort', () => {
        this.#listeners.delete(listener);
        this.#maybeTimeoutConnection();
        reject(signal.reason);
      });
    });

    // Ignore unhandled rejections
    updatePromise.catch(() => {});

    return { waitForUpdate: () => updatePromise };
  }

  async shutdown() {
    if (this.#isShuttingDown) {
      return;
    }
    this.#isShuttingDown = true;
    const conn = await this.#connPromise?.catch(() => undefined);
    if (conn) {
      this.#destroyConnection(conn);
    }
  }

  #handleNotify(topic: string) {
    this.#logger.debug(`Listener received notification for topic '${topic}'`);
    for (const l of this.#listeners) {
      if (l.topics.has(topic)) {
        l.resolve({ topic });
        this.#listeners.delete(l);
      }
    }
    this.#maybeTimeoutConnection();
  }

  // We don't try to reconnect on error, instead we notify all listeners and let
  // them try to establish a new connection
  #handleError(error: Error) {
    this.#logger.error(
      `Listener connection failed, notifying all listeners`,
      error,
    );
    for (const l of this.#listeners) {
      l.reject(new Error('Listener connection failed'));
    }
    this.#listeners.clear();
    this.#maybeTimeoutConnection();
  }

  #maybeTimeoutConnection() {
    // If we don't have any listeners, destroy the connection after a timeout
    if (this.#listeners.size === 0 && !this.#connTimeout) {
      this.#connTimeout = setTimeout(() => {
        this.#connTimeout = undefined;
        this.#connPromise?.then(conn => {
          this.#logger.info('Listener connection timed out, destroying');
          this.#connPromise = undefined;
          this.#destroyConnection(conn);
        });
      }, LISTENER_CONNECTION_TIMEOUT_MS);
    }
  }

  #destroyConnection(conn: InternalDbConnection) {
    if (this.#keepaliveInterval) {
      clearInterval(this.#keepaliveInterval);
      this.#keepaliveInterval = undefined;
    }
    this.#client.destroyRawConnection(conn).catch(error => {
      this.#logger.error(`Listener failed to destroy connection`, error);
    });
    conn.removeAllListeners();
  }

  async #ensureConnection() {
    if (this.#isShuttingDown) {
      throw new Error('Listener is shutting down');
    }
    if (this.#connPromise) {
      await this.#connPromise;
      return;
    }
    this.#connPromise = Promise.resolve().then(async () => {
      const conn = await this.#client.acquireRawConnection();

      try {
        await conn.query(`LISTEN ${TOPIC_PUBLISH}`);

        // Set up a keepalive interval to make sure the connection stays alive
        if (this.#keepaliveInterval) {
          clearInterval(this.#keepaliveInterval);
        }
        this.#keepaliveInterval = setInterval(() => {
          conn.query('select 1').catch(error => {
            this.#connPromise = undefined;
            this.#destroyConnection(conn);
            this.#handleError(new ForwardedError('Keepalive failed', error));
          });
        }, KEEPALIVE_INTERVAL_MS);

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
    scheduler: SchedulerService;
    lifecycle: LifecycleService;
    window?: {
      /** Events within this range will never be deleted */
      minAge?: HumanDuration;
      /** Events outside of this age will always be deleted */
      maxAge?: HumanDuration;
      /** Events outside of this count will be deleted if they are outside the minAge window */
      size?: number;
    };
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

    const listener = new DatabaseEventBusListener(db.client, options.logger);

    const store = new DatabaseEventBusStore(
      db,
      options.logger,
      listener,
      options.window?.size ?? WINDOW_SIZE_DEFAULT,
      durationToMilliseconds(options.window?.minAge ?? WINDOW_MIN_AGE_DEFAULT),
      durationToMilliseconds(options.window?.maxAge ?? WINDOW_MAX_AGE_DEFAULT),
    );

    options.scheduler.scheduleTask({
      id: 'event-bus-cleanup',
      frequency: { seconds: 10 },
      timeout: { minutes: 1 },
      initialDelay: { seconds: 10 },
      fn: store.#cleanup,
    });

    options.lifecycle.addShutdownHook(async () => {
      await listener.shutdown();
    });

    return store;
  }

  readonly #db: Knex;
  readonly #logger: LoggerService;
  readonly #listener: DatabaseEventBusListener;
  readonly #windowSize: number;
  readonly #windowMinAge: number;
  readonly #windowMaxAge: number;

  private constructor(
    db: Knex,
    logger: LoggerService,
    listener: DatabaseEventBusListener,
    windowSize: number,
    windowMinAge: number,
    windowMaxAge: number,
  ) {
    this.#db = db;
    this.#logger = logger;
    this.#listener = listener;
    this.#windowSize = windowSize;
    this.#windowMinAge = windowMinAge;
    this.#windowMaxAge = windowMaxAge;
  }

  async publish(options: {
    params: EventParams;
    consumedBy?: string[];
  }): Promise<{ id: string } | undefined> {
    const topic = options.params.topic;
    const consumedBy = options.consumedBy ?? [];
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
              this.#db.raw('?', [consumedBy]),
            )
            // The rest of this query is to check whether there are any
            // subscribers that have not been notified yet
            .from(TABLE_SUBSCRIPTIONS)
            .whereNotIn('id', consumedBy) // Skip notified subscribers
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
        read_until: this.#db.raw(
          `( SELECT COALESCE(MAX("id"), 0) FROM "${TABLE_EVENTS}" )`,
        ),
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
      .with('sub', q =>
        q.select().from(TABLE_SUBSCRIPTIONS).where({ id }).forUpdate(),
      )
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
          .whereNot(
            this.#db.raw('?', id),
            '=',
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
          'COALESCE(last_event_id, (SELECT MAX(id) FROM event_bus_events), 0)',
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

  async setupListener(
    subscriptionId: string,
    options: {
      signal: AbortSignal;
    },
  ): Promise<{ waitForUpdate(): Promise<{ topic: string }> }> {
    const result = await this.#db<SubscriptionsRow>(TABLE_SUBSCRIPTIONS)
      .select('topics')
      .where({ id: subscriptionId })
      .first();

    if (!result) {
      throw new NotFoundError(
        `Subscription with ID '${subscriptionId}' not found`,
      );
    }

    options.signal.throwIfAborted();

    return this.#listener.setupListener(
      new Set(result.topics ?? []),
      options.signal,
    );
  }

  #cleanup = async () => {
    try {
      const eventCount = await this.#db
        .delete()
        .from(TABLE_EVENTS)
        // Delete any events that are outside both the min age and size window
        .where('created_at', '<', new Date(Date.now() - this.#windowMinAge))
        .andWhere(
          'id',
          '=',
          this.#db
            .raw(
              this.#db
                .select('id')
                .from(TABLE_EVENTS)
                .orderBy('id', 'desc')
                .offset(this.#windowSize),
            )
            .wrap('ANY(ARRAY(', '))'),
        )
        // If events are outside the max age they will always be deleted
        .orWhere('created_at', '<', new Date(Date.now() - this.#windowMaxAge));
      this.#logger.info(
        `Event cleanup resulted in ${eventCount} old events being deleted`,
      );
    } catch (error) {
      this.#logger.error('Event cleanup failed', error);
    }

    try {
      // Delete any subscribers that aren't keeping up with current events
      const subscriberCount = await this.#db
        .delete()
        .from(TABLE_SUBSCRIPTIONS)
        .where('read_until', '<', (q: Knex.QueryBuilder) =>
          q.select(this.#db.raw('MIN(id)')).from(TABLE_EVENTS),
        );

      this.#logger.info(
        `Subscription cleanup resulted in ${subscriberCount} stale subscribers being deleted`,
      );
    } catch (error) {
      this.#logger.error('Subscription cleanup failed', error);
    }
  };
}
