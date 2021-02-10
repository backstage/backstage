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

import { Entity, EntityName, Location } from '@backstage/catalog-model';

export type CatalogEntitiesRequest = {
  filter?: Record<string, string | string[]> | undefined;
  fields?: string[] | undefined;
};

export type CatalogListResponse<T> = {
  items: T[];
};

export type CatalogRequestOptions = {
  token?: string;
};

export interface CatalogApi {
  getLocationById(
    id: String,
    options?: CatalogRequestOptions,
  ): Promise<Location | undefined>;
  getEntityByName(
    name: EntityName,
    options?: CatalogRequestOptions,
  ): Promise<Entity | undefined>;
  getEntities(
    request?: CatalogEntitiesRequest,
    options?: CatalogRequestOptions,
  ): Promise<CatalogListResponse<Entity>>;
  addLocation(
    location: AddLocationRequest,
    options?: CatalogRequestOptions,
  ): Promise<AddLocationResponse>;
  getLocationByEntity(
    entity: Entity,
    options?: CatalogRequestOptions,
  ): Promise<Location | undefined>;
  removeEntityByUid(
    uid: string,
    options?: CatalogRequestOptions,
  ): Promise<void>;
}

export type AddLocationRequest = {
  type?: string;
  target: string;
  dryRun?: boolean;
  presence?: 'optional' | 'required';
};

export type AddLocationResponse = {
  location: Location;
  entities: Entity[];
};

/**
 * This is a copy of the core DiscoveryApi, to avoid importing core.
 */
export type DiscoveryApi = {
  getBaseUrl(pluginId: string): Promise<string>;
};
