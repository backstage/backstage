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

import { Readable } from 'stream';
import { Logger } from 'winston';
import {
  CacheClient,
  PluginCacheManager,
  PluginEndpointDiscovery,
  TokenManager,
  UrlReader,
} from '@backstage/backend-common';
import {
  CatalogApi,
  CatalogClient,
  CATALOG_FILTER_EXISTS,
} from '@backstage/catalog-client';
import { stringifyEntityRef } from '@backstage/catalog-model';
import { Config } from '@backstage/config';
import { NotModifiedError, stringifyError } from '@backstage/errors';
import {
  ScmIntegrationRegistry,
  ScmIntegrations,
} from '@backstage/integration';
import {
  AdrDocument,
  AdrFilePathFilterFn,
  ANNOTATION_ADR_LOCATION,
  getAdrLocationUrl,
  madrFilePathFilter,
} from '@backstage/plugin-adr-common';
import { DocumentCollatorFactory } from '@backstage/plugin-search-common';

import { createMadrParser } from './createMadrParser';
import { AdrParser } from './types';

/**
 * Options to configure the AdrCollatorFactory
 * @public
 */
export type AdrCollatorFactoryOptions = {
  /**
   * Function used to filter ADR file paths.
   * Defaults to filtering paths following MADR filename format.
   */
  adrFilePathFilterFn?: AdrFilePathFilterFn;
  /**
   * Plugin cache manager
   */
  cache: PluginCacheManager;
  /**
   * App Config
   */
  config: Config;
  /**
   * Catalog API client. Defaults to CatalogClient.
   */
  catalogClient?: CatalogApi;
  /**
   * Plugin Endpoint Discovery client
   */
  discovery: PluginEndpointDiscovery;
  /**
   * Logger
   */
  logger: Logger;
  /**
   * ADR content parser. Defaults to built in MADR parser.
   */
  parser?: AdrParser;
  /**
   * URL Reader
   */
  reader: UrlReader;
  /**
   * Token Manager
   */
  tokenManager: TokenManager;
};

/**
 * Default collator to index ADR documents for Backstage search.
 * @public
 */
export class DefaultAdrCollatorFactory implements DocumentCollatorFactory {
  public readonly type: string = 'adr';
  private readonly adrFilePathFilterFn: AdrFilePathFilterFn;
  private readonly cacheClient: CacheClient;
  private readonly catalogClient: CatalogApi;
  private readonly logger: Logger;
  private readonly parser: AdrParser;
  private readonly reader: UrlReader;
  private readonly scmIntegrations: ScmIntegrationRegistry;
  private readonly tokenManager: TokenManager;

  private constructor(options: AdrCollatorFactoryOptions) {
    this.adrFilePathFilterFn =
      options.adrFilePathFilterFn ?? madrFilePathFilter;
    this.cacheClient = options.cache.getClient();
    this.catalogClient =
      options.catalogClient ??
      new CatalogClient({ discoveryApi: options.discovery });
    this.logger = options.logger.child({ documentType: this.type });
    this.parser = options.parser ?? createMadrParser();
    this.reader = options.reader;
    this.scmIntegrations = ScmIntegrations.fromConfig(options.config);
    this.tokenManager = options.tokenManager;
  }

  static fromConfig(options: AdrCollatorFactoryOptions) {
    return new DefaultAdrCollatorFactory(options);
  }

  async getCollator() {
    return Readable.from(this.execute());
  }

  async *execute(): AsyncGenerator<AdrDocument> {
    const { token } = await this.tokenManager.getToken();
    const entities = (
      await this.catalogClient.getEntities(
        {
          filter: {
            [`metadata.annotations.${ANNOTATION_ADR_LOCATION}`]:
              CATALOG_FILTER_EXISTS,
          },
          fields: [
            'kind',
            'metadata.annotations',
            'metadata.name',
            'metadata.namespace',
            'metadata.title',
          ],
        },
        { token },
      )
    ).items;

    for (const ent of entities) {
      let adrsUrl: string;
      try {
        adrsUrl = getAdrLocationUrl(ent, this.scmIntegrations);
      } catch (e: any) {
        this.logger.error(
          `Unable to get ADR location URL for ${stringifyEntityRef(
            ent,
          )}: ${stringifyError(e)}`,
        );
        continue;
      }

      const cacheItem = (await this.cacheClient.get(adrsUrl)) as {
        adrFiles: {
          path: string;
          content: string;
        }[];
        etag: string;
      };

      let adrFiles = cacheItem?.adrFiles;
      try {
        const tree = await this.reader.readTree(adrsUrl, {
          etag: cacheItem?.etag,
          filter: filePath => this.adrFilePathFilterFn(filePath),
        });

        adrFiles = await Promise.all(
          (
            await tree.files()
          ).map(async f => ({
            path: f.path,
            content: (await f.content()).toString('utf8'),
          })),
        );

        await this.cacheClient.set(adrsUrl, { adrFiles, etag: tree.etag });
      } catch (error: any) {
        // Ignore error if we're able to use cached response
        if (!cacheItem || error.name !== NotModifiedError.name) {
          this.logger.error(
            `Unable to fetch ADRs from ${adrsUrl}: ${stringifyError(error)}`,
          );
          continue;
        }
      }

      for (const { content, path } of adrFiles) {
        try {
          const adrDoc = await this.parser({
            entity: ent,
            path,
            content,
          });
          yield adrDoc;
        } catch (e: any) {
          this.logger.error(
            `Unable to parse ADR ${path}: ${stringifyError(e)}`,
          );
        }
      }

      this.logger.info(`Indexed ${adrFiles.length} ADRs from ${adrsUrl}`);
    }
  }
}
