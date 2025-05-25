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
import { readHistorySubscription } from '../../database/operations/readHistorySubscription';
import { waitForEvents } from '../../database/operations/waitForEvents';
import { CatalogEvent } from './types';

export interface ReadSubscriptionOptions {
  subscriptionId: string;
  limit: number;
  block: boolean;
}

export interface ReadSubscriptionModel {
  readSubscription(options: {
    readOptions: ReadSubscriptionOptions;
    signal?: AbortSignal;
  }): Promise<
    | { type: 'data'; events: CatalogEvent[]; ackId: string }
    | { type: 'empty' }
    | { type: 'block'; wait: () => Promise<'timeout' | 'aborted' | 'ready'> }
  >;
}

export class ReadSubscriptionModelImpl implements ReadSubscriptionModel {
  #knexPromise: Promise<Knex>;
  #shutdownSignal: AbortSignal;
  #historyConfig: HistoryConfig;

  constructor(options: {
    knexPromise: Promise<Knex>;
    historyConfig: HistoryConfig;
    shutdownSignal: AbortSignal;
  }) {
    this.#knexPromise = options.knexPromise;
    this.#shutdownSignal = options.shutdownSignal;
    this.#historyConfig = options.historyConfig;
  }

  async readSubscription(options: {
    readOptions: ReadSubscriptionOptions;
    signal?: AbortSignal;
  }): Promise<
    | { type: 'data'; events: CatalogEvent[]; ackId: string }
    | { type: 'empty' }
    | { type: 'block'; wait: () => Promise<'timeout' | 'aborted' | 'ready'> }
  > {
    const { subscriptionId, limit, block } = options.readOptions;
    const knex = await this.#knexPromise;

    const result = await readHistorySubscription(knex, {
      subscriptionId,
      operation: 'read',
      limit,
      historyConfig: this.#historyConfig,
    });

    if (result) {
      return {
        type: 'data',
        events: result.events,
        ackId: result.ackId,
      };
    }

    if (!block) {
      return {
        type: 'empty',
      };
    }

    return {
      type: 'block',
      wait: async () => {
        return await waitForEvents({
          historyConfig: this.#historyConfig,
          signal: AbortSignal.any([
            this.#shutdownSignal,
            ...(options.signal ? [options.signal] : []),
          ]),
          checker: () =>
            readHistorySubscription(knex, {
              subscriptionId,
              operation: 'peek',
              limit: 1,
              historyConfig: this.#historyConfig,
            }).then(r => r !== undefined),
        });
      },
    };
  }

  async readSubscriptionNonblocking(options: {
    readOptions: ReadSubscriptionOptions;
  }): Promise<{ events: CatalogEvent[]; ackId: string } | undefined> {
    const { subscriptionId, limit } = options.readOptions;
    const knex = await this.#knexPromise;

    return await readHistorySubscription(knex, {
      subscriptionId,
      operation: 'read',
      limit,
      historyConfig: this.#historyConfig,
    });
  }

  // TODO(freben): Implement a more efficient way to wait for new events. See
  // the events backend using LISTEN/NOTIFY for inspiration. For now, wait for
  // up until the deadline and stop early if the request closes, or if we are
  // shutting down, or we start finding some rows.
  async blockUntilDataIsReady(options: {
    readOptions: ReadSubscriptionOptions;
    signal?: AbortSignal;
  }): Promise<'timeout' | 'aborted' | 'ready'> {
    const { subscriptionId } = options.readOptions;
    const knex = await this.#knexPromise;

    return await waitForEvents({
      historyConfig: this.#historyConfig,
      signal: AbortSignal.any([
        this.#shutdownSignal,
        ...(options.signal ? [options.signal] : []),
      ]),
      checker: () =>
        readHistorySubscription(knex, {
          subscriptionId,
          operation: 'peek',
          limit: 1,
          historyConfig: this.#historyConfig,
        }).then(r => r !== undefined),
    });
  }
}
