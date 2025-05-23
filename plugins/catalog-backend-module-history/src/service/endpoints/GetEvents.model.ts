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
import { getMaxEventId } from '../../database/operations/getMaxEventId';
import {
  readHistoryEvents,
  ReadHistoryEventsOptions,
} from '../../database/operations/readHistoryEvents';
import { waitForEvents } from '../../database/operations/waitForEvents';
import { Cursor } from './GetEvents.utils';
import { CatalogEvent } from './types';

export interface GetEventsModel {
  readEventsNonblocking(options: {
    readOptions: ReadHistoryEventsOptions;
    block: boolean;
  }): Promise<{ events: CatalogEvent[]; cursor?: Cursor }>;
  blockUntilDataIsReady(options: {
    readOptions: ReadHistoryEventsOptions;
    signal?: AbortSignal;
  }): Promise<'timeout' | 'aborted' | 'ready'>;
}

export class GetEventsModelImpl implements GetEventsModel {
  #knexPromise: Promise<Knex>;
  #shutdownSignal: AbortSignal;
  #historyConfig: HistoryConfig;

  constructor(options: {
    knexPromise: Promise<Knex>;
    shutdownSignal: AbortSignal;
    historyConfig: HistoryConfig;
  }) {
    this.#knexPromise = options.knexPromise;
    this.#shutdownSignal = options.shutdownSignal;
    this.#historyConfig = options.historyConfig;
  }

  async readEventsNonblocking(options: {
    readOptions: ReadHistoryEventsOptions;
    block: boolean;
  }): Promise<{ events: CatalogEvent[]; cursor?: Cursor }> {
    const knex = await this.#knexPromise;

    let readOptions = options.readOptions;
    let events: CatalogEvent[] = [];
    if (readOptions.afterEventId === 'last') {
      readOptions = { ...readOptions, afterEventId: await getMaxEventId(knex) };
    } else {
      events = await readHistoryEvents(knex, readOptions);
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
            ? events[events.length - 1].eventId
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

  async blockUntilDataIsReady(options: {
    readOptions: ReadHistoryEventsOptions;
    signal?: AbortSignal;
  }): Promise<'timeout' | 'aborted' | 'ready'> {
    const knex = await this.#knexPromise;
    return await waitForEvents({
      historyConfig: this.#historyConfig,
      signal: AbortSignal.any([
        this.#shutdownSignal,
        ...(options.signal ? [options.signal] : []),
      ]),
      checker: () =>
        readHistoryEvents(knex, { ...options.readOptions, limit: 1 }).then(
          rows => rows.length > 0,
        ),
    });
  }
}
