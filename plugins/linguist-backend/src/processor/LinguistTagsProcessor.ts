/*
 * Copyright 2023 The Backstage Authors
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

import { Entity, stringifyEntityRef } from '@backstage/catalog-model';
import {
  CatalogProcessor,
  CatalogProcessorCache,
} from '@backstage/plugin-catalog-node';
import { DiscoveryService } from '@backstage/backend-plugin-api';
import { Languages, LanguageType } from '@backstage/plugin-linguist-common';
import fetch from 'node-fetch';
import { Logger } from 'winston';
import { HumanDuration, durationToMilliseconds } from '@backstage/types';
import { Config } from '@backstage/config';

/**
 * A function which given an entity, determines if it should be processed for linguist tags.
 * @public
 */
export type ShouldProcessEntity = (entity: Entity) => boolean;

interface CachedData {
  [key: string]: number | string[];
  languages: string[];
  cachedTime: number;
}

/**
 * The constructor options for building the LinguistTagsProcessor
 * @public
 */
export interface LinguistTagsProcessorOptions {
  logger: Logger;
  discovery: DiscoveryService;
  /**
   * Optional map that gives full control over which linguist languages should be included as tags and
   * how they should be represented. The keys should be exact matches to languages in the linguist
   * and the values should be how they render as backstage tags. Keep in mind that backstage has character
   * requirements for tags. If you map a key to a falsey value, it will not be emitted as a tag.
   */
  languageMap?: Record<string, string | undefined>;
  /**
   * A function which determines which entities should be processed by the LinguistTagProcessor.
   *
   * The default is to process all entities of kind=Component
   */
  shouldProcessEntity?: ShouldProcessEntity;
  /**
   * Determines how long to cache language breakdowns for entities in the processor. Considering
   * how often this processor runs, caching can help move some read traffic off of the linguist DB.
   *
   * If this caching is using up too much memory, you can disable it by setting cacheTTL to 0.
   */
  cacheTTL?: HumanDuration;
  /**
   * How many bytes must exist of a language in a repo before we consider it for adding a tag to
   * the entity. This can be used if some repos have short utility scripts that may not be the primary
   * language for the repo.
   */
  bytesThreshold?: number;
  /**
   * Which linguist file types to process tags for.
   */
  languageTypes?: LanguageType[];
}

/**
 * This processor will fetch the language breakdown from the linguist API and
 * add the languages to the entity as searchable tags.
 *
 * @public
 * */
export class LinguistTagsProcessor implements CatalogProcessor {
  private logger: Logger;
  private discovery: DiscoveryService;
  private loggerMeta = { plugin: 'LinguistTagsProcessor' };
  private languageMap: Record<string, string | undefined> = {};
  private shouldProcessEntity: ShouldProcessEntity = (entity: Entity) => {
    return entity.kind === 'Component';
  };
  private cacheTTLMilliseconds: number;
  private bytesThreshold = 0;
  private languageTypes: LanguageType[] = ['programming'];

  getProcessorName(): string {
    return 'LinguistTagsProcessor';
  }

  constructor(options: LinguistTagsProcessorOptions) {
    this.logger = options.logger;
    this.discovery = options.discovery;
    if (options.shouldProcessEntity) {
      this.shouldProcessEntity = options.shouldProcessEntity;
    }
    this.cacheTTLMilliseconds = durationToMilliseconds(
      options.cacheTTL || { minutes: 30 },
    );
    if (options.bytesThreshold) {
      this.bytesThreshold = options.bytesThreshold;
    }
    if (options.languageTypes) {
      this.languageTypes = options.languageTypes;
    }
    if (options.languageMap) {
      this.languageMap = options.languageMap;
    }
  }

  static fromConfig(
    config: Config,
    options: LinguistTagsProcessorOptions,
  ): LinguistTagsProcessor {
    const c = config.getOptionalConfig('linguist.tagsProcessor');
    if (c) {
      options.bytesThreshold ??= c.getOptionalNumber('bytesThreshold');
      options.languageTypes ??= c.getOptionalStringArray(
        'languageTypes',
      ) as LanguageType[];
      options.languageMap ??= c.getOptional('languageMap');
      options.cacheTTL ??= c.getOptional('cacheTTL');
    }

    return new LinguistTagsProcessor(options);
  }

