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

import { durationToMilliseconds, HumanDuration } from '@backstage/types';
import { Knex } from 'knex';
import { SubscriptionEvent } from '../../consumers';
import { getMaxId } from '../../database/getMaxId';
import {
  readEventsTableRows,
  ReadEventsTableRowsOptions,
} from '../../database/readEventsTableRows';
import { Cursor } from './GetEvents.utils';

export interface GetEventsModel {
  readEventsNonblocking(options: {
    readOptions: ReadEventsTableRowsOptions;
    block: boolean;
  }): Promise<{ events: SubscriptionEvent[]; cursor?: Cursor }>;
  blockUntilDataIsReady(options: {
    readOptions: ReadEventsTableRowsOptions;
  }): Promise<'timeout' | 'aborted' | 'ready'>;
}

const DEFAULT_BLOCK_DURATION =
  process.env.NODE_ENV === 'test' ? { seconds: 3 } : { seconds: 10 };
const DEFAULT_BLOCK_POLL_FREQUENCY =
  process.env.NODE_ENV === 'test' ? { milliseconds: 100 } : { seconds: 1 };

export class GetEventsModelImpl implements GetEventsModel {
  #knexPromise: Promise<Knex>;
  #signal: AbortSignal;
  #blockDurationMillis: number;
  #blockPollFrequencyMillis: number;

  constructor(options: {
    knexPromise: Promise<Knex>;
    signal: AbortSignal;
    blockDuration?: HumanDuration;
    blockPollFrequency?: HumanDuration;
  }) {
    this.#knexPromise = options.knexPromise;
    this.#signal = options.signal;
    this.#blockDurationMillis = durationToMilliseconds(
      options.blockDuration ?? DEFAULT_BLOCK_DURATION,
    );
    this.#blockPollFrequencyMillis = durationToMilliseconds(
      options.blockPollFrequency ?? DEFAULT_BLOCK_POLL_FREQUENCY,
    );
  }

  async readEventsNonblocking(options: {
    readOptions: ReadEventsTableRowsOptions;
    block: boolean;
  }): Promise<{ events: SubscriptionEvent[]; cursor?: Cursor }> {
    const knex = await this.#knexPromise;

    let readOptions = options.readOptions;
    let events: SubscriptionEvent[] = [];
    if (readOptions.afterEventId === 'last') {
      readOptions = { ...readOptions, afterEventId: await getMaxId(knex) };
    } else {
      events = await readEventsTableRows(knex, readOptions);
    }

    // Let's generate a cursor for continuing to read, if we got some rows OR if
    // we were reading in ascending order (because then there might be more
    // events next time around)
    const shouldReturnCursor =
      readOptions.order === 'asc' || events.length >= readOptions.limit;
    let cursor: Cursor | undefined;
    if (shouldReturnCursor) {
      cursor = {
        version: 1,
        afterEventId:
          events.length > 0
            ? events[events.length - 1].id
            : readOptions.afterEventId,
        entityRef: readOptions.entityRef,
        entityId: readOptions.entityId,
        order: readOptions.order,
        limit: readOptions.limit,
        block: options.block,
      };
    }

    return { events, cursor };
  }

  // TODO(freben): Implement a more efficient way to wait for new events. See
  // the events backend using LISTEN/NOTIFY for inspiration. For now, wait for
  // up until the deadline and stop early if the request closes, or if we are
  // shutting down, or we start finding some rows.
  async blockUntilDataIsReady(options: {
    readOptions: ReadEventsTableRowsOptions;
  }): Promise<'timeout' | 'aborted' | 'ready'> {
    const knex = await this.#knexPromise;
    const deadline = Date.now() + this.#blockDurationMillis;

    while (Date.now() < deadline) {
      const inner = AbortSignal.any([
        this.#signal,
        AbortSignal.timeout(this.#blockPollFrequencyMillis),
      ]);
      // The event won't ever fire if the signal is already aborted, so we
      // need this check.
      if (!inner.aborted) {
        await new Promise<void>(resolve => {
          inner.addEventListener('abort', () => resolve());
        });
      }
      if (this.#signal.aborted) {
        return 'aborted';
      }
      const rows = await readEventsTableRows(knex, {
        ...options.readOptions,
        limit: 1,
      });
      if (rows.length) {
        return 'ready';
      }
    }

    return 'timeout';
  }
}
