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

import { Entity, Location, LocationSpec } from '@backstage/catalog-model';
import { RefreshStateMatch } from './database/types';
import { DeferredEntity } from './processing/types';

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
  refresh(options: EntityRefreshOptions): Promise<void>;
}

export type EntityRefreshOptions =
  | { entityRef: string } // example: component:default/backstage
  | { locationRef: string }; // example: url:https://github.com/backstage/backstage/blob/master/catalog-info.yaml

export type EntityProviderMutation =
  | { type: 'refresh'; match: RefreshStateMatch } // TODO(jhaals): Should this really use a type from the db?
  | { type: 'full'; entities: DeferredEntity[] }
  | { type: 'delta'; added: DeferredEntity[]; removed: DeferredEntity[] };

export interface EntityProviderConnection {
  applyMutation(mutation: EntityProviderMutation): Promise<void>;
}

export interface EntityProvider {
  getProviderName(): string;
  connect(connection: EntityProviderConnection): Promise<void>;
  refresh?(options: EntityRefreshOptions): Promise<void>;
}
