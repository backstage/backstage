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

import { Logger } from 'winston';
import { Config } from '@backstage/config';
import { ReaderFactory, UrlReader } from './types';
import { UrlReaderPredicateMux } from './UrlReaderPredicateMux';
import { AzureUrlReader } from './AzureUrlReader';
import { BitbucketUrlReader } from './BitbucketUrlReader';
import { GerritUrlReader } from './GerritUrlReader';
import { GithubUrlReader } from './GithubUrlReader';
import { GitlabUrlReader } from './GitlabUrlReader';
import { DefaultReadTreeResponseFactory } from './tree';
import { FetchUrlReader } from './FetchUrlReader';
import { GoogleGcsUrlReader } from './GoogleGcsUrlReader';
import { AwsS3UrlReader } from './AwsS3UrlReader';

/**
 * Creation options for {@link UrlReaders}.
 *
 * @public
 */
export type UrlReadersOptions = {
  /** Root config object */
  config: Config;
  /** Logger used by all the readers */
  logger: Logger;
  /** A list of factories used to construct individual readers that match on URLs */
  factories?: ReaderFactory[];
};

/**
 * Helps construct {@link UrlReader}s.
 *
 * @public
 */
export class UrlReaders {
  /**
   * Creates a custom {@link UrlReader} wrapper for your own set of factories.
   */
  static create(options: UrlReadersOptions): UrlReader {
    const { logger, config, factories } = options;
    const mux = new UrlReaderPredicateMux(logger);
    const treeResponseFactory = DefaultReadTreeResponseFactory.create({
      config,
    });

    for (const factory of factories ?? []) {
      const tuples = factory({ config, logger: logger, treeResponseFactory });

      for (const tuple of tuples) {
        mux.register(tuple);
      }
    }

    return mux;
  }

  /**
   * Creates a {@link UrlReader} wrapper that includes all the default factories
   * from this package.
   *
   * Any additional factories passed will be loaded before the default ones.
   */
  static default(options: UrlReadersOptions) {
    const { logger, config, factories = [] } = options;
    return UrlReaders.create({
      logger,
      config,
      factories: factories.concat([
        AzureUrlReader.factory,
        BitbucketUrlReader.factory,
        GerritUrlReader.factory,
        GithubUrlReader.factory,
        GitlabUrlReader.factory,
        GoogleGcsUrlReader.factory,
        AwsS3UrlReader.factory,
        FetchUrlReader.factory,
      ]),
    });
  }
}
