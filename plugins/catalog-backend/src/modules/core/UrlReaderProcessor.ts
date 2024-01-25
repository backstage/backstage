/*
 * Copyright 2020 The Backstage Authors
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

import { UrlReader } from '@backstage/backend-common';
import { Entity } from '@backstage/catalog-model';
import { assertError } from '@backstage/errors';
import limiterFactory from 'p-limit';
import { Logger } from 'winston';
import { LocationSpec } from '@backstage/plugin-catalog-common';
import parseGitUrl from 'git-url-parse';
import {
  CatalogProcessor,
  CatalogProcessorCache,
  CatalogProcessorEmit,
  CatalogProcessorEntityResult,
  CatalogProcessorParser,
  CatalogProcessorResult,
  processingResult,
} from '@backstage/plugin-catalog-node';

const CACHE_KEY = 'v1';

// WARNING: If you change this type, you likely need to bump the CACHE_KEY as well
type CacheItem = {
  etag: string;
  value: {
    type: 'entity';
    entity: Entity;
    location: LocationSpec;
  }[];
};

/** @public */
export class UrlReaderProcessor implements CatalogProcessor {
  constructor(
    private readonly options: {
      reader: UrlReader;
      logger: Logger;
    },
  ) {}

  getProcessorName() {
    return 'url-reader';
  }

  async readLocation(
    location: LocationSpec,
    optional: boolean,
    emit: CatalogProcessorEmit,
    parser: CatalogProcessorParser,
    cache: CatalogProcessorCache,
  ): Promise<boolean> {
    if (location.type !== 'url') {
      return false;
    }

    const cacheItem = await cache.get<CacheItem>(CACHE_KEY);

    try {
      const { response, etag: newEtag } = await this.doRead(
        location.target,
        cacheItem?.etag,
      );

      const parseResults: CatalogProcessorResult[] = [];
      for (const item of response) {
        for await (const parseResult of parser({
          data: item.data,
          location: { type: location.type, target: item.url },
        })) {
          parseResults.push(parseResult);
          emit(parseResult);
        }
      }

      const isOnlyEntities = parseResults.every(r => r.type === 'entity');
      if (newEtag && isOnlyEntities) {
        await cache.set<CacheItem>(CACHE_KEY, {
          etag: newEtag,
          value: parseResults as CatalogProcessorEntityResult[],
        });
      }

      emit(processingResult.refresh(`${location.type}:${location.target}`));
    } catch (error) {
      assertError(error);
      const message = `Unable to read ${location.type}, ${error}`.substring(
        0,
        5000,
      );
      if (error.name === 'NotModifiedError' && cacheItem) {
        for (const parseResult of cacheItem.value) {
          emit(parseResult);
        }
        emit(processingResult.refresh(`${location.type}:${location.target}`));
      } else if (error.name === 'NotFoundError') {
        if (!optional) {
          emit(processingResult.notFoundError(location, message));
        }
      } else {
        emit(processingResult.generalError(location, message));
      }
    }

    return true;
  }

  private async doRead(
    location: string,
    etag?: string,
  ): Promise<{ response: { data: Buffer; url: string }[]; etag?: string }> {
    // Does it contain globs? I.e. does it contain asterisks or question marks
    // (no curly braces for now)

    const { filepath } = parseGitUrl(location);
    if (filepath?.match(/[*?]/)) {
      const limiter = limiterFactory(5);
      const response = await this.options.reader.search(location, { etag });
      const output = response.files.map(async file => ({
        url: file.url,
        data: await limiter(file.content),
      }));
      return { response: await Promise.all(output), etag: response.etag };
    }

    const data = await this.options.reader.readUrl(location, { etag });
    return {
      response: [{ url: location, data: await data.buffer() }],
      etag: data.etag,
    };
  }
}
