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

import {
  createDeferred,
  DeferredPromise,
  durationToMilliseconds,
} from '@backstage/types';
import { Knex } from 'knex';
import { EventsTableRow } from '../tables';
import { HistoryConfig } from '../../config';
import { ChangeHandler } from './types';

/**
 * Encapsulates a single subscription to changes.
 *
 * @remarks
 *
 * While nobody is actively listening, it rolls up any notfications in memory so
 * that the subscriber does not miss anything in between calls to
 * `waitForUpdate`.
 */
class Subscription {
  #queuedNotification: boolean;
  #deferred: DeferredPromise<void> | undefined;

  constructor() {
    this.#queuedNotification = false;
    this.#deferred = undefined;
  }

  notify() {
    if (this.#deferred) {
      this.#deferred.resolve();
      this.#deferred = undefined;
    } else {
      this.#queuedNotification = true;
    }
  }

  reject(error: Error) {
    if (this.#deferred) {
      this.#deferred.reject(error);
      this.#deferred = undefined;
    }
  }

  async waitForUpdate(): Promise<void> {
    if (this.#queuedNotification) {
      this.#queuedNotification = false;
      return;
    }

    if (!this.#deferred) {
      this.#deferred = createDeferred();
    }

    await this.#deferred;
  }
}

/**
 * Notifies callers about changes to the history events table, by using polling.
 */
export class PollingChangeHandler implements ChangeHandler {
  readonly #knex: Knex;
  readonly #historyConfig: HistoryConfig;
  readonly #subscriptions = new Set<Subscription>();
  #highestKnownEventId: string;
  #pollLoopHandle: NodeJS.Timeout | undefined;
  #isShuttingDown: boolean;

  constructor(knex: Knex, historyConfig: HistoryConfig) {
    this.#knex = knex;
    this.#historyConfig = historyConfig;
    this.#highestKnownEventId = '0';
    this.#pollLoopHandle = undefined;
    this.#isShuttingDown = false;
  }

  async setupListener(
    signal: AbortSignal,
  ): Promise<{ waitForUpdate(): Promise<void> }> {
    if (this.#isShuttingDown) {
      throw new Error('PollingChangeHandler is shutting down');
    }

    await this.#ensurePollingLoop();

    const subscription = new Subscription();
    this.#subscriptions.add(subscription);

    const onAbort = () => {
      this.#subscriptions.delete(subscription);
      if (this.#subscriptions.size === 0) {
        this.#stopPollingLoop();
      }
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

  async shutdown() {
    if (this.#isShuttingDown) {
      return;
    }
    this.#isShuttingDown = true;

    this.#stopPollingLoop();

    const subscriptions = Array.from(this.#subscriptions);
    this.#subscriptions.clear();

    for (const subscription of subscriptions) {
      subscription.reject(new Error('PollingChangeHandler is shutting down'));
    }
  }

  async #ensurePollingLoop() {
    if (this.#isShuttingDown || this.#pollLoopHandle) {
      return;
    }

    const pollOnce = async () => {
      const newHighestEventId = await this.#getCurrentHighestEventId();
      if (this.#highestKnownEventId !== newHighestEventId) {
        this.#highestKnownEventId = newHighestEventId;
        for (const subscription of this.#subscriptions) {
          subscription.notify();
        }
      }
    };

    this.#highestKnownEventId = await this.#getCurrentHighestEventId();
    this.#pollLoopHandle = setInterval(
      () => pollOnce().catch(() => {}),
      durationToMilliseconds(this.#historyConfig.blockPollFrequency),
    );
  }

  #stopPollingLoop() {
    if (this.#pollLoopHandle) {
      clearInterval(this.#pollLoopHandle);
      this.#pollLoopHandle = undefined;
    }
  }

  async #getCurrentHighestEventId(): Promise<string> {
    // faster, "looser" check than evaluating the exact MAX(),
    // and also we do not have to do bighum comparisons in js
    const result = await this.#knex<EventsTableRow>('module_history__events')
      .where('event_id', '>', this.#highestKnownEventId)
      .orderBy('event_id', 'desc')
      .limit(1);
    if (result.length === 0) {
      return this.#highestKnownEventId;
    }
    return result[0].event_id;
  }
}
