/*
 * Copyright 2023 The Backstage Authors
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

import { ENTITY_STATUS_CATALOG_PROCESSING_TYPE } from '@backstage/catalog-client';
import {
  ANNOTATION_EDIT_URL,
  ANNOTATION_VIEW_URL,
  EntityRelation,
} from '@backstage/catalog-model';
import { AlphaEntity, EntityStatusItem } from '@backstage/catalog-model/alpha';
import { SerializedError } from '@backstage/errors';
import { Knex } from 'knex';
import { v4 as uuid } from 'uuid';
import { StitchingStrategy } from '../../../stitching/types';
import {
  DbFinalEntitiesRow,
  DbRefreshStateRow,
  DbSearchRow,
} from '../../tables';
import { buildEntitySearch } from './buildEntitySearch';
import { markDeferredStitchCompleted } from './markDeferredStitchCompleted';
import { BATCH_SIZE, generateStableHash } from './util';
import {
  LoggerService,
  isDatabaseConflictError,
} from '@backstage/backend-plugin-api';

// See https://github.com/facebook/react/blob/f0cf832e1d0c8544c36aa8b310960885a11a847c/packages/react-dom-bindings/src/shared/sanitizeURL.js
const scriptProtocolPattern =
  // eslint-disable-next-line no-control-regex
  /^[\u0000-\u001F ]*j[\r\n\t]*a[\r\n\t]*v[\r\n\t]*a[\r\n\t]*s[\r\n\t]*c[\r\n\t]*r[\r\n\t]*i[\r\n\t]*p[\r\n\t]*t[\r\n\t]*\:/i;

/**
 * Performs the act of stitching - to take all of the various outputs from the
 * ingestion process, and stitching them together into the final entity JSON
 * shape.
 */
