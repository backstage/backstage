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
  BackstageCredentials,
  PermissionsService,
} from '@backstage/backend-plugin-api';
import { NotAllowedError } from '@backstage/errors';
import { catalogEntityReadPermission } from '@backstage/plugin-catalog-common/alpha';
import { EntityFilter } from '@backstage/plugin-catalog-node';
import { AuthorizeResult } from '@backstage/plugin-permission-common';
import { ConditionTransformer } from '@backstage/plugin-permission-node';
import { Knex } from 'knex';
import { ChangeListener } from '../../database/changeListener/types';
import { getMaxEventId } from '../../database/operations/getMaxEventId';
import {
  readHistoryEvents,
  ReadHistoryEventsOptions,
} from '../../database/operations/readHistoryEvents';
import { EventsTableEntry } from '../../types';
import { Cursor } from './GetEvents.utils';

export interface GetEventsOptions {
  readOptions: ReadHistoryEventsOptions;
  block: boolean;
  credentials: BackstageCredentials;
  filter?: EntityFilter;
  signal: AbortSignal;
}

export type GetEventsResult =
  | {
      type: 'data';
      events: EventsTableEntry[];
      cursor?: Cursor;
    }
  | {
      type: 'block';
      wait: () => Promise<'timeout' | 'aborted' | 'ready'>;
      cursor: Cursor;
    };

export interface GetEventsModel {
  getEvents(options: GetEventsOptions): Promise<GetEventsResult>;
}

export class GetEventsModelImpl implements GetEventsModel {
  readonly #knexPromise: Promise<Knex>;
  readonly #changeListener: ChangeListener;

  constructor(options: {
    knexPromise: Promise<Knex>;
    changeListener: ChangeListener;
  }) {
    this.#knexPromise = options.knexPromise;
    this.#changeListener = options.changeListener;
  }

  async getEvents(options: GetEventsOptions): Promise<GetEventsResult> {
    const knex = await this.#knexPromise;

    let readOptions = options.readOptions;
    let skipRead = false;

    if (readOptions.afterEventId === 'last') {
      if (readOptions.order === 'asc') {
        // Translate to an actual ID, to place in the cursor and/or use as a
        // basis for waiting for data. Also since we're going forward, there's
        // no need to peform the read since it's by definition not going to
        // return anything the first time
        skipRead = true;
        readOptions = {
          ...readOptions,
          afterEventId: await getMaxEventId(knex),
        };
      } else {
        // Redundant to state that you want to read from beyond the last event,
        // when you're going in descending order
        delete readOptions.afterEventId;
      }
    }

    // We set up the listener before doing the read, to ensure that no events
    // ever get missed
    const listener = await this.#changeListener.setupListener({
      signal: options.signal,
      checker: () =>
        readHistoryEvents(
          knex,
          {
            ...readOptions,
            limit: 1,
          },
          options.filter,
        ).then(entries => entries.length > 0),
    });

    const events = skipRead
      ? []
      : await readHistoryEvents(knex, readOptions, options.filter);

    // Let's generate a cursor for continuing to read, if we got some entries OR
    // if we were reading in ascending order (because then there might be more
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
      wait: () => listener.waitForUpdate(),
      cursor,
    };
  }
}

/**
 * Implements authorization on top of the actual {@link GetEventsModel} model.
 */
export class AuthorizedGetEventsModelImpl implements GetEventsModel {
  readonly #inner: GetEventsModel;
  readonly #permissions: PermissionsService;
  readonly #transformConditions: ConditionTransformer<EntityFilter>;

  constructor(options: {
    inner: GetEventsModel;
    permissions: PermissionsService;
    transformConditions: ConditionTransformer<EntityFilter>;
  }) {
    this.#inner = options.inner;
    this.#permissions = options.permissions;
    this.#transformConditions = options.transformConditions;
  }

  async getEvents(options: GetEventsOptions): Promise<GetEventsResult> {
    const authorizeDecision = (
      await this.#permissions.authorizeConditional(
        [{ permission: catalogEntityReadPermission }],
        { credentials: options.credentials },
      )
    )[0];

    if (authorizeDecision.result === AuthorizeResult.DENY) {
      throw new NotAllowedError();
    }

    if (authorizeDecision.result === AuthorizeResult.CONDITIONAL) {
      const permissionFilter: EntityFilter = this.#transformConditions(
        authorizeDecision.conditions,
      );
      return await this.#inner.getEvents({
        ...options,
        filter: options?.filter
          ? { allOf: [permissionFilter, options.filter] }
          : permissionFilter,
      });
    }

    return await this.#inner.getEvents(options);
  }
}
