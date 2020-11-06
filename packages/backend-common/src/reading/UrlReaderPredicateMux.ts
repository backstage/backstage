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

import { ReadTreeResponse, UrlReader, UrlReaderPredicateTuple } from './types';

type Options = {
  // UrlReader to fall back to if no other reader is matched
  fallback?: UrlReader;
};

/**
 * A UrlReader implementation that selects from a set of UrlReaders
 * based on a predicate tied to each reader.
 */
export class UrlReaderPredicateMux implements UrlReader {
  private readonly readers: UrlReaderPredicateTuple[] = [];
  private readonly fallback?: UrlReader;

  constructor({ fallback }: Options) {
    this.fallback = fallback;
  }

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

    if (this.fallback) {
      return this.fallback.read(url);
    }

    throw new Error(`No reader found that could handle '${url}'`);
  }

  readTree(
    repoUrl: string,
    branchName: string,
    paths: Array<string>,
  ): Promise<ReadTreeResponse> {
    const parsed = new URL(repoUrl);

    for (const { predicate, reader } of this.readers) {
      if (predicate(parsed)) {
        if (reader.readTree) return reader.readTree(repoUrl, branchName, paths);
        throw new Error(
          `Trying to call readTree on UrlReader which does not support the feature.`,
        );
      }
    }

    if (this.fallback) {
      if (this.fallback.readTree)
        return this.fallback.readTree(repoUrl, branchName, paths);
      throw new Error(
        `Trying to call readTree on UrlReader which does not support the feature.`,
      );
    }

    throw new Error(`No reader found that could handle '${repoUrl}'`);
  }

  toString() {
    return `predicateMux{readers=${this.readers
      .map(t => t.reader)
      .join(',')},fallback=${this.fallback}}`;
  }
}
