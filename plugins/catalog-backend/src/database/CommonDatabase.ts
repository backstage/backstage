/*
 * Copyright 2020 Spotify AB
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

import {
  ConflictError,
  InputError,
  NotFoundError,
} from '@backstage/backend-common';
import {
  Entity,
  EntityName,
  ENTITY_DEFAULT_NAMESPACE,
  ENTITY_META_GENERATED_FIELDS,
  generateEntityEtag,
  generateEntityUid,
  Location,
  EntityRelationSpec,
  parseEntityName,
} from '@backstage/catalog-model';
import Knex from 'knex';
import lodash from 'lodash';
import type { Logger } from 'winston';
import { buildEntitySearch } from './search';
import {
  Database,
  DatabaseLocationUpdateLogEvent,
  DatabaseLocationUpdateLogStatus,
  DbEntitiesRelationsRow,
  DbEntitiesRow,
  DbEntitiesSearchRow,
  DbEntityRequest,
  DbEntityResponse,
  DbLocationsRow,
  DbLocationsRowWithStatus,
  EntityFilters,
} from './types';

// The number of items that are sent per batch to the database layer, when
// doing .batchInsert calls to knex. This needs to be low enough to not cause
// errors in the underlying engine due to exceeding query limits, but large
// enough to get the speed benefits.
const BATCH_SIZE = 50;

/**
 * The core database implementation.
 */
export class CommonDatabase implements Database {
  constructor(
    private readonly database: Knex,
    private readonly logger: Logger,
  ) {}

