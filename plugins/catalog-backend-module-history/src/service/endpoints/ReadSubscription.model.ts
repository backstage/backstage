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

import { BackstageCredentials } from '@backstage/backend-plugin-api';
import { EntityFilter } from '@backstage/plugin-catalog-node';
import { Knex } from 'knex';
import { HistoryConfig } from '../../config';
import { ChangeListener } from '../../database/changeListener/types';
import { readHistorySubscription } from '../../database/operations/readHistorySubscription';
import { EventsTableEntry } from '../../types';
import { EntityPermissionFilterBuilder } from '../createEntityPermissionFilterBuilder';

export interface ReadSubscriptionOptions {
  subscriptionId: string;
  limit: number;
  block: boolean;
}

export type ReadSubscriptionResult =
  | { type: 'data'; events: EventsTableEntry[]; ackId: string }
  | { type: 'empty' }
  | { type: 'block'; wait: () => Promise<'timeout' | 'aborted' | 'ready'> };

export interface ReadSubscriptionModel {
  readSubscription(options: {
    readOptions: ReadSubscriptionOptions;
    credentials: BackstageCredentials;
    filter?: EntityFilter;
    signal: AbortSignal;
  }): Promise<ReadSubscriptionResult>;
}

export class ReadSubscriptionModelImpl implements ReadSubscriptionModel {
  readonly #knexPromise: Promise<Knex>;
  readonly #historyConfig: HistoryConfig;
  readonly #changeListener: ChangeListener;

  constructor(options: {
    knexPromise: Promise<Knex>;
    historyConfig: HistoryConfig;
    changeListener: ChangeListener;
  }) {
    this.#knexPromise = options.knexPromise;
    this.#historyConfig = options.historyConfig;
    this.#changeListener = options.changeListener;
  }

  async readSubscription(options: {
    readOptions: ReadSubscriptionOptions;
    filter?: EntityFilter;
    signal: AbortSignal;
  }): Promise<ReadSubscriptionResult> {
    const { subscriptionId, limit, block } = options.readOptions;
    const knex = await this.#knexPromise;

    // We set up the listener before doing the read, to ensure that no events
    // ever get missed
    const listener = await this.#changeListener.setupListener({
      signal: options.signal,
      checker: () =>
        readHistorySubscription(knex, {
          subscriptionId,
          operation: 'peek',
          limit: 1,
          historyConfig: this.#historyConfig,
        }).then(r => r !== undefined),
    });

    const result = await readHistorySubscription(
      knex,
      {
        subscriptionId,
        operation: 'read',
        limit,
        historyConfig: this.#historyConfig,
      },
      options.filter,
    );

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
      wait: () => listener.waitForUpdate(),
    };
  }
}

/**
 * Implements authorization on top of the actual {@link ReadSubscriptionModel} model.
 */
export class AuthorizedReadSubscriptionModelImpl
  implements ReadSubscriptionModel
{
  readonly #inner: ReadSubscriptionModel;
  readonly #entityPermissionFilterBuilder: EntityPermissionFilterBuilder;

  constructor(options: {
    inner: ReadSubscriptionModel;
    entityPermissionFilterBuilder: EntityPermissionFilterBuilder;
  }) {
    this.#inner = options.inner;
    this.#entityPermissionFilterBuilder = options.entityPermissionFilterBuilder;
  }

  async readSubscription(options: {
    readOptions: ReadSubscriptionOptions;
    credentials: BackstageCredentials;
    filter?: EntityFilter;
    signal: AbortSignal;
  }): Promise<ReadSubscriptionResult> {
    const filter = await this.#entityPermissionFilterBuilder(
      options.credentials,
      options.filter,
    );

    return await this.#inner.readSubscription({
      ...options,
      filter,
    });
  }
}
