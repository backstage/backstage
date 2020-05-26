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
import Knex from 'knex';
import lodash from 'lodash';
import { v4 as uuidv4 } from 'uuid';
import { Logger } from 'winston';
import { DescriptorEnvelope, EntityMeta } from '../ingestion';
import { buildEntitySearch } from './search';
import {
  AddDatabaseLocation,
  DatabaseLocationUpdateLogEvent,
  DatabaseLocationUpdateLogStatus,
  DbEntitiesRow,
  DbEntitiesSearchRow,
  DbEntityRequest,
  DbEntityResponse,
  DbLocationsRow,
} from './types';

function getStrippedMetadata(metadata: EntityMeta): EntityMeta {
  const output = lodash.cloneDeep(metadata);
  delete output.uid;
  delete output.etag;
  delete output.generation;

  return output;
}

function serializeMetadata(metadata: EntityMeta | undefined): string | null {
  if (!metadata) {
    return null;
  }

  return JSON.stringify(getStrippedMetadata(metadata));
}

function serializeSpec(
  spec: DescriptorEnvelope['spec'],
): DbEntitiesRow['spec'] {
  if (!spec) {
    return null;
  }

  return JSON.stringify(spec);
}

function toEntityRow(
  locationId: string | undefined,
  entity: DescriptorEnvelope,
): DbEntitiesRow {
  return {
    id: entity.metadata!.uid!,
    location_id: locationId || null,
    etag: entity.metadata!.etag!,
    generation: entity.metadata!.generation!,
    api_version: entity.apiVersion,
    kind: entity.kind,
    name: entity.metadata!.name || null,
    namespace: entity.metadata!.namespace || null,
    metadata: serializeMetadata(entity.metadata),
    spec: serializeSpec(entity.spec),
  };
}

function toEntityResponse(row: DbEntitiesRow): DbEntityResponse {
  const entity: DescriptorEnvelope = {
    apiVersion: row.api_version,
    kind: row.kind,
    metadata: {
      uid: row.id,
      etag: row.etag,
      generation: Number(row.generation), // cast because of sqlite
    },
  };

  if (row.metadata) {
    const metadata = JSON.parse(row.metadata) as DescriptorEnvelope['metadata'];
    entity.metadata = { ...entity.metadata, ...metadata };
  }

  if (row.spec) {
    const spec = JSON.parse(row.spec);
    entity.spec = spec;
  }

  return {
    locationId: row.location_id || undefined,
    entity,
  };
}

function specsAreEqual(
  first: string | null,
  second: object | undefined,
): boolean {
  if (!first && !second) {
    return true;
  } else if (!first || !second) {
    return false;
  }

  return lodash.isEqual(JSON.parse(first), second);
}

function generateUid(): string {
  return uuidv4();
}

function generateEtag(): string {
  return Buffer.from(uuidv4(), 'utf8').toString('base64').replace(/[^\w]/g, '');
}

/**
 * An abstraction on top of the underlying database, wrapping the basic CRUD
 * needs.
 */
export class Database {
  constructor(
    private readonly database: Knex,
    private readonly logger: Logger,
  ) {}

