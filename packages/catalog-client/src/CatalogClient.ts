/*
 * Copyright 2020 The Backstage Authors
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
  CompoundEntityRef,
  Entity,
  parseEntityRef,
  stringifyLocationRef,
} from '@backstage/catalog-model';
import { ResponseError } from '@backstage/errors';
import {
  AddLocationRequest,
  AddLocationResponse,
  CATALOG_FILTER_EXISTS,
  CatalogApi,
  CatalogRequestOptions,
  EntityFilterQuery,
  GetEntitiesByRefsRequest,
  GetEntitiesByRefsResponse,
  GetEntitiesRequest,
  GetEntitiesResponse,
  GetEntityAncestorsRequest,
  GetEntityAncestorsResponse,
  GetEntityFacetsRequest,
  GetEntityFacetsResponse,
  GetLocationsResponse,
  Location,
  QueryEntitiesRequest,
  QueryEntitiesResponse,
  QueryLocationsInitialRequest,
  QueryLocationsRequest,
  QueryLocationsResponse,
  StreamEntitiesRequest,
  ValidateEntityResponse,
} from './types/api';
import {
  isQueryEntitiesInitialRequest,
  splitRefsIntoChunks,
  cursorContainsQuery,
} from './utils';
import {
  DefaultApiClient,
  GetEntitiesByQuery,
  GetLocationsByQueryRequest,
  QueryEntitiesByPredicateRequest,
  TypedResponse,
} from './schema/openapi';
import type {
  AnalyzeLocationRequest,
  AnalyzeLocationResponse,
} from '@backstage/plugin-catalog-common';
import {
  DEFAULT_STREAM_ENTITIES_LIMIT,
  DEFAULT_STREAM_LOCATIONS_LIMIT,
} from './constants';

/**
 * A frontend and backend compatible client for communicating with the Backstage
 * software catalog.
 *
 * @public
 */
export class CatalogClient implements CatalogApi {
  private readonly apiClient: DefaultApiClient;

  constructor(options: {
    discoveryApi: { getBaseUrl(pluginId: string): Promise<string> };
    fetchApi?: { fetch: typeof fetch };
  }) {
    this.apiClient = new DefaultApiClient(options);
  }

  /**
   * {@inheritdoc CatalogApi.getEntityAncestors}
   */
  async getEntityAncestors(
    request: GetEntityAncestorsRequest,
    options?: CatalogRequestOptions,
  ): Promise<GetEntityAncestorsResponse> {
    return await this.requestRequired(
      await this.apiClient.getEntityAncestryByName(
        { path: parseEntityRef(request.entityRef) },
        options,
      ),
    );
  }

  /**
   * {@inheritdoc CatalogApi.getLocations}
   */
  async getLocations(
    request?: {},
    options?: CatalogRequestOptions,
  ): Promise<GetLocationsResponse> {
    const res = await this.requestRequired(
      await this.apiClient.getLocations(request ?? {}, options),
    );
    return {
      items: res.map(item => item.data),
    };
  }

  /**
   * {@inheritdoc CatalogApi.queryLocations}
   */
  async queryLocations(
    request?: QueryLocationsRequest,
    options?: CatalogRequestOptions,
  ): Promise<QueryLocationsResponse> {
    const res = await this.requestRequired(
      await this.apiClient.getLocationsByQuery(
        { body: (request ?? {}) as unknown as GetLocationsByQueryRequest },
        options,
      ),
    );
    return {
      items: res.items,
      totalItems: res.totalItems,
      pageInfo: res.pageInfo,
    };
  }

  /**
   * {@inheritdoc CatalogApi.streamLocations}
   */
  async *streamLocations(
    request?: QueryLocationsInitialRequest,
    options?: CatalogRequestOptions,
  ): AsyncIterable<Location[]> {
    let response = await this.queryLocations(
      { limit: DEFAULT_STREAM_LOCATIONS_LIMIT, ...request },
      options,
    );
    if (response.items.length) {
      yield response.items;
    }

    while (response.pageInfo.nextCursor) {
      response = await this.queryLocations(
        { cursor: response.pageInfo.nextCursor },
        options,
      );
      if (response.items.length) {
        yield response.items;
      }
    }
  }

  /**
   * {@inheritdoc CatalogApi.getLocationById}
   */
  async getLocationById(
    id: string,
    options?: CatalogRequestOptions,
  ): Promise<Location | undefined> {
    return await this.requestOptional(
      await this.apiClient.getLocation({ path: { id } }, options),
    );
  }