export async function performStitching(options: {
  knex: Knex | Knex.Transaction;
  logger: LoggerService;
  strategy: StitchingStrategy;
  entityRef: string;
  stitchTicket?: string;
}): Promise<'changed' | 'unchanged' | 'abandoned'> {
  const { knex, logger, entityRef } = options;
  const stitchTicket = options.stitchTicket ?? uuid();

  // In deferred mode, the entity is removed from the stitch queue on ANY
  // completion, except when an exception is thrown. In the latter case, the
  // entity will be retried at a later time.
  let removeFromStitchQueueOnCompletion = options.strategy.mode === 'deferred';

  try {
    // Select the winning candidate from all entities with this entity_ref.
    // Winner selection rules:
    // 1. Non-null location_key beats null location_key
    // 2. Among equals, oldest (by created_at) wins
    const candidates = await knex<DbRefreshStateRow>('refresh_state')
      .where({ entity_ref: entityRef })
      .orderBy([
        // Non-null location_key wins over null
        {
          column: knex.raw(
            'CASE WHEN location_key IS NULL THEN 1 ELSE 0 END',
          ) as any,
          order: 'asc',
        },
        // Oldest (by created_at) wins among equals
        { column: 'created_at', order: 'asc', nulls: 'last' },
      ])
      .select('entity_id', 'processed_entity', 'errors', 'location_key');

    if (!candidates.length) {
      // Entity does not exist in refresh state table, no stitching required.
      return 'abandoned';
    }

    // The first candidate is the winner
    const winner = candidates[0];

    // Insert stitching ticket that will be compared before inserting the final entity.
    try {
      await knex<DbFinalEntitiesRow>('final_entities')
        .insert({
          entity_id: winner.entity_id,
          hash: '',
          entity_ref: entityRef,
          stitch_ticket: stitchTicket,
        })
        .onConflict('entity_id')
        .merge(['stitch_ticket']);
    } catch (error) {
      // It's possible to hit a race where a refresh_state table delete + insert
      // is done just after we read the entity_id from it. This conflict is safe
      // to ignore because the current stitching operation will be triggered by
      // the old entry, and the new entry will trigger it's own stitching that
      // will update the entity.
      if (isDatabaseConflictError(error)) {
        logger.debug(`Skipping stitching of ${entityRef}, conflict`, error);
        return 'abandoned';
      }

      throw error;
    }

    // Count incoming references using both new inline source columns and old table
    // An entity has incoming references if:
    // - Any entity has source_type='entity' and source_key pointing to this entity_ref
    // - Or there's a row in refresh_state_references with this target
    const [incomingCountResult, relationsResult] = await Promise.all([
      knex
        .with('inline_refs', ['count'], builder =>
          builder
            .from('refresh_state')
            .where('source_type', '=', 'entity')
            .where('source_key', '=', entityRef)
            .count({ count: '*' }),
        )
        .with('table_refs', ['count'], builder =>
          builder
            .from('refresh_state_references')
            .where({ target_entity_ref: entityRef })
            .count({ count: '*' }),
        )
        .select({
          inlineCount: 'inline_refs.count',
          tableCount: 'table_refs.count',
        })
        .from('inline_refs')
        .crossJoin(knex.raw('table_refs')),
      knex
        .distinct({
          relationType: 'type',
          relationTarget: 'target_entity_ref',
        })
        .from('relations')
        .where({ source_entity_ref: entityRef })
        .orderBy('relationType', 'asc')
        .orderBy('relationTarget', 'asc'),
    ]);

    // Get previous hash from final_entities
    const previousHashResult = await knex<DbFinalEntitiesRow>('final_entities')
      .where({ entity_id: winner.entity_id })
      .select('hash')
      .first();

    const entityId = winner.entity_id;
    const processedEntity = winner.processed_entity;
    const errors = winner.errors;
    const incomingReferenceCount =
      Number(incomingCountResult[0]?.inlineCount ?? 0) +
      Number(incomingCountResult[0]?.tableCount ?? 0);
    const previousHash = previousHashResult?.hash;

    // If there was no processed entity in place, the target hasn't been
    // through the processing steps yet. It's safe to ignore this stitch
    // attempt in that case, since another stitch will be triggered when
    // that processing has finished.
    if (!processedEntity) {
      logger.debug(
        `Unable to stitch ${entityRef}, the entity has not yet been processed`,
      );
      return 'abandoned';
    }

    // Grab the processed entity and stitch all of the relevant data into
    // it
    const entity = JSON.parse(processedEntity) as AlphaEntity;
    const isOrphan = Number(incomingReferenceCount) === 0;
    let statusItems: EntityStatusItem[] = [];

    if (isOrphan) {
      logger.debug(`${entityRef} is an orphan`);
      entity.metadata.annotations = {
        ...entity.metadata.annotations,
        ['backstage.io/orphan']: 'true',
      };
    }
    if (errors) {
      const parsedErrors = JSON.parse(errors) as SerializedError[];
      if (Array.isArray(parsedErrors) && parsedErrors.length) {
        statusItems = parsedErrors.map(e => ({
          type: ENTITY_STATUS_CATALOG_PROCESSING_TYPE,
          level: 'error',
          message: `${e.name}: ${e.message}`,
          error: e,
        }));
      }
    }
    // We opt to do this check here as we otherwise can't guarantee that it will be run after all processors
    for (const annotation of [ANNOTATION_VIEW_URL, ANNOTATION_EDIT_URL]) {
      const value = entity.metadata.annotations?.[annotation];
      if (typeof value === 'string' && scriptProtocolPattern.test(value)) {
        entity.metadata.annotations![annotation] =
          'https://backstage.io/annotation-rejected-for-security-reasons';
      }
    }

    // TODO: entityRef is lower case and should be uppercase in the final
    // result
    entity.relations = relationsResult
      .filter(row => row.relationType /* exclude null row, if relevant */)
      .map<EntityRelation>(row => ({
        type: row.relationType!,
        targetRef: row.relationTarget!,
      }));
    if (statusItems.length) {
      entity.status = {
        ...entity.status,
        items: [...(entity.status?.items ?? []), ...statusItems],
      };
    }

    // If the output entity was actually not changed, just abort
    const hash = generateStableHash(entity);
    if (hash === previousHash) {
      logger.debug(`Skipped stitching of ${entityRef}, no changes`);
      return 'unchanged';
    }

    entity.metadata.uid = entityId;
    if (!entity.metadata.etag) {
      // If the original data source did not have its own etag handling,
      // use the hash as a good-quality etag
      entity.metadata.etag = hash;
    }

    // This may throw if the entity is invalid, so we call it before
    // the final_entities write, even though we may end up not needing
    // to write the search index.
    const searchEntries = buildEntitySearch(entityId, entity);

    const amountOfRowsChanged = await knex<DbFinalEntitiesRow>('final_entities')
      .update({
        final_entity: JSON.stringify(entity),
        hash,
        last_updated_at: knex.fn.now(),
      })
      .where('entity_id', entityId)
      .where('stitch_ticket', stitchTicket);

    if (amountOfRowsChanged === 0) {
      logger.debug(`Entity ${entityRef} is already stitched, skipping write.`);
      return 'abandoned';
    }

    await knex.transaction(async trx => {
      await trx<DbSearchRow>('search').where({ entity_id: entityId }).delete();
      await trx.batchInsert('search', searchEntries, BATCH_SIZE);
    });

    return 'changed';
  } catch (error) {
    removeFromStitchQueueOnCompletion = false;
    throw error;
  } finally {
    if (removeFromStitchQueueOnCompletion) {
      await markDeferredStitchCompleted({
        knex: knex,
        entityRef,
        stitchTicket,
      });
    }
  }
}
