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

import {
  Entity,
  EntityName,
  Location,
  LOCATION_ANNOTATION,
} from '@backstage/catalog-model';
import fetch from 'cross-fetch';
import {
  AddLocationRequest,
  AddLocationResponse,
  CatalogRequestOptions,
  CatalogApi,
  CatalogEntitiesRequest,
  CatalogListResponse,
  DiscoveryApi,
} from './types';

export class CatalogClient implements CatalogApi {
  private readonly discoveryApi: DiscoveryApi;

  constructor(options: { discoveryApi: DiscoveryApi }) {
    this.discoveryApi = options.discoveryApi;
  }

  async getLocationById(
    id: String,
    options?: CatalogRequestOptions,
  ): Promise<Location | undefined> {
    return await this.getOptional(`/locations/${id}`, options);
  }

  async getEntities(
    request?: CatalogEntitiesRequest,
    options?: CatalogRequestOptions,
  ): Promise<CatalogListResponse<Entity>> {
    const { filter = {}, fields = [] } = request ?? {};
    const params: string[] = [];

    const filterParts: string[] = [];
    for (const [key, value] of Object.entries(filter)) {
      for (const v of [value].flat()) {
        filterParts.push(`${encodeURIComponent(key)}=${encodeURIComponent(v)}`);
      }
    }
    if (filterParts.length) {
      params.push(`filter=${filterParts.join(',')}`);
    }

    if (fields.length) {
      params.push(`fields=${fields.map(encodeURIComponent).join(',')}`);
    }

    const query = params.length ? `?${params.join('&')}` : '';
    const entities: Entity[] = await this.getRequired(
      `/entities${query}`,
      options,
    );
    return { items: entities };
  }

  async getEntityByName(
    compoundName: EntityName,
    options?: CatalogRequestOptions,
  ): Promise<Entity | undefined> {
    const { kind, namespace = 'default', name } = compoundName;
    return this.getOptional(
      `/entities/by-name/${kind}/${namespace}/${name}`,
      options,
    );
  }

  async addLocation(
    { type = 'url', target, dryRun, presence }: AddLocationRequest,
    options?: CatalogRequestOptions,
  ): Promise<AddLocationResponse> {
    const response = await fetch(
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

    const { location, entities } = await response.json();

    if (!location) {
      throw new Error(`Location wasn't added: ${target}`);
    }

    if (entities.length === 0) {
      throw new Error(
        `Location was added but has no entities specified yet: ${target}`,
      );
    }
    return {
      location,
      entities,
    };
  }

  async getLocationByEntity(
    entity: Entity,
    options?: CatalogRequestOptions,
  ): Promise<Location | undefined> {
    const locationCompound = entity.metadata.annotations?.[LOCATION_ANNOTATION];
    const all: { data: Location }[] = await this.getRequired(
      '/locations',
      options,
    );
    return all
      .map(r => r.data)
      .find(l => locationCompound === `${l.type}:${l.target}`);
  }

  async removeEntityByUid(
    uid: string,
    options?: CatalogRequestOptions,
  ): Promise<void> {
    const response = await fetch(
      `${await this.discoveryApi.getBaseUrl('catalog')}/entities/by-uid/${uid}`,
      {
        headers: options?.token
          ? { Authorization: `Bearer ${options.token}` }
          : {},
        method: 'DELETE',
      },
    );
    if (!response.ok) {
      const payload = await response.text();
      throw new Error(
        `Request failed with ${response.status} ${response.statusText}, ${payload}`,
      );
    }
    return undefined;
  }

  //
  // Private methods
  //

  private async getRequired(
    path: string,
    options?: CatalogRequestOptions,
  ): Promise<any> {
    const url = `${await this.discoveryApi.getBaseUrl('catalog')}${path}`;
    const response = await fetch(url, {
      headers: options?.token
        ? { Authorization: `Bearer ${options.token}` }
        : {},
    });

    if (!response.ok) {
      const payload = await response.text();
      const message = `Request failed with ${response.status} ${response.statusText}, ${payload}`;
      throw new Error(message);
    }

    return await response.json();
  }

  private async getOptional(
    path: string,
    options?: CatalogRequestOptions,
  ): Promise<any | undefined> {
    const url = `${await this.discoveryApi.getBaseUrl('catalog')}${path}`;
    const response = await fetch(url, {
      headers: options?.token
        ? { Authorization: `Bearer ${options.token}` }
        : {},
    });

    if (!response.ok) {
      if (response.status === 404) {
        return undefined;
      }

      const payload = await response.text();
      const message = `Request failed with ${response.status} ${response.statusText}, ${payload}`;
      throw new Error(message);
    }

    return await response.json();
  }
}
