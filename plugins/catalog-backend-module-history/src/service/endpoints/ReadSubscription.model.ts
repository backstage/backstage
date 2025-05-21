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

import { durationToMilliseconds } from '@backstage/types';
import { once } from 'events';
import { Knex } from 'knex';
import { HistoryConfig } from '../../config';
import { readHistorySubscription } from '../../database/operations/readHistorySubscription';
import { CatalogEvent } from './types';

export interface ReadSubscriptionOptions {
  subscriptionId: string;
  limit: number;
}

export interface ReadSubscriptionModel {
  readSubscriptionNonblocking(options: {
    readOptions: ReadSubscriptionOptions;
    peek?: boolean;
  }): Promise<{ events: CatalogEvent[]; ackId: string } | undefined>;
  blockUntilDataIsReady(options: {
    readOptions: ReadSubscriptionOptions;
    signal?: AbortSignal;
  }): Promise<'timeout' | 'aborted' | 'ready'>;
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

  async readSubscriptionNonblocking(options: {
    readOptions: ReadSubscriptionOptions;
  }): Promise<{ events: CatalogEvent[]; ackId: string } | undefined> {
    return await readHistorySubscription(await this.#knexPromise, {
      subscriptionId: options.readOptions.subscriptionId,
      operation: 'read',
      limit: options.readOptions.limit,
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
    const deadline =
      Date.now() + durationToMilliseconds(this.#historyConfig.blockDuration);

    while (Date.now() < deadline) {
      // Not using AbortSignal.timeout() because https://github.com/nodejs/node/pull/57867
      const timeoutController = new AbortController();
      const timeoutHandle = setTimeout(
        () => timeoutController.abort(),
        durationToMilliseconds(this.#historyConfig.blockPollFrequency),
      );
      try {
        const inner = AbortSignal.any([
          timeoutController.signal,
          this.#shutdownSignal,
          ...(options.signal ? [options.signal] : []),
        ]);
        // The event won't ever fire if the signal is already aborted, so we
        // need this check.
        if (!inner.aborted) {
          await once(inner, 'abort');
        }
        if (this.#shutdownSignal.aborted || options.signal?.aborted) {
          return 'aborted';
        }
        const result = await readHistorySubscription(await this.#knexPromise, {
          subscriptionId: options.readOptions.subscriptionId,
          operation: 'peek',
          limit: 1,
          historyConfig: this.#historyConfig,
        });
        if (result) {
          return 'ready';
        }
      } finally {
        // Clean up
        clearTimeout(timeoutHandle);
        timeoutController.abort();
      }
    }

    return 'timeout';
  }
}
