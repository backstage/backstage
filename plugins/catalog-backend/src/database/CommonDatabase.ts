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
  EntityMeta,
  entityMetaGeneratedFields,
  generateEntityEtag,
  generateEntityUid,
  Location,
} from '@backstage/catalog-model';
import Knex from 'knex';
import lodash from 'lodash';
import type { Logger } from 'winston';
import { buildEntitySearch } from './search';
import type {
  Database,
  DatabaseLocationUpdateLogEvent,
  DatabaseLocationUpdateLogStatus,
  DbEntitiesRow,
  DbEntitiesSearchRow,
  DbEntityRequest,
  DbEntityResponse,
  DbLocationsRow,
  DbLocationsRowWithStatus,
  EntityFilters,
} from './types';

/**
 * The core database implementation.
 */
export class CommonDatabase implements Database {
  constructor(
    private readonly database: Knex,
    private readonly normalize: (value: string) => string,
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

    await this.ensureNoSimilarNames(tx, request.entity);

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

    await this.ensureNoSimilarNames(tx, request.entity);

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

    let builder = tx<DbEntitiesRow>('entities');
    for (const [indexU, filter] of (filters ?? []).entries()) {
      const index = Number(indexU);
      const key = filter.key.replace('*', '%');
      const keyOp = filter.key.includes('*') ? 'like' : '=';

      let matchNulls = false;
      const matchIn: string[] = [];
      const matchLike: string[] = [];

      for (const value of filter.values) {
        if (!value) {
          matchNulls = true;
        } else if (value.includes('*')) {
          matchLike.push(value.replace('*', '%'));
        } else {
          matchIn.push(value);
        }
      }

      builder = builder
        .leftOuterJoin(`entities_search as t${index}`, function joins() {
          this.on('entities.id', '=', `t${index}.entity_id`);
          this.andOn(`t${index}.key`, keyOp, tx.raw('?', [key]));
        })
        .where(function rules() {
          if (matchIn.length) {
            this.orWhereIn(`t${index}.value`, matchIn);
          }
          if (matchLike.length) {
            for (const x of matchLike) {
              this.orWhere(`t${index}.value`, 'like', tx.raw('?', [x]));
            }
          }
          if (matchNulls) {
            this.orWhereNull(`t${index}.value`);
          }
        });
    }

    const rows = await builder
      .select('entities.*')
      .orderBy('kind', 'asc')
      .orderBy('namespace', 'asc')
      .orderBy('name', 'asc')
      .groupBy('id');

    return rows.map(row => this.toEntityResponse(row));
  }

  async entity(
    txOpaque: unknown,
    kind: string,
    name: string,
    namespace?: string,
  ): Promise<DbEntityResponse | undefined> {
    const tx = txOpaque as Knex.Transaction<any, any>;

    const rows = await tx<DbEntitiesRow>('entities')
      .where({ kind, name, namespace: namespace || null })
      .select();

    if (rows.length !== 1) {
      return undefined;
    }

    return this.toEntityResponse(rows[0]);
  }

  async entityByUid(
    txOpaque: unknown,
    id: string,
  ): Promise<DbEntityResponse | undefined> {
    const tx = txOpaque as Knex.Transaction<any, any>;

    const rows = await tx<DbEntitiesRow>('entities').where({ id }).select();

    if (rows.length !== 1) {
      return undefined;
    }

    return this.toEntityResponse(rows[0]);
  }

  async removeEntity(txOpaque: unknown, uid: string): Promise<void> {
    const tx = txOpaque as Knex.Transaction<any, any>;

    const result = await tx<DbEntitiesRow>('entities').where({ id: uid }).del();

    if (!result) {
      throw new NotFoundError(`Found no entity with ID ${uid}`);
    }
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
    return this.database<DatabaseLocationUpdateLogEvent>(
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

  private async ensureNoSimilarNames(
    tx: Knex.Transaction<any, any>,
    data: Entity,
  ): Promise<void> {
    const newKind = data.kind;
    const newName = data.metadata.name;
    const newNamespace = data.metadata.namespace;
    const newKindNorm = this.normalize(newKind);
    const newNameNorm = this.normalize(newName);
    const newNamespaceNorm = this.normalize(newNamespace || '');

    for (const item of await this.entities(tx)) {
      if (data.metadata.uid === item.entity.metadata.uid) {
        continue;
      }

      const oldKind = item.entity.kind;
      const oldName = item.entity.metadata.name;
      const oldNamespace = item.entity.metadata.namespace;
      const oldKindNorm = this.normalize(oldKind);
      const oldNameNorm = this.normalize(oldName);
      const oldNamespaceNorm = this.normalize(oldNamespace || '');

      if (
        oldKindNorm === newKindNorm &&
        oldNameNorm === newNameNorm &&
        oldNamespaceNorm === newNamespaceNorm
      ) {
        // Only throw if things were actually different - for completely equal
        // things, we let the database handle the conflict
        if (
          oldKind !== newKind ||
          oldName !== newName ||
          oldNamespace !== newNamespace
        ) {
          const message = `Kind, namespace, name are too similar to an existing entity`;
          throw new ConflictError(message);
        }
      }
    }
  }

  private toEntityRow(
    locationId: string | undefined,
    entity: Entity,
  ): DbEntitiesRow {
    return {
      id: entity.metadata.uid!,
      location_id: locationId || null,
      etag: entity.metadata.etag!,
      generation: entity.metadata.generation!,
      api_version: entity.apiVersion,
      kind: entity.kind,
      name: entity.metadata.name,
      namespace: entity.metadata.namespace || null,
      metadata: JSON.stringify(
        lodash.omit(entity.metadata, ...entityMetaGeneratedFields),
      ),
      spec: entity.spec ? JSON.stringify(entity.spec) : null,
    };
  }

  private toEntityResponse(row: DbEntitiesRow): DbEntityResponse {
    const entity: Entity = {
      apiVersion: row.api_version,
      kind: row.kind,
      metadata: {
        ...(JSON.parse(row.metadata) as EntityMeta),
        uid: row.id,
        etag: row.etag,
        generation: Number(row.generation), // cast because of sqlite
      },
    };

    if (row.spec) {
      const spec = JSON.parse(row.spec);
      entity.spec = spec;
    }

    return {
      locationId: row.location_id || undefined,
      entity,
    };
  }
}
