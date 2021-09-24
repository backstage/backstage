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

import { Entity, stringifyEntityRef } from '@backstage/catalog-model';
import { ConflictError, NotFoundError } from '@backstage/errors';
import { Knex } from 'knex';
import lodash from 'lodash';
import { v4 as uuid } from 'uuid';
import type { Logger } from 'winston';
import { Transaction } from '../../database';
import { DeferredEntity } from '../processing/types';
import { RefreshIntervalFunction } from '../refresh';
import { rethrowError, timestampToDateTime } from './conversion';
import { initDatabaseMetrics } from './metrics';
import {
  DbRefreshStateReferencesRow,
  DbRefreshStateRow,
  DbRelationsRow,
} from './tables';
import {
  GetProcessableEntitiesResult,
  ProcessingDatabase,
  RefreshStateItem,
  RefreshOptions,
  ReplaceUnprocessedEntitiesOptions,
  UpdateProcessedEntityOptions,
  ListAncestorsOptions,
  ListAncestorsResult,
  UpdateEntityCacheOptions,
} from './types';

// The number of items that are sent per batch to the database layer, when
// doing .batchInsert calls to knex. This needs to be low enough to not cause
// errors in the underlying engine due to exceeding query limits, but large
// enough to get the speed benefits.
const BATCH_SIZE = 50;
const MAX_ANCESTOR_DEPTH = 32;

export class DefaultProcessingDatabase implements ProcessingDatabase {
  constructor(
    private readonly options: {
      database: Knex;
      logger: Logger;
      refreshInterval: RefreshIntervalFunction;
    },
  ) {
    initDatabaseMetrics(options.database);
  }

  async updateProcessedEntity(
    txOpaque: Transaction,
    options: UpdateProcessedEntityOptions,
  ): Promise<void> {
    const tx = txOpaque as Knex.Transaction;
    const {
      id,
      processedEntity,
      resultHash,
      errors,
      relations,
      deferredEntities,
      locationKey,
    } = options;
    const refreshResult = await tx<DbRefreshStateRow>('refresh_state')
      .update({
        processed_entity: JSON.stringify(processedEntity),
        result_hash: resultHash,
        errors,
        location_key: locationKey,
      })
      .where('entity_id', id)
      .andWhere(inner => {
        if (!locationKey) {
          return inner.whereNull('location_key');
        }
        return inner
          .where('location_key', locationKey)
          .orWhereNull('location_key');
      });
    if (refreshResult === 0) {
      throw new ConflictError(
        `Conflicting write of processing result for ${id} with location key '${locationKey}'`,
      );
    }

    // Schedule all deferred entities for future processing.
    await this.addUnprocessedEntities(tx, {
      entities: deferredEntities,
      sourceEntityRef: stringifyEntityRef(processedEntity),
    });

    // Delete old relations
    await tx<DbRelationsRow>('relations')
      .where({ originating_entity_id: id })
      .delete();

    // Batch insert new relations
    const relationRows: DbRelationsRow[] = relations.map(
      ({ source, target, type }) => ({
        originating_entity_id: id,
        source_entity_ref: stringifyEntityRef(source),
        target_entity_ref: stringifyEntityRef(target),
        type,
      }),
    );
    await tx.batchInsert(
      'relations',
      this.deduplicateRelations(relationRows),
      BATCH_SIZE,
    );
  }

  async updateProcessedEntityErrors(
    txOpaque: Transaction,
    options: UpdateProcessedEntityOptions,
  ): Promise<void> {
    const tx = txOpaque as Knex.Transaction;
    const { id, errors, resultHash } = options;

    await tx<DbRefreshStateRow>('refresh_state')
      .update({
        errors,
        result_hash: resultHash,
      })
      .where('entity_id', id);
  }

  async updateEntityCache(
    txOpaque: Transaction,
    options: UpdateEntityCacheOptions,
  ): Promise<void> {
    const tx = txOpaque as Knex.Transaction;
    const { id, state } = options;

    await tx<DbRefreshStateRow>('refresh_state')
      .update({ cache: JSON.stringify(state ?? {}) })
      .where('entity_id', id);
  }

