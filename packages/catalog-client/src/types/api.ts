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

import { CompoundEntityRef, Entity } from '@backstage/catalog-model';
import { SerializedError } from '@backstage/errors';

/**
 * This symbol can be used in place of a value when passed to filters in e.g.
 * {@link CatalogClient.getEntities}, to signify that you want to filter on the
 * presence of that key no matter what its value is.
 *
 * @public
 */
export const CATALOG_FILTER_EXISTS = Symbol.for(
  // Random UUID to ensure no collisions
  'CATALOG_FILTER_EXISTS_0e15b590c0b343a2bae3e787e84c2111',
);

/**
 * A key-value based filter expression for entities.
 *
 * @remarks
 *
 * Each key of a record is a dot-separated path into the entity structure, e.g.
 * `metadata.name`.
 *
 * The values are literal values to match against. As a value you can also pass
 * in the symbol `CATALOG_FILTER_EXISTS` (exported from this package), which
 * means that you assert on the existence of that key, no matter what its value
 * is.
 *
 * All matching of keys and values is case insensitive.
 *
 * If multiple filter sets are given as an array, then there is effectively an
 * OR between each filter set.
 *
 * Within one filter set, there is effectively an AND between the various keys.
 *
 * Within one key, if there are more than one value, then there is effectively
 * an OR between them.
 *
 * Example: For an input of
 *
 * ```
 * [
 *   { kind: ['API', 'Component'] },
 *   { 'metadata.name': 'a', 'metadata.namespace': 'b' }
 * ]
 * ```
 *
 * This effectively means
 *
 * ```
 * (kind = EITHER 'API' OR 'Component')
 * OR
 * (metadata.name = 'a' AND metadata.namespace = 'b' )
 * ```
 *
 * @public
 */
export type EntityFilterQuery =
  | Record<string, string | symbol | (string | symbol)[]>[]
  | Record<string, string | symbol | (string | symbol)[]>;

/**
 * A set of dot-separated paths into an entity's keys, showing what parts of an
 * entity to include in a response, and excluding all others.
 *
 * @remarks
 *
 * Example: For an input of `['kind', 'metadata.annotations']`, then response
 * objects will be shaped like
 *
 * ```
 * {
 *   "kind": "Component",
 *   "metadata": {
 *     "annotations": {
 *       "foo": "bar"
 *     }
 *   }
 * }
 * ```
 * @public
 */
export type EntityFieldsQuery = string[];

/**
 * Dot-separated field based ordering directives, controlling the sort order of
 * the output entities.
 *
 * @remarks
 *
 * Each field is a dot-separated path into an entity's keys. The order is either
 * ascending (`asc`, lexicographical order) or descending (`desc`, reverse
 * lexicographical order). The ordering is case insensitive.
 *
 * If more than one order directive is given, later directives have lower
 * precedence (they are applied only when directives of higher precedence have
 * equal values).
 *
 * Example:
 *
 * ```
 * [
 *   { field: 'kind', order: 'asc' },
 *   { field: 'metadata.name', order: 'desc' },
 * ]
 * ```
 *
 * This will order the output first by kind ascending, and then within each kind
 * (if there's more than one of a given kind) by their name descending.
 *
 * When given a field that does NOT exist on all entities in the result set,
 * those entities that do not have the field will always be sorted last in that
 * particular order step, no matter what the desired order was.
 *
 * @public
 */
export type EntityOrderQuery =
  | {
      field: string;
      order: 'asc' | 'desc';
    }
  | Array<{
      field: string;
      order: 'asc' | 'desc';
    }>;

/**
 * The request type for {@link CatalogClient.getEntities}.
 *
 * @public
 */
