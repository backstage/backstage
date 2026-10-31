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

import {
  BackstageCredentials,
  PermissionsService,
} from '@backstage/backend-plugin-api';
import { Entity } from '@backstage/catalog-model';
import { InputError, NotAllowedError, NotFoundError } from '@backstage/errors';
import { FilterPredicate } from '@backstage/filter-predicates';
import { catalogEntityReadPermission } from '@backstage/plugin-catalog-common/alpha';
import { EntityFilter } from '@backstage/plugin-catalog-node';
import {
  AuthorizeResult,
  PolicyDecision,
} from '@backstage/plugin-permission-common';
import { ConditionTransformer } from '@backstage/plugin-permission-node';
import { HumanDuration } from '@backstage/types';
import { Knex } from 'knex';
import {
  EntityChangeRow,
  getMaxGeneration,
  readEntityChanges,
} from '../../database/operations/changes/readEntityChanges';
import { EntityChangeScopeEntry } from '../../database/operations/changes/scope';
import {
  ackEntityChangeSubscription,
  EntityChangeSubscription,
  getEntityChangeSubscription,
  nackEntityChangeSubscription,
  sendEntityChangeSubscription,
  skipEntityChangeSubscription,
  touchEntityChangeSubscription,
  upsertEntityChangeSubscription,
} from '../../database/operations/changes/subscriptions';
import { entityFilterToFilterPredicate } from '../request';
import {
  EntityChangeListener,
  EntityChangeWaitResult,
} from './EntityChangeListener';

/**
 * How many fully filtered windows a subscription read skips past before
 * giving up for this request.
 */
const MAX_SKIPPED_WINDOWS = 5;

export type EntityChangesReadResult =
  | {
      type: 'data';
      entityRefs: string[];
      nextGeneration: string;
      filtered: boolean;
    }
  | {
      type: 'block';
      nextGeneration: string;
      filtered: boolean;
      wait(): Promise<EntityChangeWaitResult>;
    };

export type EntityChangesSubscriptionReadResult =
  | {
      type: 'data';
      entityRefs: string[];
      ackId?: string;
      filtered: boolean;
    }
  | { type: 'block'; wait(): Promise<EntityChangeWaitResult> };

/**
 * The caller's view of the catalog: everything, or only entities that pass the
 * permission conditions.
 */
type Visibility =
  | { filtered: false }
  | {
      filtered: true;
      filter: FilterPredicate;
      isTombstoneVisible(lastEntity: Entity): boolean;
    };

/**
 * Serves the feed of changed entity refs, with permissions applied.
 *
 * @remarks
 *
 * Live rows are filtered through the search table, and tombstones by applying
 * the permission conditions in memory to the body they replaced. A reader
 * whose access depends on conditions isn't told when it loses access to an
 * entity: later bumps of that entity are just filtered out. Results say
 * whether conditions were applied, so such readers know to resync now and
 * then.
 */