  async replaceUnprocessedEntities(
    txOpaque: Transaction,
    options: ReplaceUnprocessedEntitiesOptions,
  ): Promise<void> {
    const tx = txOpaque as Knex.Transaction;

    const { toAdd, toRemove } = await this.createDelta(tx, options);

    if (toRemove.length) {
      // TODO(freben): Batch split, to not hit variable limits?
      /*
      WITH RECURSIVE
        -- All the nodes that can be reached downwards from our root
        descendants(root_id, entity_ref) AS (
          SELECT id, target_entity_ref
          FROM refresh_state_references
          WHERE source_key = "R1" AND target_entity_ref = "A"
          UNION
          SELECT descendants.root_id, target_entity_ref
          FROM descendants
          JOIN refresh_state_references ON source_entity_ref = descendants.entity_ref
        ),
        -- All the nodes that can be reached upwards from the descendants
        ancestors(root_id, via_entity_ref, to_entity_ref) AS (
          SELECT CAST(NULL as INT), entity_ref, entity_ref
          FROM descendants
          UNION
          SELECT
            CASE WHEN source_key IS NOT NULL THEN id ELSE NULL END,
            source_entity_ref,
            ancestors.to_entity_ref
          FROM ancestors
          JOIN refresh_state_references ON target_entity_ref = ancestors.via_entity_ref
        )
      -- Start out with all of the descendants
      SELECT descendants.entity_ref
      FROM descendants
      -- Expand with all ancestors that point to those, but aren't the current root
      LEFT OUTER JOIN ancestors
        ON ancestors.to_entity_ref = descendants.entity_ref
        AND ancestors.root_id IS NOT NULL
        AND ancestors.root_id != descendants.root_id
      -- Exclude all lines that had such a foreign ancestor
      WHERE ancestors.root_id IS NULL;
      */
      const removedCount = await tx<DbRefreshStateRow>('refresh_state')
        .whereIn('entity_ref', function orphanedEntityRefs(orphans) {
          return (
            orphans
              // All the nodes that can be reached downwards from our root
              .withRecursive('descendants', function descendants(outer) {
                return outer
                  .select({ root_id: 'id', entity_ref: 'target_entity_ref' })
                  .from('refresh_state_references')
                  .where('source_key', options.sourceKey)
                  .whereIn('target_entity_ref', toRemove)
                  .union(function recursive(inner) {
                    return inner
                      .select({
                        root_id: 'descendants.root_id',
                        entity_ref:
                          'refresh_state_references.target_entity_ref',
                      })
                      .from('descendants')
                      .join('refresh_state_references', {
                        'descendants.entity_ref':
                          'refresh_state_references.source_entity_ref',
                      });
                  });
              })
              // All the nodes that can be reached upwards from the descendants
              .withRecursive('ancestors', function ancestors(outer) {
                return outer
                  .select({
                    root_id: tx.raw('CAST(NULL as INT)', []),
                    via_entity_ref: 'entity_ref',
                    to_entity_ref: 'entity_ref',
                  })
                  .from('descendants')
                  .union(function recursive(inner) {
                    return inner
                      .select({
                        root_id: tx.raw(
                          'CASE WHEN source_key IS NOT NULL THEN id ELSE NULL END',
                          [],
                        ),
                        via_entity_ref: 'source_entity_ref',
                        to_entity_ref: 'ancestors.to_entity_ref',
                      })
                      .from('ancestors')
                      .join('refresh_state_references', {
                        target_entity_ref: 'ancestors.via_entity_ref',
                      });
                  });
              })
              // Start out with all of the descendants
              .select('descendants.entity_ref')
              .from('descendants')
              // Expand with all ancestors that point to those, but aren't the current root
              .leftOuterJoin('ancestors', function keepaliveRoots() {
                this.on(
                  'ancestors.to_entity_ref',
                  '=',
                  'descendants.entity_ref',
                );
                this.andOnNotNull('ancestors.root_id');
                this.andOn('ancestors.root_id', '!=', 'descendants.root_id');
              })
              .whereNull('ancestors.root_id')
          );
        })
        .delete();

      await tx<DbRefreshStateReferencesRow>('refresh_state_references')
        .where('source_key', '=', options.sourceKey)
        .whereIn('target_entity_ref', toRemove)
        .delete();

      this.options.logger.debug(
        `removed, ${removedCount} entities: ${JSON.stringify(toRemove)}`,
      );
    }

    if (toAdd.length) {
      for (const { entity, locationKey } of toAdd) {
        const entityRef = stringifyEntityRef(entity);

        try {
          let ok = await this.insertUnprocessedEntity(tx, entity, locationKey);
          if (!ok) {
            ok = await this.updateUnprocessedEntity(tx, entity, locationKey);
          }

          if (ok) {
            await tx('refresh_state_references').insert<any>({
              source_key: options.sourceKey,
              target_entity_ref: entityRef,
            });
          } else {
            const conflictingKey = await this.checkLocationKeyConflict(
              tx,
              entityRef,
              locationKey,
            );
            if (conflictingKey) {
              this.options.logger.warn(
                `Source ${options.sourceKey} detected conflicting entityRef ${entityRef} already referenced by ${conflictingKey} and now also ${locationKey}`,
              );
            }
          }
        } catch (error) {
          this.options.logger.error(
            `Failed to add '${entityRef}' from source '${options.sourceKey}', ${error}`,
          );
        }
      }
    }
  }

