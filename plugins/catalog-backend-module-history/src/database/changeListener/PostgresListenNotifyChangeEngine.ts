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

import { LoggerService } from '@backstage/backend-plugin-api';
import { ForwardedError } from '@backstage/errors';
import {
  createDeferred,
  DeferredPromise,
  durationToMilliseconds,
  HumanDuration,
} from '@backstage/types';
import { Knex } from 'knex';
import { ChangeEngine } from './types';

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

const LISTENER_CONNECTION_TIMEOUT: HumanDuration = { minutes: 1 };
const KEEPALIVE_INTERVAL: HumanDuration = { minutes: 1 };
export const TOPIC_PUBLISH = 'event_bus_publish';

/**
 * Encapsulates a single subscription to a set of topics.
 *
 * @remarks
 *
 * While nobody is actively listening, it rolls up any notified topics in memory
 * so that the subscriber does not miss anything in between calls to
 * `waitForUpdate`.
 */
class Subscription {
  readonly #topics: Set<string>;
  readonly #notifiedTopics: Array<string>;
  #deferred: DeferredPromise<string> | undefined;

  constructor(topics: Iterable<string>) {
    this.#topics = new Set(topics);
    this.#notifiedTopics = [];
    this.#deferred = undefined;
  }

  notify(topic: string) {
    if (this.#topics.has(topic)) {
      if (this.#deferred) {
        this.#deferred.resolve(topic);
        this.#deferred = undefined;
      } else if (!this.#notifiedTopics.includes(topic)) {
        this.#notifiedTopics.push(topic);
      }
    }
  }

  reject(error: Error) {
    if (this.#deferred) {
      this.#deferred.reject(error);
      this.#deferred = undefined;
    }
  }

  async waitForUpdate(): Promise<{ topic: string }> {
    if (this.#notifiedTopics.length > 0) {
      // shift to return in the order they were notified
      const topic = this.#notifiedTopics.shift()!;
      return { topic };
    }

    if (!this.#deferred) {
      this.#deferred = createDeferred();
    }

    const topic = await this.#deferred;
    return { topic };
  }
}

/**
 * Manages a single connection to the database that all NOTIFY listeners can
 * share.
 *
 * @remarks
 *
 * This class only works for postgres databases, since they are the ones that
 * implement the notify/listen commands.
 */
export class PostgresListenNotifyChangeEngine implements ChangeEngine {
  readonly #client: InternalDbClient;
  readonly #logger: LoggerService;
  readonly #subscriptions = new Set<Subscription>();

  #isShuttingDown = false;
  #connPromise?: Promise<InternalDbConnection>;
  #connTimeout?: NodeJS.Timeout;
  #keepaliveInterval?: NodeJS.Timeout;

  constructor(knex: Knex, logger: LoggerService) {
    if (!knex.client.config.client.includes('pg')) {
      throw new Error(
        'PostgresListenNotifyChangeEngine only works for postgres databases',
      );
    }
    this.#client = knex.client;
    this.#logger = logger.child({ type: 'PostgresListenNotifyChangeEngine' });
  }

  async setupListener(
    signal: AbortSignal,
  ): Promise<{ waitForUpdate(): Promise<void> }> {
    const subscription = await this.setupListenerInternal(
      new Set(['history_event_created']),
      signal,
    );
    return {
      async waitForUpdate() {
        return await subscription.waitForUpdate().then(() => {});
      },
    };
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

  async setupListenerInternal(
    topics: Set<string>,
    signal: AbortSignal,
  ): Promise<{ waitForUpdate(): Promise<{ topic: string }> }> {
    if (this.#connTimeout) {
      clearTimeout(this.#connTimeout);
      this.#connTimeout = undefined;
    }

    await this.#ensureConnection();

    const subscription = new Subscription(topics);
    this.#subscriptions.add(subscription);

    const onAbort = () => {
      this.#subscriptions.delete(subscription);
      this.#maybeTimeoutConnection();
      subscription.reject(signal.reason);
      cleanup();
    };

    function cleanup() {
      signal.removeEventListener('abort', onAbort);
    }

    signal.addEventListener('abort', onAbort);

    return {
      waitForUpdate: subscription.waitForUpdate.bind(subscription),
    };
  }

  #handleNotify(topic: string) {
    this.#logger.debug(`Listener received notification for topic '${topic}'`);
    for (const subscription of this.#subscriptions) {
      subscription.notify(topic);
    }
    this.#maybeTimeoutConnection();
  }

  // We don't try to reconnect on error, instead we notify all subscribers and let
  // them try to establish a new connection
  #handleError(error: Error) {
    this.#logger.error(
      `Listener connection failed, notifying all subbscribers`,
      error,
    );
    for (const subscription of this.#subscriptions) {
      subscription.reject(new Error('Listener connection failed'));
    }
    this.#subscriptions.clear();
    this.#maybeTimeoutConnection();
  }

  #maybeTimeoutConnection() {
    // If we don't have any subscribers, destroy the connection after a timeout
    if (this.#subscriptions.size === 0 && !this.#connTimeout) {
      this.#connTimeout = setTimeout(() => {
        this.#connTimeout = undefined;
        this.#connPromise?.then(conn => {
          this.#logger.info('Listener connection timed out, destroying');
          this.#connPromise = undefined;
          this.#destroyConnection(conn);
        });
      }, durationToMilliseconds(LISTENER_CONNECTION_TIMEOUT));
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
        }, durationToMilliseconds(KEEPALIVE_INTERVAL));

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
