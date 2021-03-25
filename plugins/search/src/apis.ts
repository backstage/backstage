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

import { createApiRef, DiscoveryApi } from '@backstage/core';
import { Entity, ENTITY_DEFAULT_NAMESPACE } from '@backstage/catalog-model';

import { CatalogApi } from '@backstage/plugin-catalog-react';
import { SearchQuery, SearchResultSet } from '@backstage/search-common';
import qs from 'qs';

export const searchApiRef = createApiRef<SearchApi>({
  id: 'plugin.search.queryservice',
  description: 'Used to make requests against the search API',
});

export type Result = {
  name: string;
  description: string | undefined;
  owner: string | undefined;
  kind: string;
  lifecycle: string | undefined;
  url: string;
};

export type SearchResults = Array<Result>;

export interface SearchApi {
  getSearchResult(): Promise<SearchResults>;
  _alphaPerformSearch(query: SearchQuery): Promise<SearchResultSet>;
}

export class SearchClient implements SearchApi {
  private readonly catalogApi: CatalogApi;
  private readonly discoveryApi: DiscoveryApi;

  constructor(options: { catalogApi: CatalogApi; discoveryApi: DiscoveryApi }) {
    this.catalogApi = options.catalogApi;
    this.discoveryApi = options.discoveryApi;
  }

  private async entities() {
    const entities = await this.catalogApi.getEntities();
    return entities.items.map((entity: Entity) => ({
      name: entity.metadata.name,
      description: entity.metadata.description,
      owner:
        typeof entity.spec?.owner === 'string' ? entity.spec?.owner : undefined,
      kind: entity.kind,
      lifecycle:
        typeof entity.spec?.lifecycle === 'string'
          ? entity.spec?.lifecycle
          : undefined,
      url: `/catalog/${
        entity.metadata.namespace?.toLowerCase() || ENTITY_DEFAULT_NAMESPACE
      }/${entity.kind.toLowerCase()}/${entity.metadata.name}`,
    }));
  }

  getSearchResult(): Promise<SearchResults> {
    return this.entities();
  }

  // TODO: Productionalize as we implement search milestones.
  async _alphaPerformSearch(query: SearchQuery): Promise<SearchResultSet> {
    const queryString = qs.stringify(query);
    const url = `${await this.discoveryApi.getBaseUrl(
      'search/query',
    )}?${queryString}`;
    const response = await fetch(url);
    return response.json();
  }
}
