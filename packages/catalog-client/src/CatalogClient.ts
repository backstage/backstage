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
import crossFetch from 'cross-fetch';
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
} from './types/api';
import { DiscoveryApi } from './types/discovery';
import { FetchApi } from './types/fetch';

/**
 * A frontend and backend compatible client for communicating with the Backstage
 * software catalog.
 *
 * @public
 */
export class CatalogClient implements CatalogApi {
  private readonly discoveryApi: DiscoveryApi;
  private readonly fetchApi: FetchApi;

  constructor(options: {
    discoveryApi: { getBaseUrl(pluginId: string): Promise<string> };
    fetchApi?: { fetch: typeof fetch };
  }) {
    this.discoveryApi = options.discoveryApi;
    this.fetchApi = options.fetchApi || { fetch: crossFetch };
  }

  /**
   * {@inheritdoc CatalogApi.getEntityAncestors}
   */
  async getEntityAncestors(
    request: GetEntityAncestorsRequest,
    options?: CatalogRequestOptions,
  ): Promise<GetEntityAncestorsResponse> {
    const { kind, namespace, name } = parseEntityRef(request.entityRef);
    return await this.requestRequired(
      'GET',
      `/entities/by-name/${encodeURIComponent(kind)}/${encodeURIComponent(
        namespace,
      )}/${encodeURIComponent(name)}/ancestry`,
      options,
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
      'GET',
      `/locations/${encodeURIComponent(id)}`,
      options,
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
    const params: string[] = [];

    // filter param can occur multiple times, for example
    // /api/catalog/entities?filter=metadata.name=wayback-search,kind=component&filter=metadata.name=www-artist,kind=component'
    // the "outer array" defined by `filter` occurrences corresponds to "anyOf" filters
    // the "inner array" defined within a `filter` param corresponds to "allOf" filters
    for (const filterItem of [filter].flat()) {
      const filterParts: string[] = [];
      for (const [key, value] of Object.entries(filterItem)) {
        for (const v of [value].flat()) {
          if (v === CATALOG_FILTER_EXISTS) {
            filterParts.push(encodeURIComponent(key));
          } else if (typeof v === 'string') {
            filterParts.push(
              `${encodeURIComponent(key)}=${encodeURIComponent(v)}`,
            );
          }
        }
      }

      if (filterParts.length) {
        params.push(`filter=${filterParts.join(',')}`);
      }
    }

    if (fields.length) {
      params.push(`fields=${fields.map(encodeURIComponent).join(',')}`);
    }

    if (order) {
      for (const directive of [order].flat()) {
        if (directive) {
          params.push(
            `order=${encodeURIComponent(directive.order)}:${encodeURIComponent(
              directive.field,
            )}`,
          );
        }
      }
    }

    if (offset !== undefined) {
      params.push(`offset=${offset}`);
    }
    if (limit !== undefined) {
      params.push(`limit=${limit}`);
    }
    if (after !== undefined) {
      params.push(`after=${encodeURIComponent(after)}`);
    }

    const query = params.length ? `?${params.join('&')}` : '';
    const entities: Entity[] = await this.requestRequired(
      'GET',
      `/entities${query}`,
      options,
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
    const body: any = { entityRefs: request.entityRefs };
    if (request.fields?.length) {
      body.fields = request.fields;
    }

    const baseUrl = await this.discoveryApi.getBaseUrl('catalog');
    const url = `${baseUrl}/entities/by-refs`;

    const response = await this.fetchApi.fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...(options?.token && { Authorization: `Bearer ${options?.token}` }),
      },
      method: 'POST',
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      throw await ResponseError.fromResponse(response);
    }

    const { items } = await response.json();

    return { items };
  }

  /**
   * {@inheritdoc CatalogApi.getEntityByRef}
   */
  async getEntityByRef(
    entityRef: string | CompoundEntityRef,
    options?: CatalogRequestOptions,
  ): Promise<Entity | undefined> {
    const { kind, namespace, name } = parseEntityRef(entityRef);
    return this.requestOptional(
      'GET',
      `/entities/by-name/${encodeURIComponent(kind)}/${encodeURIComponent(
        namespace,
      )}/${encodeURIComponent(name)}`,
      options,
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
      'GET',
      `/entities/by-name/${encodeURIComponent(kind)}/${encodeURIComponent(
        namespace,
      )}/${encodeURIComponent(name)}`,
      options,
    );
  }