  async getProcessableEntities(
    txOpaque: Transaction,
    request: { processBatchSize: number },
  ): Promise<GetProcessableEntitiesResult> {
    const tx = txOpaque as Knex.Transaction;

    let itemsQuery = tx<DbRefreshStateRow>('refresh_state').select();

    // This avoids duplication of work because of race conditions and is
    // also fast because locked rows are ignored rather than blocking.
    // It's only available in MySQL and PostgreSQL
    if (['mysql', 'mysql2', 'pg'].includes(tx.client.config.client)) {
      itemsQuery = itemsQuery.forUpdate().skipLocked();
    }

    const items = await itemsQuery
      .where('next_update_at', '<=', tx.fn.now())
      .limit(request.processBatchSize)
      .orderBy('next_update_at', 'asc');

    const interval = this.options.refreshInterval();
    await tx<DbRefreshStateRow>('refresh_state')
      .whereIn(
        'entity_ref',
        items.map(i => i.entity_ref),
      )
      .update({
        next_update_at:
          tx.client.config.client === 'sqlite3'
            ? tx.raw(`datetime('now', ?)`, [`${interval} seconds`])
            : tx.raw(`now() + interval '${interval} seconds'`),
      });

    return {
      items: items.map(
        i =>
          ({
            id: i.entity_id,
            entityRef: i.entity_ref,
            unprocessedEntity: JSON.parse(i.unprocessed_entity) as Entity,
            processedEntity: i.processed_entity
              ? (JSON.parse(i.processed_entity) as Entity)
              : undefined,
            resultHash: i.result_hash || '',
            nextUpdateAt: timestampToDateTime(i.next_update_at),
            lastDiscoveryAt: timestampToDateTime(i.last_discovery_at),
            state: i.cache ? JSON.parse(i.cache) : undefined,
            errors: i.errors,
            locationKey: i.location_key,
          } as RefreshStateItem),
      ),
    };
  }

  async listAncestors(
    txOpaque: Transaction,
    options: ListAncestorsOptions,
  ): Promise<ListAncestorsResult> {
    const tx = txOpaque as Knex.Transaction;
    const { entityRef } = options;
    const entityRefs = new Array<string>();

    let currentRef = entityRef.toLocaleLowerCase('en-US');
    for (let depth = 1; depth <= MAX_ANCESTOR_DEPTH; depth += 1) {
      const rows = await tx<DbRefreshStateReferencesRow>(
        'refresh_state_references',
      )
        .where({ target_entity_ref: currentRef })
        .select();

      if (rows.length === 0) {
        if (depth === 1) {
          throw new NotFoundError(`Entity ${currentRef} not found`);
        }
        throw new NotFoundError(
          `Entity ${entityRef} has a broken parent reference chain at ${currentRef}`,
        );
      }

      const parentRef = rows.find(r => r.source_entity_ref)?.source_entity_ref;
      if (!parentRef) {
        // We've reached the top of the tree which is the entityProvider.
        // In this case we refresh the entity itself.
        return { entityRefs };
      }
      entityRefs.push(parentRef);
      currentRef = parentRef;
    }
    throw new Error(
      `Unable receive ancestors for ${entityRef}, reached maximum depth of ${MAX_ANCESTOR_DEPTH}`,
    );
  }

