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

import { ENTITY_STATUS_CATALOG_PROCESSING_TYPE } from '@backstage/catalog-client';
import {
  Entity,
  parseEntityRef,
  UNSTABLE_EntityStatusItem,
} from '@backstage/catalog-model';
import { SerializedError } from '@backstage/errors';
import Emittery from 'emittery';
import { Knex } from 'knex';
import { v4 as uuid } from 'uuid';
import { Logger } from 'winston';
import {
  DbFinalEntitiesRow,
  DbRefreshStateRow,
  DbSearchRow,
} from '../database/tables';
import { buildEntitySearch } from './buildEntitySearch';
import { StitchAbortedReason, StitcherEvents } from './StitcherEvents';
import { BATCH_SIZE, generateStableHash } from './util';

type StitchResult =
  | { type: 'success' }
  | { type: 'aborted'; reason: StitchAbortedReason };

/**
 * Performs the act of stitching - to take all of the various outputs from the
 * ingestion process, and stitching them together into the final entity JSON
 * shape.
 */
export class Stitcher {
  readonly events: Emittery<StitcherEvents>;

  constructor(private readonly database: Knex) {
    this.events = new Emittery();
  }

  registerDefaultLoggingEvents(logger: Logger) {
    this.events.on('stitchStarted', ({ entityRef, jobId }) => {
      logger.debug(`Beginning stitch attempt of ${entityRef}`, {
        jobId,
        entityRef,
      });
    });
    this.events.on('stitchCompleted', ({ entityRef, jobId, durationMs }) => {
      logger.debug(
        `Completed stitch attempt of ${entityRef} in ${durationMs} ms`,
        { jobId, entityRef },
      );
    });
    this.events.on('stitchAborted', ({ entityRef, jobId, reason }) => {
      logger.debug(
        `Aborted stitch attempt of ${entityRef}, with reason ${reason}`,
        { jobId, entityRef },
      );
    });
    this.events.on('stitchFailed', ({ entityRef, jobId, error }) => {
      logger.error(`Failed to stitch ${entityRef}, ${error}`, {
        jobId,
        entityRef,
      });
    });
  }

  async stitch(options: { jobId: string; entityRefs: Set<string> }) {
    for (const entityRef of options.entityRefs) {
      const jobId = uuid();
      const startTime = new Date();

      try {
        this.events.emit('stitchStarted', {
          entityRef,
          jobId,
        });

        const result = await this.stitchOne(entityRef, jobId);

        if (result.type === 'success') {
          const durationMs = new Date().getTime() - startTime.getTime();
          this.events.emit('stitchCompleted', {
            entityRef,
            jobId,
            durationMs,
          });
        } else if (result.type === 'aborted') {
          this.events.emit('stitchAborted', {
            entityRef,
            jobId,
            reason: result.reason,
          });
        }
      } catch (error) {
        this.events.emit('stitchFailed', {
          entityRef,
          jobId,
          error,
        });
      }
    }
  }

  private async stitchOne(
    entityRef: string,
    jobId: string,
  ): Promise<StitchResult> {
    // Try to locate the target in the refresh state
    const entityResult = await this.database<DbRefreshStateRow>('refresh_state')
      .where({ entity_ref: entityRef })
      .limit(1)
      .select('entity_id');
    if (!entityResult.length) {
      return {
        type: 'aborted',
        reason: 'did-not-exist',
      };
    }

    // Insert stitching ticket that will be compared before inserting the final
    // entity. As we do this, we may overwrite the ticket of another in-
    // progress stitch attempt. As they discover that fact, they will abort
    // their attempt and let us "win" since we started ours with newer data
    // than they did.
    await this.database<DbFinalEntitiesRow>('final_entities')
      .insert({
        entity_id: entityResult[0].entity_id,
        hash: '',
        stitch_ticket: jobId,
      })
      .onConflict('entity_id')
      .merge(['stitch_ticket']);

    // Gather all of the data from the different tables.
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
    }> = await this.database
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
      .crossJoin(this.database.raw('incoming_references'))
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
      return {
        type: 'aborted',
        reason: 'did-not-exist',
      };
    }

    const {
      entityId,
      processedEntity,
      errors,
      incomingReferenceCount,
      previousHash,
    } = result[0];

    // If there was no processed entity in place, the target hasn't been
    // through the processing steps yet. It's safe to ignore this stitch
    // attempt in that case, since another stitch will be triggered when
    // that processing has finished.
    if (!processedEntity) {
      return {
        type: 'aborted',
        reason: 'did-not-exist',
      };
    }

    // Grab the processed entity and stitch all of the relevant data into
    // it
    const entity = JSON.parse(processedEntity) as Entity;
    const isOrphan = Number(incomingReferenceCount) === 0;
    let statusItems: UNSTABLE_EntityStatusItem[] = [];

    if (isOrphan) {
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

    // TODO: entityRef is lower case and should be uppercase in the final
    // result
    entity.relations = result
      .filter(row => row.relationType /* exclude null row, if relevant */)
      .map(row => ({
        type: row.relationType!,
        target: parseEntityRef(row.relationTarget!),
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
      return {
        type: 'aborted',
        reason: 'had-no-changes',
      };
    }

    entity.metadata.uid = entityId;
    entity.metadata.generation = 1;
    if (!entity.metadata.etag) {
      // If the original data source did not have its own etag handling,
      // use the hash as a good-quality etag
      entity.metadata.etag = hash;
    }

    const rowsChanged = await this.database<DbFinalEntitiesRow>(
      'final_entities',
    )
      .update({
        final_entity: JSON.stringify(entity),
        hash,
      })
      .where('entity_id', entityId)
      .where('stitch_ticket', jobId)
      .onConflict('entity_id')
      .merge(['final_entity', 'hash']);

    if (rowsChanged.length === 0) {
      return {
        type: 'aborted',
        reason: 'yielded-to-later-stitch-attempt',
      };
    }

    // TODO(freben): Search will probably need a similar safeguard against
    // race conditions like the final_entities ticket handling above.
    // Otherwise, it can be the case that:
    // A writes the entity ->
    // B writes the entity ->
    // B writes search ->
    // A writes search
    const searchEntries = buildEntitySearch(entityId, entity);
    await this.database<DbSearchRow>('search')
      .where({ entity_id: entityId })
      .delete();
    await this.database.batchInsert('search', searchEntries, BATCH_SIZE);

    return {
      type: 'success',
    };
  }
}
