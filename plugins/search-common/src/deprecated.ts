/*
 * Copyright 2024 The Backstage Authors
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

import { Writable } from 'stream';
import { SearchQuery, IndexableResultSet } from './types';

/**
 * A type of function responsible for translating an abstract search query into
 * a concrete query relevant to a particular search engine.
 * @public
 * @deprecated Import from `@backstage/plugin-search-backend-node` instead
 */
export type QueryTranslator = (query: SearchQuery) => unknown;

/**
 * Options when querying a search engine.
 * @public
 * @deprecated Import from `@backstage/plugin-search-backend-node` instead
 */
export type QueryRequestOptions = {
  token?: string;
};

/**
 * Interface that must be implemented by specific search engines, responsible
 * for performing indexing and querying and translating abstract queries into
 * concrete, search engine-specific queries.
 * @public
 * @deprecated Import from `@backstage/plugin-search-backend-node` instead
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
