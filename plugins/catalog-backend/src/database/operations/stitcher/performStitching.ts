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
import {
  DbFinalEntitiesRow,
  DbSearchRow,
  DbStitchQueueRow,
} from '../../tables';
import { buildEntitySearch } from './buildEntitySearch';
import { markDeferredStitchCompleted } from './markDeferredStitchCompleted';
import { markDeferredStitchFailed } from './markDeferredStitchFailed';
import { syncSearchRows } from './syncSearchRows';
import { StitchLeaseExpiresAt } from './getDeferredStitchableEntities';
import { LoggerService } from '@backstage/backend-plugin-api';
import { retryOnDeadlock } from '../../util';
import { assignGeneration } from './assignGeneration';

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
 *
 * The final entity row is a stable slot for the entity ref. Its `entity_id`
 * starts out equal to the first candidate's ID and is kept across deletion
 * and re-creation, while `metadata.uid` always comes from the current
 * candidate. When the candidate is gone, a live row becomes a tombstone.
 *
 * Requires a root database connection so publication commits and releases
 * its counter lock before claim settlement acquires queue write locks.
 */
export async function performStitching(options: {
  knex: Knex;
  logger: LoggerService;
  entityRef: string;
  stitchTicket: string;
  stitchLeaseExpiresAt: StitchLeaseExpiresAt;
}): Promise<'changed' | 'unchanged' | 'abandoned'> {
  const { knex, logger, entityRef, stitchTicket, stitchLeaseExpiresAt } =
    options;
  if (knex.isTransaction) {
    throw new Error('Stitch publication requires a root database connection');
  }

  // Settle the claim on any completion, without disturbing a successor's
  // lease. A new request during this lease becomes eligible immediately.
  // Exceptions skip cleanup so the entity gets retried at a later time.
  let stitchResult: 'succeeded' | 'abandoned' | undefined;

  try {
    // The candidate and the final slot are both looked up by ref. Their IDs
    // are equal for rows that were never deleted and re-created, but code
    // must not rely on that.
    const [processedResult, slotResult, relationsResult] = await Promise.all([
      knex
        .with('incoming_references', function incomingReferences(builder) {
          return builder
            .from('refresh_state_references')
            .where({ target_entity_ref: entityRef })
            .count({ count: '*' });
        })
        .select({
          candidateId: 'refresh_state.entity_id',
          processedEntity: 'refresh_state.processed_entity',
          errors: 'refresh_state.errors',
          incomingReferenceCount: 'incoming_references.count',
        })
        .from('refresh_state')
        .where({ 'refresh_state.entity_ref': entityRef })
        .crossJoin(knex.raw('incoming_references')),
      knex<DbFinalEntitiesRow>('final_entities')
        .where('entity_ref', entityRef)
        .select({
          slotId: 'entity_id',
          previousHash: 'hash',
          live: knex.raw('CASE WHEN final_entity IS NULL THEN 0 ELSE 1 END'),
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

    const slot = slotResult[0] as
      | { slotId: string; previousHash: string; live: number | string }
      | undefined;

    // No candidate exists. This happens when the entity was deleted, and also
    // when a relation points at something that hasn't been ingested yet.
    if (!processedResult.length) {
      if (!slot || !Number(slot.live)) {
        logger.debug(
          `Unable to stitch ${entityRef}, item does not exist in refresh state table`,
        );
        stitchResult = 'abandoned';
        return 'abandoned';
      }
      const outcome = await publish(knex, () =>
        knex.transaction(tx =>
          writeTombstone({
            tx,
            entityRef,
            slotId: slot.slotId,
            stitchTicket,
            stitchLeaseExpiresAt,
          }),
        ),
      );
      stitchResult = outcome === 'abandoned' ? 'abandoned' : 'succeeded';
      return outcome;
    }

    const { candidateId, processedEntity, errors, incomingReferenceCount } =
      processedResult[0];

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

    // The hash covers the content but not the UID. While the slot and the
    // candidate share an ID, it is the plain content hash, exactly as before.
    // After re-creation the candidate ID is folded in, so that identical
    // content from a new candidate still publishes its new UID.
    const slotId = slot?.slotId ?? candidateId;
    const contentHash = generateStableHash(entity);
    const hash =
      slotId === candidateId
        ? contentHash
        : createHash('sha1')
            .update(`${contentHash}:${candidateId}`)
            .digest('hex');
    if (hash === slot?.previousHash) {
      logger.debug(`Skipped stitching of ${entityRef}, no changes`);
      stitchResult = 'succeeded';
      return 'unchanged';
    }

    entity.metadata.uid = candidateId;
    if (!entity.metadata.etag) {
      // If the original data source did not have its own etag handling,
      // use the hash as a good-quality etag
      entity.metadata.etag = hash;
    }

    // This may throw if the entity is invalid, so we call it before
    // the final_entities write, even though we may end up not needing
    // to write the search index.
    const searchEntries = buildEntitySearch(slotId, entity);

    // The final_entities row and the search index rows have to land
    // together. If the search write fails on its own, the next stitch
    // attempt reads back the hash we just wrote and returns early as
    // unchanged, so the entity keeps a stale search index for good. It
    // stays readable by direct lookup and drops out of every filtered or
    // sorted list query.
    const writeOutcome = await publish(knex, () =>
      knex.transaction(tx =>
        writeEntity({
          tx,
          entityRef,
          slotId,
          entity,
          hash,
          searchEntries,
          stitchTicket,
          stitchLeaseExpiresAt,
        }),
      ),
    );

    if (writeOutcome === 'abandoned') {
      logger.debug(`Entity ${entityRef} is already stitched, skipping write.`);
      stitchResult = 'abandoned';
      return 'abandoned';
    }

    stitchResult = 'succeeded';
    return 'changed';
  } catch (error) {
    try {
      await markDeferredStitchFailed({
        knex,
        entityRef,
        stitchTicket,
        stitchLeaseExpiresAt,
      });
    } catch (recordError) {
      // A database outage may also prevent recording the failure. Keep the
      // queued work and report the original stitching error to the caller.
      logger.warn(
        `Failed to record stitch failure for ${entityRef}`,
        recordError,
      );
    }
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

/**
 * Runs one publication transaction, retrying on deadlock. A superseded
 * publication has already been rolled back and counts as abandoned.
 */
async function publish(
  knex: Knex,
  fn: () => Promise<'changed' | 'abandoned'>,
): Promise<'changed' | 'abandoned'> {
  return retryOnDeadlock(fn, knex).catch(error => {
    // Knex has rolled the publication back before rejecting the transaction.
    // Supersession is a normal abandonment, not a failure or deadlock retry.
    if (error instanceof StitchPublicationSupersededError) {
      return 'abandoned' as const;
    }
    throw error;
  });
}

// Guard against concurrent stitchers: if our stitch_ticket no longer
// matches stitch_queue, another worker has newer data and we should
// not overwrite it. PostgreSQL guards both insert and merge in the
// publication statement and rechecks the captured claim after the write.
// SQLite checks inside its transaction as well as guarding the merge path.
// MySQL does not support ON CONFLICT ... DO UPDATE ... WHERE, so its
// separate check retains a best-effort TOCTOU window. Do not turn it into a
// queue lock here: that would introduce a new lock-order dependency during
// publication. Deleting a candidate replaces its ticket (by trigger on
// PostgreSQL), which also fences out a publication racing that deletion.

async function hasValidTicket(
  tx: Knex.Transaction,
  entityRef: string,
  stitchTicket: string,
): Promise<boolean> {
  // Recheck on every attempt: a request or reclaimed claim may have
  // superseded this worker while its previous transaction rolled back.
  // Do not lock the queue here; processing locks refresh state before queue.
  const row = await tx<DbStitchQueueRow>('stitch_queue')
    .where('entity_ref', entityRef)
    .where('stitch_ticket', stitchTicket)
    .first();
  return Boolean(row);
}

/**
 * Verifies that a write took effect. On PostgreSQL, also rechecks ownership
 * using this statement's fresh Read Committed snapshot: the write's snapshot
 * may predate a reclaim that committed while it was running. A successful
 * write holds the final-row lock until commit, so a successor cannot publish
 * past us after this check. Do not lock the queue, which would introduce a
 * publication/deletion lock inversion.
 */
async function ensureStillOwned(options: {
  tx: Knex.Transaction;
  entityRef: string;
  slotId: string;
  hash: string;
  stitchTicket: string;
  stitchLeaseExpiresAt: StitchLeaseExpiresAt;
}): Promise<void> {
  const { tx, entityRef, slotId, hash, stitchTicket, stitchLeaseExpiresAt } =
    options;
  const isPostgres = tx.client.config.client === 'pg';
  const written = await tx<DbFinalEntitiesRow>('final_entities')
    .where('entity_id', slotId)
    .where('entity_ref', entityRef)
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

async function writeEntity(options: {
  tx: Knex.Transaction;
  entityRef: string;
  slotId: string;
  entity: Entity;
  hash: string;
  searchEntries: DbSearchRow[];
  stitchTicket: string;
  stitchLeaseExpiresAt: StitchLeaseExpiresAt;
}): Promise<'changed' | 'abandoned'> {
  const { tx, entityRef, entity, hash, stitchTicket } = options;
  const isMySQL = String(tx.client.config.client).includes('mysql');
  const isPostgres = tx.client.config.client === 'pg';

  if (!isPostgres && !(await hasValidTicket(tx, entityRef, stitchTicket))) {
    return 'abandoned';
  }

  // Upsert by ref so that an existing slot keeps its ID. A new row takes the
  // slot ID we predicted, which is the candidate's ID.
  // Knex's typed insert overload excludes raw INSERT SELECT bodies.
  let upsert = tx('final_entities')
    .insert(
      !isPostgres
        ? {
            entity_id: options.slotId,
            entity_ref: entityRef,
            final_entity: JSON.stringify(entity),
            hash,
            last_updated_at: tx.fn.now(),
            deleted_at: null,
          }
        : tx.raw(
            '(entity_id, entity_ref, final_entity, hash, last_updated_at, deleted_at) ' +
              'select ?, ?, ?, ?, CURRENT_TIMESTAMP, NULL ' +
              'where exists (select 1 from stitch_queue where entity_ref = ? and stitch_ticket = ?)',
            [
              options.slotId,
              entityRef,
              JSON.stringify(entity),
              hash,
              entityRef,
              stitchTicket,
            ],
          ),
    )
    .onConflict('entity_ref')
    .merge(['final_entity', 'hash', 'last_updated_at', 'deleted_at']);

  if (!isMySQL) {
    upsert = upsert.where(
      tx.raw(
        'exists (select 1 from stitch_queue where entity_ref = ? and stitch_ticket = ?)',
        [entityRef, stitchTicket],
      ),
    );
  }

  await upsert;

  // Another stitcher may have created the slot after our read. Its ID wins.
  const row = await tx<DbFinalEntitiesRow>('final_entities')
    .where('entity_ref', entityRef)
    .select('entity_id')
    .first();
  if (!row) {
    throw new StitchPublicationSupersededError();
  }
  const slotId = row.entity_id;
  const searchEntries =
    slotId === options.slotId
      ? options.searchEntries
      : options.searchEntries.map(e => ({ ...e, entity_id: slotId }));

  if (!isMySQL) {
    await ensureStillOwned({ ...options, slotId });
  }

  await syncSearchRows(tx, slotId, searchEntries);

  // All publication locks are already held. Do not acquire queue or
  // other entity locks after this global counter lock; settle later.
  await assignGeneration(tx, slotId);

  return 'changed';
}

/**
 * Turns a live slot whose candidate is gone into a tombstone: clears the
 * body, removes its search rows and assigns a generation, all in one
 * publication. An already tombstoned slot is left alone.
 */
async function writeTombstone(options: {
  tx: Knex.Transaction;
  entityRef: string;
  slotId: string;
  stitchTicket: string;
  stitchLeaseExpiresAt: StitchLeaseExpiresAt;
}): Promise<'changed' | 'abandoned'> {
  const { tx, entityRef, slotId, stitchTicket } = options;
  const isMySQL = String(tx.client.config.client).includes('mysql');
  const isPostgres = tx.client.config.client === 'pg';

  if (!isPostgres && !(await hasValidTicket(tx, entityRef, stitchTicket))) {
    return 'abandoned';
  }

  // A candidate created after our read would replace the ticket, so the
  // ticket guard also stops us from tombstoning a re-created entity.
  const updated = await tx<DbFinalEntitiesRow>('final_entities')
    .where('entity_id', slotId)
    .where('entity_ref', entityRef)
    .whereNotNull('final_entity')
    .whereExists(
      tx<DbStitchQueueRow>('stitch_queue')
        .select(tx.raw('1'))
        .where('entity_ref', entityRef)
        .where('stitch_ticket', stitchTicket),
    )
    .update({
      final_entity: null,
      hash: '',
      deleted_at: tx.fn.now(),
      last_updated_at: tx.fn.now(),
    });
  if (!updated) {
    return 'abandoned';
  }

  if (!isMySQL) {
    await ensureStillOwned({ ...options, hash: '' });
  }

  await tx<DbSearchRow>('search').where('entity_id', slotId).delete();

  await assignGeneration(tx, slotId);

  return 'changed';
}
