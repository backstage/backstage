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
  ANNOTATION_LOCATION,
  ANNOTATION_ORIGIN_LOCATION,
  Entity,
  EntityName,
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
    const { filter = [], fields = [], offset, limit, after } = request ?? {};
    const filterItems = [filter].flat();
    const params: string[] = [];

    // filter param can occur multiple times, for example
    // /api/catalog/entities?filter=metadata.name=wayback-search,kind=component&filter=metadata.name=www-artist,kind=component'
    // the "outer array" defined by `filter` occurrences corresponds to "anyOf" filters
    // the "inner array" defined within a `filter` param corresponds to "allOf" filters
    for (const filterItem of filterItems) {
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
   * {@inheritdoc CatalogApi.getEntityByName}
   */
  async getEntityByName(
    compoundName: EntityName,
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
   * {@inheritdoc CatalogApi.addLocation}
   */
  async addLocation(
    { type = 'url', target, dryRun, presence }: AddLocationRequest,
    options?: CatalogRequestOptions,
  ): Promise<AddLocationResponse> {
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
        body: JSON.stringify({ type, target, presence }),
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
   * {@inheritdoc CatalogApi.getOriginLocationByEntity}
   */
  async getOriginLocationByEntity(
    entity: Entity,
    options?: CatalogRequestOptions,
  ): Promise<Location | undefined> {
    const locationCompound =
      entity.metadata.annotations?.[ANNOTATION_ORIGIN_LOCATION];
    if (!locationCompound) {
      return undefined;
    }
    const all: { data: Location }[] = await this.requestRequired(
      'GET',
      '/locations',
      options,
    );
    return all
      .map(r => r.data)
      .find(l => locationCompound === stringifyLocationRef(l));
  }

  /**
   * {@inheritdoc CatalogApi.getLocationByEntity}
   */
  async getLocationByEntity(
    entity: Entity,
    options?: CatalogRequestOptions,
  ): Promise<Location | undefined> {
    const locationCompound = entity.metadata.annotations?.[ANNOTATION_LOCATION];
    if (!locationCompound) {
      return undefined;
    }
    const all: { data: Location }[] = await this.requestRequired(
      'GET',
      '/locations',
      options,
    );
    return all
      .map(r => r.data)
      .find(l => locationCompound === stringifyLocationRef(l));
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