  /**
   * Runs a transaction.
   *
   * The callback is expected to make calls back into this class. When it
   * completes, the transaction is closed.
   *
   * @param fn The callback that implements the transaction
   */
  async transaction<T>(
    fn: (tx: Knex.Transaction<any, any>) => Promise<T>,
  ): Promise<T> {
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

  /**
   * Adds a new entity to the catalog.
   *
   * @param tx An ongoing transaction
   * @param request The entity being added
   * @returns The added entity, with uid, etag and generation set
   */
  async addEntity(
    tx: Knex.Transaction<any, any>,
    request: DbEntityRequest,
  ): Promise<DbEntityResponse> {
    if (request.entity.metadata?.uid !== undefined) {
      throw new InputError('May not specify uid for new entities');
    } else if (request.entity.metadata?.etag !== undefined) {
      throw new InputError('May not specify etag for new entities');
    } else if (request.entity.metadata?.generation !== undefined) {
      throw new InputError('May not specify generation for new entities');
    }

    const newEntity = lodash.cloneDeep(request.entity);
    newEntity.metadata = Object.assign({}, newEntity.metadata, {
      uid: generateUid(),
      etag: generateEtag(),
      generation: 1,
    });

    const newRow = toEntityRow(request.locationId, newEntity);
    await tx<DbEntitiesRow>('entities').insert(newRow);
    await this.updateEntitiesSearch(tx, newRow.id, newEntity);

    return { locationId: request.locationId, entity: newEntity };
  }

  /**
   * Updates an existing entity in the catalog.
   *
   * The given entity must contain enough information to identify an already
   * stored entity in the catalog - either by uid, or by kind + namespace +
   * name. If no matching entity is found, the operation fails.
   *
   * If etag or generation are given, they are taken into account. Attempts to
   * update a matching entity, but where the etag and/or generation are not
   * equal to the passed values, will fail.
   *
   * @param tx An ongoing transaction
   * @param request The entity being updated
   * @returns The updated entity
   */
  async updateEntity(
    tx: Knex.Transaction<any, any>,
    request: DbEntityRequest,
  ): Promise<DbEntityResponse> {
    const { kind } = request.entity;
    const {
      uid,
      etag: expectedOldEtag,
      generation: expectedOldGeneration,
      name,
      namespace,
    } = request.entity.metadata ?? {};

    // Find existing entities that match the given metadata
    let entitySelector: Partial<DbEntitiesRow>;
    if (uid) {
      entitySelector = { id: uid };
    } else if (kind && name) {
      entitySelector = {
        kind,
        name: name,
        namespace: namespace || null,
      };
    } else {
      throw new InputError(
        'Must specify either uid, or kind + name + namespace to be able to identify an entity',
      );
    }
    const oldRows = await tx<DbEntitiesRow>('entities')
      .where(entitySelector)
      .select();
    if (oldRows.length !== 1) {
      throw new NotFoundError('No matching entity found');
    }

    // Validate the old entity
    const oldRow = oldRows[0];
    // The Number cast is here because sqlite reads it as a string, no matter
    // what the table actually says
    oldRow.generation = Number(oldRow.generation);
    if (expectedOldEtag) {
      if (expectedOldEtag !== oldRow.etag) {
        throw new ConflictError(
          `Etag mismatch, expected="${expectedOldEtag}" found="${oldRow.etag}"`,
        );
      }
    }
    if (expectedOldGeneration) {
      if (expectedOldGeneration !== oldRow.generation) {
        throw new ConflictError(
          `Generation mismatch, expected="${expectedOldGeneration}" found="${oldRow.generation}"`,
        );
      }
    }

    // Build the new shape of the entity
    const newEtag = generateEtag();
    const newGeneration = specsAreEqual(oldRow.spec, request.entity.spec)
      ? oldRow.generation
      : oldRow.generation + 1;
    const newEntity = lodash.cloneDeep(request.entity);
    newEntity.metadata = Object.assign({}, request.entity.metadata, {
      uid: oldRow.id,
      etag: newEtag,
      generation: newGeneration,
    });

    // Preserve annotations that were set on the old version of the entity,
    // unless the new version overwrites them
    if (oldRow.metadata) {
      const oldMetadata = JSON.parse(oldRow.metadata) as EntityMeta;
      if (oldMetadata.annotations) {
        newEntity.metadata!.annotations = {
          ...oldMetadata.annotations,
          ...newEntity.metadata!.annotations,
        };
      }
    }

    // Store the updated entity; select on the old etag to ensure that we do
    // not lose to another writer
    const newRow = toEntityRow(request.locationId, newEntity);
    const updatedRows = await tx<DbEntitiesRow>('entities')
      .where({ id: oldRow.id, etag: oldRow.etag })
      .update(newRow);

    // If this happens, somebody else changed the entity just now
    if (updatedRows !== 1) {
      throw new ConflictError(`Failed to update entity`);
    }

    await this.updateEntitiesSearch(tx, oldRow.id, newEntity);
    return { locationId: request.locationId, entity: newEntity };
  }

  async entities(tx: Knex.Transaction<any, any>): Promise<DbEntityResponse[]> {
    const rows = await tx<DbEntitiesRow>('entities')
      .orderBy('namespace', 'name')
      .select();
    return rows.map(row => toEntityResponse(row));
  }

  async entity(
    tx: Knex.Transaction<any, any>,
    kind: string,
    name: string,
    namespace?: string,
  ): Promise<DbEntityResponse | undefined> {
    const rows = await tx<DbEntitiesRow>('entities')
      .where({ kind, name, namespace: namespace || null })
      .select();

    if (rows.length !== 1) {
      return undefined;
    }

    return toEntityResponse(rows[0]);
  }

  async addLocation(location: AddDatabaseLocation): Promise<DbLocationsRow> {
    return await this.database.transaction<DbLocationsRow>(async tx => {
      const existingLocation = await tx<DbLocationsRow>('locations')
        .where({
          target: location.target,
        })
        .select();

      if (existingLocation?.[0]) {
        return existingLocation[0];
      }

      const id = uuidv4();
      const { type, target } = location;
      await tx<DbLocationsRow>('locations').insert({
        id,
        type,
        target,
      });

      return (await tx<DbLocationsRow>('locations').where({ id }).select())![0];
    });
  }

  async removeLocation(id: string): Promise<void> {
    const result = await this.database<DbLocationsRow>('locations')
      .where({ id })
      .del();

    if (!result) {
      throw new NotFoundError(`Found no location with ID ${id}`);
    }
  }

  async location(id: string): Promise<DbLocationsRow> {
    const items = await this.database<DbLocationsRow>('locations')
      .where({ id })
      .select();
    if (!items.length) {
      throw new NotFoundError(`Found no location with ID ${id}`);
    }
    return items[0];
  }

  async locations(): Promise<DbLocationsRow[]> {
    return this.database<DbLocationsRow>('locations').select();
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
      id: uuidv4(),
      status: status,
      location_id: locationId,
      entity_name: entityName,
      message,
    });
  }

  private async updateEntitiesSearch(
    tx: Knex.Transaction<any, any>,
    entityId: string,
    data: DescriptorEnvelope,
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
}
