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
  EntityRelationSpec,
  ENTITY_DEFAULT_NAMESPACE,
  ENTITY_META_GENERATED_FIELDS,
  generateEntityEtag,
  generateEntityUid,
  Location,
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
  EntityFilter,
  Transaction,
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

  async transaction<T>(fn: (tx: Transaction) => Promise<T>): Promise<T> {
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

  async addEntities(
    txOpaque: Transaction,
    request: DbEntityRequest[],
  ): Promise<DbEntityResponse[]> {
    const tx = txOpaque as Knex.Transaction<any, any>;

    const result: DbEntityResponse[] = [];
    const entityRows: DbEntitiesRow[] = [];
    const relationRows: DbEntitiesRelationsRow[] = [];
    const searchRows: DbEntitiesSearchRow[] = [];

    for (const { entity, relations, locationId } of request) {
      if (entity.metadata.uid !== undefined) {
        throw new InputError('May not specify uid for new entities');
      } else if (entity.metadata.etag !== undefined) {
        throw new InputError('May not specify etag for new entities');
      } else if (entity.metadata.generation !== undefined) {
        throw new InputError('May not specify generation for new entities');
      } else if (entity.relations !== undefined) {
        throw new InputError('May not specify relations for new entities');
      }

      const uid = generateEntityUid();
      const etag = generateEntityEtag();
      const generation = 1;
      const newEntity = {
        ...entity,
        metadata: {
          ...entity.metadata,
          uid,
          etag,
          generation,
        },
      };

      result.push({ entity: newEntity, locationId });
      entityRows.push(this.toEntityRow(locationId, newEntity));
      relationRows.push(...this.toRelationRows(uid, relations));
      searchRows.push(...buildEntitySearch(uid, newEntity));
    }

    await tx.batchInsert('entities', entityRows, BATCH_SIZE);
    await tx.batchInsert('entities_relations', relationRows, BATCH_SIZE);
    await tx.batchInsert('entities_search', searchRows, BATCH_SIZE);

    return result;
  }

  async updateEntity(
    txOpaque: Transaction,
    request: DbEntityRequest,
    matchingEtag?: string,
    matchingGeneration?: number,
  ): Promise<DbEntityResponse> {
    const tx = txOpaque as Knex.Transaction<any, any>;

    const { uid } = request.entity.metadata;
    if (!uid) {
      throw new InputError('Must specify uid when updating entities');
    }

    // Find existing entity
    const oldRows = await tx<DbEntitiesRow>('entities')
      .where({ id: uid })
      .select();
    if (oldRows.length !== 1) {
      throw new NotFoundError('No matching entity found');
    }
    const etag = oldRows[0].etag;
    const generation = Number(oldRows[0].generation);

    // Validate the old entity. The Number cast is here because sqlite reads it
    // as a string, no matter what the table actually says.
    if (matchingEtag && matchingEtag !== etag) {
      throw new ConflictError(
        `Etag mismatch, expected="${matchingEtag}" found="${etag}"`,
      );
    }
    if (matchingGeneration && matchingGeneration !== generation) {
      throw new ConflictError(
        `Generation mismatch, expected="${matchingGeneration}" found="${generation}"`,
      );
    }

    // Store the updated entity; select on the old etag to ensure that we do
    // not lose to another writer
    const newRow = this.toEntityRow(request.locationId, request.entity);
    const updatedRows = await tx<DbEntitiesRow>('entities')
      .where({ id: uid, etag })
      .update(newRow);
    if (updatedRows !== 1) {
      throw new ConflictError(`Failed to update entity`);
    }

    const relationRows = this.toRelationRows(uid, request.relations);
    await tx<DbEntitiesRelationsRow>('entities_relations')
      .where({ originating_entity_id: uid })
      .del();
    await tx.batchInsert('entities_relations', relationRows, BATCH_SIZE);

    try {
      const entries = buildEntitySearch(uid, request.entity);
      await tx<DbEntitiesSearchRow>('entities_search')
        .where({ entity_id: uid })
        .del();
      await tx.batchInsert('entities_search', entries, BATCH_SIZE);
    } catch {
      // ignore intentionally - if this happens, the entity was deleted before
      // we got around to writing the entries
    }

    return request;
  }

  async entities(
    txOpaque: Transaction,
    filter?: EntityFilter,
  ): Promise<DbEntityResponse[]> {
    const tx = txOpaque as Knex.Transaction<any, any>;

    let entitiesQuery = tx<DbEntitiesRow>('entities');

    for (const singleFilter of filter?.anyOf ?? []) {
      entitiesQuery = entitiesQuery.orWhere(function singleFilterFn() {
        for (const { key, matchValueIn } of singleFilter.allOf) {
          // NOTE(freben): This used to be a set of OUTER JOIN, which may seem to
          // make a lot of sense. However, it had abysmal performance on sqlite
          // when datasets grew large, so we're using IN instead.
          const matchQuery = tx<DbEntitiesSearchRow>('entities_search')
            .select('entity_id')
            .where(function keyFilter() {
              this.andWhere({ key: key.toLowerCase() });
              if (matchValueIn) {
                if (matchValueIn.length === 1) {
                  this.andWhere({ value: matchValueIn[0].toLowerCase() });
                } else if (matchValueIn.length > 1) {
                  this.andWhere(
                    'value',
                    'in',
                    matchValueIn.map(v => v.toLowerCase()),
                  );
                }
              }
            });

          this.andWhere('id', 'in', matchQuery);
        }
      });
    }

    const rows = await entitiesQuery
      .select('entities.*')
      .orderBy('full_name', 'asc');

    return this.toEntityResponses(tx, rows);
  }

  async entityByName(
    txOpaque: Transaction,
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

    return this.toEntityResponses(tx, rows).then(r => r[0]);
  }

  async entityByUid(
    txOpaque: Transaction,
    uid: string,
  ): Promise<DbEntityResponse | undefined> {
    const tx = txOpaque as Knex.Transaction<any, any>;

    const rows = await tx<DbEntitiesRow>('entities')
      .where({ id: uid })
      .select();

    if (rows.length !== 1) {
      return undefined;
    }

    return this.toEntityResponses(tx, rows).then(r => r[0]);
  }

  async removeEntityByUid(txOpaque: Transaction, uid: string): Promise<void> {
    const tx = txOpaque as Knex.Transaction<any, any>;

    const result = await tx<DbEntitiesRow>('entities').where({ id: uid }).del();

    if (!result) {
      throw new NotFoundError(`Found no entity with ID ${uid}`);
    }
  }

  async setRelations(
    txOpaque: Transaction,
    originatingEntityId: string,
    relations: EntityRelationSpec[],
  ): Promise<void> {
    const tx = txOpaque as Knex.Transaction<any, any>;
    const relationRows = this.toRelationRows(originatingEntityId, relations);

    await tx<DbEntitiesRelationsRow>('entities_relations')
      .where({ originating_entity_id: originatingEntityId })
      .del();
    await tx.batchInsert('entities_relations', relationRows, BATCH_SIZE);
  }

  async addLocation(
    txOpaque: Transaction,
    location: Location,
  ): Promise<DbLocationsRow> {
    const tx = txOpaque as Knex.Transaction<any, any>;

    const row: DbLocationsRow = {
      id: location.id,
      type: location.type,
      target: location.target,
    };
    await tx<DbLocationsRow>('locations').insert(row);
    return row;
  }

  async removeLocation(txOpaque: Transaction, id: string): Promise<void> {
    const tx = txOpaque as Knex.Transaction<any, any>;

    const locations = await tx<DbLocationsRow>('locations')
      .where({ id })
      .select();
    if (!locations.length) {
      throw new NotFoundError(`Found no location with ID ${id}`);
    }

    if (locations[0].type === 'bootstrap') {
      throw new ConflictError('You may not delete the bootstrap location.');
    }

    await tx<DbEntitiesRow>('entities')
      .where({ location_id: id })
      .update({ location_id: null });
    await tx<DbLocationsRow>('locations').where({ id }).del();
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
    entityName?: string | string[],
    message?: string,
  ): Promise<void> {
    // Remove log entries older than a day
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - 1);
    await this.database<DatabaseLocationUpdateLogEvent>('location_update_log')
      .where('created_at', '<', cutoff.toISOString())
      .del();

    const items: Partial<DatabaseLocationUpdateLogEvent>[] = [entityName]
      .flat()
      .map(n => ({
        status,
        location_id: locationId,
        entity_name: n,
        message,
      }));

    for (const chunk of lodash.chunk(items, BATCH_SIZE)) {
      await this.database<DatabaseLocationUpdateLogEvent>(
        'location_update_log',
      ).insert(chunk);
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

  private toRelationRows(
    originatingEntityId: string,
    relations: EntityRelationSpec[],
  ): DbEntitiesRelationsRow[] {
    const serializeName = (e: EntityName) =>
      `${e.kind}:${e.namespace}/${e.name}`.toLowerCase();

    const rows = relations.map(({ source, target, type }) => ({
      originating_entity_id: originatingEntityId,
      source_full_name: serializeName(source),
      target_full_name: serializeName(target),
      type,
    }));

    return deduplicateRelations(rows);
  }

  private async toEntityResponses(
    tx: Knex.Transaction<any, any>,
    rows: DbEntitiesRow[],
  ): Promise<DbEntityResponse[]> {
    // TODO(Rugvip): This is here because it's simple for now, but we likely
    //               need to refactor this to be more efficient or introduce pagination.
    const relations = await this.getRelationsPerFullName(
      tx,
      rows.map(r => r.full_name),
    );

    const result = new Array<DbEntityResponse>();
    for (const row of rows) {
      const entity = JSON.parse(row.data) as Entity;
      entity.metadata.uid = row.id;
      entity.metadata.etag = row.etag;
      entity.metadata.generation = Number(row.generation); // cast due to sqlite

      entity.relations = (relations[row.full_name] ?? []).map(r => ({
        target: parseEntityName(r.target_full_name),
        type: r.type,
      }));

      result.push({
        locationId: row.location_id || undefined,
        entity,
      });
    }

    return result;
  }

  // Returns a mapping from e.g. component:default/foo to the relations whose
  // source_full_name matches that.
  private async getRelationsPerFullName(
    tx: Knex.Transaction<any, any>,
    sourceFullNames: string[],
  ): Promise<Record<string, DbEntitiesRelationsRow[]>> {
    const batches = lodash.chunk(lodash.uniq(sourceFullNames), 500);

    const relations = new Array<DbEntitiesRelationsRow>();
    for (const batch of batches) {
      relations.push(
        ...(await tx<DbEntitiesRelationsRow>('entities_relations')
          .whereIn('source_full_name', batch)
          .orderBy(['type', 'target_full_name'])
          .select()),
      );
    }

    return lodash.groupBy(
      deduplicateRelations(relations),
      r => r.source_full_name,
    );
  }
}

function deduplicateRelations(
  rows: DbEntitiesRelationsRow[],
): DbEntitiesRelationsRow[] {
  return lodash.uniqBy(
    rows,
    r => `${r.source_full_name}:${r.target_full_name}:${r.type}`,
  );
}
