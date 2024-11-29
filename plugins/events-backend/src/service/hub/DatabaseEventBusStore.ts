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
  BackstageCredentials,
  BackstageServicePrincipal,
  DatabaseService,
  LifecycleService,
  LoggerService,
  SchedulerService,
  resolvePackagePath,
} from '@backstage/backend-plugin-api';
import { ForwardedError, NotFoundError } from '@backstage/errors';
import { HumanDuration, durationToMilliseconds } from '@backstage/types';

const WINDOW_MAX_COUNT_DEFAULT = 10_000;
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
  created_by: string;
  created_at: Date;
  topic: string;
  data_json: string;
  notified_subscribers: string[];
};

type SubscriptionsRow = {
  id: string;
  created_by: string;
  created_at: Date;
  updated_at: Date;
  read_until: string;
  topics: string[];
};

function creatorId(
  credentials: BackstageCredentials<BackstageServicePrincipal>,
) {
  return `service=${credentials.principal.subject}`;
}

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
      const listener = {
        topics,
        resolve(result: { topic: string }) {
          resolve(result);
          cleanup();
        },
        reject(err: Error) {
          reject(err);
          cleanup();
        },
      };
      this.#listeners.add(listener);

      const onAbort = () => {
        this.#listeners.delete(listener);
        this.#maybeTimeoutConnection();
        reject(signal.reason);
        cleanup();
      };

      function cleanup() {
        signal.removeEventListener('abort', onAbort);
      }

      signal.addEventListener('abort', onAbort);
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
      maxCount?: number;
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
    }

    const listener = new DatabaseEventBusListener(db.client, options.logger);

    const store = new DatabaseEventBusStore(
      db,
      options.logger,
      listener,
      options.window?.maxCount ?? WINDOW_MAX_COUNT_DEFAULT,
      durationToMilliseconds(options.window?.minAge ?? WINDOW_MIN_AGE_DEFAULT),
      durationToMilliseconds(options.window?.maxAge ?? WINDOW_MAX_AGE_DEFAULT),
    );

    await options.scheduler.scheduleTask({
      id: 'event-bus-cleanup',
      frequency: { seconds: 10 },
      timeout: { minutes: 1 },
      initialDelay: { seconds: 10 },
      fn: () => store.#cleanup(),
    });

    options.lifecycle.addShutdownHook(async () => {
      await listener.shutdown();
    });

    return store;
  }

  /** @internal */
  static async forTest({
    db,
    logger,
    minAge = 0,
    maxAge = 10_000,
  }: {
    db: Knex;
    logger: LoggerService;
    minAge?: number;
    maxAge?: number;
  }) {
    await db.migrate.latest({ directory: migrationsDir });

    const store = new DatabaseEventBusStore(
      db,
      logger,
      new DatabaseEventBusListener(db.client, logger),
      5,
      minAge,
      maxAge,
    );

    return Object.assign(store, { clean: () => store.#cleanup() });
  }

  readonly #db: Knex;
  readonly #logger: LoggerService;
  readonly #listener: DatabaseEventBusListener;
  readonly #windowMaxCount: number;
  readonly #windowMinAge: number;
  readonly #windowMaxAge: number;

  private constructor(
    db: Knex,
    logger: LoggerService,
    listener: DatabaseEventBusListener,
    windowMaxCount: number,
    windowMinAge: number,
    windowMaxAge: number,
  ) {
    this.#db = db;
    this.#logger = logger;
    this.#listener = listener;
    this.#windowMaxCount = windowMaxCount;
    this.#windowMinAge = windowMinAge;
    this.#windowMaxAge = windowMaxAge;
  }

  async publish(options: {
    event: EventParams;
    notifiedSubscribers?: string[];
    credentials: BackstageCredentials<BackstageServicePrincipal>;
  }): Promise<{ eventId: string } | undefined> {
    const topic = options.event.topic;
    const notifiedSubscribers = options.notifiedSubscribers ?? [];
    // This query inserts a new event into the database, but only if there are
    // subscribers to the topic that have not already been notified
    const result = await this.#db
      // There's no clean way to create a INSERT INTO .. SELECT with knex, so we end up with quite a lot of .raw(...)
      .into(
        this.#db.raw('?? (??, ??, ??, ??)', [
          TABLE_EVENTS,
          // These are the rows that we insert, and should match the SELECT below
          'created_by',
          'topic',
          'data_json',
          'notified_subscribers',
        ]),
      )
      .insert<EventsRow>(
        (q: Knex.QueryBuilder) =>
          q
            // We're not reading data to insert from anywhere else, just raw data
            .select(
              this.#db.raw('?', [creatorId(options.credentials)]),
              this.#db.raw('?', [topic]),
              this.#db.raw('?', [
                JSON.stringify({
                  payload: options.event.eventPayload,
                  metadata: options.event.metadata,
                }),
              ]),
              this.#db.raw('?', [notifiedSubscribers]),
            )
            // The rest of this query is to check whether there are any
            // subscribers that have not been notified yet
            .from(TABLE_SUBSCRIPTIONS)
            .whereNotIn('id', notifiedSubscribers) // Skip notified subscribers
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

    return { eventId: id };
  }

  async upsertSubscription(
    id: string,
    topics: string[],
    credentials: BackstageCredentials<BackstageServicePrincipal>,
  ): Promise<void> {
    const [{ max: maxId }] = await this.#db(TABLE_EVENTS).max('id');
    const result = await this.#db<SubscriptionsRow>(TABLE_SUBSCRIPTIONS)
      .insert({
        id,
        created_by: creatorId(credentials),
        updated_at: this.#db.fn.now(),
        topics,
        read_until: maxId || 0,
      })
      .onConflict('id')
      .merge(['created_by', 'topics', 'updated_at'])
      .returning('*');

    if (result.length !== 1) {
      throw new Error(
        `Failed to upsert subscription, updated ${result.length} rows`,
      );
    }
  }

  async readSubscription(id: string): Promise<{ events: EventParams[] }> {
    // The below query selects the subscription we're reading from, locks it for
    // an update, reads events for the subscription up to the limit, and then
    // updates the pointer to the last read event.
    //
    // This is written as a plain SQL query to spare us all the horrors of
    // expressing this in knex.

    const { rows: result } = await this.#db.raw<{
      rows: [] | [{ events: EventsRow[] }];
    }>(
      `
      WITH subscription AS (
        SELECT topics, read_until
        FROM event_bus_subscriptions
        WHERE id = :id
        FOR UPDATE
      ),
      selected_events AS (
        SELECT event_bus_events.*
        FROM event_bus_events
        INNER JOIN subscription
        ON event_bus_events.topic = ANY(subscription.topics)
        WHERE event_bus_events.id > subscription.read_until
        AND NOT :id = ANY(event_bus_events.notified_subscribers)
        ORDER BY event_bus_events.id ASC LIMIT :limit
      ),
      last_event_id AS (
        SELECT max(id) AS last_event_id
        FROM selected_events
      ),
      events_array AS (
        SELECT json_agg(row_to_json(selected_events)) AS events
        FROM selected_events
      )
      UPDATE event_bus_subscriptions
      SET read_until = COALESCE(last_event_id, (SELECT MAX(id) FROM event_bus_events), 0)
      FROM events_array, last_event_id
      WHERE event_bus_subscriptions.id = :id
      RETURNING events_array.events
    `,
      { id, limit: MAX_BATCH_SIZE },
    );

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
      events: rows.map(row => {
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

  async #cleanup() {
    try {
      const eventCount = await this.#db(TABLE_EVENTS)
        .delete()
        // Delete any events that are outside both the min age and size window
        .orWhere(inner =>
          inner
            .whereIn(
              'id',
              this.#db
                .select('id')
                .from(TABLE_EVENTS)
                .orderBy('id', 'desc')
                .offset(this.#windowMaxCount),
            )
            .andWhere(
              'created_at',
              '<',
              new Date(Date.now() - this.#windowMinAge),
            ),
        )
        // If events are outside the max age they will always be deleted
        .orWhere('created_at', '<', new Date(Date.now() - this.#windowMaxAge));

      if (eventCount > 0) {
        this.#logger.info(
          `Event cleanup resulted in ${eventCount} old events being deleted`,
        );
      }
    } catch (error) {
      this.#logger.error('Event cleanup failed', error);
    }

    try {
      // Delete any subscribers that aren't keeping up with current events
      const [{ min: minId }] = await this.#db(TABLE_EVENTS).min('id');

      let subscriberCount;
      if (minId === null) {
        // No events left, remove all subscribers. This can happen if no events
        // are published within the max age window.
        subscriberCount = await this.#db(TABLE_SUBSCRIPTIONS)
          .where('updated_at', '<', new Date(Date.now() - this.#windowMaxAge))
          .delete();
      } else {
        subscriberCount = await this.#db(TABLE_SUBSCRIPTIONS)
          .delete()
          // Read pointer points to the ID that has been read, so we need an additional offset
          .where('read_until', '<', minId - 1);
      }

      if (subscriberCount > 0) {
        this.#logger.info(
          `Subscription cleanup resulted in ${subscriberCount} stale subscribers being deleted`,
        );
      }
    } catch (error) {
      this.#logger.error('Subscription cleanup failed', error);
    }
  }
}
