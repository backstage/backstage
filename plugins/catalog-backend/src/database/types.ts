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

import type { Entity, EntityName, Location } from '@backstage/catalog-model';

export type DbEntitiesRow = {
  id: string;
  location_id: string | null;
  etag: string;
  generation: number;
  full_name: string;
  data: string;
};

export type DbEntityRequest = {
  locationId?: string;
  entity: Entity;
};

export type DbEntityResponse = {
  locationId?: string;
  entity: Entity;
};

export type DbEntitiesSearchRow = {
  entity_id: string;
  key: string;
  value: string | null;
};

export type DbLocationsRow = {
  id: string;
  type: string;
  target: string;
};

export type DbLocationsRowWithStatus = DbLocationsRow & {
  status: string | null;
  timestamp: string | null;
  message: string | null;
};

export enum DatabaseLocationUpdateLogStatus {
  FAIL = 'fail',
  SUCCESS = 'success',
}

export type DatabaseLocationUpdateLogEvent = {
  id: string;
  status: DatabaseLocationUpdateLogStatus;
  location_id: string;
  entity_name: string;
  created_at?: string;
  message?: string;
};

/**
 * Filter matcher for a single entity field.
 *
 * Can be either null or a string, or an array of those. Null and the empty
 * string are treated equally, and match both a present field with a null or
 * empty value, as well as an absent field.
 *
 * A filter may contain asterisks (*) that are treated as wildcards for zero
 * or more arbitrary characters.
 */
export type EntityFilter = null | string | (null | string)[];

/**
 * A set of filter matchers used for filtering entities.
 *
 * The keys are full dot-separated paths into the structure of an entity, for
 * example "metadata.name". You can also address any item in an array the same
 * way, e.g. "a.b.c": "x" works if b is an array of objects that have a c field
 * and any of those have the value x.
 */
export type EntityFilters = Record<string, EntityFilter>;

/**
 * An abstraction on top of the underlying database, wrapping the basic CRUD
 * needs.
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
  transaction<T>(fn: (tx: unknown) => Promise<T>): Promise<T>;

  /**
   * Adds a set of new entities to the catalog.
   *
   * @param tx An ongoing transaction
   * @param request The entities being added
   */
  addEntities(
    tx: unknown,
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
    tx: unknown,
    request: DbEntityRequest,
    matchingEtag?: string,
    matchingGeneration?: number,
  ): Promise<DbEntityResponse>;

  entities(tx: unknown, filters?: EntityFilters): Promise<DbEntityResponse[]>;

  entityByName(
    tx: unknown,
    name: EntityName,
  ): Promise<DbEntityResponse | undefined>;

  entityByUid(tx: unknown, uid: string): Promise<DbEntityResponse | undefined>;

  removeEntityByUid(tx: unknown, uid: string): Promise<void>;

  addLocation(location: Location): Promise<DbLocationsRow>;

  removeLocation(tx: unknown, id: string): Promise<void>;

  location(id: string): Promise<DbLocationsRowWithStatus>;

  locations(): Promise<DbLocationsRowWithStatus[]>;

  locationHistory(id: string): Promise<DatabaseLocationUpdateLogEvent[]>;

  addLocationUpdateLogEvent(
    locationId: string,
    status: DatabaseLocationUpdateLogStatus,
    entityName?: string,
    message?: string,
  ): Promise<void>;
};
