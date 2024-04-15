/*
 * Copyright 2023 The Backstage Authors
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
  DiscoveryApi,
  createApiRef,
  FetchApi,
} from '@backstage/core-plugin-api';
import { ResponseError } from '@backstage/errors';
import { UnprocessedEntity } from '../types';

/**
 * {@link @backstage/core-plugin-api#ApiRef} for the {@link CatalogUnprocessedEntitiesApi}
 *
 * @public
 */
export const catalogUnprocessedEntitiesApiRef =
  createApiRef<CatalogUnprocessedEntitiesApi>({
    id: 'plugin.catalog-unprocessed-entities.service',
  });

/**
 * Response expected by the {@link CatalogUnprocessedEntitiesApi}
 *
 * @public
 */
export type CatalogUnprocessedEntitiesApiResponse = {
  entities: UnprocessedEntity[];
};

/**
 * Interface for the CatalogUnprocessedEntitiesApi.
 *
 * @public
 */
export interface CatalogUnprocessedEntitiesApi {
  /**
   * Returns a list of entities with state 'pending'
   */
  pending(): Promise<CatalogUnprocessedEntitiesApiResponse>;
  /**
   * Returns a list of entities with state 'failed'
   */
  failed(): Promise<CatalogUnprocessedEntitiesApiResponse>;
  /**
   * Deletes an entity from the refresh_state table
   */
  delete(entityId: string): Promise<void>;
}

/**
 * Default API implementation for the Catalog Unprocessed Entities plugin
 *
 * @public
 */
export class CatalogUnprocessedEntitiesClient
  implements CatalogUnprocessedEntitiesApi
{
  constructor(
    public discovery: DiscoveryApi,
    public fetchApi: FetchApi,
  ) {}

  private async fetch<T>(path: string, init?: RequestInit): Promise<T> {
    const url = await this.discovery.getBaseUrl('catalog');
    const resp = await this.fetchApi.fetch(`${url}/${path}`, init);

    if (!resp.ok) {
      throw await ResponseError.fromResponse(resp);
    }

    return resp.status === 204 ? (resp as T) : await resp.json();
  }

  async pending(): Promise<CatalogUnprocessedEntitiesApiResponse> {
    return await this.fetch('entities/unprocessed/pending');
  }

  async failed(): Promise<CatalogUnprocessedEntitiesApiResponse> {
    return await this.fetch('entities/unprocessed/failed');
  }

  async delete(entityId: string): Promise<void> {
    await this.fetch(`entities/unprocessed/delete/${entityId}`, {
      method: 'DELETE',
    });
  }
}