export interface GetEntitiesRequest {
  /**
   * If given, return only entities that match the given filter.
   */
  filter?: EntityFilterQuery;
  /**
   * If given, return only the parts of each entity that match the field
   * declarations.
   */
  fields?: EntityFieldsQuery;
  /**
   *If given, order the result set by those directives.
   */
  order?: EntityOrderQuery;
  /**
   * If given, skips over the first N items in the result set.
   */
  offset?: number;
  /**
   * If given, returns at most N items from the result set.
   */
  limit?: number;
  /**
   * If given, skips over all items before that cursor as returned by a previous
   * request.
   */
  after?: string;
}

/**
 * The response type for {@link CatalogClient.getEntities}.
 *
 * @public
 */
export interface GetEntitiesResponse {
  items: Entity[];
}

/**
 * The request type for {@link CatalogClient.getEntitiesByRefs}.
 *
 * @public
 */
export interface GetEntitiesByRefsRequest {
  /**
   * The list of entity refs to fetch.
   *
   * @remarks
   *
   * The returned list of entities will be in the same order as the refs, and
   * null will be returned in those positions that were not found.
   */
  entityRefs: string[];
  /**
   * If given, return only the parts of each entity that match the field
   * declarations.
   */
  fields?: EntityFieldsQuery | undefined;
}

/**
 * The response type for {@link CatalogClient.getEntitiesByRefs}.
 *
 * @public
 */
export interface GetEntitiesByRefsResponse {
  /**
   * The returned list of entities.
   *
   * @remarks
   *
   * The list will be in the same order as the refs given in the request, and
   * null will be returned in those positions that were not found.
   */
  items: Array<Entity | undefined>;
}

/**
 * The request type for {@link CatalogClient.getEntityAncestors}.
 *
 * @public
 */
export interface GetEntityAncestorsRequest {
  entityRef: string;
}

/**
 * The response type for {@link CatalogClient.getEntityAncestors}.
 *
 * @public
 */
export interface GetEntityAncestorsResponse {
  rootEntityRef: string;
  items: Array<{
    entity: Entity;
    parentEntityRefs: string[];
  }>;
}

/**
 * The request type for {@link CatalogClient.getEntityFacets}.
 *
 * @public
 */
export interface GetEntityFacetsRequest {
  /**
   * If given, return only entities that match the given patterns.
   *
   * @remarks
   *
   * If multiple filter sets are given as an array, then there is effectively an
   * OR between each filter set.
   *
   * Within one filter set, there is effectively an AND between the various
   * keys.
   *
   * Within one key, if there are more than one value, then there is effectively
   * an OR between them.
   *
   * Example: For an input of
   *
   * ```
   * [
   *   { kind: ['API', 'Component'] },
   *   { 'metadata.name': 'a', 'metadata.namespace': 'b' }
   * ]
   * ```
   *
   * This effectively means
   *
   * ```
   * (kind = EITHER 'API' OR 'Component')
   * OR
   * (metadata.name = 'a' AND metadata.namespace = 'b' )
   * ```
   *
   * Each key is a dot separated path in each object.
   *
   * As a value you can also pass in the symbol `CATALOG_FILTER_EXISTS`
   * (exported from this package), which means that you assert on the existence
   * of that key, no matter what its value is.
   */
  filter?: EntityFilterQuery;
  /**
   * Dot separated paths for the facets to extract from each entity.
   *
   * @remarks
   *
   * Example: For an input of `['kind', 'metadata.annotations.backstage.io/orphan']`, then the
   * response will be shaped like
   *
   * ```
   * {
   *   "facets": {
   *     "kind": [
   *       { "key": "Component", "count": 22 },
   *       { "key": "API", "count": 13 }
   *     ],
   *     "metadata.annotations.backstage.io/orphan": [
   *       { "key": "true", "count": 2 }
   *     ]
   *   }
   * }
   * ```
   */
  facets: string[];
}

/**
 * The response type for {@link CatalogClient.getEntityFacets}.
 *
 * @public
 */
export interface GetEntityFacetsResponse {
  /**
   * The computed facets, one entry per facet in the request.
   */
  facets: Record<string, Array<{ value: string; count: number }>>;
}

/**
 * Options you can pass into a catalog request for additional information.
 *
 * @public
 */
