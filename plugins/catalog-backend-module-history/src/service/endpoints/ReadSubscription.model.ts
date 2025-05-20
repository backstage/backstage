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

import { NotFoundError } from '@backstage/errors';
import { durationToMilliseconds } from '@backstage/types';
import { randomUUID } from 'crypto';
import { once } from 'events';
import { Knex } from 'knex';
import { HistoryConfig } from '../../config';
import { readEventsTableRows } from '../../database/readEventsTableRows';
import { SubscriptionsTableRow } from '../../database/tables';
import { knexRawNowPlus } from '../../database/util';
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
    const result = await this.#tryReadSubscriptionNonblocking(options);
    if (!result) {
      return undefined;
    }

    // Move the subscription forward and mark it as waiting for acknowledgement,
    // but only if it's still untouched since the operation started
    const knex = await this.#knexPromise;
    const ackId = randomUUID();
    const ackDeadline = knexRawNowPlus(
      knex,
      this.#historyConfig.subscriptionAckTimeout,
    );
    const count = await knex<SubscriptionsTableRow>(
      'module_history__subscriptions',
    )
      .update({
        state: 'waiting',
        ack_id: ackId,
        ack_timeout_at: ackDeadline,
        last_sent_event_id: result.events[result.events.length - 1].id,
      })
      .where('id', '=', options.readOptions.subscriptionId)
      .andWhere('state', '=', 'idle')
      .andWhere(
        'last_acknowledged_event_id',
        '=',
        result.previousLasAcknowledgedEventId,
      );

    // If we could not move the subscription forward, just bail out because
    // either the subscription was deleted, or someone else made an
    // overlapping read and "won". In that case we do not want to also send
    // the same events.
    if (count !== 1) {
      return undefined;
    }

    return {
      events: result.events,
      ackId,
    };
  }

  async #tryReadSubscriptionNonblocking(options: {
    readOptions: ReadSubscriptionOptions;
  }): Promise<
    | { events: CatalogEvent[]; previousLasAcknowledgedEventId: string }
    | undefined
  > {
    const { subscriptionId, limit } = options.readOptions;
    const knex = await this.#knexPromise;

    // "Touch" the subscription and get its metadata
    let subscriptions: SubscriptionsTableRow[];
    if (knex.client.config.client.includes('pg')) {
      subscriptions = await knex<SubscriptionsTableRow>(
        'module_history__subscriptions',
      )
        .update({ active_at: knex.fn.now() })
        .where('id', '=', subscriptionId)
        .returning(['state', 'last_acknowledged_event_id']);
    } else {
      await knex<SubscriptionsTableRow>('module_history__subscriptions')
        .update({ active_at: knex.fn.now() })
        .where('id', '=', subscriptionId);
      subscriptions = await knex
        .select('state', 'last_acknowledged_event_id')
        .from<SubscriptionsTableRow>('module_history__subscriptions')
        .where('id', '=', subscriptionId);
    }

    if (subscriptions.length !== 1) {
      throw new NotFoundError(`Subscription ${subscriptionId} not found`);
    }

    // We can only read idle subscriptions. If it is not idle, another operation
    // is pending for it, most likely waiting for another reader to acknowledge
    // reception of events.
    const { state, last_acknowledged_event_id } = subscriptions[0];
    if (state !== 'idle') {
      return undefined;
    }

    const events = await readEventsTableRows(knex, {
      afterEventId: String(last_acknowledged_event_id),
      order: 'asc',
      limit,
    });

    if (events.length === 0) {
      return undefined;
    }

    return {
      events,
      previousLasAcknowledgedEventId: String(last_acknowledged_event_id),
    };
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
        const result = await this.#tryReadSubscriptionNonblocking({
          readOptions: { ...options.readOptions, limit: 1 },
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
