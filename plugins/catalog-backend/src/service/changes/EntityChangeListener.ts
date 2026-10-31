/*
 * Copyright 2026 The Backstage Authors
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
import { durationToMilliseconds, HumanDuration } from '@backstage/types';
import { Knex } from 'knex';
import pLimit from 'p-limit';
import { getMaxGeneration } from '../../database/operations/changes/readEntityChanges';
import { getEntityChangeSubscriptionStates } from '../../database/operations/changes/subscriptions';

export type EntityChangeWaitResult = 'ready' | 'timeout' | 'aborted';

type Waiter = {
  /** Whether the waiter has not yet been checked since it registered. */
  fresh: boolean;
  /** The subscription that the waiter reads from, if any. */
  subscriptionId?: string;
  /** The subscription state seen at the previous poll. */
  subscriptionState?: string;
  wake(): void;
};

/**
 * Lets blocked requests wait until there may be new changes for them.
 *
 * @remarks
 *
 * Polling is the only mechanism, since `LISTEN` doesn't survive transaction
 * pooling. While anyone is waiting, one loop per instance reads the highest
 * generation, and in the same poll the state of every subscription that has
 * a waiter, in one batch. That way an ack, nack or timeout on any instance is
 * noticed within a poll interval. The stitcher on this instance also signals
 * publications, which triggers an early poll. When something relevant has
 * changed, each affected waiter runs its own check to see whether there is
 * something that it can actually read.
 */
export class EntityChangeListener {
  readonly #knex: Knex;
  readonly #logger: LoggerService;
  readonly #pollInterval: number;
  readonly #blockDuration: number;
  readonly #waiters = new Set<Waiter>();
  readonly #checkLimiter = pLimit(2);
  readonly #shutdown = new AbortController();
  #highestGeneration: string | undefined;
  #timer: NodeJS.Timeout | undefined;
  #polling = false;
  #pollAgain = false;

  constructor(options: {
    knex: Knex;
    logger: LoggerService;
    pollInterval?: HumanDuration;
    blockDuration?: HumanDuration;
  }) {
    this.#knex = options.knex;
    this.#logger = options.logger;
    this.#pollInterval = durationToMilliseconds(
      options.pollInterval ?? { seconds: 1 },
    );
    this.#blockDuration = durationToMilliseconds(
      options.blockDuration ?? { seconds: 10 },
    );
  }

  /**
   * Signals that something may just have been published.
   */
  notify(): void {
    if (this.#waiters.size) {
      this.#schedule(0);
    }
  }

  /**
   * Prepares a wait. Each wait checks once right away before relying on
   * changes to the highest generation, so nothing published between the
   * caller's own read and the wait is missed.
   *
   * @param checker - Returns true when there is data for the caller.
   * @param signal - Aborts the wait, for example when the client disconnects.
   * @param subscriptionId - The subscription being read, so that changes to
   *   its state also wake the waiter.
   */
  setupListener(options: {
    checker: () => Promise<boolean>;
    signal: AbortSignal;
    subscriptionId?: string;
  }): {
    waitForUpdate(): Promise<EntityChangeWaitResult>;
  } {
    const { checker } = options;
    const signal = AbortSignal.any([options.signal, this.#shutdown.signal]);

    let resolve: ((result: EntityChangeWaitResult) => void) | undefined;
    let checking = false;
    let checkAgain = false;

    const waiter: Waiter = {
      fresh: true,
      subscriptionId: options.subscriptionId,
      wake: () => {
        if (checking) {
          checkAgain = true;
          return;
        }
        checking = true;
        (async () => {
          do {
            checkAgain = false;
            try {
              if (await this.#checkLimiter(checker)) {
                resolve?.('ready');
                return;
              }
            } catch (error) {
              this.#logger.warn('Failed to check for entity changes', error);
            }
          } while (checkAgain && resolve);
        })().finally(() => {
          checking = false;
        });
      },
    };

    return {
      waitForUpdate: () => {
        if (signal.aborted) {
          return Promise.resolve('aborted');
        }
        return new Promise<EntityChangeWaitResult>(promiseResolve => {
          let timeout: NodeJS.Timeout | undefined = undefined;
          let onAbort: (() => void) | undefined = undefined;
          const finish = (result: EntityChangeWaitResult) => {
            if (!resolve) {
              return;
            }
            resolve = undefined;
            clearTimeout(timeout);
            signal.removeEventListener('abort', onAbort!);
            this.#waiters.delete(waiter);
            promiseResolve(result);
          };
          onAbort = () => finish('aborted');
          timeout = setTimeout(() => finish('timeout'), this.#blockDuration);
          resolve = finish;
          signal.addEventListener('abort', onAbort);
          this.#waiters.add(waiter);
          this.#schedule(0);
        });
      },
    };
  }

  /**
   * Releases all waiters and stops polling.
   */
  stop(): void {
    this.#shutdown.abort();
    clearTimeout(this.#timer);
    this.#timer = undefined;
  }

  #schedule(delay: number) {
    if (this.#shutdown.signal.aborted) {
      return;
    }
    if (this.#polling) {
      this.#pollAgain = true;
      return;
    }
    if (this.#timer && delay > 0) {
      return;
    }
    clearTimeout(this.#timer);
    this.#timer = setTimeout(() => {
      this.#timer = undefined;
      this.#poll();
    }, delay);
  }

  async #poll() {
    this.#polling = true;
    this.#pollAgain = false;
    try {
      const waiters = [...this.#waiters];
      const subscriptionIds = new Set(
        waiters.flatMap(w => (w.subscriptionId ? [w.subscriptionId] : [])),
      );
      const [generation, subscriptionStates] = await Promise.all([
        getMaxGeneration(this.#knex),
        getEntityChangeSubscriptionStates(this.#knex, [...subscriptionIds]),
      ]);
      const changed = generation !== this.#highestGeneration;
      this.#highestGeneration = generation;
      for (const waiter of waiters) {
        let subscriptionChanged = false;
        if (waiter.subscriptionId) {
          const state = subscriptionStates.get(waiter.subscriptionId) ?? '';
          subscriptionChanged = state !== waiter.subscriptionState;
          waiter.subscriptionState = state;
        }
        // A new waiter is always checked once, since something may have
        // changed between its registration and the previous poll
        if (changed || subscriptionChanged || waiter.fresh) {
          waiter.fresh = false;
          waiter.wake();
        }
      }
    } catch (error) {
      this.#logger.warn('Failed to poll for entity changes', error);
    } finally {
      this.#polling = false;
    }

    if (this.#waiters.size) {
      this.#schedule(this.#pollAgain ? 0 : this.#pollInterval);
    } else {
      this.#highestGeneration = undefined;
    }
  }
}
