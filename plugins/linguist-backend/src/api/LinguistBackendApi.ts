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
  CatalogClient,
  GetEntitiesRequest,
} from '@backstage/catalog-client';
import { PluginEndpointDiscovery, UrlReader } from '@backstage/backend-common';

import { Config } from '@backstage/config';
import { DateTime } from 'luxon';
import { LINGUIST_ANNOTATION } from '@backstage/plugin-linguist-common';
import { LinguistBackendStore } from '../db';
import { Logger } from 'winston';
import fs from 'fs-extra';
import linguist from 'linguist-js';
import { stringifyEntityRef } from '@backstage/catalog-model';
import { assertError } from '@backstage/errors';

/** @public */
export class LinguistBackendApi {
  public constructor(
    private readonly config: Config,
    private readonly logger: Logger,
    private readonly store: LinguistBackendStore,
    private readonly urlReader: UrlReader,
    private readonly discovery: PluginEndpointDiscovery,
  ) {}

  public async getEntityLanguages(entityRef: string): Promise<Languages> {
    this.logger?.debug(`Getting languages for entity "${entityRef}"`);

    return this.store.getEntityResults(entityRef);
  }

  public async processEntity(entityRef: string, url: string): Promise<string> {
    this.logger?.info(
      `Processing languages for entity ${entityRef} from ${url}`,
    );

    const readTreeResponse = await this.urlReader.readTree(url);
    const dir = await readTreeResponse.dir();

    const results = await linguist(dir);

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

  public async processEntities() {
    this.logger?.info('Processing applicable entities through Linguist');

    const eo = await this.getEntitiesOverview();
    this.logger?.info(
      `Entities overview: Entity: ${eo.entityCount}, Processed: ${eo.processedCount}, Pending: ${eo.pendingCount}, Stale ${eo.staleCount}`,
    );

    const entities = eo.filteredEntities;
    for (const key in entities) {
      if (Object.prototype.hasOwnProperty.call(entities, key)) {
        const entityRef = stringifyEntityRef(entities[key]);

        const url =
          entities[key].metadata.annotations?.[LINGUIST_ANNOTATION] ?? '';

        try {
          await this.processEntity(entityRef, url);
        } catch (e) {
          assertError(e);
          this.logger.error(
            `Unable to process "${entityRef}" using "${url}", ${e.message}`,
          );
        }
      }
    }
  }

  public async getEntitiesOverview(): Promise<EntitiesOverview> {
    this.logger?.debug('Getting pending entities');
    const age = this.config.getOptionalNumber('linguist.age') ?? 0;
    const catalogApi = new CatalogClient({ discoveryApi: this.discovery });
    const request: GetEntitiesRequest = {
      filter: {
        kind: ['API', 'Component', 'Template'],
        [`metadata.annotations.${LINGUIST_ANNOTATION}`]: CATALOG_FILTER_EXISTS,
      },
      fields: ['kind', 'metadata'],
    };

    const response = await catalogApi.getEntities(request);
    const entities = response.items;

    const processedEntities = await this.store.getProcessedEntities();

    const staleEntities = processedEntities.filter(pe => {
      if (age === 0) return false;
      const staleDate = DateTime.now().minus({ days: age });
      return DateTime.fromJSDate(pe.processed_date) >= staleDate;
    });

    const filteredEntities = entities.filter(en => {
      return processedEntities.every(pe => {
        const entityRef = stringifyEntityRef(en);
        return pe.entityRef !== entityRef;
      });
    });

    const entitiesOverview: EntitiesOverview = {
      entityCount: entities.length,
      processedCount: processedEntities.length,
      staleCount: staleEntities.length,
      pendingCount: filteredEntities.length,
      filteredEntities: filteredEntities,
    };

    return entitiesOverview;
  }
}