  async transaction<T>(fn: (tx: unknown) => Promise<T>): Promise<T> {
    try {
      return await this.database.transaction<T>(fn);
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

  async addEntity(
    txOpaque: unknown,
    request: DbEntityRequest,
  ): Promise<DbEntityResponse> {
    const tx = txOpaque as Knex.Transaction<any, any>;

    if (request.entity.metadata.uid !== undefined) {
      throw new InputError('May not specify uid for new entities');
    } else if (request.entity.metadata.etag !== undefined) {
      throw new InputError('May not specify etag for new entities');
    } else if (request.entity.metadata.generation !== undefined) {
      throw new InputError('May not specify generation for new entities');
    }

    const newEntity = lodash.cloneDeep(request.entity);
    newEntity.metadata = {
      ...newEntity.metadata,
      uid: generateEntityUid(),
      etag: generateEntityEtag(),
      generation: 1,
    };

    const newRow = this.toEntityRow(request.locationId, newEntity);
    await tx<DbEntitiesRow>('entities').insert(newRow);
    await this.updateEntitiesSearch(tx, newRow.id, newEntity);

    return { locationId: request.locationId, entity: newEntity };
  }

  async addEntities(
    txOpaque: unknown,
    request: DbEntityRequest[],
  ): Promise<DbEntityResponse[]> {
    const tx = txOpaque as Knex.Transaction<any, any>;

    const result: DbEntityResponse[] = [];
    const entityRows: DbEntitiesRow[] = [];
    const searchRows: DbEntitiesSearchRow[] = [];

    for (const { entity, locationId } of request) {
      if (entity.metadata.uid !== undefined) {
        throw new InputError('May not specify uid for new entities');
      } else if (entity.metadata.etag !== undefined) {
        throw new InputError('May not specify etag for new entities');
      } else if (entity.metadata.generation !== undefined) {
        throw new InputError('May not specify generation for new entities');
      } else if (entity.relations !== undefined) {
        throw new InputError('May not specify relations for new entities');
      }

      const newEntity = {
        ...entity,
        metadata: {
          ...entity.metadata,
          uid: generateEntityUid(),
          etag: generateEntityEtag(),
          generation: 1,
        },
      };

      result.push({ entity: newEntity, locationId });
      entityRows.push(this.toEntityRow(locationId, newEntity));
      searchRows.push(...buildEntitySearch(newEntity.metadata.uid, newEntity));
    }

    await tx.batchInsert('entities', entityRows, BATCH_SIZE);
    await tx<DbEntitiesSearchRow>('entities_search')
      .whereIn(
        'entity_id',
        entityRows.map(r => r.id),
      )
      .del();
    await tx.batchInsert('entities_search', searchRows, BATCH_SIZE);

    return result;
  }

  async updateEntity(
    txOpaque: unknown,
    request: DbEntityRequest,
    matchingEtag?: string,
    matchingGeneration?: number,
  ): Promise<DbEntityResponse> {
    const tx = txOpaque as Knex.Transaction<any, any>;

    const { uid } = request.entity.metadata;

    if (uid === undefined) {
      throw new InputError('Must specify uid when updating entities');
    }

    // Find existing entity
    const oldRows = await tx<DbEntitiesRow>('entities')
      .where({ id: uid })
      .select();
    if (oldRows.length !== 1) {
      throw new NotFoundError('No matching entity found');
    }

    // Validate the old entity
    const oldRow = oldRows[0];
    // The Number cast is here because sqlite reads it as a string, no matter
    // what the table actually says
    oldRow.generation = Number(oldRow.generation);
    if (matchingEtag) {
      if (matchingEtag !== oldRow.etag) {
        throw new ConflictError(
          `Etag mismatch, expected="${matchingEtag}" found="${oldRow.etag}"`,
        );
      }
    }
    if (matchingGeneration) {
      if (matchingGeneration !== oldRow.generation) {
        throw new ConflictError(
          `Generation mismatch, expected="${matchingGeneration}" found="${oldRow.generation}"`,
        );
      }
    }

    // Store the updated entity; select on the old etag to ensure that we do
    // not lose to another writer
    const newRow = this.toEntityRow(request.locationId, request.entity);
    const updatedRows = await tx<DbEntitiesRow>('entities')
      .where({ id: oldRow.id, etag: oldRow.etag })
      .update(newRow);

    // If this happens, somebody else changed the entity just now
    if (updatedRows !== 1) {
      throw new ConflictError(`Failed to update entity`);
    }

    await this.updateEntitiesSearch(tx, oldRow.id, request.entity);

    return request;
  }

  async entities(
    txOpaque: unknown,
    filters?: EntityFilters,
  ): Promise<DbEntityResponse[]> {
    const tx = txOpaque as Knex.Transaction<any, any>;

    let entitiesQuery = tx<DbEntitiesRow>('entities');

    for (const [matchKey, matchVal] of Object.entries(filters ?? {})) {
      const key = matchKey.toLowerCase().replace(/[*]/g, '%');
      const keyOp = key.includes('%') ? 'like' : '=';
      const values = Array.isArray(matchVal) ? matchVal : [matchVal];

      let matchNulls = false;
      const matchIn: string[] = [];
      const matchLike: string[] = [];

      for (const value of values) {
        if (!value) {
          matchNulls = true;
        } else if (value.includes('*')) {
          matchLike.push(value.toLowerCase().replace(/[*]/g, '%'));
        } else {
          matchIn.push(value.toLowerCase());
        }
      }

      // NOTE(freben): This used to be a set of OUTER JOIN, which may seem to
      // make a lot of sense. However, it had abysmal performance on sqlite
      // when datasets grew large, so we're using IN instead.
      const matchQuery = tx<DbEntitiesSearchRow>('entities_search')
        .select('entity_id')
        .where(function keyFilter() {
          this.andWhere('key', keyOp, key);
          this.andWhere(function valueFilter() {
            if (matchIn.length === 1) {
              this.orWhere({ value: matchIn[0] });
            } else if (matchIn.length > 1) {
              this.orWhereIn('value', matchIn);
            }
            if (matchLike.length) {
              for (const x of matchLike) {
                this.orWhere('value', 'like', tx.raw('?', [x]));
              }
            }
            if (matchNulls) {
              // Match explicit nulls, and then handle absence separately below
              this.orWhereNull('value');
            }
          });
        });

      // Handle absence as nulls as well
      entitiesQuery = entitiesQuery.andWhere(function match() {
        this.whereIn('id', matchQuery);
        if (matchNulls) {
          this.orWhereNotIn(
            'id',
            tx<DbEntitiesSearchRow>('entities_search')
              .select('entity_id')
              .where('key', keyOp, key),
          );
        }
      });
    }

    const rows = await entitiesQuery
      .select('entities.*')
      .orderBy('full_name', 'asc');

    return Promise.all(rows.map(row => this.toEntityResponse(tx, row)));
  }

  async entityByName(
    txOpaque: unknown,
    name: EntityName,
  ): Promise<DbEntityResponse | undefined> {
    const tx = txOpaque as Knex.Transaction<any, any>;

    const rows = await tx<DbEntitiesRow>('entities')
      .where({
        full_name: `${name.kind}:${name.namespace}/${name.name}`.toLowerCase(),
      })
      .select();

    if (rows.length !== 1) {
      return undefined;
    }

    return this.toEntityResponse(tx, rows[0]);
  }

  async entityByUid(
    txOpaque: unknown,
    uid: string,
  ): Promise<DbEntityResponse | undefined> {
    const tx = txOpaque as Knex.Transaction<any, any>;

    const rows = await tx<DbEntitiesRow>('entities')
      .where({ id: uid })
      .select();

    if (rows.length !== 1) {
      return undefined;
    }

    return this.toEntityResponse(tx, rows[0]);
  }

  async removeEntityByUid(txOpaque: unknown, uid: string): Promise<void> {
    const tx = txOpaque as Knex.Transaction<any, any>;

    const result = await tx<DbEntitiesRow>('entities').where({ id: uid }).del();

    if (!result) {
      throw new NotFoundError(`Found no entity with ID ${uid}`);
    }
  }

  async setRelations(
    txOpaque: unknown,
    originatingEntityId: string,
    relations: EntityRelationSpec[],
  ): Promise<void> {
    const tx = txOpaque as Knex.Transaction<any, any>;

    // remove all relations that exist for the originating entity id.
    await tx<DbEntitiesRelationsRow>('entities_relations')
      .where({ originating_entity_id: originatingEntityId })
      .del();

    const serializeName = (e: EntityName) =>
      `${e.kind}:${e.namespace}/${e.name}`.toLowerCase();

    const relationsRows: DbEntitiesRelationsRow[] = relations.map(
      ({ source, target, type }) => ({
        originating_entity_id: originatingEntityId,
        source_full_name: serializeName(source),
        target_full_name: serializeName(target),
        type,
      }),
    );

    // TODO(blam): translate constraint failures to sane NotFoundError instead
    await tx.batchInsert('entities_relations', relationsRows, BATCH_SIZE);
  }

  async addLocation(location: Location): Promise<DbLocationsRow> {
    return await this.database.transaction<DbLocationsRow>(async tx => {
      const row: DbLocationsRow = {
        id: location.id,
        type: location.type,
        target: location.target,
      };
      await tx<DbLocationsRow>('locations').insert(row);
      return row;
    });
  }

  async removeLocation(txOpaque: unknown, id: string): Promise<void> {
    const tx = txOpaque as Knex.Transaction<any, any>;

    await tx<DbEntitiesRow>('entities')
      .where({ location_id: id })
      .update({ location_id: null });

    const result = await tx<DbLocationsRow>('locations').where({ id }).del();

    if (!result) {
      throw new NotFoundError(`Found no location with ID ${id}`);
    }
  }

  async location(id: string): Promise<DbLocationsRowWithStatus> {
    const items = await this.database<DbLocationsRowWithStatus>('locations')
      .where('locations.id', id)
      .leftOuterJoin(
        'location_update_log_latest',
        'locations.id',
        'location_update_log_latest.location_id',
      )
      .select('locations.*', {
        status: 'location_update_log_latest.status',
        timestamp: 'location_update_log_latest.created_at',
        message: 'location_update_log_latest.message',
      });

    if (!items.length) {
      throw new NotFoundError(`Found no location with ID ${id}`);
    }
    return items[0];
  }

  async locations(): Promise<DbLocationsRowWithStatus[]> {
    const locations = await this.database('locations')
      .leftOuterJoin(
        'location_update_log_latest',
        'locations.id',
        'location_update_log_latest.location_id',
      )
      .select('locations.*', {
        status: 'location_update_log_latest.status',
        timestamp: 'location_update_log_latest.created_at',
        message: 'location_update_log_latest.message',
      });

    return locations;
  }

  async locationHistory(id: string): Promise<DatabaseLocationUpdateLogEvent[]> {
    const result = await this.database<DatabaseLocationUpdateLogEvent>(
      'location_update_log',
    )
      .where('location_id', id)
      .orderBy('created_at', 'desc')
      .limit(10)
      .select();

    return result;
  }

  async addLocationUpdateLogEvent(
    locationId: string,
    status: DatabaseLocationUpdateLogStatus,
    entityName?: string,
    message?: string,
  ): Promise<void> {
    // Remove log entries older than a day
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - 1);
    await this.database<DatabaseLocationUpdateLogEvent>('location_update_log')
      .where('created_at', '<', cutoff.toISOString())
      .del();

    await this.database<DatabaseLocationUpdateLogEvent>(
      'location_update_log',
    ).insert({
      status,
      location_id: locationId,
      entity_name: entityName,
      message,
    });
  }

  private async updateEntitiesSearch(
    tx: Knex.Transaction<any, any>,
    entityId: string,
    data: Entity,
  ): Promise<void> {
    try {
      const entries = buildEntitySearch(entityId, data);
      await tx<DbEntitiesSearchRow>('entities_search')
        .where({ entity_id: entityId })
        .del();
      await tx<DbEntitiesSearchRow>('entities_search').insert(entries);
    } catch {
      // ignore intentionally - if this happens, the entity was deleted before
      // we got around to writing the entries
    }
  }

  private toEntityRow(
    locationId: string | undefined,
    entity: Entity,
  ): DbEntitiesRow {
    const lowerKind = entity.kind.toLowerCase();
    const lowerNamespace = (
      entity.metadata.namespace || ENTITY_DEFAULT_NAMESPACE
    ).toLowerCase();
    const lowerName = entity.metadata.name.toLowerCase();

    const data = {
      ...entity,
      metadata: lodash.omit(entity.metadata, ...ENTITY_META_GENERATED_FIELDS),
    };

    return {
      id: entity.metadata.uid!,
      location_id: locationId || null,
      etag: entity.metadata.etag!,
      generation: entity.metadata.generation!,
      full_name: `${lowerKind}:${lowerNamespace}/${lowerName}`,
      data: JSON.stringify(data),
    };
  }

  private async toEntityResponse(
    tx: Knex.Transaction<any, any>,
    row: DbEntitiesRow,
  ): Promise<DbEntityResponse> {
    const entity = JSON.parse(row.data) as Entity;
    entity.metadata.uid = row.id;
    entity.metadata.etag = row.etag;
    entity.metadata.generation = Number(row.generation); // cast due to sqlite

    // TODO(Rugvip): This is here because it's simple for now, but we likely
    //               need to refactor this to be more efficient or introduce pagination.
    const relations = await tx<DbEntitiesRelationsRow>('entities_relations')
      .where({ source_full_name: row.full_name })
      .orderBy(['type', 'target_full_name'])
      .select();

    entity.relations = relations.map(r => ({
      target: parseEntityName(r.target_full_name),
      type: r.type,
    }));

    return {
      locationId: row.location_id || undefined,
      entity,
    };
  }
}
