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
import {
  Entity,
  EntityName,
  LocationSpec,
  Location,
} from '@backstage/catalog-model';
import { JsonObject } from '@backstage/config';
import { Observable } from '@backstage/core'; // << nooo

export interface LocationEntity {
  apiVersion: 'backstage.io/v1alpha1';
  kind: 'Location';
  metadata: {
    name: string; // type:target
    namespace: 'default';
  };
  spec: {
    location: { type: string; target: string };
  };
}

export interface LocationService {
  createLocation(
    spec: LocationSpec,
    dryRun: boolean,
  ): Promise<{ location: Location; entities: Entity[] }>;
  listLocations(): Promise<Location[]>;
  getLocation(id: string): Promise<Location>;
  deleteLocation(id: string): Promise<void>;
}

export type EntityMessage =
  | { all: Entity[] }
  | { added: Entity[]; removed: EntityName[] };

export interface LocationStore {
  // extends EntityProvider
  createLocation(spec: LocationSpec): Promise<Location>;
  listLocations(): Promise<Location[]>;
  getLocation(id: string): Promise<Location>;
  deleteLocation(id: string): Promise<void>;

  location$(): Observable<
    { all: Location[] } | { added: Location[]; removed: Location[] }
  >;
}

export interface CatalogProcessingEngine {
  start(): Promise<void>;
  stop(): Promise<void>;
}

export interface EntityProvider {
  entityChange$(): Observable<EntityMessage>;
}

export type EntityProcessingRequest = {
  entity: Entity;
  eager?: boolean;
  state: Map<string, JsonObject>; // Versions for multiple deployments etc
};

export type EntityProcessingResult =
  | {
      ok: true;
      state: Map<string, JsonObject>;
      completedEntity: Entity;
      deferredEntites: Entity[];
      errors: Error[];
    }
  | {
      ok: false;
      errors: Error[];
    };

export interface CatalogProcessingOrchestrator {
  process(request: EntityProcessingRequest): Promise<EntityProcessingResult>;
}

export type ProcessingItemResult = {
  id: string;
  entity: Entity;
  state: Map<string, JsonObject>;
  errors: Error[];
};

export type AddProcessingItemRequest = {
  entities: Entity[];
};

export type ProccessingItem = {
  id: string;
  entity: Entity;
  state: Map<string, JsonObject>;
};
export interface ProcessingStateManager {
  setProcessingItemResult(result: ProcessingItemResult): Promise<void>;
  getNextProccessingItem(): Promise<ProccessingItem>;
  addProcessingItems(request: AddProcessingItemRequest): Promise<void>;
}
