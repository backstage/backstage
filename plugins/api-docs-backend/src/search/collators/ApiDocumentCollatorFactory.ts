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

import { Config } from '@backstage/config';
import { Readable } from 'stream';
import { DocumentCollatorFactory } from '@backstage/plugin-search-common';

import { CatalogApi, CatalogClient } from '@backstage/catalog-client';

import { ApiDocument } from './ApiDocument';

import { SpecHandler, OpenAPISpecParser } from './spec-parsers';

/** @public */
export type ApiDocumentCollatorFactoryOptions = {
  discovery: PluginEndpointDiscovery;
  catalogClient?: CatalogApi;
  batchSize?: number;
  tokenManager: TokenManager;
};

/** @public */
export class ApiDocumentCollatorFactory implements DocumentCollatorFactory {
  // private readonly logger: Logger;
  public readonly type: string = 'api-definition';
  private readonly catalogClient: CatalogApi;
  private batchSize: number;
  private tokenManager: TokenManager;

  private constructor(options: ApiDocumentCollatorFactoryOptions) {
    const { discovery, catalogClient, batchSize, tokenManager } = options;

    this.tokenManager = tokenManager;
    this.batchSize = batchSize || 500;
    this.catalogClient =
      catalogClient || new CatalogClient({ discoveryApi: discovery });
  }

  static fromConfig(
    _config: Config,
    options: ApiDocumentCollatorFactoryOptions,
  ) {
    return new ApiDocumentCollatorFactory(options);
  }

  async getCollator() {
    return Readable.from(this.execute());
  }

  async *execute(): AsyncGenerator<ApiDocument> {
    const { token } = await this.tokenManager.getToken();

    const specHandler = new SpecHandler();
    specHandler.addSpecParser(new OpenAPISpecParser());

    let entitiesRetrieved = 0;
    let moreEntitiesToGet = true;

    while (moreEntitiesToGet) {
      const entities = (
        await this.catalogClient.getEntities(
          {
            filter: {
              kind: 'api',
            },
            limit: this.batchSize,
            offset: entitiesRetrieved,
          },
          { token },
        )
      ).items;

      moreEntitiesToGet = entities.length === this.batchSize;
      entitiesRetrieved += entities.length;

      for (const entity of entities) {
        const specParser = specHandler.getSpecParser(
          entity.spec?.type as string,
        );
        if (specParser == undefined) {
          continue;
        }

        yield {
          title: entity.metadata.name,
          location: `/catalog/default/api/${entity.metadata.name}/definition/`,
          text: specParser.getSpecText(entity.spec?.definition),
          kind: entity.kind,
          lifecycle: (entity.spec?.lifecycle as string) || '',
        };
      }
    }
  }
}
