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

export type ReadSubscriptionResult =
  | { type: 'data'; events: CatalogEvent[]; ackId: string }
  | { type: 'empty' }
  | { type: 'block'; wait: () => Promise<'timeout' | 'aborted' | 'ready'> };

export interface ReadSubscriptionModel {
  readSubscription(options: {
    readOptions: ReadSubscriptionOptions;
    signal?: AbortSignal;
  }): Promise<ReadSubscriptionResult>;
}

export class ReadSubscriptionModelImpl implements ReadSubscriptionModel {
  readonly #knexPromise: Promise<Knex>;
  readonly #shutdownSignal: AbortSignal;
  readonly #historyConfig: HistoryConfig;

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
  }): Promise<ReadSubscriptionResult> {
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
}
