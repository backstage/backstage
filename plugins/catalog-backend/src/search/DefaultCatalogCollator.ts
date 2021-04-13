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
import { EntitiesCatalog } from '../catalog';
import { CatalogBuilder, CatalogEnvironment } from '../service/CatalogBuilder';

export interface CatalogEntityDocument extends IndexableDocument {
  componentType: string;
  namespace: string;
  kind: string;
}

type PluginEnv = CatalogEnvironment & {
  discovery: PluginEndpointDiscovery;
};

type CatalogCollatorArgs = {
  discovery?: PluginEndpointDiscovery;
  entitiesCatalog?: EntitiesCatalog;
};

export class DefaultCatalogCollator implements DocumentCollator {
  protected discovery?: PluginEndpointDiscovery;
  protected entitiesCatalog?: EntitiesCatalog;

  private constructor({ discovery, entitiesCatalog }: CatalogCollatorArgs) {
    this.discovery = discovery;
    this.entitiesCatalog = entitiesCatalog;
  }

  static async fromEnv(env: PluginEnv) {
    const { config, discovery } = env;

    // If configs exist for the catalog, the catalog is deployed in the same
    // process. Return a Collator configured to pull directly from the catalog.
    if (config.get('catalog')) {
      const builder = new CatalogBuilder(env);
      const { entitiesCatalog } = await builder.build();
      return new DefaultCatalogCollator({ entitiesCatalog });
    }

    return new DefaultCatalogCollator({ discovery });
  }

  async execute() {
    const entities = await this.getEntities();
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

  protected async getEntities() {
    if (this.entitiesCatalog) {
      return (await this.entitiesCatalog.entities()).entities;
    } else if (this.discovery) {
      const baseUrl = await this.discovery.getBaseUrl('catalog');
      const res = await fetch(`${baseUrl}/entities`);
      return (await res.json()) as Entity[];
    }
    return [];
  }
}
