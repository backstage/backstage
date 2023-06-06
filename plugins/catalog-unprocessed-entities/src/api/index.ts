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
import { DiscoveryApi, createApiRef } from '@backstage/core-plugin-api';
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
 * API client for the Catalog Unprocessed Entities plugin
 *
 * @public
 */
export class CatalogUnprocessedEntitiesApi {
  url: string = '';

  constructor(public discovery: DiscoveryApi) {}

  private async fetch<T>(path: string, init?: RequestInit): Promise<T> {
    if (!this.url) {
      this.url = await this.discovery.getBaseUrl('catalog');
    }
    const resp = await fetch(`${this.url}/${path}`, init);
    if (!resp.ok) {
      throw await ResponseError.fromResponse(resp);
    }

    return await resp.json();
  }

  async pending(): Promise<{ entities: UnprocessedEntity[] }> {
    return await this.fetch('entities/unprocessed/pending');
  }

  async failed(): Promise<{ entities: UnprocessedEntity[] }> {
    return await this.fetch('entities/unprocessed/failed');
  }
}
