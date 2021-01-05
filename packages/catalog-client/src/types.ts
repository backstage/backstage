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

export interface CatalogApi {
  getLocationById(id: String): Promise<Location | undefined>;
  getEntityByName(name: EntityName): Promise<Entity | undefined>;
  getEntities(
    request?: CatalogEntitiesRequest,
  ): Promise<CatalogListResponse<Entity>>;
  addLocation(location: AddLocationRequest): Promise<AddLocationResponse>;
  getLocationByEntity(entity: Entity): Promise<Location | undefined>;
  removeEntityByUid(uid: string): Promise<void>;
}

export type AddLocationRequest = {
  type?: string;
  target: string;
  dryRun?: boolean;
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
/**
 * This is a copy of the core IdentityApi, to avoid importing core.
 */
export type ProfileInfo = {
  email?: string;
  displayName?: string;
  picture?: string;
};
export type IdentityApi = {
  getUserId(): string;
  getProfile(): ProfileInfo;
  getIdToken(): Promise<string | undefined>;
  signOut(): Promise<void>;
};
