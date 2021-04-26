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

import { Knex } from 'knex';
import { Logger } from 'winston';
import { Transaction } from '../database';
import { ConflictError } from '@backstage/errors';
import {
  DbRefreshStateReferencesRow,
  DbRefreshStateRow,
  DbRelationsRow,
} from './database/DefaultProcessingDatabase';
import { Entity, parseEntityRef } from '@backstage/catalog-model';
import { createHash } from 'crypto';
import stableStringify from 'fast-json-stable-stringify';

export type DbFinalEntitiesRow = {
  entity_id: string;
  etag: string;
  finalized_entity: string;
};

function generateEntityEtag(entity: Entity) {
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
        const [result] = await tx<DbRefreshStateRow>('refresh_state')
          .select('entity_id', 'processed_entity')
          .where({ entity_ref: entityRef });

        if (!result) {
          this.logger.debug(
            `Unable to stitch ${entityRef}, item does not exist in refresh state table`,
          );
          return;
        } else if (!result.processed_entity) {
          this.logger.debug(
            `Unable to stitch ${entityRef}, the entity has not yet been processed`,
          );
          return;
        }

        const entity: Entity = JSON.parse(result.processed_entity);

        const entityId = entity?.metadata?.uid;
        if (!entityId) {
          this.logger.error(`missing ID in entity ${JSON.stringify(entity)}`);
          return;
        }

        const [reference_count_result] = await tx<DbRefreshStateReferencesRow>(
          'refresh_state_references',
        )
          .where({ target_entity_ref: entityRef })
          .count({ reference_count: 'target_entity_ref' });

        if (Number(reference_count_result.reference_count) === 0) {
          this.logger.debug(`${entityRef} is orphan`);
          entity.metadata.annotations = {
            ...entity.metadata.annotations,
            ['backstage.io/orphan']: 'true',
          };
        }

        const relationResults = await tx<DbRelationsRow>('relations')
          .where({ source_entity_ref: entityRef })
          .select();

        // TODO: entityRef is lower case and should be uppercase in the final result.
        entity.relations = relationResults.map(relation => ({
          type: relation.type,
          target: parseEntityRef(relation.target_entity_ref),
        }));
        entity.metadata.generation = 1;
        const etag = generateEntityEtag(entity);
        entity.metadata.etag = etag;
        await tx<DbFinalEntitiesRow>('final_entities')
          .insert({
            finalized_entity: JSON.stringify(entity),
            entity_id: entityId,
            etag,
          })
          .onConflict('entity_id')
          .merge(['finalized_entity', 'etag']);
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
