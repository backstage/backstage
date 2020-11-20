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

import { CatalogApi } from '@backstage/plugin-catalog';
import { Entity, ENTITY_DEFAULT_NAMESPACE } from '@backstage/catalog-model';

export type Result = {
  name: string;
  description: string;
  owner: string;
  kind: string;
  lifecycle: string;
  url: string;
};

export type SearchResults = Array<Result>;

class SearchApi {
  private catalogApi: CatalogApi;

  constructor(catalogApi: CatalogApi) {
    this.catalogApi = catalogApi;
  }

  private async entities() {
    const entities = await this.catalogApi.getEntities();
    return entities.items.map((entity: Entity) => ({
      name: entity.metadata.name,
      description: entity.metadata.description || 'No description',
      owner:
        typeof entity.spec?.owner === 'string' ? entity.spec?.owner : 'unknown',
      kind: entity.kind,
      lifecycle:
        typeof entity.spec?.lifecycle === 'string'
          ? entity.spec?.lifecycle
          : 'unknown',
      url: `/catalog/${entity.metadata.namespace || ENTITY_DEFAULT_NAMESPACE}/${
        entity.kind
      }/${entity.metadata.name}`,
    }));
  }

  public getSearchResult(): Promise<SearchResults> {
    return this.entities();
  }
}

export default SearchApi;
