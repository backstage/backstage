/*
 * Copyright 2022 The Backstage Authors
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
import {
  CatalogApi,
  CatalogClient,
  GetEntitiesRequest,
} from '@backstage/catalog-client';
import { DocumentCollatorFactory } from '@backstage/plugin-search-common';
import {
  catalogEntityReadPermission,
  CatalogEntityDocument,
} from '@backstage/plugin-catalog-common';
import { Permission } from '@backstage/plugin-permission-common';
import { Readable } from 'stream';
import { CatalogCollatorEntityProcessor } from './CatalogCollatorEntityProcessor';
import { Config } from '@backstage/config';

/** @public */
export type CatalogCollatorFactoryOptions = {
  type: string;
  discovery: PluginEndpointDiscovery;
  tokenManager: TokenManager;
  entityProcessor: CatalogCollatorEntityProcessor;
  locationTemplate?: string;
  filter?: GetEntitiesRequest['filter'];
  batchSize?: number;
  catalogClient?: CatalogApi;
};

/** @public */
export type CatalogCollatorFactoryCreateOptions = Omit<
  CatalogCollatorFactoryOptions,
  'entityProcessor' | 'type'
>;

/** @public */
export abstract class CatalogCollatorFactory
  implements DocumentCollatorFactory
{
  public readonly type: string;
  public readonly visibilityPermission: Permission =
    catalogEntityReadPermission;

  private locationTemplate: string;
  private filter?: GetEntitiesRequest['filter'];
  private batchSize: number;
  private readonly catalogClient: CatalogApi;
  private tokenManager: TokenManager;
  private entityProcessor: CatalogCollatorEntityProcessor;

  static fromConfig(
    _config: Config,
    _options: CatalogCollatorFactoryCreateOptions,
  ): CatalogCollatorFactory {
    throw new Error('Method should be implemented');
  }

  protected constructor(options: CatalogCollatorFactoryOptions) {
    const {
      type,
      batchSize,
      discovery,
      locationTemplate,
      filter,
      catalogClient,
      tokenManager,
      entityProcessor,
    } = options;

    this.type = type;
    this.locationTemplate =
      locationTemplate || '/catalog/:namespace/:kind/:name';
    this.filter = filter;
    this.batchSize = batchSize || 500;
    this.catalogClient =
      catalogClient || new CatalogClient({ discoveryApi: discovery });
    this.tokenManager = tokenManager;
    this.entityProcessor = entityProcessor;
  }

  async getCollator(): Promise<Readable> {
    return Readable.from(this.execute());
  }

  private async *execute(): AsyncGenerator<CatalogEntityDocument> {
    const { token } = await this.tokenManager.getToken();
    let entitiesRetrieved = 0;
    let moreEntitiesToGet = true;

    // Offset/limit pagination is used on the Catalog Client in order to
    // limit (and allow some control over) memory used by the search backend
    // at index-time.
    while (moreEntitiesToGet) {
      const entities = (
        await this.catalogClient.getEntities(
          {
            filter: this.filter,
            limit: this.batchSize,
            offset: entitiesRetrieved,
          },
          { token },
        )
      ).items;

      // Control looping through entity batches.
      moreEntitiesToGet = entities.length === this.batchSize;
      entitiesRetrieved += entities.length;

      for (const entity of entities) {
        yield this.entityProcessor.process(entity, this.locationTemplate);
      }
    }
  }
}
