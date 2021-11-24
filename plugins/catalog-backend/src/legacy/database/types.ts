/*
 * Copyright 2020 The Backstage Authors
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

import type {
  Entity,
  EntityName,
  EntityRelationSpec,
  Location,
} from '@backstage/catalog-model';
import { EntityFilter, EntityPagination } from '../../catalog/types';

/** @deprecated This was part of the legacy catalog engine */
export type DbEntitiesRow = {
  id: string;
  location_id: string | null;
  etag: string;
  generation: number;
  full_name: string;
  data: string;
};

/** @deprecated This was part of the legacy catalog engine */
export type DbEntityRequest = {
  locationId?: string;
  entity: Entity;
  relations: EntityRelationSpec[];
};

/** @deprecated This was part of the legacy catalog engine */
export type DbEntitiesRequest = {
  filter?: EntityFilter;
  pagination?: EntityPagination;
};

/** @deprecated This was part of the legacy catalog engine */
export type DbEntitiesResponse = {
  entities: DbEntityResponse[];
  pageInfo: DbPageInfo;
};

/** @deprecated This was part of the legacy catalog engine */
export type DbPageInfo =
  | {
      hasNextPage: false;
    }
  | {
      hasNextPage: true;
      endCursor: string;
    };

/** @deprecated This was part of the legacy catalog engine */
export type DbEntityResponse = {
  locationId?: string;
  entity: Entity;
};

/** @deprecated This was part of the legacy catalog engine */
export type DbEntitiesRelationsRow = {
  originating_entity_id: string;
  source_full_name: string;
  type: string;
  target_full_name: string;
};

/** @deprecated This was part of the legacy catalog engine */
export type DbEntitiesSearchRow = {
  entity_id: string;
  key: string;
  value: string | null;
};

/** @deprecated This was part of the legacy catalog engine */
export type DbLocationsRow = {
  id: string;
  type: string;
  target: string;
};

/** @deprecated This was part of the legacy catalog engine */
export type DbLocationsRowWithStatus = DbLocationsRow & {
  status: string | null;
  timestamp: string | null;
  message: string | null;
};

export enum DatabaseLocationUpdateLogStatus {
  FAIL = 'fail',
  SUCCESS = 'success',
}

/** @deprecated This was part of the legacy catalog engine */
export type DatabaseLocationUpdateLogEvent = {
  id: string;
  status: DatabaseLocationUpdateLogStatus;
  location_id: string;
  entity_name: string;
  created_at?: string;
  message?: string;
};

/**
 * An abstraction for transactions of the underlying database technology.
 *
 * @deprecated This was part of the legacy catalog engine
 */
export type Transaction = {
  rollback(): Promise<unknown>;
};

/**
 * An abstraction on top of the underlying database, wrapping the basic CRUD
 * needs.
 * @deprecated This was part of the legacy catalog engine
 */
export type Database = {
  /**
   * Runs a transaction.
   *
   * The callback is expected to make calls back into this class. When it
   * completes, the transaction is closed.
   *
   * @param fn The callback that implements the transaction
   */
  transaction<T>(fn: (tx: Transaction) => Promise<T>): Promise<T>;

  /**
   * Adds a set of new entities to the catalog.
   *
   * @param tx An ongoing transaction
   * @param request The entities being added
   */
  addEntities(
    tx: Transaction,
    request: DbEntityRequest[],
  ): Promise<DbEntityResponse[]>;

  /**
   * Updates an existing entity in the catalog.
   *
   * The given entity must contain an uid to identify an already stored entity
   * in the catalog. If it is missing or if no matching entity is found, the
   * operation fails.
   *
   * If matchingEtag or matchingGeneration are given, they are taken into
   * account. Attempts to update a matching entity, but where the etag and/or
   * generation are not equal to the passed values, will fail.
   *
   * @param tx An ongoing transaction
   * @param request The entity being updated
   * @param matchingEtag If specified, reject with ConflictError if not
   *                     matching the entry in the database
   * @param matchingGeneration If specified, reject with ConflictError if not
   *                           matching the entry in the database
   * @returns The updated entity
   */
  updateEntity(
    tx: Transaction,
    request: DbEntityRequest,
    matchingEtag?: string,
    matchingGeneration?: number,
  ): Promise<DbEntityResponse>;

  entities(
    tx: Transaction,
    request?: DbEntitiesRequest,
  ): Promise<DbEntitiesResponse>;

  entityByName(
    tx: Transaction,
    name: EntityName,
  ): Promise<DbEntityResponse | undefined>;

  entityByUid(
    tx: Transaction,
    uid: string,
  ): Promise<DbEntityResponse | undefined>;

  removeEntityByUid(tx: Transaction, uid: string): Promise<void>;

  /**
   * Remove current relations for the entity and replace them with the new
   * relations array.
   *
   * @param tx An ongoing transaction
   * @param entityUid The entity uid
   * @param relations The relationships to be set
   */
  setRelations(
    tx: Transaction,
    entityUid: string,
    relations: EntityRelationSpec[],
  ): Promise<void>;

  addLocation(tx: Transaction, location: Location): Promise<DbLocationsRow>;

  removeLocation(tx: Transaction, id: string): Promise<void>;

  location(id: string): Promise<DbLocationsRowWithStatus>;

  locations(): Promise<DbLocationsRowWithStatus[]>;

  locationHistory(id: string): Promise<DatabaseLocationUpdateLogEvent[]>;

  addLocationUpdateLogEvent(
    locationId: string,
    status: DatabaseLocationUpdateLogStatus,
    entityName?: string | string[],
    message?: string,
  ): Promise<void>;
};
