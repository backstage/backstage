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

import { Logger } from 'winston';
import { Config } from '@backstage/config';
import { ReaderFactory, UrlReader } from './types';
import { UrlReaderPredicateMux } from './UrlReaderPredicateMux';
import { AzureUrlReader } from './AzureUrlReader';
import { BitbucketUrlReader } from './BitbucketUrlReader';
import { GithubUrlReader } from './GithubUrlReader';
import { GitlabUrlReader } from './GitlabUrlReader';
import { FetchUrlReader } from './FetchUrlReader';

/**
 * UrlReaders provide various utilities related to the UrlReader interface.
 */
export class UrlReaders {
  /**
   * Creates a new UrlReaders instance without any known types.
   */
  static empty({ logger }: { logger: Logger }) {
    return new UrlReaders([], logger);
  }

  /**
   * Creates a new UrlReaders instance that includes all the default factories from this package
   */
  static default({ logger }: { logger: Logger }) {
    return new UrlReaders(
      [
        AzureUrlReader.factory,
        BitbucketUrlReader.factory,
        GithubUrlReader.factory,
        GitlabUrlReader.factory,
      ],
      logger,
      new FetchUrlReader(),
    );
  }

  private constructor(
    private readonly factories: ReaderFactory[],
    private readonly logger: Logger,
    private fallback?: UrlReader,
  ) {}

  /**
   * Constructs a new UrlReader using the provided configuration. Any encountered
   * reader type needs to have a registered factory, or an error will be thrown.
   */
  createWithConfig(config: Config): UrlReader {
    const mux = new UrlReaderPredicateMux({ fallback: this.fallback });

    for (const factory of this.factories) {
      const tuples = factory({ config, logger: this.logger });

      for (const tuple of tuples) {
        mux.register(tuple);
      }
    }

    return mux;
  }

  /**
   * Register a UrlReader factory
   */
  addFactory(factory: ReaderFactory) {
    this.factories.push(factory);
  }

  setFallback(reader?: UrlReader) {
    this.fallback = reader;
  }
}
