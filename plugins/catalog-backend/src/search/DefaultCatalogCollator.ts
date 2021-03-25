/*
 * Copyright 2021 Spotify AB
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
import fetch from 'cross-fetch';

export interface CatalogEntityDocument extends IndexableDocument {
  componentType: string;
  namespace: string;
  kind: string;
}

export class DefaultCatalogCollator implements DocumentCollator {
  protected discovery: PluginEndpointDiscovery;

  constructor(discovery: PluginEndpointDiscovery) {
    this.discovery = discovery;
  }

  async execute() {
    const baseUrl = await this.discovery.getBaseUrl('catalog');
    const res = await fetch(`${baseUrl}/entities`);
    const entities: Entity[] = await res.json();
    return entities.map(
      (entity): CatalogEntityDocument => {
        return {
          title: entity.metadata.name,
          // TODO: Use a config-based template approach for entity location.
          location: `/catalog/${
            entity.metadata.namespace || 'default'
          }/component/${entity.metadata.name}`,
          text: entity.metadata.description || '',
          componentType: entity.spec?.type?.toString() || 'other',
          namespace: entity.metadata.namespace || 'default',
          kind: entity.kind,
        };
      },
    );
  }
}
