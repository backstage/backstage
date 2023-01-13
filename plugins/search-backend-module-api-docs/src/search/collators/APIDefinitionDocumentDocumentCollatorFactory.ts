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
import { Logger } from 'winston';
import { Config } from '@backstage/config';
import { Readable } from 'stream';
import { DocumentCollatorFactory } from '@backstage/plugin-search-common';

import { CatalogApi, CatalogClient } from '@backstage/catalog-client';

import { APIDefinitionDocument } from './APIDefinitionDocument';

import { OpenAPISpecParser, SpecHandler, SpecParser } from '../spec-parsers';

/**
 * Options for instantiating APIDocumentCollatorFactoryOptions
 * @public
 */
export type APIDocumentCollatorFactoryOptions = {
  discovery: PluginEndpointDiscovery;
  catalogClient?: CatalogApi;
  batchSize?: number;
  tokenManager: TokenManager;
  specParsers?: SpecParser[];
  logger: Logger;
};

/**
 * Factory class producing a collator that can be used to index documents
 * sourced from api catalog entities.
 *
 * @remarks
 * This collator is intended for use by those whose are imlementing the {@link https://github.com/backstage/backstage/blob/master/plugins/api-docs/README.md | api-docs plugin}.
 * it will gather api definitions and format them to be consumed by core
 *
 * @example
 * ```ts
 * indexBuilder.addCollator({
 * apiDefinitionIndexingSchedule,
 *  factory: APIDocumentCollatorFactory.fromConfig(env.config, {
 *    logger: env.logger,
 *    discovery: env.discovery,
 *    tokenManager: env.tokenManager,
 *  })
 * });
 * ```
 *
 * @public
 */
export class APIDocumentCollatorFactory implements DocumentCollatorFactory {
  public readonly type: string = 'api-definition';
  private readonly catalogClient: CatalogApi;
  private batchSize: number;
  private tokenManager: TokenManager;
  private specHandler: SpecHandler;
  private logger: Logger;

  private constructor(options: APIDocumentCollatorFactoryOptions) {
    const {
      discovery,
      catalogClient,
      batchSize,
      tokenManager,
      specParsers,
      logger,
    } = options;

    this.logger = logger;
    this.tokenManager = tokenManager;
    this.batchSize = batchSize || 500;
    this.catalogClient =
      catalogClient || new CatalogClient({ discoveryApi: discovery });
    this.specHandler = new SpecHandler();

    if (specParsers) {
      specParsers.forEach(parser => this.specHandler.addSpecParser(parser));
    } else {
      this.specHandler = new SpecHandler().addSpecParser(
        new OpenAPISpecParser(),
      );
    }
  }

  /**
   * Returns a APIDocumentCollatorFactory instance from configuration
   * and a set of options.
   */
  static fromConfig(
    _config: Config,
    options: APIDocumentCollatorFactoryOptions,
  ) {
    return new APIDocumentCollatorFactory(options);
  }

  async getCollator() {
    return Readable.from(this.execute());
  }

  private async *execute(): AsyncGenerator<APIDefinitionDocument> {
    const { token } = await this.tokenManager.getToken();

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
        const specParser = this.specHandler.getSpecParser(
          entity.spec?.type as string,
        );

        if (!specParser) {
          this.logger.warn(
            `No Spec Parser Available for Entity Type ${entity.spec?.type}`,
          );
          continue;
        }

        try {
          if (entity.spec?.definition) {
            yield {
              title: entity.metadata.name,
              location: `/catalog/default/api/${entity.metadata.name}/definition/`,
              text: specParser.getSpecText(entity.spec?.definition as string),
              kind: entity.kind,
              lifecycle: (entity.spec?.lifecycle as string) || '',
            };
          }
        } catch (e: any) {
          this.logger.warn(
            `Error Parsing Spec Text For ${entity.metadata.name}: ${e}`,
          );
          continue;
        }
      }
    }
  }
}
