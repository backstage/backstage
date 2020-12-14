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

import { PluginEndpointDiscovery } from '@backstage/backend-common';
import { Entity } from '@backstage/catalog-model';
import { DocsBuilder } from './../DocsBuilder';
import { Logger } from 'winston';
import fetch from 'cross-fetch';

type EntityBuilderArguments = {
  builder: DocsBuilder;
  discovery: PluginEndpointDiscovery;
  logger: Logger;
};

export class EntityBuilder {
  private builder: DocsBuilder;
  private discovery: PluginEndpointDiscovery;
  private logger: Logger;

  constructor({ builder, discovery, logger }: EntityBuilderArguments) {
    this.builder = builder;
    this.discovery = discovery;
    this.logger = logger;
  }

  public async refreshDocs() {
    const entities = await this.getEntities();

    entities.forEach(entity => {
      this.builder.build(entity);
    });
  }

  private async getEntities(): Promise<Entity[]> {
    const catalogUrl = await this.discovery.getBaseUrl('catalog');

    const entitiesRes = await fetch(`${catalogUrl}/entities`).catch(err =>
      console.log(err),
    );

    if (entitiesRes && entitiesRes.ok) {
      const entities = (await entitiesRes.json()) as Entity[];

      return entities.filter(
        entity => !!entity.metadata.annotations?.['backstage.io/techdocs-ref'],
      );
    }

    this.logger.warn(`Unable to call the catalog API, retrying...`);
    return new Promise(resolve => {
      setTimeout(() => {
        resolve(this.getEntities());
      }, 3000);
    });
  }
}
