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

import { PluginEndpointDiscovery } from '@backstage/backend-common';
import { Entity } from '@backstage/catalog-model';
import { IndexableDocument, DocumentCollator } from '@backstage/search-common';
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

export class DefaultCatalogCollator implements DocumentCollator {
  protected discovery: PluginEndpointDiscovery;
  protected locationTemplate: string;
  protected filter?: CatalogEntitiesRequest['filter'];
  protected readonly catalogClient: CatalogApi;
  public readonly type: string = 'software-catalog';

  static fromConfig(
    _config: Config,
    options: {
      discovery: PluginEndpointDiscovery;
      filter?: CatalogEntitiesRequest['filter'];
    },
  ) {
    return new DefaultCatalogCollator({
      ...options,
    });
  }

  constructor({
    discovery,
    locationTemplate,
    filter,
    catalogClient,
  }: {
    discovery: PluginEndpointDiscovery;
    locationTemplate?: string;
    filter?: CatalogEntitiesRequest['filter'];
    catalogClient?: CatalogApi;
  }) {
    this.discovery = discovery;
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

  async execute() {
    const response = await this.catalogClient.getEntities({
      filter: this.filter,
    });
    return response.items.map((entity: Entity): CatalogEntityDocument => {
      return {
        title: entity.metadata.name,
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
    });
  }
}

export function mapFilterToQueryString(
  filter: CatalogEntitiesRequest['filter'],
): string | undefined {
  if (!filter) {
    return undefined;
  }

  const mappedFilters = Object.entries(filter).map(kvp => {
    const type = kvp[0];
    const values = [].concat(kvp[1]);
    return `${type}=${values.join(',')}`;
  });
  return `?filter=${mappedFilters.join(',')}`;
}
