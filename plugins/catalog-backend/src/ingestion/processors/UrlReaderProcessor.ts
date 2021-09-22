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
import { LocationSpec } from '@backstage/catalog-model';
import parseGitUrl from 'git-url-parse';
import limiterFactory from 'p-limit';
import { Logger } from 'winston';
import * as result from './results';
import {
  CatalogProcessor,
  CatalogProcessorCache,
  CatalogProcessorEmit,
  CatalogProcessorEntityResult,
  CatalogProcessorParser,
  CatalogProcessorResult,
} from './types';

const CACHE_KEY = 'v1';

type Options = {
  reader: UrlReader;
  logger: Logger;
};

type CacheItem = {
  etag: string;
  value: CatalogProcessorEntityResult[];
};

export class UrlReaderProcessor implements CatalogProcessor {
  constructor(private readonly options: Options) {}

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
    } catch (error) {
      const message = `Unable to read ${location.type}, ${error}`;
      if (error.name === 'NotModifiedError' && cacheItem) {
        for (const parseResult of cacheItem.value) {
          emit(parseResult);
        }
      } else if (error.name === 'NotFoundError') {
        if (!optional) {
          emit(result.notFoundError(location, message));
        }
      } else {
        emit(result.generalError(location, message));
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

    // Otherwise do a plain read, prioritizing readUrl if available
    if (this.options.reader.readUrl) {
      const data = await this.options.reader.readUrl(location, { etag });
      return {
        response: [{ url: location, data: await data.buffer() }],
        etag: data.etag,
      };
    }

    const data = await this.options.reader.read(location);
    return { response: [{ url: location, data }] };
  }
}
