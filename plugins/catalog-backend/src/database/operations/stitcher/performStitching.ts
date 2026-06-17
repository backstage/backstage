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
  Entity,
  EntityRelation,
} from '@backstage/catalog-model';
import { AlphaEntity, EntityStatusItem } from '@backstage/catalog-model/alpha';
import { SerializedError } from '@backstage/errors';
import { Knex } from 'knex';
import { createHash } from 'node:crypto';
import stableStringify from 'fast-json-stable-stringify';
import { DbFinalEntitiesRow, DbStitchQueueRow } from '../../tables';
import { buildEntitySearch } from './buildEntitySearch';
import { markDeferredStitchCompleted } from './markDeferredStitchCompleted';
import { syncSearchRows } from './syncSearchRows';
import { LoggerService } from '@backstage/backend-plugin-api';

function generateStableHash(entity: Entity) {
  return createHash('sha1')
    .update(stableStringify({ ...entity }))
    .digest('hex');
}

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
  entityRef: string;
  stitchTicket: string;
}): Promise<'changed' | 'unchanged' | 'abandoned'> {
  const { knex, logger, entityRef, stitchTicket } = options;

  // The stitch queue is cleaned up on ANY completion — either by deleting
  // the entry (ticket unchanged) or bumping next_stitch_at (re-stitch
  // requested). Exceptions are the only case where we skip cleanup, so
  // the entity gets retried at a later time.
  let stitchResult: 'succeeded' | 'abandoned' | undefined;

  try {
    // Selecting from refresh_state (with an optional left join to
    // final_entities for the previous hash) should yield exactly one row,
    // except in abnormal cases where the entity was deleted between the
    // stitch request and now.
    const [processedResult, relationsResult] = await Promise.all([
      knex
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
        })
        .from('refresh_state')
        .where({ 'refresh_state.entity_ref': entityRef })
        .crossJoin(knex.raw('incoming_references'))
        .leftOuterJoin('final_entities', {
          'final_entities.entity_id': 'refresh_state.entity_id',
        }),
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

    // If there were no rows returned, it would mean that there was no
    // matching row even in the refresh_state. This can happen for example
    // if we emit a relation to something that hasn't been ingested yet.
    // It's safe to ignore this stitch attempt in that case.
    if (!processedResult.length) {
      logger.debug(
        `Unable to stitch ${entityRef}, item does not exist in refresh state table`,
      );
      stitchResult = 'abandoned';
      return 'abandoned';
    }

    const {
      entityId,
      processedEntity,
      errors,
      incomingReferenceCount,
      previousHash,
    } = processedResult[0];

    // If there was no processed entity in place, the target hasn't been
    // through the processing steps yet. It's safe to ignore this stitch
    // attempt in that case, since another stitch will be triggered when
    // that processing has finished.
    if (!processedEntity) {
      logger.debug(
        `Unable to stitch ${entityRef}, the entity has not yet been processed`,
      );
      stitchResult = 'abandoned';
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
      stitchResult = 'succeeded';
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

    // Guard against concurrent stitchers: if our stitch_ticket no longer
    // matches stitch_queue, another worker has newer data and we should
    // not overwrite it. On PostgreSQL and SQLite, this is done atomically
    // via a WHERE on the upsert merge path. MySQL does not support
    // ON CONFLICT ... DO UPDATE ... WHERE, so it uses a separate check
    // with a negligible TOCTOU window (self-corrects on the next ~1s
    // stitch cycle).
    const isMySQL = String(knex.client.config.client).includes('mysql');

    if (isMySQL) {
      const ticketValid = await knex<DbStitchQueueRow>('stitch_queue')
        .where('entity_ref', entityRef)
        .where('stitch_ticket', stitchTicket)
        .first();
      if (!ticketValid) {
        logger.debug(
          `Entity ${entityRef} is already stitched, skipping write.`,
        );
        stitchResult = 'abandoned';
        return 'abandoned';
      }
    }

    let upsert = knex<DbFinalEntitiesRow>('final_entities')
      .insert({
        entity_id: entityId,
        entity_ref: entityRef,
        final_entity: JSON.stringify(entity),
        hash,
        last_updated_at: knex.fn.now(),
      })
      .onConflict('entity_id')
      .merge(['final_entity', 'hash', 'last_updated_at']);

    if (!isMySQL) {
      upsert = upsert.where(
        knex.raw(
          'exists (select 1 from stitch_queue where entity_ref = ? and stitch_ticket = ?)',
          [entityRef, stitchTicket],
        ),
      );
    }

    await upsert;

    // Verify the write took effect. INSERT return values vary across
    // database engines (row IDs vs row counts vs empty arrays), so we
    // check the hash directly — we already know hash !== previousHash
    // from the check above, so a mismatch means the write was blocked.
    if (!isMySQL) {
      const written = await knex<DbFinalEntitiesRow>('final_entities')
        .where('entity_id', entityId)
        .where('hash', hash)
        .select(knex.raw('1'))
        .first();
      if (!written) {
        logger.debug(
          `Entity ${entityRef} is already stitched, skipping write.`,
        );
        stitchResult = 'abandoned';
        return 'abandoned';
      }
    }

    await syncSearchRows(knex, entityId, searchEntries);

    stitchResult = 'succeeded';
    return 'changed';
  } catch (error) {
    throw error;
  } finally {
    if (stitchResult) {
      await markDeferredStitchCompleted({
        knex: knex,
        entityRef,
        stitchTicket,
        result: stitchResult,
      });
    }
  }
}
