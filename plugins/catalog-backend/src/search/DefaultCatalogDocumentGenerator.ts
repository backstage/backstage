/*
 * Copyright 2021 The Backstage Authors
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
  PluginEndpointDiscovery,
  TokenManager,
} from '@backstage/backend-common';
import { IndexableDocument } from '@backstage/search-common';
import { Config } from '@backstage/config';
import {
  CatalogApi,
  CatalogClient,
  CatalogEntitiesRequest,
} from '@backstage/catalog-client';

export interface CatalogEntityDocument extends IndexableDocument {
  componentType: string;
  namespace: string;
  kind: string;
  lifecycle: string;
  owner: string;
}

export class DefaultCatalogDocumentGenerator {
  private tokenManager: TokenManager;
  private locationTemplate: string;
  private filter?: CatalogEntitiesRequest['filter'];
  private readonly catalogClient: CatalogApi;
  public readonly type: string = 'software-catalog';

  static fromConfig(
    _config: Config,
    options: {
      discovery: PluginEndpointDiscovery;
      tokenManager: TokenManager;
      filter?: CatalogEntitiesRequest['filter'];
    },
  ) {
    return new DefaultCatalogDocumentGenerator({
      ...options,
    });
  }

  constructor({
    discovery,
    tokenManager,
    locationTemplate,
    filter,
    catalogClient,
  }: {
    discovery: PluginEndpointDiscovery;
    tokenManager: TokenManager;
    locationTemplate?: string;
    filter?: CatalogEntitiesRequest['filter'];
    catalogClient?: CatalogApi;
  }) {
    this.tokenManager = tokenManager;
    this.locationTemplate =
      locationTemplate || '/catalog/:namespace/:kind/:name';
    this.filter = filter;
    this.catalogClient =
      catalogClient || new CatalogClient({ discoveryApi: discovery });
  }

  protected applyArgsToFormat(
    format: string,
    args: Record<string, string>,
  ): string {
    let formatted = format;
    for (const [key, value] of Object.entries(args)) {
      formatted = formatted.replace(`:${key}`, value);
    }
    return formatted.toLowerCase();
  }

  async *execute(): AsyncGenerator<CatalogEntityDocument> {
    const { token } = await this.tokenManager.getToken();
    const entities = (
      await this.catalogClient.getEntities(
        {
          filter: this.filter,
        },
        {
          token,
        },
      )
    ).items;
    for (const entity of entities) {
      yield {
        title: entity.metadata.title ?? entity.metadata.name,
        location: this.applyArgsToFormat(this.locationTemplate, {
          namespace: entity.metadata.namespace || 'default',
          kind: entity.kind,
          name: entity.metadata.name,
        }),
        text: entity.metadata.description || '',
        componentType: entity.spec?.type?.toString() || 'other',
        namespace: entity.metadata.namespace || 'default',
        kind: entity.kind,
        lifecycle: (entity.spec?.lifecycle as string) || '',
        owner: (entity.spec?.owner as string) || '',
      };
    }
  }
}
