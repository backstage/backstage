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
import { Knex } from 'knex';
import { Transaction } from '../../database';
import {
  ProcessingDatabase,
  AddUnprocessedEntitiesOptions,
  UpdateProcessedEntityOptions,
  GetProcessableEntitiesResult,
} from './types';
import type { Logger } from 'winston';
import { Entity, stringifyEntityRef } from '@backstage/catalog-model';
import { v4 as uuid } from 'uuid';

export type DbRefreshStateRequest = {
  entity: Entity;
  nextRefresh: string; // TODO dateTime/ Date?
};

export type DbRefreshStateRow = {
  id: string;
  entity_ref: string;
  unprocessed_entity: string;
  processed_entity: string;
  cache: string;
  next_update_at: string;
  last_discovery_at: string; // remove?
  errors: string;
};

class ProcessingDatabaseImpl implements ProcessingDatabase {
  constructor(
    private readonly database: Knex,
    private readonly logger: Logger,
  ) {}

  async updateProcessedEntity(
    txOpaque: Transaction,
    options: UpdateProcessedEntityOptions,
  ): Promise<void> {
    const tx = txOpaque as Knex.Transaction;
    const { id, processedEntity, state, errors } = options;
    const result = await tx<DbRefreshStateRow>('refresh_state')
      .update({
        processed_entity: JSON.stringify(processedEntity),
        cache: JSON.stringify(state),
        errors,
      })
      .where('id', id);
    if (result === 0) {
      throw new NotFoundError(`Processing state not found for ${id}`);
    }

    // Update refs table
    // Update fragments
  }

  async addUnprocessedEntities(
    txOpaque: Transaction,
    options: AddUnprocessedEntitiesOptions,
  ): Promise<void> {
    const tx = txOpaque as Knex.Transaction;

    for (const entity of options.unprocessedEntities) {
      await tx<DbRefreshStateRow>('refresh_state')
        .insert({
          id: uuid(),
          entity_ref: stringifyEntityRef(entity),
          unprocessed_entity: JSON.stringify(entity),
          next_update_at: tx.fn.now(),
          last_discovery_at: tx.fn.now(),
        })
        .onConflict('entity_ref')
        .merge(['unprocessed_entity', 'last_discovery_at']);
    }
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
      .orderBy('next_update_at', 'desc');

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
        id: i.id,
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
