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
  EntityRelationSpec,
} from '@backstage/catalog-model';
import { JsonObject } from '@backstage/config';

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

export interface LocationStore {
  createLocation(spec: LocationSpec): Promise<Location>;
  listLocations(): Promise<Location[]>;
  getLocation(id: string): Promise<Location>;
  deleteLocation(id: string): Promise<void>;
}

export interface CatalogProcessingEngine {
  start(): Promise<void>;
  stop(): Promise<void>;
}

export type EntityProviderMutation =
  | { type: 'full'; entities: Iterable<Entity> }
  | { type: 'delta'; added: Iterable<Entity>; removed: Iterable<Entity> };

export interface EntityProviderConnection {
  applyMutation(mutation: EntityProviderMutation): Promise<void>;
}

export interface EntityProvider {
  connect(connection: EntityProviderConnection): Promise<void>;
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
      relations: EntityRelationSpec[];
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
  relations: EntityRelationSpec[];
  deferredEntities: Entity[];
};

export type AddProcessingItemRequest = {
  type: 'entity' | 'provider';
  id: string;
  entities: Entity[];
};

export type ProccessingItem = {
  id: string;
  entity: Entity;
  state: Map<string, JsonObject>;
};

export interface ProcessingStateManager {
  setProcessingItemResult(result: ProcessingItemResult): Promise<void>;
  getNextProcessingItem(): Promise<ProccessingItem>;
  addProcessingItems(request: AddProcessingItemRequest): Promise<void>;
}