  /**
   * Given an entity ref, fetches the language breakdown from the Linguist backend HTTP API.
   * @param entityRef - stringified entity ref
   * @returns The language breakdown
   */
  private async getLanguagesFromLinguistAPI(
    entityRef: string,
  ): Promise<string[]> {
    this.logger.debug(`Fetching languages from linguist API`, {
      ...this.loggerMeta,
      entityRef,
    });

    const baseUrl = await this.discovery.getBaseUrl('linguist');
    const linguistApi = new URL(`${baseUrl}/entity-languages`);
    linguistApi.searchParams.append('entityRef', entityRef);
    const linguistData = await fetch(linguistApi).then(
      res => res.json() as Promise<Languages>,
    );
    if (!linguistData || !linguistData.processedDate) {
      return [];
    }

    return linguistData.breakdown
      .filter(
        b =>
          this.languageTypes.includes(b.type) && b.bytes > this.bytesThreshold,
      )
      .map(b => b.name);
  }

  /**
   * Cached wrapper around getLanguagesFromLinguistAPI
   * @param cache - The CatalogProcessorCache
   * @param entityRef - Stringified entity references
   *
   * @returns List of languages
   */
  private async getCachedLanguages(
    cache: CatalogProcessorCache,
    entityRef: string,
  ): Promise<string[]> {
    let cachedData = (await cache.get(entityRef)) as CachedData | undefined;
    if (!cachedData || this.isExpired(cachedData)) {
      const languages = await this.getLanguagesFromLinguistAPI(entityRef);
      cachedData = { languages, cachedTime: Date.now() };
      await cache.set(entityRef, cachedData);
    }
    this.logger.debug(`Fetched cached languages ${cachedData.languages}`, {
      ...this.loggerMeta,
      entityRef,
    });
    return cachedData.languages;
  }

  /**
   * Determines if cached data is expired based on TTL
   *
   * @param cachedData - The cached data for this entity
   * @returns True if data is expired
   */
  private isExpired(cachedData: CachedData): boolean {
    const elapsed = Date.now() - (cachedData.cachedTime || 0);
    return elapsed > this.cacheTTLMilliseconds;
  }

  /**
   * This pre-processor will fetch linguist data for a Component and convert the language breakdown
   * into entity tags which will be appended to the entity.
   *
   * @public
   */
  async preProcessEntity(
    entity: Entity,
    _: any,
    __: any,
    ___: any,
    cache: CatalogProcessorCache,
  ): Promise<Entity> {
    if (!this.shouldProcessEntity(entity)) {
      return entity;
    }
    const entityRef = stringifyEntityRef(entity);
    this.logger.debug(`Processing ${entityRef}`, {
      ...this.loggerMeta,
      entityRef,
    });

    const languages =
      this.cacheTTLMilliseconds > 0
        ? await this.getCachedLanguages(cache, entityRef)
        : await this.getLanguagesFromLinguistAPI(entityRef);

    const tags = (entity.metadata.tags ||= []);
    const originalTagCount = tags.length;

    languages.forEach(lang => {
      const cleanedUpLangTag =
        lang in this.languageMap ? this.languageMap[lang] : sanitizeTag(lang);
      if (cleanedUpLangTag && !tags.includes(cleanedUpLangTag)) {
        tags.push(cleanedUpLangTag);
      }
    });

    const addedCount = tags.length - originalTagCount;

    this.logger.debug(`Added ${addedCount} language tags from linguist`, {
      ...this.loggerMeta,
      entityRef,
    });

    return entity;
  }
}

/**
 * Converts language tags from linguist to something acceptable by
 * the tag requirements for backstage
 *
 * @param tag - A language tag from linguist
 * @returns Cleaned up language tag
 * @internal
 */
export function sanitizeTag(tag: string): string {
  return tag
    .toLowerCase()
    .replace(/\.net/g, '-dot-net')
    .replace(/[^a-z0-9:+#-]+/g, '-')
    .replace(/-{2,}/g, '-')
    .replace(/^-+|-+$/g, '');
}
