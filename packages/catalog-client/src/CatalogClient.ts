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
  Entity,
  CompoundEntityRef,
  parseEntityRef,
  stringifyEntityRef,
  stringifyLocationRef,
} from '@backstage/catalog-model';
import { ResponseError } from '@backstage/errors';
import {
  CATALOG_FILTER_EXISTS,
  AddLocationRequest,
  AddLocationResponse,
  CatalogApi,
  GetEntitiesRequest,
  GetEntitiesResponse,
  CatalogRequestOptions,
  GetEntityAncestorsRequest,
  GetEntityAncestorsResponse,
  Location,
  GetEntityFacetsRequest,
  GetEntityFacetsResponse,
  ValidateEntityResponse,
  GetEntitiesByRefsRequest,
  GetEntitiesByRefsResponse,
  QueryEntitiesRequest,
  EntityFilterQuery,
  QueryEntitiesResponse,
} from './types/api';
import { isQueryEntitiesInitialRequest } from './utils';
import { DefaultApiClient, TypedResponse } from './generated';

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

    const refCompare = (a: Entity, b: Entity) => {
      // in case field filtering is used, these fields might not be part of the response
      if (
        a.metadata?.name === undefined ||
        a.kind === undefined ||
        b.metadata?.name === undefined ||
        b.kind === undefined
      ) {
        return 0;
      }

      const aRef = stringifyEntityRef(a);
      const bRef = stringifyEntityRef(b);
      if (aRef < bRef) {
        return -1;
      }
      if (aRef > bRef) {
        return 1;
      }
      return 0;
    };

    return { items: entities.sort(refCompare) };
  }

  /**
   * {@inheritdoc CatalogApi.getEntitiesByRefs}
   */
  async getEntitiesByRefs(
    request: GetEntitiesByRefsRequest,
    options?: CatalogRequestOptions,
  ): Promise<GetEntitiesByRefsResponse> {
    const response = await this.apiClient.getEntitiesByRefs(
      {
        body: request,
      },
      options,
    );

    if (!response.ok) {
      throw await ResponseError.fromResponse(response);
    }

    const { items } = (await response.json()) as {
      items: Array<Entity | null>;
    };

    return { items: items.map(i => i ?? undefined) };
  }

  /**
   * {@inheritdoc CatalogApi.queryEntities}
   */
  async queryEntities(
    request: QueryEntitiesRequest = {},
    options?: CatalogRequestOptions,
  ): Promise<QueryEntitiesResponse> {
    const params: Partial<
      Parameters<typeof this.apiClient.getEntitiesByQuery>[0]['query']
    > = {};

    if (isQueryEntitiesInitialRequest(request)) {
      const {
        fields = [],
        filter,
        limit,
        orderFields,
        fullTextFilter,
      } = request;
      params.filter = this.getFilterValue(filter);

      if (limit !== undefined) {
        params.limit = limit;
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

    return this.apiClient
      .getEntitiesByQuery({ query: params }, options)
      .then(r => r.json());
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
      throw new Error(await response.text());
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
      throw new Error(await response.text());
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
