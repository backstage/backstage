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
  EntitiesOverview,
  EntityResults,
  Language,
  Languages,
} from '@backstage/plugin-linguist-common';
import {
  CATALOG_FILTER_EXISTS,
  GetEntitiesRequest,
  CatalogApi,
} from '@backstage/catalog-client';
import { TokenManager, UrlReader } from '@backstage/backend-common';

import { DateTime } from 'luxon';
import { LINGUIST_ANNOTATION } from '@backstage/plugin-linguist-common';
import { LinguistBackendStore } from '../db';
import { Logger } from 'winston';
import fs from 'fs-extra';
import linguist from 'linguist-js';
import {
  ANNOTATION_SOURCE_LOCATION,
  stringifyEntityRef,
} from '@backstage/catalog-model';
import { assertError } from '@backstage/errors';
import { HumanDuration } from '@backstage/types';
import { Results } from 'linguist-js/dist/types';

/** @public */
export interface LinguistBackendApi {
  getEntityLanguages(entityRef: string): Promise<Languages>;
  processEntities(): Promise<void>;
}

/** @public */
export class LinguistBackendClient implements LinguistBackendApi {
  private readonly logger: Logger;
  private readonly store: LinguistBackendStore;
  private readonly urlReader: UrlReader;
  private readonly tokenManager: TokenManager;

  private readonly catalogApi: CatalogApi;
  private readonly age?: HumanDuration;
  private readonly batchSize?: number;
  private readonly useSourceLocation?: boolean;
  private readonly kind: string[];
  private readonly linguistJsOptions?: Record<string, unknown>;
  public constructor(
    logger: Logger,
    store: LinguistBackendStore,
    urlReader: UrlReader,
    tokenManager: TokenManager,
    catalogApi: CatalogApi,
    age?: HumanDuration,
    batchSize?: number,
    useSourceLocation?: boolean,
    kind?: string[],
    linguistJsOptions?: Record<string, unknown>,
  ) {
    this.logger = logger;
    this.store = store;
    this.urlReader = urlReader;
    this.tokenManager = tokenManager;
    this.catalogApi = catalogApi;
    this.batchSize = batchSize;
    this.age = age;
    this.useSourceLocation = useSourceLocation;
    this.kind = kindOrDefault(kind);
    this.linguistJsOptions = linguistJsOptions;
  }

  async getEntityLanguages(entityRef: string): Promise<Languages> {
    this.logger?.debug(`Getting languages for entity "${entityRef}"`);

    return this.store.getEntityResults(entityRef);
  }

  async processEntities(): Promise<void> {
    this.logger?.info('Updating list of entities');

    await this.addNewEntities();

    this.logger?.info('Processing applicable entities through Linguist');

    await this.generateEntitiesLanguages();
  }

  /** @internal */
  async addNewEntities(): Promise<void> {
    const annotationKey = this.useSourceLocation
      ? ANNOTATION_SOURCE_LOCATION
      : LINGUIST_ANNOTATION;
    const request: GetEntitiesRequest = {
      filter: {
        kind: this.kind,
        [`metadata.annotations.${annotationKey}`]: CATALOG_FILTER_EXISTS,
      },
      fields: ['kind', 'metadata'],
    };

    const { token } = await this.tokenManager.getToken();
    const response = await this.catalogApi.getEntities(request, { token });
    const entities = response.items;

    entities.forEach(entity => {
      const entityRef = stringifyEntityRef(entity);
      this.store.insertNewEntity(entityRef);
    });
  }

  /** @internal */
  async generateEntitiesLanguages(): Promise<void> {
    const entitiesOverview = await this.getEntitiesOverview();
    this.logger?.info(
      `Entities overview: Entity: ${entitiesOverview.entityCount}, Processed: ${entitiesOverview.processedCount}, Pending: ${entitiesOverview.pendingCount}, Stale ${entitiesOverview.staleCount}`,
    );

    const entities = entitiesOverview.filteredEntities.slice(
      0,
      this.batchSize ?? 20,
    );

    for (const entityRef of entities) {
      const { token } = await this.tokenManager.getToken();
      const entity = await this.catalogApi.getEntityByRef(entityRef, {
        token,
      });
      const annotationKey = this.useSourceLocation
        ? ANNOTATION_SOURCE_LOCATION
        : LINGUIST_ANNOTATION;

      let url = entity?.metadata.annotations?.[annotationKey] ?? '';
      if (url.startsWith('url:')) {
        url = url.slice(4);
      }

      try {
        await this.generateEntityLanguages(entityRef, url);
      } catch (error) {
        console.log(error);
        assertError(error);
        this.logger.error(
          `Unable to process "${entityRef}" using "${url}", message: ${error.message}, stack: ${error.stack}`,
        );
      }
    }
  }

  /** @internal */
  async getEntitiesOverview(): Promise<EntitiesOverview> {
    this.logger?.debug('Getting pending entities');

    const processedEntities = await this.store.getProcessedEntities();
    const staleEntities = processedEntities
      .filter(pe => {
        if (this.age === undefined) return false;
        const staleDate = DateTime.now().minus(this.age as HumanDuration);
        return DateTime.fromJSDate(pe.processedDate) <= staleDate;
      })
      .map(pe => pe.entityRef);

    const unprocessedEntities = await this.store.getUnprocessedEntities();
    const filteredEntities = unprocessedEntities.concat(staleEntities);

    const entitiesOverview: EntitiesOverview = {
      entityCount: unprocessedEntities.length + processedEntities.length,
      processedCount: processedEntities.length,
      staleCount: staleEntities.length,
      pendingCount: filteredEntities.length,
      filteredEntities: filteredEntities,
    };

    return entitiesOverview;
  }

  /** @internal */
  async generateEntityLanguages(
    entityRef: string,
    url: string,
  ): Promise<string> {
    this.logger?.info(
      `Processing languages for entity ${entityRef} from ${url}`,
    );

    const readTreeResponse = await this.urlReader.readTree(url);
    const dir = await readTreeResponse.dir();

    const results = await this.getLinguistResults(dir);

    try {
      const totalBytes = results.languages.bytes;
      const langResults = results.languages.results;

      const breakdown: Language[] = [];
      for (const key in langResults) {
        if (Object.prototype.hasOwnProperty.call(langResults, key)) {
          const lang: Language = {
            name: key,
            percentage: +((langResults[key].bytes / totalBytes) * 100).toFixed(
              2,
            ),
            bytes: langResults[key].bytes,
            type: langResults[key].type,
            color: langResults[key].color,
          };
          breakdown.push(lang);
        }
      }

      const languages: Languages = {
        languageCount: results.languages.count,
        totalBytes: totalBytes,
        processedDate: new Date().toISOString(),
        breakdown: breakdown,
      };

      const entityResults: EntityResults = {
        entityRef: entityRef,
        results: languages,
      };

      return await this.store.insertEntityResults(entityResults);
    } finally {
      this.logger?.info(`Cleaning up files from ${dir}`);
      await fs.remove(dir);
    }
  }

  /** @internal */
  async getLinguistResults(dir: string): Promise<Results> {
    const results = await linguist(dir, this.linguistJsOptions);
    return results;
  }
}

export function kindOrDefault(kind?: string[]): string[] {
  if (!kind || kind.length === 0) {
    return ['API', 'Component', 'Template'];
  }
  return kind;
}
