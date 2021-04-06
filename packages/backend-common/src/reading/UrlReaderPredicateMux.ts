/*
 * Copyright 2020 Spotify AB
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

import { NotAllowedError } from '@backstage/errors';
import {
  ReadTreeOptions,
  ReadTreeResponse,
  SearchOptions,
  SearchResponse,
  UrlReader,
  UrlReaderPredicateTuple,
} from './types';

/**
 * A UrlReader implementation that selects from a set of UrlReaders
 * based on a predicate tied to each reader.
 */
export class UrlReaderPredicateMux implements UrlReader {
  private readonly readers: UrlReaderPredicateTuple[] = [];

  register(tuple: UrlReaderPredicateTuple): void {
    this.readers.push(tuple);
  }

  read(url: string): Promise<Buffer> {
    const parsed = new URL(url);

    for (const { predicate, reader } of this.readers) {
      if (predicate(parsed)) {
        return reader.read(url);
      }
    }

    throw new NotAllowedError(`Reading from '${url}' is not allowed`);
  }

  async readTree(
    url: string,
    options?: ReadTreeOptions,
  ): Promise<ReadTreeResponse> {
    const parsed = new URL(url);

    for (const { predicate, reader } of this.readers) {
      if (predicate(parsed)) {
        return await reader.readTree(url, options);
      }
    }

    throw new NotAllowedError(`Reading from '${url}' is not allowed`);
  }

  async search(url: string, options?: SearchOptions): Promise<SearchResponse> {
    const parsed = new URL(url);

    for (const { predicate, reader } of this.readers) {
      if (predicate(parsed)) {
        return await reader.search(url, options);
      }
    }

    throw new NotAllowedError(`Reading from '${url}' is not allowed`);
  }

  toString() {
    return `predicateMux{readers=${this.readers.map(t => t.reader).join(',')}`;
  }
}