export class EntityChangesService {
  readonly #knex: Knex;
  readonly #permissions: PermissionsService;
  readonly #transformConditions: ConditionTransformer<EntityFilter>;
  readonly #authorizeConditions: (
    decision: PolicyDecision,
    entity: Entity,
  ) => boolean;
  readonly #listener: EntityChangeListener;
  readonly #ackTimeout: HumanDuration;

  constructor(options: {
    knex: Knex;
    permissions: PermissionsService;
    transformConditions: ConditionTransformer<EntityFilter>;
    authorizeConditions: (decision: PolicyDecision, entity: Entity) => boolean;
    listener: EntityChangeListener;
    ackTimeout?: HumanDuration;
  }) {
    this.#knex = options.knex;
    this.#permissions = options.permissions;
    this.#transformConditions = options.transformConditions;
    this.#authorizeConditions = options.authorizeConditions;
    this.#listener = options.listener;
    this.#ackTimeout = options.ackTimeout ?? { seconds: 30 };
  }

  /**
   * Reads changed refs after a position. With `block`, an empty read returns a
   * wait instead, after which the caller should read again.
   */
  async readChanges(options: {
    afterGeneration: string;
    scope?: EntityChangeScopeEntry[];
    limit: number;
    block: boolean;
    credentials: BackstageCredentials;
    signal: AbortSignal;
  }): Promise<EntityChangesReadResult> {
    const { scope, limit, block, credentials, signal } = options;
    const visibility = await this.#visibility(credentials);

    // Starting from the end has nothing to return yet
    const afterLast = options.afterGeneration === 'last';
    const afterGeneration = afterLast
      ? await getMaxGeneration(this.#knex)
      : parseGeneration(options.afterGeneration);

    const read = (from: string, readLimit: number) =>
      readEntityChanges(this.#knex, {
        afterGeneration: from,
        limit: readLimit,
        scope,
        filter: visibility.filtered ? visibility.filter : undefined,
      }).then(page => ({
        nextGeneration: page.nextGeneration,
        entityRefs: visibleRefs(page.rows, visibility),
      }));

    const page = afterLast
      ? { nextGeneration: afterGeneration, entityRefs: [] }
      : await read(afterGeneration, limit);

    if (page.entityRefs.length || !block) {
      return { type: 'data', ...page, filtered: visibility.filtered };
    }

    const listener = this.#listener.setupListener({
      signal,
      checker: () =>
        read(page.nextGeneration, limit).then(p => p.entityRefs.length > 0),
    });

    return {
      type: 'block',
      nextGeneration: page.nextGeneration,
      filtered: visibility.filtered,
      wait: () => listener.waitForUpdate(),
    };
  }

  async upsertSubscription(options: {
    subscriptionId?: string;
    afterGeneration?: string;
    scope?: EntityChangeScopeEntry[];
    credentials: BackstageCredentials;
  }): Promise<EntityChangeSubscription> {
    await this.#visibility(options.credentials);
    return upsertEntityChangeSubscription(this.#knex, {
      subscriptionId: options.subscriptionId,
      afterGeneration:
        options.afterGeneration === undefined ||
        options.afterGeneration === 'last'
          ? options.afterGeneration
          : parseGeneration(options.afterGeneration),
      scope: options.scope,
    });
  }

  /**
   * Reads a batch from a subscription. The batch must be acknowledged before
   * the subscription can move on.
   */
  async readSubscription(options: {
    subscriptionId: string;
    limit: number;
    block: boolean;
    credentials: BackstageCredentials;
    signal: AbortSignal;
  }): Promise<EntityChangesSubscriptionReadResult> {
    const { subscriptionId, limit, block, credentials, signal } = options;
    const visibility = await this.#visibility(credentials);
    const subscription = await touchEntityChangeSubscription(
      this.#knex,
      subscriptionId,
    );

    const read = (from: string) =>
      readEntityChanges(this.#knex, {
        afterGeneration: from,
        limit,
        scope: subscription.scope,
        filter: visibility.filtered ? visibility.filter : undefined,
      }).then(page => ({
        nextGeneration: page.nextGeneration,
        entityRefs: visibleRefs(page.rows, visibility),
      }));

    if (subscription.state === 'idle') {
      let position = subscription.lastAcknowledgedGeneration;
      for (let i = 0; i < MAX_SKIPPED_WINDOWS; ++i) {
        const page = await read(position);
        if (page.nextGeneration === position) {
          break;
        }

        if (!page.entityRefs.length) {
          // Nothing in this window is visible to the caller. Move past it
          // directly, since there is nothing to acknowledge.
          const skipped = await skipEntityChangeSubscription(this.#knex, {
            subscriptionId,
            fromGeneration: position,
            toGeneration: page.nextGeneration,
          });
          if (!skipped) {
            break;
          }
          position = page.nextGeneration;
          continue;
        }

        const ackId = await sendEntityChangeSubscription(this.#knex, {
          subscriptionId,
          fromGeneration: position,
          toGeneration: page.nextGeneration,
          ackTimeout: this.#ackTimeout,
        });
        if (ackId) {
          return {
            type: 'data',
            entityRefs: page.entityRefs,
            ackId,
            filtered: visibility.filtered,
          };
        }
        // Another reader got this batch first
        break;
      }
    }

    if (!block) {
      return { type: 'data', entityRefs: [], filtered: visibility.filtered };
    }

    const listener = this.#listener.setupListener({
      signal,
      checker: async () => {
        const current = await getEntityChangeSubscription(
          this.#knex,
          subscriptionId,
        );
        if (current?.state !== 'idle') {
          return false;
        }
        const page = await read(current.lastAcknowledgedGeneration);
        return page.entityRefs.length > 0;
      },
    });

    return { type: 'block', wait: () => listener.waitForUpdate() };
  }

  async ackSubscription(options: {
    subscriptionId: string;
    ackId: string;
    credentials: BackstageCredentials;
  }): Promise<void> {
    await this.#visibility(options.credentials);
    if (!(await ackEntityChangeSubscription(this.#knex, options))) {
      throw new NotFoundError(
        `Subscription ${options.subscriptionId} has no batch with that ack ID`,
      );
    }
  }

  async nackSubscription(options: {
    subscriptionId: string;
    ackId: string;
    credentials: BackstageCredentials;
  }): Promise<void> {
    await this.#visibility(options.credentials);
    if (!(await nackEntityChangeSubscription(this.#knex, options))) {
      throw new NotFoundError(
        `Subscription ${options.subscriptionId} has no batch with that ack ID`,
      );
    }
  }

  async #visibility(credentials: BackstageCredentials): Promise<Visibility> {
    const [decision] = await this.#permissions.authorizeConditional(
      [{ permission: catalogEntityReadPermission }],
      { credentials },
    );

    if (decision.result === AuthorizeResult.DENY) {
      throw new NotAllowedError();
    }

    if (decision.result === AuthorizeResult.CONDITIONAL) {
      return {
        filtered: true,
        filter: entityFilterToFilterPredicate(
          this.#transformConditions(decision.conditions),
        ),
        isTombstoneVisible: entity =>
          this.#authorizeConditions(decision, entity),
      };
    }

    return { filtered: false };
  }
}

function visibleRefs(rows: EntityChangeRow[], visibility: Visibility) {
  if (!visibility.filtered) {
    return rows.map(row => row.entityRef);
  }
  // Live rows were already filtered in the query. A tombstone without a last
  // body can't be evaluated, so it is left out.
  return rows
    .filter(
      row =>
        !row.deleted ||
        (row.lastEntity &&
          visibility.isTombstoneVisible(JSON.parse(row.lastEntity))),
    )
    .map(row => row.entityRef);
}

function parseGeneration(value: string): string {
  if (!/^\d+$/.test(value)) {
    throw new InputError(
      `Invalid generation "${value}", expected a non-negative integer or "last"`,
    );
  }
  return BigInt(value).toString();
}
