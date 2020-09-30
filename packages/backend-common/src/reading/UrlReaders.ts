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

import { Config } from '@backstage/config';
import { GithubUrlReader } from './GithubUrlReader';
import { UrlReader } from './types';
import { UrlReaderHostMux } from './UrlReaderHostMux';

export type ReaderFactoryOptions = {
  config: Config;
  logger: Logger;
};
export type ReaderFactory = (options: ReaderFactoryOptions) => UrlReader;

/**
 * UrlReaders provide various utilities related to the UrlReader interface.
 */
export class UrlReaders {
  /**
   * Creates a new UrlReaders instance without any known types.
   */
  static empty({ logger }: { logger: Logger }) {
    return new UrlReaders(new Map(), logger);
  }

  /**
   * Creates a new UrlReaders instance that includes factories for all types
   * implemented in this package.
   */
  static default({ logger }: { logger: Logger }) {
    return new UrlReaders(
      new Map([['github', GithubUrlReader.factory]]),
      logger,
    );
  }

  private constructor(
    private readonly factories: Map<string, ReaderFactory>,
    private readonly logger: Logger,
  ) {}

  /**
   * Constructs a new UrlReader using the provided configuration. Any encountered
   * reader type needs to have a registered factory, or an error will be thrown.
   */
  createWithConfig(config: Config): UrlReader {
    const readerItems = config.getOptionalConfigArray('readers.byHost') ?? [];
    const mux = new UrlReaderHostMux();

    for (const readerItem of readerItems) {
      const type = readerItem.getString('type');
      const host = readerItem.getString('host');
      const readerConfig = readerItem.getConfig('config');

      const factory = this.factories.get(type);
      if (!factory) {
        throw new Error(`Failed to create reader for unknown type '${type}'`);
      }
      const reader = factory({
        config: readerConfig,
        logger: this.logger,
      });

      mux.register(host, reader);
    }

    return mux;
  }

  /**
   * Register a UrlReader factory for a given type
   */
  register(type: string, factory: ReaderFactory) {
    this.factories.set(type, factory);
  }
}
