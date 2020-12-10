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

import { Entity, EntityRelationSpec, Location } from '@backstage/catalog-model';
import type { EntityFilter } from '../database';

//
// Entities
//

export type EntityUpsertRequest = {
  entity: Entity;
  relations: EntityRelationSpec[];
};

export type EntityUpsertResponse = {
  entityId: string;
  entity?: Entity;
};

export type EntitiesCatalog = {
  entities(filter?: EntityFilter): Promise<Entity[]>;
  removeEntityByUid(uid: string): Promise<void>;

  /**
   * Writes a number of entities efficiently to storage.
   *
   * @param entities Some entities
   * @param locationId The location that they all belong to
   */
  batchAddOrUpdateEntities(
    entities: EntityUpsertRequest[],
    options?: {
      locationId?: string;
      dryRun?: boolean;
      outputEntities?: boolean;
    },
  ): Promise<EntityUpsertResponse[]>;
};

//
// Locations
//

export type LocationUpdateStatus = {
  timestamp: string | null;
  status: string | null;
  message: string | null;
};
export type LocationUpdateLogEvent = {
  id: string;
  status: 'fail' | 'success';
  location_id: string;
  entity_name: string;
  created_at?: string;
  message?: string;
};

export type LocationResponse = {
  data: Location;
  currentStatus: LocationUpdateStatus;
};

export type LocationsCatalog = {
  addLocation(location: Location): Promise<Location>;
  removeLocation(id: string): Promise<void>;
  locations(): Promise<LocationResponse[]>;
  location(id: string): Promise<LocationResponse>;
  locationHistory(id: string): Promise<LocationUpdateLogEvent[]>;
  logUpdateSuccess(
    locationId: string,
    entityName?: string | string[],
  ): Promise<void>;
  logUpdateFailure(
    locationId: string,
    error?: Error,
    entityName?: string,
  ): Promise<void>;
};
