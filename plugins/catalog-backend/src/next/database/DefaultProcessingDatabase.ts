/*
 * Copyright 2021 Spotify AB
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

import { ConflictError, NotFoundError } from '@backstage/errors';
import { stringifyEntityRef, Entity } from '@backstage/catalog-model';
import { Knex } from 'knex';
import { Transaction } from '../../database';
import lodash from 'lodash';

import {
  ProcessingDatabase,
  AddUnprocessedEntitiesOptions,
  UpdateProcessedEntityOptions,
  GetProcessableEntitiesResult,
  ReplaceUnprocessedEntitiesOptions,
} from './types';
import type { Logger } from 'winston';

import { v4 as uuid } from 'uuid';

export type DbRefreshStateRow = {
  entity_id: string;
  entity_ref: string;
  unprocessed_entity: string;
  processed_entity?: string;
  cache?: string;
  next_update_at: string;
  last_discovery_at: string; // remove?
  errors?: string;
};

export type DbRelationsRow = {
  originating_entity_id: string;
  source_entity_ref: string;
  target_entity_ref: string;
  type: string;
};

export type DbRefreshStateReferencesRow = {
  source_key?: string;
  source_entity_ref?: string;
  target_entity_ref: string;
};

// The number of items that are sent per batch to the database layer, when
// doing .batchInsert calls to knex. This needs to be low enough to not cause
// errors in the underlying engine due to exceeding query limits, but large
// enough to get the speed benefits.
const BATCH_SIZE = 50;

export class DefaultProcessingDatabase implements ProcessingDatabase {
  constructor(
    private readonly database: Knex,
    private readonly logger: Logger,
  ) {}

  async updateProcessedEntity(
    txOpaque: Transaction,
    options: UpdateProcessedEntityOptions,
  ): Promise<void> {
    const tx = txOpaque as Knex.Transaction;
    const {
      id,
      processedEntity,
      state,
      errors,
      relations,
      deferredEntities,
    } = options;

    const refreshResult = await tx<DbRefreshStateRow>('refresh_state')
      .update({
        processed_entity: JSON.stringify(processedEntity),
        cache: JSON.stringify(state),
        errors,
      })
      .where('entity_id', id);

    if (refreshResult === 0) {
      throw new NotFoundError(`Processing state not found for ${id}`);
    }

    // Schedule all deferred entities for future processing.
    await this.addUnprocessedEntities(tx, {
      entities: deferredEntities,
      id,
      type: 'entity',
    });

    // Update fragments

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

  private deduplicateRelations(rows: DbRelationsRow[]): DbRelationsRow[] {
    return lodash.uniqBy(
      rows,
      r => `${r.source_entity_ref}:${r.target_entity_ref}:${r.type}`,
    );
  }

  async replaceUnprocessedEntities(
    txOpaque: Transaction,
    options: ReplaceUnprocessedEntitiesOptions,
  ): Promise<void> {
    const tx = txOpaque as Knex.Transaction;
    const entityIds = new Array<string>();

    if (options.type === 'full') {
      const oldRefs = await tx<DbRefreshStateReferencesRow>(
        'refresh_state_references',
      )
        .where({ source_key: options.sourceKey })
        .select('target_entity_ref')
        .then(rows => rows.map(r => r.target_entity_ref));

      const items = options.items.map(entity => ({
        entity,
        ref: stringifyEntityRef(entity),
        id: uuid(),
      }));

      const oldRefsSet = new Set(oldRefs);
      const newRefsSet = new Set(items.map(item => item.ref));
      const toAdd = items.filter(item => !oldRefsSet.has(item.ref));
      const toRemove = oldRefs.filter(ref => !newRefsSet.has(ref));

      if (toRemove.length) {
        // TODO(freben): Batch split, to not hit variable limits?

        // get all refs where source = any of the toRemove
        // delete all state rows matching any of the toRemove
        // revisit the targets of all of those refs
        // verify if they have references, otherwise delete from refresh_state

        const current = [...toRemove];
        while (true) {

          tx.withRecursive('r', function refs() {
            return tx.select({  })
              .from({ r1: 'refresh_state_references' })
              .where({ source_key: options.sourceKey })
              .whereIn('target_entity_ref', toRemove)
              .unionAll(function recurse() {
                return tx.select({  })
                  .from({ r2: 'refresh_state_references' })
                  .whereNotExists()
              })
          })
          .select().from('refs');

          const nextLayerToRemove = await tx<DbRefreshStateReferencesRow>(
            'refresh_state_references',
          )
            .whereIn('source_entity_ref', toRemove)
            .leftOuterJoin('refresh_state_references AS b', function f() {

            })

            .whereNotNull('b.source_target_ref')
            .select('target_entity_ref');

          await tx<DbRefreshStateRow>('refresh_state')
            .whereIn('entity_ref', toRemove)
            .delete();

          const refsThatStillHaveASourcePointingAtThe = await tx<DbRefreshStateReferencesRow>(
            'refresh_state_references',
          )
            .whereIn('target_entity_ref', nextLayerTargetRefs)
            .groupBy('target_entity_ref')
            .select('target_entity_ref');

      }




      if (toAdd.length) {
        const state: Knex.DbRecord<DbRefreshStateRow>[] = toAdd.map(item => ({
          entity_id: item.id,
          entity_ref: item.ref,
          unprocessed_entity: JSON.stringify(item.entity),
          errors: '',
          next_update_at: tx.fn.now(),
          last_discovery_at: tx.fn.now(),
        }));
        const stateReferences: DbRefreshStateReferencesRow[] = toAdd.map(
          item => ({
            source_key: options.sourceKey,
            target_entity_ref: item.ref,
          }),
        );
        // TODO(freben): Concurrency? If we did these one by one, a .onConflict().merge would have made sense
        await tx.batchInsert('refresh_state', state, BATCH_SIZE);
        await tx.batchInsert('refresh_state_references', stateReferences, BATCH_SIZE);
      }


      for (const entity of options.items) {
        const entityRef = stringifyEntityRef(entity);
        await tx<DbRefreshStateRow>('refresh_state')
          .insert({
            entity_id: uuid(),
            entity_ref: entityRef,
            unprocessed_entity: JSON.stringify(entity),
            errors: '',
            next_update_at: tx.fn.now(),
            last_discovery_at: tx.fn.now(),
          })
          .onConflict('entity_ref')
          .merge(['unprocessed_entity', 'last_discovery_at']);

        const [{ entity_id: entityId }] = await tx<DbRefreshStateRow>(
          'refresh_state',
        ).where({ entity_ref: entityRef });
        entityIds.push(entityId);
      }
      const referenceRows: DbRefreshStateReferencesRow[] = entityIds.map(
        entityId => ({
          source_key: options.sourceKey,
          target_entityRef: entityRef,
        }),
      );
      await tx.batchInsert(
        'refresh_state_references',
        referenceRows,
        BATCH_SIZE,
      );
      return;
    }

    for (const entity of options.removed) {
      const entityRef = stringifyEntityRef(entity);
      const [result] = await tx<DbRefreshStateRow>('refresh_state')
        .where({ entity_ref: entityRef })
        .select('entity_id');

      if (!result) {
        this.logger.info(
          `Unable to delete entity '${entityRef}', entity does not exist in refresh state`,
        );
        continue;
      }

      const referenceResults = await tx<DbRefreshStateReferencesRow>(
        'refresh_state_references',
      )
        // todo correct key?
        .where({ source_entity_id: result.entity_id })
        .select();

      await tx<DbRefreshStateReferencesRow>('refresh_state_references')
        // todo correct key?
        .where({ source_entity_id: result.entity_id })
        .delete();
    }
  }

  async addUnprocessedEntities(
    txOpaque: Transaction,
    options: AddUnprocessedEntitiesOptions,
  ): Promise<void> {
    const tx = txOpaque as Knex.Transaction;
    const entityIds = new Array<string>();

    for (const entity of options.entities) {
      const entityRef = stringifyEntityRef(entity);
      await tx<DbRefreshStateRow>('refresh_state')
        .insert({
          entity_id: uuid(),
          entity_ref: entityRef,
          unprocessed_entity: JSON.stringify(entity),
          errors: '',
          next_update_at: tx.fn.now(),
          last_discovery_at: tx.fn.now(),
        })
        .onConflict('entity_ref')
        .merge(['unprocessed_entity', 'last_discovery_at']);

      const [{ entity_id: entityId }] = await tx<DbRefreshStateRow>(
        'refresh_state',
      ).where({ entity_ref: entityRef });
      entityIds.push(entityId);
    }

    const key =
      options.type === 'provider'
        ? { source_special_key: options.id }
        : { source_entity_id: options.id };
    // copied from update refs
    await tx<DbRefreshStateReferencesRow>('refresh_state_references')
      .where(key)
      .delete();

    const referenceRows: DbRefreshStateReferencesRow[] = entityIds.map(
      entityId => ({
        ...key,
        target_entity_id: entityId,
      }),
    );
    await tx.batchInsert('refresh_state_references', referenceRows, BATCH_SIZE);
  }

  async getProcessableEntities(
    txOpaque: Transaction,
    request: { processBatchSize: number },
  ): Promise<GetProcessableEntitiesResult> {
    const tx = txOpaque as Knex.Transaction;

    const items = await tx<DbRefreshStateRow>('refresh_state')
      .select()
      .where('next_update_at', '<=', tx.fn.now())
      .limit(request.processBatchSize)
      .orderBy('next_update_at', 'asc');

    await tx<DbRefreshStateRow>('refresh_state')
      .whereIn(
        'entity_ref',
        items.map(i => i.entity_ref),
      )
      .update({
        next_update_at:
          tx.client.config.client === 'sqlite3'
            ? tx.raw(`datetime('now', ?)`, [`10 seconds`]) // TODO: test this in sqlite3
            : tx.raw(`now() + interval '30 seconds'`),
      });

    return {
      items: items.map(i => ({
        id: i.entity_id,
        entityRef: i.entity_ref,
        unprocessedEntity: JSON.parse(i.unprocessed_entity) as Entity,
        processedEntity: JSON.parse(i.processed_entity) as Entity,
        nextUpdateAt: i.next_update_at,
        lastDiscoveryAt: i.last_discovery_at,
        state: JSON.parse(i.cache),
        errors: i.errors,
      })),
    };
  }

  async transaction<T>(fn: (tx: Transaction) => Promise<T>): Promise<T> {
    try {
      let result: T | undefined = undefined;

      await this.database.transaction(
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
      this.logger.debug(`Error during transaction, ${e}`);

      if (
        /SQLITE_CONSTRAINT: UNIQUE/.test(e.message) ||
        /unique constraint/.test(e.message)
      ) {
        throw new ConflictError(`Rejected due to a conflicting entity`, e);
      }

      throw e;
    }
  }
}
