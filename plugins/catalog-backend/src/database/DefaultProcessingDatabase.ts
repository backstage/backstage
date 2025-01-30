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
import { ConflictError } from '@backstage/errors';
import { DeferredEntity } from '@backstage/plugin-catalog-node';
import { Knex } from 'knex';
import lodash from 'lodash';
import { ProcessingIntervalFunction } from '../processing';
import { rethrowError, timestampToDateTime } from './conversion';
import { initDatabaseMetrics } from './metrics';
import {
  DbRefreshKeysRow,
  DbRefreshStateReferencesRow,
  DbRefreshStateRow,
  DbRelationsRow,
} from './tables';
import {
  GetProcessableEntitiesResult,
  ListParentsOptions,
  ListParentsResult,
  ProcessingDatabase,
  RefreshStateItem,
  Transaction,
  UpdateEntityCacheOptions,
  UpdateProcessedEntityOptions,
} from './types';
import { checkLocationKeyConflict } from './operations/refreshState/checkLocationKeyConflict';
import { insertUnprocessedEntity } from './operations/refreshState/insertUnprocessedEntity';
import { updateUnprocessedEntity } from './operations/refreshState/updateUnprocessedEntity';
import { generateStableHash, generateTargetKey } from './util';
import {
  EventBroker,
  EventParams,
  EventsService,
} from '@backstage/plugin-events-node';
import { DateTime } from 'luxon';
import { CATALOG_CONFLICTS_TOPIC } from '../constants';
import { CatalogConflictEventPayload } from '../catalog/types';
import { LoggerService } from '@backstage/backend-plugin-api';

// The number of items that are sent per batch to the database layer, when
// doing .batchInsert calls to knex. This needs to be low enough to not cause
// errors in the underlying engine due to exceeding query limits, but large
// enough to get the speed benefits.
const BATCH_SIZE = 50;

export class DefaultProcessingDatabase implements ProcessingDatabase {
  constructor(
    private readonly options: {
      database: Knex;
      logger: LoggerService;
      refreshInterval: ProcessingIntervalFunction;
      eventBroker?: EventBroker | EventsService;
    },
  ) {
    initDatabaseMetrics(options.database);
  }