export interface CatalogRequestOptions {
  token?: string;
}

/**
 * Entity location for a specific entity.
 *
 * @public
 */
export type Location = {
  id: string;
  type: string;
  target: string;
};

/**
 * The request type for {@link CatalogClient.addLocation}.
 *
 * @public
 */
export type AddLocationRequest = {
  type?: string;
  target: string;
  /**
   * If set to true, the location will not be added, but the response will
   * contain the entities that match the given location.
   */
  dryRun?: boolean;
};

/**
 * The response type for {@link CatalogClient.addLocation}.
 *
 * @public
 */
export type AddLocationResponse = {
  location: Location;
  /**
   * The entities matching this location. Will only be filled in dryRun mode
   */
  entities: Entity[];
  /**
   * True, if the location exists. Will only be filled in dryRun mode
   */
  exists?: boolean;
};

/**
 * The response type for {@link CatalogClient.validateEntity}
 *
 * @public
 */
export type ValidateEntityResponse =
  | { valid: true }
  | { valid: false; errors: SerializedError[] };

/**
 * The request type for {@link CatalogClient.queryEntities}.
 *
 * @public
 */
export type QueryEntitiesRequest =
  | QueryEntitiesInitialRequest
  | QueryEntitiesCursorRequest;

/**
 * A request type for {@link CatalogClient.queryEntities}.
 * The method takes this type in an initial pagination request,
 * when requesting the first batch of entities.
 *
 * The properties filter, sortField, query and sortFieldOrder, are going
 * to be immutable for the entire lifecycle of the following requests.
 *
 * @public
 */
export type QueryEntitiesInitialRequest = {
  fields?: string[];
  limit?: number;
  filter?: EntityFilterQuery;
  orderFields?: EntityOrderQuery;
  fullTextFilter?: {
    term: string;
    fields?: string[];
  };
};

/**
 * A request type for {@link CatalogClient.queryEntities}.
 * The method takes this type in a pagination request, following
 * the initial request.
 *
 * @public
 */
export type QueryEntitiesCursorRequest = {
  fields?: string[];
  limit?: number;
  cursor: string;
};

/**
 * The response type for {@link CatalogClient.queryEntities}.
 *
 * @public
 */
export type QueryEntitiesResponse = {
  /* The list of entities for the current request */
  items: Entity[];
  /* The number of entities among all the requests */
  totalItems: number;
  pageInfo: {
    /* The cursor for the next batch of entities */
    nextCursor?: string;
    /* The cursor for the previous batch of entities */
    prevCursor?: string;
  };
};

/**
 * A client for interacting with the Backstage software catalog through its API.
 *
 * @public
 */
export interface CatalogApi {
  /**
   * Lists catalog entities.
   *
   * @param request - Request parameters
   * @param options - Additional options
   */
  getEntities(
    request?: GetEntitiesRequest,
    options?: CatalogRequestOptions,
  ): Promise<GetEntitiesResponse>;

  /**
   * Gets a batch of entities, by their entity refs.
   *
   * @remarks
   *
   * The output list of entities is of the same size and in the same order as
   * the requested list of entity refs. Entries that are not found are returned
   * as null.
   *
   * @param request - Request parameters
   * @param options - Additional options
   */
  getEntitiesByRefs(
    request: GetEntitiesByRefsRequest,
    options?: CatalogRequestOptions,
  ): Promise<GetEntitiesByRefsResponse>;

