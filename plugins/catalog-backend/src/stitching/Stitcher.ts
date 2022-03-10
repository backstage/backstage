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

import { ENTITY_STATUS_CATALOG_PROCESSING_TYPE } from '@backstage/catalog-client';
import {
  AlphaEntity,
  parseEntityRef,
  EntityRelation,
  EntityStatusItem,
} from '@backstage/catalog-model';
import { SerializedError, stringifyError } from '@backstage/errors';
import { Knex } from 'knex';
import { uniqBy } from 'lodash';
import { v4 as uuid } from 'uuid';
import { Logger } from 'winston';
import {
  DbFinalEntitiesRow,
  DbRefreshStateRow,
  DbSearchRow,
} from '../database/tables';
import { buildEntitySearch } from './buildEntitySearch';
import { BATCH_SIZE, generateStableHash } from './util';

/**
 * Performs the act of stitching - to take all of the various outputs from the
 * ingestion process, and stitching them together into the final entity JSON
 * shape.
 */
export class Stitcher {
  constructor(
    private readonly database: Knex,
    private readonly logger: Logger,
  ) {}

  async stitch(entityRefs: Set<string>) {
    for (const entityRef of entityRefs) {
      try {
        await this.stitchOne(entityRef);
      } catch (error) {
        this.logger.error(
          `Failed to stitch ${entityRef}, ${stringifyError(error)}`,
        );
      }
    }
  }

  async pruneDeletedEntities() {
    const ticket = uuid();
    // This selects all entities that have been deleted but not yet fully marked
    // as deleted within the final_entities table.
    //
    // Stitching of processed entities will always take precedence over this,
    // because when the stitch ticket is added it also atomically adds the
    // entity_id back in, meaning we won't select that entity here.
    let pendingDeletions = await this.database<DbFinalEntitiesRow>(
      'final_entities',
    )
      .whereNull('entity_id')
      .whereNull('deleted_at')
      .update('stitch_ticket', ticket)
      .returning(['entity_ref']);

    // Returning is not supported by sqlite3
    if (this.database.client.config.client.includes('sqlite3')) {
      pendingDeletions = await this.database<DbFinalEntitiesRow>(
        'final_entities',
      )
        .whereNull('entity_id')
        .whereNull('deleted_at')
        .andWhere('stitch_ticket', ticket)
        .select(['entity_ref']);
    }

    for (const { entity_ref: entityRef } of pendingDeletions) {
      try {
        const count = await this.database<DbFinalEntitiesRow>('final_entities')
          .where('entity_ref', entityRef)
          .andWhere('stitch_ticket', ticket)
          .update({
            deleted_at: this.database.fn.now(),
            final_entity: null,
            hash: '',
            change_index: this.nextChangeIndex(),
          });
        if (count === 1) {
          this.logger.debug(`Entity ${entityRef} marked as deleted`);
        }
      } catch (error) {
        this.logger.error(
          `Failed to prune deleted entity ${entityRef}, ${stringifyError(
            error,
          )}`,
        );
      }
    }
  }

  private async stitchOne(entityRef: string): Promise<void> {
    const entityResult = await this.database<DbRefreshStateRow>('refresh_state')
      .where({ entity_ref: entityRef })
      .limit(1)
      .select('entity_id');
    if (!entityResult.length) {
      // Entity does no exist in refresh state table, no stitching required.
      return;
    }

    // Insert stitching ticket that will be compared before inserting the final entity.
    const ticket = uuid();
    await this.database<DbFinalEntitiesRow>('final_entities')
      .insert({
        entity_id: entityResult[0].entity_id,
        entity_ref: entityRef,
        hash: '',
        stitch_ticket: ticket,
      })
      .onConflict('entity_ref')
      .merge(['stitch_ticket', 'entity_id']);

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
      this.logger.error(
        `Unable to stitch ${entityRef}, item does not exist in refresh state table`,
      );
      return;
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
      this.logger.debug(
        `Unable to stitch ${entityRef}, the entity has not yet been processed`,
      );
      return;
    }

    // Grab the processed entity and stitch all of the relevant data into
    // it
    const entity = JSON.parse(processedEntity) as AlphaEntity;
    const isOrphan = Number(incomingReferenceCount) === 0;
    let statusItems: EntityStatusItem[] = [];

    if (isOrphan) {
      this.logger.debug(`${entityRef} is an orphan`);
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
    const uniqueRelationRows = uniqBy(
      result,
      r => `${r.relationType}:${r.relationTarget}`,
    );
    entity.relations = uniqueRelationRows
      .filter(row => row.relationType /* exclude null row, if relevant */)
      .map<EntityRelation>(row => ({
        type: row.relationType!,
        // TODO(freben): This field is deprecated and should be removed in a future release
        target: parseEntityRef(row.relationTarget!),
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

    // This may throw if the entity is invalid, so we call it before
    // the final_entities write, even though we may end up not needing
    // to write the search index.
    const searchEntries = buildEntitySearch(entityId, entity);

    const rowsChanged = await this.database<DbFinalEntitiesRow>(
      'final_entities',
    )
      .update({
        final_entity: JSON.stringify(entity),
        hash,
        deleted_at: null,
        change_index: this.nextChangeIndex(),
      })
      .where('entity_id', entityId)
      .where('stitch_ticket', ticket);

    if (rowsChanged === 0) {
      this.logger.debug(
        `Entity ${entityRef} is already processed, skipping write.`,
      );
      return;
    }

    // TODO(freben): Search will probably need a similar safeguard against
    // race conditions like the final_entities ticket handling above.
    // Otherwise, it can be the case that:
    // A writes the entity ->
    // B writes the entity ->
    // B writes search ->
    // A writes search
    await this.database<DbSearchRow>('search')
      .where({ entity_id: entityId })
      .delete();
    await this.database.batchInsert('search', searchEntries, BATCH_SIZE);
  }

  private nextChangeIndex() {
    if (this.database.client.config.client.includes('sqlite3')) {
      return this.database.raw(
        'COALESCE((SELECT MAX(change_index) FROM final_entities), 0) + 1',
      );
    }
    return this.database.raw(`nextval('final_entities_change_index_seq')`);
  }
}
