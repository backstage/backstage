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
import { createApiRef } from '@backstage/core';
import { Entity, Location } from '@backstage/catalog-model';

export const catalogApiRef = createApiRef<CatalogApi>({
  id: 'plugin.catalog.service',
  description:
    'Used by the Catalog plugin to make requests to accompanying backend',
});

export type EntityCompoundName = {
  kind: string;
  namespace?: string;
  name: string;
};

export interface CatalogApi {
  getLocationById(id: String): Promise<Location | undefined>;
  getEntityByName(
    compoundName: EntityCompoundName,
  ): Promise<Entity | undefined>;
  getEntities(filter?: Record<string, string>): Promise<Entity[]>;
  addLocation(type: string, target: string): Promise<AddLocationResponse>;
  getLocationByEntity(entity: Entity): Promise<Location | undefined>;
  removeEntityByUid(uid: string): Promise<void>;
}

export type AddLocationResponse = { location: Location; entities: Entity[] };
