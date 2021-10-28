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

import { Entity, EntityName, Location } from '@backstage/catalog-model';

/**
 * A Symbol to define if a catalog filter exists or not.
 *
 * @public
 */
export const CATALOG_FILTER_EXISTS = Symbol('CATALOG_FILTER_EXISTS');

/**
 * A request type for retrieving catalog Entities.
 *
 * @public
 */
export type CatalogEntitiesRequest = {
  filter?:
    | Record<string, string | symbol | (string | symbol)[]>[]
    | Record<string, string | symbol | (string | symbol)[]>
    | undefined;
  fields?: string[] | undefined;
};

/**
 * A request type for Catalog Entity Ancestor information.
 *
 * @public
 */
export type CatalogEntityAncestorsRequest = {
  entityRef: string;
};

/**
 * A response type for Catalog Entity Ancestor information.
 *
 * @public
 */
export type CatalogEntityAncestorsResponse = {
  root: EntityName;
  items: { entity: Entity; parents: EntityName[] }[];
};

/**
 * A response type for the result of a catalog operation in list form.
 *
 * @public
 */
export type CatalogListResponse<T> = {
  items: T[];
};

/**
 * Options you can pass into a catalog request for additional information.
 *
 * @public
 */
export type CatalogRequestOptions = {
  token?: string;
};

/**
 * Public functions for interacting with the Catalog API.
 *
 * @public
 */
export interface CatalogApi {
  /**
   * Gets the Entities from the catalog based on your request and options.
   *
   * @param request - An object with your filters and fields.
   * @param options - An object with your preferred options.
   *
   * @returns A CatalogListResponse with items typed Catalog Model Entity.
   *
   */
  getEntities(
    request?: CatalogEntitiesRequest,
    options?: CatalogRequestOptions,
  ): Promise<CatalogListResponse<Entity>>;
  /**
   * Gets the Entity ancestor information from the catalog based on your request and options.
   *
   * @param request - An object with your filters and fields.
   * @param options - An object with your preferred options.
   *
   * @returns A CatalogEntityAncestorsResponse.
   */
  getEntityAncestors(
    request: CatalogEntityAncestorsRequest,
    options?: CatalogRequestOptions,
  ): Promise<CatalogEntityAncestorsResponse>;
  /**
   * Gets a single Entity from the catalog by Entity name.
   *
   * @param name - A complete Entity name, with the full kind-namespace-name triplet.
   * @param options - An object with your preferred options.
   *
   * @returns A {@link catalog-model#Entity}.
   */
  getEntityByName(
    name: EntityName,
    options?: CatalogRequestOptions,
  ): Promise<Entity | undefined>;
  /**
   * Removes a single Entity from the catalog by Entity UID.
   *
   * @param uid - A string of the Entity UID.
   * @param options - An object with your preferred options.
   *
   */
  removeEntityByUid(
    uid: string,
    options?: CatalogRequestOptions,
  ): Promise<void>;
  /**
   * Refreshes an Entity in the catalog.
   *
   * @param entityRef - A string in the form of 'Kind/default:foo'.
   * @param options - An object with your preferred options.
   *
   */
  refreshEntity(
    entityRef: string,
    options?: CatalogRequestOptions,
  ): Promise<void>;

  // Locations
  /**
   * Gets a Location object by ID from the catalog.
   *
   * @param id - A string in of the Location Id.
   * @param options - An object with your preferred options.
   *
   * @returns A {@link catalog-model#Location_2}.
   */
  getLocationById(
    id: string,
    options?: CatalogRequestOptions,
  ): Promise<Location | undefined>;
  /**
   * Gets origin location by Entity.
   *
   * @param entity - An {@link catalog-model#Entity}.
   * @param options - An object with your preferred options.
   *
   * @returns A {@link catalog-model#Location_2}.
   */
  getOriginLocationByEntity(
    entity: Entity,
    options?: CatalogRequestOptions,
  ): Promise<Location | undefined>;
  /**
   * Gets Location by Entity.
   *
   * @param entity - An {@link catalog-model#Entity}.
   * @param options - An object with your preferred options.
   *
   * @returns A {@link catalog-model#Location_2}.
   */
  getLocationByEntity(
    entity: Entity,
    options?: CatalogRequestOptions,
  ): Promise<Location | undefined>;
  /**
   * Adds a Location.
   *
   * @param location - A request type for adding a Location to the catalog.
   * @param options - An object with your preferred options.
   *
   * @returns A AddLocationResponse.
   */
  addLocation(
    location: AddLocationRequest,
    options?: CatalogRequestOptions,
  ): Promise<AddLocationResponse>;
  /**
   * Removes a Location by Id.
   *
   * @param id - A string in of the Location Id.
   * @param options - An object with your preferred options.
   *
   */
  removeLocationById(
    id: string,
    options?: CatalogRequestOptions,
  ): Promise<void>;
}

/**
 * A request type for adding a Location to the catalog.
 *
 * @public
 */
export type AddLocationRequest = {
  type?: string;
  target: string;
  dryRun?: boolean;
  presence?: 'optional' | 'required';
};

/**
 * A response type for adding a Location to the catalog.
 *
 * @public
 */
export type AddLocationResponse = {
  location: Location;
  entities: Entity[];
  // Exists is only set in DryRun mode.
  exists?: boolean;
};