  /**
   * {@inheritdoc CatalogApi.getLocationByEntity}
   */
  async getLocationByEntity(
    entityRef: CompoundEntityRef | string,
    options?: CatalogRequestOptions,
  ): Promise<Location | undefined> {
    return await this.requestOptional(
      await this.apiClient.getLocationByEntity(
        { path: parseEntityRef(entityRef) },
        options,
      ),
    );
  }

  /**
   * {@inheritdoc CatalogApi.getEntities}
   */
  async getEntities(
    request?: GetEntitiesRequest,
    options?: CatalogRequestOptions,
  ): Promise<GetEntitiesResponse> {
    const {
      filter = [],
      fields = [],
      order,
      offset,
      limit,
      after,
    } = request ?? {};
    const encodedOrder = [];
    if (order) {
      for (const directive of [order].flat()) {
        if (directive) {
          encodedOrder.push(`${directive.order}:${directive.field}`);
        }
      }
    }

    const entities = await this.requestRequired(
      await this.apiClient.getEntities(
        {
          query: {
            fields,
            limit,
            filter: this.getFilterValue(filter),
            offset,
            after,
            order: order ? encodedOrder : undefined,
          },
        },
        options,
      ),
    );
    return { items: entities };
  }

  /**
   * {@inheritdoc CatalogApi.getEntitiesByRefs}
   */
  async getEntitiesByRefs(
    request: GetEntitiesByRefsRequest,
    options?: CatalogRequestOptions,
  ): Promise<GetEntitiesByRefsResponse> {
    const getOneChunk = async (refs: string[]) => {
      const response = await this.apiClient.getEntitiesByRefs(
        {
          body: { entityRefs: refs, fields: request.fields },
          query: { filter: this.getFilterValue(request.filter) },
        },
        options,
      );
      if (!response.ok) {
        throw await ResponseError.fromResponse(response);
      }
      const body = (await response.json()) as {
        items: Array<Entity | null>;
      };
      return body.items.map(i => i ?? undefined);
    };

    let result: Array<Entity | undefined> | undefined;
    for (const refs of splitRefsIntoChunks(request.entityRefs)) {
      const entities = await getOneChunk(refs);
      if (!result) {
        result = entities;
      } else {
        result.push(...entities);
      }
    }

    return { items: result ?? [] };
  }

  /**
   * {@inheritdoc CatalogApi.queryEntities}
   */
  async queryEntities(
    request: QueryEntitiesRequest = {},
    options?: CatalogRequestOptions,
  ): Promise<QueryEntitiesResponse> {
    const isInitialRequest = isQueryEntitiesInitialRequest(request);

    // Validate that filter and query are mutually exclusive
    if (isInitialRequest && request.filter && request.query) {
      throw new Error(
        'Cannot specify both "filter" and "query" in the same request. Use "filter" for traditional key-value filtering or "query" for predicate-based filtering.',
      );
    }

    // Route to POST endpoint if query predicate is provided (initial request)
    if (isInitialRequest && request.query) {
      return this.queryEntitiesByPredicate(request, options);
    }

    // Route to POST endpoint if cursor contains a query predicate (pagination)
    // TODO(freben): It's costly and non-opaque to have to introspect the cursor
    // like this. It should be refactored in the future to not need this.
    // Suggestion: make the GET and POST endpoints understand the same cursor
    // format, and pick which one to call ONLY based on whether the cursor size
    // risks hitting url length limits
    if (!isInitialRequest && cursorContainsQuery(request.cursor)) {
      return this.queryEntitiesByPredicate(request, options);
    }

    const params: Partial<GetEntitiesByQuery['query']> = {};

    if (isInitialRequest) {
      const {
        fields = [],
        filter,
        limit,
        offset,
        orderFields,
        fullTextFilter,
      } = request;
      params.filter = this.getFilterValue(filter);

      if (limit !== undefined) {
        params.limit = limit;
      }
      if (offset !== undefined) {
        params.offset = offset;
      }
      if (orderFields !== undefined) {
        params.orderField = (
          Array.isArray(orderFields) ? orderFields : [orderFields]
        ).map(({ field, order }) => `${field},${order}`);
      }
      if (fields.length) {
        params.fields = fields;
      }

      const normalizedFullTextFilterTerm = fullTextFilter?.term?.trim();
      if (normalizedFullTextFilterTerm) {
        params.fullTextFilterTerm = normalizedFullTextFilterTerm;
      }
      if (fullTextFilter?.fields?.length) {
        params.fullTextFilterFields = fullTextFilter.fields;
      }
    } else {
      const { fields = [], limit, cursor } = request;

      params.cursor = cursor;
      if (limit !== undefined) {
        params.limit = limit;
      }
      if (fields.length) {
        params.fields = fields;
      }
    }

    return this.requestRequired(
      await this.apiClient.getEntitiesByQuery({ query: params }, options),
    );
  }

