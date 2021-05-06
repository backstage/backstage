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

import { Entity, parseEntityRef } from '@backstage/catalog-model';
import { ConflictError } from '@backstage/errors';
import { createHash } from 'crypto';
import stableStringify from 'fast-json-stable-stringify';
import { Knex } from 'knex';
import { Logger } from 'winston';
import { Transaction } from '../database';
import { buildEntitySearch, DbSearchRow } from './search';

// The number of items that are sent per batch to the database layer, when
// doing .batchInsert calls to knex. This needs to be low enough to not cause
// errors in the underlying engine due to exceeding query limits, but large
// enough to get the speed benefits.
const BATCH_SIZE = 50;

export type DbFinalEntitiesRow = {
  entity_id: string;
  hash: string;
  final_entity: string;
};

function generateStableHash(entity: Entity) {
  return createHash('sha1')
    .update(stableStringify({ ...entity }))
    .digest('hex');
}

export class Stitcher {
  constructor(
    private readonly database: Knex,
    private readonly logger: Logger,
  ) {}

  async stitch(entityRefs: Set<string>) {
    for (const entityRef of entityRefs) {
      await this.transaction(async txOpaque => {
        const tx = txOpaque as Knex.Transaction;

        // Selecting from refresh_state and final_entities should yield exactly
        // one row (except in abnormal cases where the stitch was invoked for
        // something that didn't exist at all, in which case it's zero rows).
        // The join with the temporary incoming_references still gives one row.
        // The only result set "expanding" join is the one with relations, so
        // the output should be at least one row (if zero or one relations were
        // found), or at most the same number of rows as relations.
        const result: Array<{
          entityId: string;
          processedEntity?: string;
          errors: string;
          incomingReferenceCount: string | number;
          previousHash?: string;
          relationType?: string;
          relationTarget?: string;
        }> = await tx
          .with('incoming_references', function incomingReferences(builder) {
            return builder
              .from('refresh_state_references')
              .where({ target_entity_ref: entityRef })
              .count({ count: '*' });
          })
          .select({
            entityId: 'refresh_state.entity_id',
            processedEntity: 'refresh_state.processed_entity',
            errors: 'refresh_state.errors',
            incomingReferenceCount: 'incoming_references.count',
            previousHash: 'final_entities.hash',
            relationType: 'relations.type',
            relationTarget: 'relations.target_entity_ref',
          })
          .from('refresh_state')
          .where({ 'refresh_state.entity_ref': entityRef })
          .crossJoin(tx.raw('incoming_references'))
          .leftOuterJoin('final_entities', {
            'final_entities.entity_id': 'refresh_state.entity_id',
          })
          .leftOuterJoin('relations', {
            'relations.source_entity_ref': 'refresh_state.entity_ref',
          })
          .orderBy('relationType', 'asc')
          .orderBy('relationTarget', 'asc');

        // If there were no rows returned, it would mean that there was no
        // matching row even in the refresh_state. This can happen for example
        // if we emit a relation to something that hasn't been ingested yet.
        // It's safe to ignore this stitch attempt in that case.
        if (!result.length) {
          this.logger.debug(
            `Unable to stitch ${entityRef}, item does not exist in refresh state table`,
          );
          return;
        }

        const {
          entityId,
          processedEntity,
          // errors,
          incomingReferenceCount,
          previousHash,
        } = result[0];

        // If there was no processed entity in place, the target hasn't been
        // through the processing steps yet. It's safe to ignore this stitch
        // attempt in that case, since another stitch will be triggered when
        // that processing has finished.
        if (!processedEntity) {
          this.logger.debug(
            `Unable to stitch ${entityRef}, the entity has not yet been processed`,
          );
          return;
        }

        // Grab the processed entity and stitch all of the relevant data into
        // it
        const entity = JSON.parse(processedEntity) as Entity;
        const isOrphan = Number(incomingReferenceCount) === 0;

        if (isOrphan) {
          this.logger.debug(`${entityRef} is an orphan`);
          entity.metadata.annotations = {
            ...entity.metadata.annotations,
            ['backstage.io/orphan']: 'true',
          };
        }

        // TODO: entityRef is lower case and should be uppercase in the final
        // result
        entity.relations = result
          .filter(row => row.relationType /* exclude null row, if relevant */)
          .map(row => ({
            type: row.relationType!,
            target: parseEntityRef(row.relationTarget!),
          }));

        // If the output entity was actually not changed, just abort
        const hash = generateStableHash(entity);
        if (hash === previousHash) {
          this.logger.debug(`Skipped stitching of ${entityRef}, no changes`);
          return;
        }

        entity.metadata.uid = entityId;
        entity.metadata.generation = 1;
        if (!entity.metadata.etag) {
          // If the original data source did not have its own etag handling,
          // use the hash as a good-quality etag
          entity.metadata.etag = hash;
        }

        await tx<DbFinalEntitiesRow>('final_entities')
          .insert({
            entity_id: entityId,
            final_entity: JSON.stringify(entity),
            hash,
          })
          .onConflict('entity_id')
          .merge(['final_entity', 'hash']);

        const searchEntries = buildEntitySearch(entityId, entity);
        await tx<DbSearchRow>('search').where({ entity_id: entityId }).delete();
        await tx.batchInsert('search', searchEntries, BATCH_SIZE);
      });
    }
  }

  private async transaction<T>(
    fn: (tx: Transaction) => Promise<T>,
  ): Promise<T> {
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
          isolationLevel:
            this.database.client.config.client === 'sqlite3'
              ? undefined // sqlite3 only supports serializable transactions, ignoring the isolation level param
              : 'serializable',
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
