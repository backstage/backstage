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
import { StitchLeaseExpiresAt } from './getDeferredStitchableEntities';
import { LoggerService } from '@backstage/backend-plugin-api';
import { retryOnDeadlock } from '../../util';

class StitchPublicationSupersededError extends Error {}

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
  stitchLeaseExpiresAt: StitchLeaseExpiresAt;
}): Promise<'changed' | 'unchanged' | 'abandoned'> {
  const { knex, logger, entityRef, stitchTicket, stitchLeaseExpiresAt } =
    options;

  // Settle the claim on any completion, without disturbing a successor's
  // lease. A new request during this lease becomes eligible immediately.
  // Exceptions skip cleanup so the entity gets retried at a later time.
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
    // not overwrite it. PostgreSQL guards both insert and merge in the
    // publication statement and rechecks the captured claim after the upsert.
    // SQLite checks inside its transaction as well
    // as guarding the merge path. MySQL does not support
    // ON CONFLICT ... DO UPDATE ... WHERE, so its separate check retains
    // a best-effort TOCTOU window. Do not turn it into a queue lock here:
    // that would introduce a new lock-order dependency during publication.
    const isMySQL = String(knex.client.config.client).includes('mysql');
    const isPostgres = knex.client.config.client === 'pg';

    // The final_entities row and the search index rows have to land
    // together. If the search write fails on its own, the next stitch
    // attempt reads back the hash we just wrote and returns early as
    // unchanged, so the entity keeps a stale search index for good. It
    // stays readable by direct lookup and drops out of every filtered or
    // sorted list query.
    const writeOutcome = await retryOnDeadlock(
      () =>
        knex.transaction(async tx => {
          // Recheck on every attempt: a request or reclaimed claim may have
          // superseded this worker while its previous transaction rolled back.
          // Do not lock the queue here; processing locks refresh state before queue.
          if (!isPostgres) {
            const ticketValid = await tx<DbStitchQueueRow>('stitch_queue')
              .where('entity_ref', entityRef)
              .where('stitch_ticket', stitchTicket)
              .first();
            if (!ticketValid) return 'abandoned' as const;
          }
          // Knex's typed insert overload excludes raw INSERT SELECT bodies.
          let upsert = tx('final_entities')
            .insert(
              !isPostgres
                ? {
                    entity_id: entityId,
                    entity_ref: entityRef,
                    final_entity: JSON.stringify(entity),
                    hash,
                    last_updated_at: tx.fn.now(),
                  }
                : tx.raw(
                    '(entity_id, entity_ref, final_entity, hash, last_updated_at) ' +
                      'select ?, ?, ?, ?, CURRENT_TIMESTAMP ' +
                      'where exists (select 1 from stitch_queue where entity_ref = ? and stitch_ticket = ?)',
                    [
                      entityId,
                      entityRef,
                      JSON.stringify(entity),
                      hash,
                      entityRef,
                      stitchTicket,
                    ],
                  ),
            )
            .onConflict('entity_id')
            .merge(['final_entity', 'hash', 'last_updated_at']);

          if (!isMySQL) {
            upsert = upsert.where(
              tx.raw(
                'exists (select 1 from stitch_queue where entity_ref = ? and stitch_ticket = ?)',
                [entityRef, stitchTicket],
              ),
            );
          }

          await upsert;

          // Verify the write took effect. On PostgreSQL, also recheck ownership
          // using this statement's fresh Read Committed snapshot: the upsert's
          // snapshot may predate a reclaim that committed while it was running.
          // A successful upsert holds the final-row lock until commit, so a
          // successor cannot publish past us after this check. Do not lock the
          // queue, which would introduce a publication/deletion lock inversion.
          if (!isMySQL) {
            const written = await tx<DbFinalEntitiesRow>('final_entities')
              .where('entity_id', entityId)
              .where('hash', hash)
              .modify(qb => {
                if (isPostgres) {
                  qb.whereExists(
                    tx<DbStitchQueueRow>('stitch_queue')
                      .select(tx.raw('1'))
                      .where('entity_ref', entityRef)
                      .where('stitch_ticket', stitchTicket)
                      .where('next_stitch_at', stitchLeaseExpiresAt),
                  );
                }
              })
              .select(tx.raw('1'))
              .first();
            if (!written) {
              // Returning normally would commit any stale write already made.
              throw new StitchPublicationSupersededError();
            }
          }

          await syncSearchRows(tx, entityId, searchEntries);

          return 'changed' as const;
        }),
      knex,
    ).catch(error => {
      // Knex has rolled the publication back before rejecting the transaction.
      // Supersession is a normal abandonment, not a failure or deadlock retry.
      if (error instanceof StitchPublicationSupersededError) {
        return 'abandoned' as const;
      }
      throw error;
    });

    if (writeOutcome === 'abandoned') {
      logger.debug(`Entity ${entityRef} is already stitched, skipping write.`);
      stitchResult = 'abandoned';
      return 'abandoned';
    }

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
        stitchLeaseExpiresAt,
      });
    }
  }
}