  async refresh(txOpaque: Transaction, options: RefreshOptions): Promise<void> {
    const tx = txOpaque as Knex.Transaction;
    const { entityRef } = options;

    const updateResult = await tx<DbRefreshStateRow>('refresh_state')
      .where({ entity_ref: entityRef.toLocaleLowerCase('en-US') })
      .update({ next_update_at: tx.fn.now() });
    if (updateResult === 0) {
      throw new NotFoundError(`Failed to schedule ${entityRef} for refresh`);
    }
  }

  async transaction<T>(fn: (tx: Transaction) => Promise<T>): Promise<T> {
    try {
      let result: T | undefined = undefined;

      await this.options.database.transaction(
        async tx => {
          // We can't return here, as knex swallows the return type in case the transaction is rolled back:
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
  }

  /**
   * Attempts to update an existing refresh state row, returning true if it was
   * updated and false if there was no with a matching entity ref and location key.
   *
   * Updating the entity will also caused it to be scheduled for immediate processing.
   */
  private async updateUnprocessedEntity(
    tx: Knex.Transaction,
    entity: Entity,
    locationKey?: string,
  ): Promise<boolean> {
    const entityRef = stringifyEntityRef(entity);
    const serializedEntity = JSON.stringify(entity);

    // We optimistically try to update any existing refresh state first, as this is by far
    // the most common case.
    const refreshResult = await tx<DbRefreshStateRow>('refresh_state')
      .update({
        unprocessed_entity: serializedEntity,
        location_key: locationKey,
        last_discovery_at: tx.fn.now(),
        // We only get to this point if a processed entity actually had any changes, or
        // if an entity provider requested this mutation, meaning that we can safely
        // bump the deferred entities to the front of the queue for immediate processing.
        next_update_at: tx.fn.now(),
      })
      .where('entity_ref', entityRef)
      .andWhere(inner => {
        if (!locationKey) {
          return inner.whereNull('location_key');
        }
        return inner
          .where('location_key', locationKey)
          .orWhereNull('location_key');
      });

    return refreshResult === 1;
  }

  /**
   * Attempts to insert a new refresh state row for the given entity, returning
   * true if successful and false if there was a conflict.
   */
  private async insertUnprocessedEntity(
    tx: Knex.Transaction,
    entity: Entity,
    locationKey?: string,
  ): Promise<boolean> {
    const entityRef = stringifyEntityRef(entity);
    const serializedEntity = JSON.stringify(entity);

    // In the event that we can't update an existing refresh state, we first try to insert a new row
    try {
      let query = tx('refresh_state').insert<any>({
        entity_id: uuid(),
        entity_ref: entityRef,
        unprocessed_entity: serializedEntity,
        errors: '',
        location_key: locationKey,
        next_update_at: tx.fn.now(),
        last_discovery_at: tx.fn.now(),
      });

      // TODO(Rugvip): only tested towards Postgres and SQLite
      // We have to do this because the only way to detect if there was a conflict with
      // SQLite is to catch the error, while Postgres needs to ignore the conflict to not
      // break the ongoing transaction.
      if (tx.client.config.client !== 'sqlite3') {
        query = query.onConflict('entity_ref').ignore();
      }

      const result: { /* postgres */ rowCount?: number; length?: number } =
        await query;
      return result.rowCount === 1 || result.length === 1;
    } catch (error) {
      // SQLite reached this rather than the rowCount check above
      if (error.message.includes('UNIQUE constraint failed')) {
        return false;
      }
      throw error;
    }
  }

  /**
   * Checks whether a refresh state exists for the given entity that has a
   * location key that does not match the provided location key.
   *
   * @returns The conflicting key if there is one.
   */
  private async checkLocationKeyConflict(
    tx: Knex.Transaction,
    entityRef: string,
    locationKey?: string,
  ): Promise<string | undefined> {
    const row = await tx<DbRefreshStateRow>('refresh_state')
      .select('location_key')
      .where('entity_ref', entityRef)
      .first();

    const conflictingKey = row?.location_key;

    // If there's no existing key we can't have a conflict
    if (!conflictingKey) {
      return undefined;
    }

    if (conflictingKey !== locationKey) {
      return conflictingKey;
    }
    return undefined;
  }

  private deduplicateRelations(rows: DbRelationsRow[]): DbRelationsRow[] {
    return lodash.uniqBy(
      rows,
      r => `${r.source_entity_ref}:${r.target_entity_ref}:${r.type}`,
    );
  }

  private async createDelta(
    tx: Knex.Transaction,
    options: ReplaceUnprocessedEntitiesOptions,
  ): Promise<{ toAdd: DeferredEntity[]; toRemove: string[] }> {
    if (options.type === 'delta') {
      return {
        toAdd: options.added,
        toRemove: options.removed.map(e => stringifyEntityRef(e.entity)),
      };
    }

    // Grab all of the existing references from the same source, and their locationKeys as well
    const oldRefs = await tx<DbRefreshStateReferencesRow>(
      'refresh_state_references',
    )
      .where({ source_key: options.sourceKey })
      .leftJoin<DbRefreshStateRow>('refresh_state', {
        target_entity_ref: 'entity_ref',
      })
      .select(['target_entity_ref', 'location_key']);

    const items = options.items.map(deferred => ({
      deferred,
      ref: stringifyEntityRef(deferred.entity),
    }));

    const oldRefsSet = new Map(
      oldRefs.map(r => [r.target_entity_ref, r.location_key]),
    );
    const newRefsSet = new Set(items.map(item => item.ref));

    const toAdd = new Array<DeferredEntity>();
    const toRemove = oldRefs
      .map(row => row.target_entity_ref)
      .filter(ref => !newRefsSet.has(ref));

    for (const item of items) {
      if (!oldRefsSet.has(item.ref)) {
        // Add any entity that does not exist in the database
        toAdd.push(item.deferred);
      } else if (oldRefsSet.get(item.ref) !== item.deferred.locationKey) {
        // Remove and then re-add any entity that exists, but with a different location key
        toRemove.push(item.ref);
        toAdd.push(item.deferred);
      }
    }

    return { toAdd, toRemove };
  }

  /**
   * Add a set of deferred entities for processing.
   * The entities will be added at the front of the processing queue.
   */
  private async addUnprocessedEntities(
    txOpaque: Transaction,
    options: {
      sourceEntityRef: string;
      entities: DeferredEntity[];
    },
  ): Promise<void> {
    const tx = txOpaque as Knex.Transaction;

    // Keeps track of the entities that we end up inserting to update refresh_state_references afterwards
    const stateReferences = new Array<string>();
    const conflictingStateReferences = new Array<string>();

    // Upsert all of the unprocessed entities into the refresh_state table, by
    // their entity ref.
    for (const { entity, locationKey } of options.entities) {
      const entityRef = stringifyEntityRef(entity);

      const updated = await this.updateUnprocessedEntity(
        tx,
        entity,
        locationKey,
      );
      if (updated) {
        stateReferences.push(entityRef);
        continue;
      }

      const inserted = await this.insertUnprocessedEntity(
        tx,
        entity,
        locationKey,
      );
      if (inserted) {
        stateReferences.push(entityRef);
        continue;
      }

      // If the row can't be inserted, we have a conflict, but it could be either
      // because of a conflicting locationKey or a race with another instance, so check
      // whether the conflicting entity has the same entityRef but a different locationKey
      const conflictingKey = await this.checkLocationKeyConflict(
        tx,
        entityRef,
        locationKey,
      );
      if (conflictingKey) {
        this.options.logger.warn(
          `Detected conflicting entityRef ${entityRef} already referenced by ${conflictingKey} and now also ${locationKey}`,
        );
        conflictingStateReferences.push(entityRef);
      }
    }

    // Replace all references for the originating entity or source and then create new ones
    await tx<DbRefreshStateReferencesRow>('refresh_state_references')
      .whereNotIn('target_entity_ref', conflictingStateReferences)
      .andWhere({ source_entity_ref: options.sourceEntityRef })
      .delete();
    await tx.batchInsert(
      'refresh_state_references',
      stateReferences.map(entityRef => ({
        source_entity_ref: options.sourceEntityRef,
        target_entity_ref: entityRef,
      })),
      BATCH_SIZE,
    );
  }
}