  async updateProcessedEntity(
    txOpaque: Transaction,
    options: UpdateProcessedEntityOptions,
  ): Promise<{ previous: { relations: DbRelationsRow[] } }> {
    const tx = txOpaque as Knex.Transaction;
    const {
      id,
      processedEntity,
      resultHash,
      errors,
      relations,
      deferredEntities,
      refreshKeys,
      locationKey,
    } = options;
    const configClient = tx.client.config.client;
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
    const sourceEntityRef = stringifyEntityRef(processedEntity);

    // Schedule all deferred entities for future processing.
    await this.addUnprocessedEntities(tx, {
      entities: deferredEntities,
      sourceEntityRef,
    });

    // Delete old relations
    // NOTE(freben): knex implemented support for returning() on update queries for sqlite, but at the current time of writing (Sep 2022) not for delete() queries.
    let previousRelationRows: DbRelationsRow[];
    if (configClient.includes('sqlite3') || configClient.includes('mysql')) {
      previousRelationRows = await tx<DbRelationsRow>('relations')
        .select('*')
        .where({ originating_entity_id: id });
      await tx<DbRelationsRow>('relations')
        .where({ originating_entity_id: id })
        .delete();
    } else {
      previousRelationRows = await tx<DbRelationsRow>('relations')
        .where({ originating_entity_id: id })
        .delete()
        .returning('*');
    }

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

    // Delete old refresh keys
    await tx<DbRefreshKeysRow>('refresh_keys')
      .where({ entity_id: id })
      .delete();

    // Insert the refresh keys for the processed entity
    await tx.batchInsert(
      'refresh_keys',
      refreshKeys.map(k => ({
        entity_id: id,
        key: generateTargetKey(k.key),
      })),
      BATCH_SIZE,
    );

    return {
      previous: {
        relations: previousRelationRows,
      },
    };
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

  async getProcessableEntities(
    maybeTx: Transaction | Knex,
    request: { processBatchSize: number },
  ): Promise<GetProcessableEntitiesResult> {
    const knex = maybeTx as Knex.Transaction | Knex;

    let itemsQuery = knex<DbRefreshStateRow>('refresh_state').select([
      'entity_id',
      'entity_ref',
      'unprocessed_entity',
      'result_hash',
      'cache',
      'errors',
      'location_key',
      'next_update_at',
    ]);

    // This avoids duplication of work because of race conditions and is
    // also fast because locked rows are ignored rather than blocking.
    // It's only available in MySQL and PostgreSQL
    if (['mysql', 'mysql2', 'pg'].includes(knex.client.config.client)) {
      itemsQuery = itemsQuery.forUpdate().skipLocked();
    }

    const items = await itemsQuery
      .where('next_update_at', '<=', knex.fn.now())
      .limit(request.processBatchSize)
      .orderBy('next_update_at', 'asc');

    const interval = this.options.refreshInterval();

    const nextUpdateAt = (refreshInterval: number) => {
      if (knex.client.config.client.includes('sqlite3')) {
        return knex.raw(`datetime('now', ?)`, [`${refreshInterval} seconds`]);
      } else if (knex.client.config.client.includes('mysql')) {
        return knex.raw(`now() + interval ${refreshInterval} second`);
      }
      return knex.raw(`now() + interval '${refreshInterval} seconds'`);
    };

    await knex<DbRefreshStateRow>('refresh_state')
      .whereIn(
        'entity_ref',
        items.map(i => i.entity_ref),
      )
      .update({
        next_update_at: nextUpdateAt(interval),
      });

    return {
      items: items.map(
        i =>
          ({
            id: i.entity_id,
            entityRef: i.entity_ref,
            unprocessedEntity: JSON.parse(i.unprocessed_entity) as Entity,
            resultHash: i.result_hash || '',
            nextUpdateAt: timestampToDateTime(i.next_update_at),
            state: i.cache ? JSON.parse(i.cache) : undefined,
            errors: i.errors,
            locationKey: i.location_key,
          } satisfies RefreshStateItem),
      ),
    };
  }

  async listParents(
    txOpaque: Transaction,
    options: ListParentsOptions,
  ): Promise<ListParentsResult> {
    const tx = txOpaque as Knex.Transaction;

    const rows = await tx<DbRefreshStateReferencesRow>(
      'refresh_state_references',
    )
      .whereIn('target_entity_ref', options.entityRefs)
      .select();

    const entityRefs = rows.map(r => r.source_entity_ref!).filter(Boolean);

    return { entityRefs };
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

  private deduplicateRelations(rows: DbRelationsRow[]): DbRelationsRow[] {
    return lodash.uniqBy(
      rows,
      r => `${r.source_entity_ref}:${r.target_entity_ref}:${r.type}`,
    );
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

    // Upsert all of the unprocessed entities into the refresh_state table, by
    // their entity ref.
    for (const { entity, locationKey } of options.entities) {
      const entityRef = stringifyEntityRef(entity);
      const hash = generateStableHash(entity);

      const updated = await updateUnprocessedEntity({
        tx,
        entity,
        hash,
        locationKey,
      });
      if (updated) {
        stateReferences.push(entityRef);
        continue;
      }

      const inserted = await insertUnprocessedEntity({
        tx,
        entity,
        hash,
        locationKey,
        logger: this.options.logger,
      });
      if (inserted) {
        stateReferences.push(entityRef);
        continue;
      }

      // If the row can't be inserted, we have a conflict, but it could be either
      // because of a conflicting locationKey or a race with another instance, so check
      // whether the conflicting entity has the same entityRef but a different locationKey
      const conflictingKey = await checkLocationKeyConflict({
        tx,
        entityRef,
        locationKey,
      });
      if (conflictingKey) {
        this.options.logger.warn(
          `Detected conflicting entityRef ${entityRef} already referenced by ${conflictingKey} and now also ${locationKey}`,
        );
        if (this.options.eventBroker && locationKey) {
          const eventParams: EventParams<CatalogConflictEventPayload> = {
            topic: CATALOG_CONFLICTS_TOPIC,
            eventPayload: {
              unprocessedEntity: entity,
              entityRef,
              newLocationKey: locationKey,
              existingLocationKey: conflictingKey,
              lastConflictAt: DateTime.now().toISO()!,
            },
          };
          await this.options.eventBroker?.publish(eventParams);
        }
      }
    }

    // Lastly, replace refresh state references for the originating entity and any successfully added entities
    await tx<DbRefreshStateReferencesRow>('refresh_state_references')
      // Remove all existing references from the originating entity
      .where({ source_entity_ref: options.sourceEntityRef })
      // And remove any existing references to entities that we're inserting new references for
      .orWhereIn('target_entity_ref', stateReferences)
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
