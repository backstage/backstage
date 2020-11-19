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

export type Result = {
  name: string;
  namespace: string;
  description: string;
  owner: string;
  kind: string;
  lifecycle: string;
};

export type SearchResults = Array<Result>;

class SearchApi {
  private catalogApi: CatalogApi;

  constructor(catalogApi: CatalogApi) {
    this.catalogApi = catalogApi;
  }

  private async entities() {
    const entities = await this.catalogApi.getEntities();
    return entities.items.map((result: any) => ({
      name: result.metadata.name,
      namespace: result.metadata.namespace,
      description: result.metadata.description,
      owner: result.spec.owner,
      kind: result.kind,
      lifecycle: result.spec.lifecycle,
    }));
  }

  public getSearchResult(): Promise<SearchResults> {
    return this.entities();
  }
}

export default SearchApi;
