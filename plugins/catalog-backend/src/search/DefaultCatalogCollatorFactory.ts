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
import { stringifyEntityRef } from '@backstage/catalog-model';
import { Config } from '@backstage/config';
import { DocumentCollatorFactory } from '@backstage/plugin-search-common';
import {
  catalogEntityReadPermission,
  CatalogEntityDocument,
} from '@backstage/plugin-catalog-common';
import { Permission } from '@backstage/plugin-permission-common';
import { Readable } from 'stream';
import { getDocumentText } from './util';

/** @public */
export type DefaultCatalogCollatorFactoryOptions = {
  discovery: PluginEndpointDiscovery;
  tokenManager: TokenManager;
  locationTemplate?: string;
  filter?: GetEntitiesRequest['filter'];
  batchSize?: number;
  catalogClient?: CatalogApi;
};

/** @public */
export class DefaultCatalogCollatorFactory implements DocumentCollatorFactory {
  public readonly type: string = 'software-catalog';
  public readonly visibilityPermission: Permission =
    catalogEntityReadPermission;

  private locationTemplate: string;
  private filter?: GetEntitiesRequest['filter'];
  private batchSize: number;
  private readonly catalogClient: CatalogApi;
  private tokenManager: TokenManager;

  static fromConfig(
    _config: Config,
    options: DefaultCatalogCollatorFactoryOptions,
  ) {
    return new DefaultCatalogCollatorFactory(options);
  }

  private constructor(options: DefaultCatalogCollatorFactoryOptions) {
    const {
      batchSize,
      discovery,
      locationTemplate,
      filter,
      catalogClient,
      tokenManager,
    } = options;

    this.locationTemplate =
      locationTemplate || '/catalog/:namespace/:kind/:name';
    this.filter = filter;
    this.batchSize = batchSize || 500;
    this.catalogClient =
      catalogClient || new CatalogClient({ discoveryApi: discovery });
    this.tokenManager = tokenManager;
  }

  async getCollator(): Promise<Readable> {
    return Readable.from(this.execute());
  }

  private applyArgsToFormat(
    format: string,
    args: Record<string, string>,
  ): string {
    let formatted = format;
    for (const [key, value] of Object.entries(args)) {
      formatted = formatted.replace(`:${key}`, value);
    }
    return formatted.toLowerCase();
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
        yield {
          title: entity.metadata.title ?? entity.metadata.name,
          location: this.applyArgsToFormat(this.locationTemplate, {
            namespace: entity.metadata.namespace || 'default',
            kind: entity.kind,
            name: entity.metadata.name,
          }),
          text: getDocumentText(entity),
          componentType: entity.spec?.type?.toString() || 'other',
          type: entity.spec?.type?.toString() || 'other',
          namespace: entity.metadata.namespace || 'default',
          kind: entity.kind,
          lifecycle: (entity.spec?.lifecycle as string) || '',
          owner: (entity.spec?.owner as string) || '',
          authorization: {
            resourceRef: stringifyEntityRef(entity),
          },
        };
      }
    }
  }
}