  /**
   * Query entities using predicate-based filters (POST endpoint).
   * @internal
   */
  private async queryEntitiesByPredicate(
    request: QueryEntitiesRequest,
    options?: CatalogRequestOptions,
  ): Promise<QueryEntitiesResponse> {
    const body: QueryEntitiesByPredicateRequest = {};

    if (isQueryEntitiesInitialRequest(request)) {
      const { query, limit, orderFields, fullTextFilter, fields } = request;
      if (query && typeof query === 'object') {
        body.query = query;
      }
      if (limit !== undefined) {
        body.limit = limit;
      }
      if (orderFields !== undefined) {
        body.orderBy = [orderFields].flat();
      }
      if (fullTextFilter) {
        body.fullTextFilter = fullTextFilter;
      }
      if (fields?.length) {
        body.fields = fields;
      }
    } else {
      body.cursor = request.cursor;
      if (request.limit !== undefined) {
        body.limit = request.limit;
      }
      if (request.fields?.length) {
        body.fields = request.fields;
      }
    }

    const res = await this.requestRequired(
      await this.apiClient.queryEntitiesByPredicate({ body }, options),
    );

    return {
      items: res.items,
      totalItems: res.totalItems,
      pageInfo: res.pageInfo,
    };
  }

  /**
   * {@inheritdoc CatalogApi.getEntityByRef}
   */
  async getEntityByRef(
    entityRef: string | CompoundEntityRef,
    options?: CatalogRequestOptions,
  ): Promise<Entity | undefined> {
    return this.requestOptional(
      await this.apiClient.getEntityByName(
        {
          path: parseEntityRef(entityRef),
        },
        options,
      ),
    );
  }

  // NOTE(freben): When we deprecate getEntityByName from the interface, we may
  // still want to leave this implementation in place for quite some time
  // longer, to minimize the risk for breakages. Suggested date for removal:
  // August 2022
  /**
   * @deprecated Use getEntityByRef instead
   */
  async getEntityByName(
    compoundName: CompoundEntityRef,
    options?: CatalogRequestOptions,
  ): Promise<Entity | undefined> {
    const { kind, namespace = 'default', name } = compoundName;
    return this.requestOptional(
      await this.apiClient.getEntityByName(
        { path: { kind, namespace, name } },
        options,
      ),
    );
  }

  /**
   * {@inheritdoc CatalogApi.refreshEntity}
   */
  async refreshEntity(entityRef: string, options?: CatalogRequestOptions) {
    const response = await this.apiClient.refreshEntity(
      { body: { entityRef } },
      options,
    );

    if (response.status !== 200) {
      throw await ResponseError.fromResponse(response);
    }
  }

  /**
   * {@inheritdoc CatalogApi.getEntityFacets}
   */
  async getEntityFacets(
    request: GetEntityFacetsRequest,
    options?: CatalogRequestOptions,
  ): Promise<GetEntityFacetsResponse> {
    const { filter = [], facets } = request;
    return await this.requestOptional(
      await this.apiClient.getEntityFacets(
        {
          query: { facet: facets, filter: this.getFilterValue(filter) },
        },
        options,
      ),
    );
  }

  /**
   * {@inheritdoc CatalogApi.addLocation}
   */
  async addLocation(
    request: AddLocationRequest,
    options?: CatalogRequestOptions,
  ): Promise<AddLocationResponse> {
    const { type = 'url', target, dryRun } = request;

    const response = await this.apiClient.createLocation(
      {
        body: { type, target },
        query: { dryRun: dryRun ? 'true' : undefined },
      },
      options,
    );

    if (response.status !== 201) {
      throw await ResponseError.fromResponse(response);
    }

    const { location, entities, exists } = await response.json();

    if (!location) {
      throw new Error(`Location wasn't added: ${target}`);
    }

    return {
      location,
      entities,
      exists,
    };
  }

