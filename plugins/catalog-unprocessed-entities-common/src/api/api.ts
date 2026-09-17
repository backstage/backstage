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

import { CatalogUnprocessedEntitiesApiResponse } from '../types';
import { ResponseError } from '@backstage/errors';

/**
 * Options you can pass into a catalog request for additional information.
 *
 * @public
 */
export interface UnprocessedEntitiesRequestOptions {
  token?: string;
}

/**
 * Interface for the CatalogUnprocessedEntitiesApi.
 *
 * @public
 */
export interface CatalogUnprocessedEntitiesApi {
  /**
   * Returns a list of entities with state 'pending'
   *
   * @param options - Additional options
   */
  pending(
    options?: UnprocessedEntitiesRequestOptions,
  ): Promise<CatalogUnprocessedEntitiesApiResponse>;
  /**
   * Returns a list of entities with state 'failed'
   *
   * @param options - Additional options
   */
  failed(
    options?: UnprocessedEntitiesRequestOptions,
  ): Promise<CatalogUnprocessedEntitiesApiResponse>;
  /**
   * Deletes an entity from the refresh_state table
   *
   * @param entityId - The ID of the entity to delete
   * @param options - Additional options
   */
  delete(
    entityId: string,
    options?: UnprocessedEntitiesRequestOptions,
  ): Promise<void>;
}

/**
 * Default API implementation for the Catalog Unprocessed Entities plugin
 *
 * @public
 */
export class CatalogUnprocessedEntitiesClient
  implements CatalogUnprocessedEntitiesApi
{
  private readonly discovery: { getBaseUrl(pluginId: string): Promise<string> };
  private readonly fetchApi: { fetch: typeof fetch };

  constructor(
    discovery: { getBaseUrl(pluginId: string): Promise<string> },
    fetchApi?: { fetch: typeof fetch },
  ) {
    this.discovery = discovery;
    this.fetchApi = fetchApi ?? { fetch };
  }

  private async fetch<T>(
    method: string,
    path: string,
    options?: UnprocessedEntitiesRequestOptions,
  ): Promise<T> {
    const url = await this.discovery.getBaseUrl('catalog');
    const resp = await this.fetchApi.fetch(`${url}/${path}`, {
      method,
      headers: {
        ...(options?.token ? { Authorization: `Bearer ${options.token}` } : {}),
      },
    });

    if (!resp.ok) {
      throw await ResponseError.fromResponse(resp);
    }

    return resp.status === 204 ? (resp as T) : await resp.json();
  }

  async pending(
    options?: UnprocessedEntitiesRequestOptions,
  ): Promise<CatalogUnprocessedEntitiesApiResponse> {
    return await this.fetch('GET', 'entities/unprocessed/pending', options);
  }

  async failed(
    options?: UnprocessedEntitiesRequestOptions,
  ): Promise<CatalogUnprocessedEntitiesApiResponse> {
    return await this.fetch('GET', 'entities/unprocessed/failed', options);
  }

  async delete(
    entityId: string,
    options?: UnprocessedEntitiesRequestOptions,
  ): Promise<void> {
    await this.fetch(
      'DELETE',
      `entities/unprocessed/delete/${entityId}`,
      options,
    );
  }
}