  /**
   * {@inheritdoc CatalogApi.refreshEntity}
   */
  async refreshEntity(entityRef: string, options?: CatalogRequestOptions) {
    const response = await this.fetchApi.fetch(
      `${await this.discoveryApi.getBaseUrl('catalog')}/refresh`,
      {
        headers: {
          'Content-Type': 'application/json',
          ...(options?.token && { Authorization: `Bearer ${options?.token}` }),
        },
        method: 'POST',
        body: JSON.stringify({ entityRef }),
      },
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
    const params: string[] = [];

    // filter param can occur multiple times, for example
    // /api/catalog/entities?filter=metadata.name=wayback-search,kind=component&filter=metadata.name=www-artist,kind=component'
    // the "outer array" defined by `filter` occurrences corresponds to "anyOf" filters
    // the "inner array" defined within a `filter` param corresponds to "allOf" filters
    for (const filterItem of [filter].flat()) {
      const filterParts: string[] = [];
      for (const [key, value] of Object.entries(filterItem)) {
        for (const v of [value].flat()) {
          if (v === CATALOG_FILTER_EXISTS) {
            filterParts.push(encodeURIComponent(key));
          } else if (typeof v === 'string') {
            filterParts.push(
              `${encodeURIComponent(key)}=${encodeURIComponent(v)}`,
            );
          }
        }
      }

      if (filterParts.length) {
        params.push(`filter=${filterParts.join(',')}`);
      }
    }

    for (const facet of facets) {
      params.push(`facet=${encodeURIComponent(facet)}`);
    }

    const query = params.length ? `?${params.join('&')}` : '';
    return await this.requestOptional('GET', `/entity-facets${query}`, options);
  }

  /**
   * {@inheritdoc CatalogApi.addLocation}
   */
  async addLocation(
    request: AddLocationRequest,
    options?: CatalogRequestOptions,
  ): Promise<AddLocationResponse> {
    const { type = 'url', target, dryRun } = request;

    const response = await this.fetchApi.fetch(
      `${await this.discoveryApi.getBaseUrl('catalog')}/locations${
        dryRun ? '?dryRun=true' : ''
      }`,
      {
        headers: {
          'Content-Type': 'application/json',
          ...(options?.token && { Authorization: `Bearer ${options?.token}` }),
        },
        method: 'POST',
        body: JSON.stringify({ type, target }),
      },
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
    const all: { data: Location }[] = await this.requestRequired(
      'GET',
      '/locations',
      options,
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
      'DELETE',
      `/locations/${encodeURIComponent(id)}`,
      options,
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
      'DELETE',
      `/entities/by-uid/${encodeURIComponent(uid)}`,
      options,
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
    const response = await this.fetchApi.fetch(
      `${await this.discoveryApi.getBaseUrl('catalog')}/validate-entity`,
      {
        headers: {
          'Content-Type': 'application/json',
          ...(options?.token && { Authorization: `Bearer ${options?.token}` }),
        },
        method: 'POST',
        body: JSON.stringify({ entity, location: locationRef }),
      },
    );

    if (response.ok) {
      return {
        valid: true,
      };
    }

    if (response.status !== 400) {
      throw await ResponseError.fromResponse(response);
    }

    const { errors = [] } = await response.json();

    return {
      valid: false,
      errors,
    };
  }

  //
  // Private methods
  //

  private async requestIgnored(
    method: string,
    path: string,
    options?: CatalogRequestOptions,
  ): Promise<void> {
    const url = `${await this.discoveryApi.getBaseUrl('catalog')}${path}`;
    const headers: Record<string, string> = options?.token
      ? { Authorization: `Bearer ${options.token}` }
      : {};
    const response = await this.fetchApi.fetch(url, { method, headers });

    if (!response.ok) {
      throw await ResponseError.fromResponse(response);
    }
  }

  private async requestRequired(
    method: string,
    path: string,
    options?: CatalogRequestOptions,
  ): Promise<any> {
    const url = `${await this.discoveryApi.getBaseUrl('catalog')}${path}`;
    const headers: Record<string, string> = options?.token
      ? { Authorization: `Bearer ${options.token}` }
      : {};
    const response = await this.fetchApi.fetch(url, { method, headers });

    if (!response.ok) {
      throw await ResponseError.fromResponse(response);
    }

    return await response.json();
  }

  private async requestOptional(
    method: string,
    path: string,
    options?: CatalogRequestOptions,
  ): Promise<any | undefined> {
    const url = `${await this.discoveryApi.getBaseUrl('catalog')}${path}`;
    const headers: Record<string, string> = options?.token
      ? { Authorization: `Bearer ${options.token}` }
      : {};
    const response = await this.fetchApi.fetch(url, { method, headers });

    if (!response.ok) {
      if (response.status === 404) {
        return undefined;
      }
      throw await ResponseError.fromResponse(response);
    }

    return await response.json();
  }
}