  /**
   * {@inheritdoc CatalogApi.getLocationByRef}
   */
  async getLocationByRef(
    locationRef: string,
    options?: CatalogRequestOptions,
  ): Promise<Location | undefined> {
    const all = await this.requestRequired(
      await this.apiClient.getLocations({}, options),
    );
    return all
      .map(r => r.data)
      .find(l => locationRef === stringifyLocationRef(l));
  }

  /**
   * {@inheritdoc CatalogApi.removeLocationById}
   */
  async removeLocationById(
    id: string,
    options?: CatalogRequestOptions,
  ): Promise<void> {
    await this.requestIgnored(
      await this.apiClient.deleteLocation({ path: { id } }, options),
    );
  }

  /**
   * {@inheritdoc CatalogApi.removeEntityByUid}
   */
  async removeEntityByUid(
    uid: string,
    options?: CatalogRequestOptions,
  ): Promise<void> {
    await this.requestIgnored(
      await this.apiClient.deleteEntityByUid({ path: { uid } }, options),
    );
  }

  /**
   * {@inheritdoc CatalogApi.validateEntity}
   */
  async validateEntity(
    entity: Entity,
    locationRef: string,
    options?: CatalogRequestOptions,
  ): Promise<ValidateEntityResponse> {
    const response = await this.apiClient.validateEntity(
      { body: { entity, location: locationRef } },
      options,
    );

    if (response.ok) {
      return {
        valid: true,
      };
    }

    if (response.status !== 400) {
      throw await ResponseError.fromResponse(response);
    }

    const { errors = [] } = (await response.json()) as any;

    return {
      valid: false,
      errors,
    };
  }

  /**
   * {@inheritdoc CatalogApi.analyzeLocation}
   */
  async analyzeLocation(
    request: AnalyzeLocationRequest,
    options?: CatalogRequestOptions,
  ): Promise<AnalyzeLocationResponse> {
    const response = await this.apiClient.analyzeLocation(
      {
        body: request,
      },
      options,
    );

    if (response.status !== 200) {
      throw await ResponseError.fromResponse(response);
    }

    return response.json() as Promise<AnalyzeLocationResponse>;
  }

  /**
   * {@inheritdoc CatalogApi.streamEntities}
   */
  async *streamEntities(
    request?: StreamEntitiesRequest,
    options?: CatalogRequestOptions,
  ): AsyncIterable<Entity[]> {
    let cursor: string | undefined = undefined;
    const limit = request?.pageSize ?? DEFAULT_STREAM_ENTITIES_LIMIT;
    do {
      const res = await this.queryEntities(
        cursor ? { ...request, cursor, limit } : { ...request, limit },
        options,
      );

      yield res.items;

      cursor = res.pageInfo.nextCursor;
    } while (cursor);
  }

  //
  // Private methods
  //

  private async requestIgnored(response: Response): Promise<void> {
    if (!response.ok) {
      throw await ResponseError.fromResponse(response);
    }
  }

  private async requestRequired<T>(response: TypedResponse<T>): Promise<T> {
    if (!response.ok) {
      throw await ResponseError.fromResponse(response);
    }

    return response.json();
  }

  private async requestOptional(response: Response): Promise<any | undefined> {
    if (!response.ok) {
      if (response.status === 404) {
        return undefined;
      }
      throw await ResponseError.fromResponse(response);
    }

    return await response.json();
  }

  private getFilterValue(filter: EntityFilterQuery = []) {
    const filters: string[] = [];
    // filter param can occur multiple times, for example
    // /api/catalog/entities?filter=metadata.name=wayback-search,kind=component&filter=metadata.name=www-artist,kind=component'
    // the "outer array" defined by `filter` occurrences corresponds to "anyOf" filters
    // the "inner array" defined within a `filter` param corresponds to "allOf" filters
    for (const filterItem of [filter].flat()) {
      const filterParts: string[] = [];
      for (const [key, value] of Object.entries(filterItem)) {
        for (const v of [value].flat()) {
          if (v === CATALOG_FILTER_EXISTS) {
            filterParts.push(key);
          } else if (typeof v === 'string') {
            filterParts.push(`${key}=${v}`);
          }
        }
      }

      if (filterParts.length) {
        filters.push(filterParts.join(','));
      }
    }
    return filters;
  }
}
