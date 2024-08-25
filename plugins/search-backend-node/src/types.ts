/*
 * Copyright 2021 The Backstage Authors
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
  BackstageCredentials,
  LoggerService,
  SchedulerServiceTaskRunner,
} from '@backstage/backend-plugin-api';
import {
  DocumentCollatorFactory,
  DocumentDecoratorFactory,
  IndexableResultSet,
  SearchQuery,
} from '@backstage/plugin-search-common';
import { Writable } from 'stream';

/**
 * Options required to instantiate the index builder.
 * @public
 */
export type IndexBuilderOptions = {
  searchEngine: SearchEngine;
  logger: LoggerService;
};

/**
 * Parameters required to register a collator.
 * @public
 */
export interface RegisterCollatorParameters {
  /**
   * The schedule for which the provided collator will be called, commonly the result of
   * {@link @backstage/backend-plugin-api#SchedulerService.createScheduledTaskRunner}
   */
  schedule: SchedulerServiceTaskRunner;
  /**
   * The class responsible for returning the document collator of the given type.
   */
  factory: DocumentCollatorFactory;
}

/**
 * Parameters required to register a decorator
 * @public
 */
export interface RegisterDecoratorParameters {
  /**
   * The class responsible for returning the decorator which appends, modifies, or filters documents.
   */
  factory: DocumentDecoratorFactory;
}

/**
 * A type of function responsible for translating an abstract search query into
 * a concrete query relevant to a particular search engine.
 * @public
 */
export type QueryTranslator = (query: SearchQuery) => unknown;

/**
 * Options when querying a search engine.
 * @public
 */
export type QueryRequestOptions =
  | {
      /** @deprecated use the `credentials` option instead. */
      token?: string;
    }
  | {
      credentials: BackstageCredentials;
    };

/**
 * Interface that must be implemented by specific search engines, responsible
 * for performing indexing and querying and translating abstract queries into
 * concrete, search engine-specific queries.
 * @public
 */
export interface SearchEngine {
  /**
   * Override the default translator provided by the SearchEngine.
   */
  setTranslator(translator: QueryTranslator): void;

  /**
   * Factory method for getting a search engine indexer for a given document
   * type.
   *
   * @param type - The type or name of the document set for which an indexer
   *   should be retrieved. This corresponds to the `type` property on the
   *   document collator/decorator factories and will most often be used to
   *   identify an index or group to which documents should be written.
   */
  getIndexer(type: string): Promise<Writable>;

  /**
   * Perform a search query against the SearchEngine.
   */
  query(
    query: SearchQuery,
    options?: QueryRequestOptions,
  ): Promise<IndexableResultSet>;
}
