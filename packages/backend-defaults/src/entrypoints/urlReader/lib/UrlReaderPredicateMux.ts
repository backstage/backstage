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

import {
  UrlReaderServiceReadTreeOptions,
  UrlReaderServiceReadTreeResponse,
  UrlReaderServiceReadUrlOptions,
  UrlReaderServiceReadUrlResponse,
  UrlReaderServiceSearchOptions,
  UrlReaderServiceSearchResponse,
  UrlReaderService,
} from '@backstage/backend-plugin-api';
import { NotAllowedError } from '@backstage/errors';
import { UrlReaderPredicateTuple } from './types';

function notAllowedMessage(url: string) {
  return (
    `Reading from '${url}' is not allowed. ` +
    `You may need to configure an integration for the target host, or add it ` +
    `to the configured list of allowed hosts at 'backend.reading.allow'`
  );
}

/**
 * A UrlReaderService implementation that selects from a set of readers
 * based on a predicate tied to each reader.
 */
export class UrlReaderPredicateMux implements UrlReaderService {
  private readonly readers: UrlReaderPredicateTuple[] = [];

  register(tuple: UrlReaderPredicateTuple): void {
    this.readers.push(tuple);
  }

  async readUrl(
    url: string,
    options?: UrlReaderServiceReadUrlOptions,
  ): Promise<UrlReaderServiceReadUrlResponse> {
    const parsed = new URL(url);

    for (const { predicate, reader } of this.readers) {
      if (predicate(parsed)) {
        return reader.readUrl(url, options);
      }
    }

    throw new NotAllowedError(notAllowedMessage(url));
  }

  async readTree(
    url: string,
    options?: UrlReaderServiceReadTreeOptions,
  ): Promise<UrlReaderServiceReadTreeResponse> {
    const parsed = new URL(url);

    for (const { predicate, reader } of this.readers) {
      if (predicate(parsed)) {
        return await reader.readTree(url, options);
      }
    }

    throw new NotAllowedError(notAllowedMessage(url));
  }

  async search(
    url: string,
    options?: UrlReaderServiceSearchOptions,
  ): Promise<UrlReaderServiceSearchResponse> {
    const parsed = new URL(url);

    for (const { predicate, reader } of this.readers) {
      if (predicate(parsed)) {
        return await reader.search(url, options);
      }
    }

    throw new NotAllowedError(notAllowedMessage(url));
  }

  toString() {
    return `predicateMux{readers=${this.readers.map(t => t.reader).join(',')}`;
  }
}
