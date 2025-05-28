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
  getEvents(options: {
    readOptions: ReadHistoryEventsOptions;
    block: boolean;
    signal?: AbortSignal;
  }): Promise<
    | {
        type: 'data';
        events: CatalogEvent[];
        cursor?: Cursor;
      }
    | {
        type: 'block';
        wait: () => Promise<'timeout' | 'aborted' | 'ready'>;
        cursor: Cursor;
      }
  >;
}

export class GetEventsModelImpl implements GetEventsModel {
  readonly #knexPromise: Promise<Knex>;
  readonly #shutdownSignal: AbortSignal;
  readonly #historyConfig: HistoryConfig;

  constructor(options: {
    knexPromise: Promise<Knex>;
    shutdownSignal: AbortSignal;
    historyConfig: HistoryConfig;
  }) {
    this.#knexPromise = options.knexPromise;
    this.#shutdownSignal = options.shutdownSignal;
    this.#historyConfig = options.historyConfig;
  }

  async getEvents(options: {
    readOptions: ReadHistoryEventsOptions;
    block: boolean;
    signal?: AbortSignal;
  }): Promise<
    | {
        type: 'data';
        events: CatalogEvent[];
        cursor?: Cursor;
      }
    | {
        type: 'block';
        wait: () => Promise<'timeout' | 'aborted' | 'ready'>;
        cursor: Cursor;
      }
  > {
    const knex = await this.#knexPromise;

    let readOptions = options.readOptions;
    let events: CatalogEvent[] = [];
    if (readOptions.afterEventId === 'last') {
      readOptions = { ...readOptions, afterEventId: await getMaxEventId(knex) };
    } else {
      // if (!readOptions.afterEventId && readOptions.order === 'asc') {
      //   readOptions = { ...readOptions, afterEventId: '0' };
      // }
      events = await readHistoryEvents(knex, readOptions);
    }

    // Let's generate a cursor for continuing to read, if we got some rows OR if
    // we were reading in ascending order (because then there might be more
    // events next time around)
    const shouldReturnCursor =
      readOptions.order === 'asc' || events.length >= readOptions.limit;
    const cursor: Cursor | undefined = shouldReturnCursor
      ? {
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
        }
      : undefined;

    if (events.length || !options.block || !cursor) {
      return {
        type: 'data',
        events,
        cursor,
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
            readHistoryEvents(knex, { ...options.readOptions, limit: 1 }).then(
              rows => rows.length > 0,
            ),
        });
      },
      cursor,
    };
  }
}
