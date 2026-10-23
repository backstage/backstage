/*
 * Copyright 2021 The Backstage Authors
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

import { stringifyEntityRef } from '@backstage/catalog-model';
import { DeferredEntity } from '@backstage/plugin-catalog-node';
import { Knex } from 'knex';
import lodash from 'lodash';
import { randomUUID as uuid } from 'node:crypto';
import { performance } from 'node:perf_hooks';
import { setImmediate } from 'node:timers/promises';
import { rethrowError } from './conversion';
import { deleteWithEagerPruningOfChildren } from './operations/provider/deleteWithEagerPruningOfChildren';
import { refreshByRefreshKeys } from './operations/provider/refreshByRefreshKeys';
import { checkLocationKeyConflict } from './operations/refreshState/checkLocationKeyConflict';
import { insertUnprocessedEntity } from './operations/refreshState/insertUnprocessedEntity';
import { updateUnprocessedEntity } from './operations/refreshState/updateUnprocessedEntity';
import { DbRefreshStateReferencesRow, DbRefreshStateRow } from './tables';
import {
  PrepareUnprocessedEntitiesOptions,
  PreparedDeferredEntity,
  ProviderDatabase,
  RefreshByKeyOptions,
  ReplaceUnprocessedEntitiesOptions,
  Transaction,
} from './types';
import {
  generateStableHash,
  isDeadlockError,
  retryOnDeadlock,
  whereInArray,
} from './util';
import {
  LoggerService,
  isDatabaseConflictError,
} from '@backstage/backend-plugin-api';

// The number of items that are sent per batch to the database layer, when
// doing .batchInsert calls to knex. This needs to be low enough to not cause
// errors in the underlying engine due to exceeding query limits, but large
// enough to get the speed benefits.
const BATCH_SIZE = 50;
const PREPARATION_TIME_SLICE_MS = 3;

async function forEachWithYield<T>(
  items: readonly T[],
  fn: (item: T, index: number) => void,
): Promise<void> {
  let sliceStart = performance.now();
  for (let index = 0; index < items.length; index++) {
    fn(items[index], index);
    if (
      index + 1 < items.length &&
      performance.now() - sliceStart >= PREPARATION_TIME_SLICE_MS
    ) {
      await setImmediate();
      sliceStart = performance.now();
    }
  }
}

async function prepareDeferredEntities(
  items: readonly DeferredEntity[],
): Promise<PreparedDeferredEntity[]> {
  const prepared = new Array<PreparedDeferredEntity>();
  await forEachWithYield(items, deferred => {
    const entityRef = stringifyEntityRef(deferred.entity);
    const hash = generateStableHash(deferred.entity);
    prepared.push({ deferred, entityRef, hash });
  });
  return prepared;
}

async function prepareRemovedEntities(
  items: readonly (
    | DeferredEntity
    | { entityRef: string; locationKey?: string }
  )[],
): Promise<{ entityRef: string; locationKey?: string }[]> {
  const prepared = new Array<{ entityRef: string; locationKey?: string }>();
  let sliceStart = performance.now();
  for (let index = 0; index < items.length; index++) {
    const item = items[index];
    if ('entityRef' in item) {
      prepared.push(item);
      continue;
    }

    prepared.push({
      entityRef: stringifyEntityRef(item.entity),
      locationKey: item.locationKey,
    });
    if (
      index + 1 < items.length &&
      performance.now() - sliceStart >= PREPARATION_TIME_SLICE_MS
    ) {
      await setImmediate();
      sliceStart = performance.now();
    }
  }
  return prepared;
}

export class DefaultProviderDatabase implements ProviderDatabase {
  private readonly options: {
    database: Knex;
    logger: LoggerService;
  };

  constructor(options: { database: Knex; logger: LoggerService }) {
    this.options = options;
  }

  async prepareUnprocessedEntities(
    options: PrepareUnprocessedEntitiesOptions,
  ): Promise<ReplaceUnprocessedEntitiesOptions> {
    if (options.type === 'full') {
      return {
        ...options,
        preparedItems: await prepareDeferredEntities(options.items),
      };
    }
    return {
      ...options,
      removed: await prepareRemovedEntities(options.removed),
      preparedItems: await prepareDeferredEntities(options.added),
    };
  }

  /**
   * Executes `fn` inside a database transaction, retrying automatically on
   * deadlock (PostgreSQL error 40P01). Because the callback may be invoked
   * more than once, it must not perform non-database side effects such as
   * emitting events, mutating in-memory state, or calling external services.
   */
  async transaction<T>(fn: (tx: Transaction) => Promise<T>): Promise<T> {
    return retryOnDeadlock(async () => {
      try {
        let result: T | undefined = undefined;
        await this.options.database.transaction(
          async tx => {
            // We can't return here, as knex swallows the return type in case the
            // transaction is rolled back:
            // https://github.com/knex/knex/blob/e37aeaa31c8ef9c1b07d2e4d3ec6607e557d800d/lib/transaction.js#L136
            result = await fn(tx);
          },
          {
            // If we explicitly trigger a rollback, don't fail.
            doNotRejectOnRollback: true,
          },
        );
        return result!;
      } catch (e) {
        this.options.logger.debug(`Error during transaction, ${e}`);
        throw rethrowError(e);
      }
    }, this.options.database);
  }

  async replaceUnprocessedEntities(
    txOpaque: Knex | Transaction,
    options: ReplaceUnprocessedEntitiesOptions,
  ): Promise<void> {
    const tx = txOpaque as Knex | Knex.Transaction;
    const { toAdd, toUpsert, toRemove } = await this.createDelta(tx, options);

    if (toRemove.length) {
      const removedCount = await deleteWithEagerPruningOfChildren({
        knex: tx,
        entityRefs: toRemove,
        sourceKey: options.sourceKey,
      });
      this.options.logger.debug(
        `removed, ${removedCount} entities: ${JSON.stringify(toRemove)}`,
      );
    }

    if (toAdd.length) {
      // The reason for this chunking, rather than just massively batch
      // inserting the entire payload, is that we fall back to the individual
      // upsert mechanism below on conflicts. That path is massively slower than
      // the fast batch path, so we don't want to end up accidentally having to
      // for example item-by-item upsert tens of thousands of entities in a
      // large initial delivery dump. The implication is that the size of these
      // chunks needs to weigh the benefit of fast successful inserts, against
      // the drawback of super slow but more rare fallbacks. There's quickly
      // diminishing returns though with turning up this value way high.
      for (const chunk of lodash.chunk(toAdd, 50)) {
        try {
          await tx.batchInsert(
            'refresh_state',
            chunk.map(item => ({
              entity_id: uuid(),
              entity_ref: item.entityRef,
              unprocessed_entity: JSON.stringify(item.deferred.entity),
              unprocessed_hash: item.hash,
              errors: '',
              location_key: item.deferred.locationKey,
              next_update_at: tx.fn.now(),
              last_discovery_at: tx.fn.now(),
            })),
            BATCH_SIZE,
          );
          await tx.batchInsert(
            'refresh_state_references',
            chunk.map(item => ({
              source_key: options.sourceKey,
              target_entity_ref: item.entityRef,
            })),
            BATCH_SIZE,
          );
        } catch (error) {
          if (!isDatabaseConflictError(error)) {
            throw error;
          } else {
            this.options.logger.debug(
              `Fast insert path failed, falling back to slow path, ${error}`,
            );
            toUpsert.push(...chunk);
          }
        }
      }
    }

    if (toUpsert.length) {
      for (const {
        deferred: { entity, locationKey },
        entityRef,
        hash,
      } of toUpsert) {
        try {
          const { updated, claimedFromNullLocationKey } =
            await updateUnprocessedEntity({
              tx,
              entity,
              entityRef,
              hash,
              locationKey,
            });

          if (updated && claimedFromNullLocationKey) {
            // Entity was claimed from weak (null-key) ownership to strong
            // ownership - delete all old references and insert the new one
            await tx<DbRefreshStateReferencesRow>('refresh_state_references')
              .where('target_entity_ref', entityRef)
              .delete();

            await tx<DbRefreshStateReferencesRow>(
              'refresh_state_references',
            ).insert({
              source_key: options.sourceKey,
              target_entity_ref: entityRef,
            });
          } else if (updated) {
            // Normal update - ensure this provider's reference exists
            await tx<DbRefreshStateReferencesRow>('refresh_state_references')
              .where('target_entity_ref', entityRef)
              .andWhere({ source_key: options.sourceKey })
              .delete();

            await tx<DbRefreshStateReferencesRow>(
              'refresh_state_references',
            ).insert({
              source_key: options.sourceKey,
              target_entity_ref: entityRef,
            });
          } else if (
            await insertUnprocessedEntity({
              tx,
              entity,
              entityRef,
              hash,
              locationKey,
              logger: this.options.logger,
            })
          ) {
            // New entity inserted - add the reference
            await tx<DbRefreshStateReferencesRow>(
              'refresh_state_references',
            ).insert({
              source_key: options.sourceKey,
              target_entity_ref: entityRef,
            });
          } else {
            // Neither update nor insert succeeded - conflict
            await tx<DbRefreshStateReferencesRow>('refresh_state_references')
              .where('target_entity_ref', entityRef)
              .andWhere({ source_key: options.sourceKey })
              .delete();

            const conflictingKey = await checkLocationKeyConflict({
              tx,
              entityRef,
              locationKey,
            });
            if (conflictingKey) {
              this.options.logger.warn(
                `Source ${options.sourceKey} detected conflicting entityRef ${entityRef} already referenced by ${conflictingKey} and now also ${locationKey}`,
              );
            }
          }
        } catch (error) {
          if (isDeadlockError(tx, error)) {
            throw error;
          }
          this.options.logger.error(
            `Failed to add '${entityRef}' from source '${options.sourceKey}', ${error}`,
          );
        }
      }
    }
  }

  async listReferenceSourceKeys(txOpaque: Transaction): Promise<string[]> {
    const tx = txOpaque as Knex | Knex.Transaction;

    const rows = await tx<DbRefreshStateReferencesRow>(
      'refresh_state_references',
    )
      .distinct('source_key')
      .whereNotNull('source_key');

    return rows
      .map(row => row.source_key)
      .filter((key): key is string => !!key);
  }

  async refreshByRefreshKeys(
    txOpaque: Transaction,
    options: RefreshByKeyOptions,
  ) {
    const tx = txOpaque as Knex.Transaction;
    await refreshByRefreshKeys({ tx, keys: options.keys });
  }

  private async createDelta(
    tx: Knex | Knex.Transaction,
    options: ReplaceUnprocessedEntitiesOptions,
  ): Promise<{
    toAdd: PreparedDeferredEntity[];
    toUpsert: PreparedDeferredEntity[];
    toRemove: string[];
  }> {
    if (options.type === 'delta') {
      const toAdd = new Array<PreparedDeferredEntity>();
      const toUpsert = new Array<PreparedDeferredEntity>();
      const toRemove = options.removed.map(e => e.entityRef);

      const prepared =
        options.preparedItems ?? (await prepareDeferredEntities(options.added));

      for (const chunk of lodash.chunk(prepared, 1_000)) {
        const entityRefs = chunk.map(item => item.entityRef);
        const rows = await tx<DbRefreshStateRow>('refresh_state')
          .select(['entity_ref', 'unprocessed_hash', 'location_key'])
          .where(whereInArray('entity_ref', entityRefs));
        const oldStates = new Map(
          rows.map(row => [
            row.entity_ref,
            {
              unprocessed_hash: row.unprocessed_hash,
              location_key: row.location_key,
            },
          ]),
        );

        for (const item of chunk) {
          const { deferred, entityRef, hash } = item;
          const oldState = oldStates.get(entityRef);
          if (oldState === undefined) {
            // Add any entity that does not exist in the database
            toAdd.push(item);
          } else if (
            (deferred.locationKey ?? null) !== (oldState.location_key ?? null)
          ) {
            // Remove and then re-add any entity that exists, but with a different location key
            toRemove.push(entityRef);
            toAdd.push(item);
          } else if (hash !== oldState.unprocessed_hash) {
            // Entities with modifications should be pushed through too
            toUpsert.push(item);
          }
        }
      }

      return { toAdd, toUpsert, toRemove };
    }

    const items =
      options.preparedItems ?? (await prepareDeferredEntities(options.items));
    const newRefsSet = new Set<string>();
    for (const item of items) {
      newRefsSet.add(item.entityRef);
    }

    // Do the yielding preparation above before reading the existing state, so
    // that it does not widen the interval between the read and the writes.
    const oldRefs = await tx<DbRefreshStateReferencesRow>(
      'refresh_state_references',
    )
      .leftJoin<DbRefreshStateRow>('refresh_state', {
        target_entity_ref: 'entity_ref',
      })
      .where({ source_key: options.sourceKey })
      .select({
        target_entity_ref: 'refresh_state_references.target_entity_ref',
        location_key: 'refresh_state.location_key',
        unprocessed_hash: 'refresh_state.unprocessed_hash',
      });

    const oldRefsSet = new Map(
      oldRefs.map(r => [
        r.target_entity_ref,
        {
          locationKey: r.location_key,
          oldEntityHash: r.unprocessed_hash,
        },
      ]),
    );

    const toAdd = new Array<PreparedDeferredEntity>();
    const toUpsert = new Array<PreparedDeferredEntity>();
    const toRemove = oldRefs
      .map(row => row.target_entity_ref)
      .filter(ref => !newRefsSet.has(ref));

    for (const item of items) {
      const oldRef = oldRefsSet.get(item.entityRef);
      if (!oldRef) {
        // Add any entity that does not exist in the database
        toAdd.push(item);
      } else if (
        (oldRef.locationKey ?? undefined) !==
        (item.deferred.locationKey ?? undefined)
      ) {
        // Remove and then re-add any entity that exists, but with a different location key
        toRemove.push(item.entityRef);
        toAdd.push(item);
      } else if (oldRef.oldEntityHash !== item.hash) {
        // Entities with modifications should be pushed through too
        toUpsert.push(item);
      }
    }

    return { toAdd, toUpsert, toRemove };
  }
}