  /**
   * Gets paginated entities from the catalog.
   *
   * @remarks
   *
   * @example
   *
   * ```
   * const response = await catalogClient.queryEntities({
   *   filter: [{ kind: 'group' }],
   *   limit: 20,
   *   fullTextFilter: {
   *     term: 'A',
   *   }
   *   orderFields: { field: 'metadata.name' order: 'asc' },
   * });
   * ```
   *
   * this will match all entities of type group having a name starting
   * with 'A', ordered by name ascending.
   *
   * The response will contain a maximum of 20 entities. In case
   * more than 20 entities exist, the response will contain a nextCursor
   * property that can be used to fetch the next batch of entities.
   *
   * ```
   * const secondBatchResponse = await catalogClient
   *  .queryEntities({ cursor: response.nextCursor });
   * ```
   *
   * secondBatchResponse will contain the next batch of (maximum) 20 entities,
   * together with a prevCursor property, useful to fetch the previous batch.
   *
   * @public
   *
   * @param request - Request parameters
   * @param options - Additional options
   */
  queryEntities(
    request?: QueryEntitiesRequest,
    options?: CatalogRequestOptions,
  ): Promise<QueryEntitiesResponse>;

  /**
   * Gets entity ancestor information, i.e. the hierarchy of parent entities
   * whose processing resulted in a given entity appearing in the catalog.
   *
   * @param request - Request parameters
   * @param options - Additional options
   */
  getEntityAncestors(
    request: GetEntityAncestorsRequest,
    options?: CatalogRequestOptions,
  ): Promise<GetEntityAncestorsResponse>;

  /**
   * Gets a single entity from the catalog by its ref (kind, namespace, name)
   * triplet.
   *
   * @param entityRef - A complete entity ref, either on string or compound form
   * @param options - Additional options
   * @returns The matching entity, or undefined if there was no entity with that ref
   */
  getEntityByRef(
    entityRef: string | CompoundEntityRef,
    options?: CatalogRequestOptions,
  ): Promise<Entity | undefined>;

  /**
   * Removes a single entity from the catalog by entity UID.
   *
   * @param uid - An entity UID
   * @param options - Additional options
   */
  removeEntityByUid(
    uid: string,
    options?: CatalogRequestOptions,
  ): Promise<void>;

  /**
   * Refreshes (marks for reprocessing) an entity in the catalog.
   *
   * @param entityRef - An entity ref on string form (e.g.
   *        'component/default:my-component')
   * @param options - Additional options
   */
  refreshEntity(
    entityRef: string,
    options?: CatalogRequestOptions,
  ): Promise<void>;

  /**
   * Gets a summary of field facets of entities in the catalog.
   *
   * @param request - Request parameters
   * @param options - Additional options
   */
  getEntityFacets(
    request: GetEntityFacetsRequest,
    options?: CatalogRequestOptions,
  ): Promise<GetEntityFacetsResponse>;

  // Locations

  /**
   * Gets a registered location by its ID.
   *
   * @param id - A location ID
   * @param options - Additional options
   */
  getLocationById(
    id: string,
    options?: CatalogRequestOptions,
  ): Promise<Location | undefined>;

  /**
   * Gets a registered location by its ref.
   *
   * @param locationRef - A location ref, e.g. "url:https://github.com/..."
   * @param options - Additional options
   */
  getLocationByRef(
    locationRef: string,
    options?: CatalogRequestOptions,
  ): Promise<Location | undefined>;

  /**
   * Registers a new location.
   *
   * @param location - Request parameters
   * @param options - Additional options
   */
  addLocation(
    location: AddLocationRequest,
    options?: CatalogRequestOptions,
  ): Promise<AddLocationResponse>;

  /**
   * Removes a registered Location by its ID.
   *
   * @param id - A location ID
   * @param options - Additional options
   */
  removeLocationById(
    id: string,
    options?: CatalogRequestOptions,
  ): Promise<void>;

  /**
   * Gets a location associated with an entity.
   *
   * @param entityRef - A complete entity ref, either on string or compound form
   * @param options - Additional options
   */
  getLocationByEntity(
    entityRef: string | CompoundEntityRef,
    options?: CatalogRequestOptions,
  ): Promise<Location | undefined>;

  /**
   * Validate entity and its location.
   *
   * @param entity - Entity to validate
   * @param locationRef - Location ref in format `url:http://example.com/file`
   */
  validateEntity(
    entity: Entity,
    locationRef: string,
    options?: CatalogRequestOptions,
  ): Promise<ValidateEntityResponse>;
}
