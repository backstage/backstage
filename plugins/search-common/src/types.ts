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

import { Permission } from '@backstage/plugin-permission-common';
import { JsonObject } from '@backstage/types';
import { Readable, Transform, Writable } from 'stream';

/**
 * @beta
 */
export interface SearchQuery {
  term: string;
  filters?: JsonObject;
  types?: string[];
  pageCursor?: string;
}

/**
 * @beta
 */
export interface Result<TDocument extends SearchDocument> {
  type: string;
  document: TDocument;
}

/**
 * @beta
 */
export interface ResultSet<TDocument extends SearchDocument> {
  results: Result<TDocument>[];
  nextPageCursor?: string;
  previousPageCursor?: string;
}

/**
 * @beta
 */
export type SearchResult = Result<SearchDocument>;

/**
 * @beta
 */
export type SearchResultSet = ResultSet<SearchDocument>;

/**
 * @beta
 */
export type IndexableResult = Result<IndexableDocument>;

/**
 * @beta
 */
export type IndexableResultSet = ResultSet<IndexableDocument>;

/**
 * Base properties that all search documents must include.
 * @beta
 */
export interface SearchDocument {
  /**
   * The primary name of the document (e.g. name, title, identifier, etc).
   */
  title: string;

  /**
   * Free-form text of the document (e.g. description, content, etc).
   */
  text: string;

  /**
   * The relative or absolute URL of the document (target when a search result
   * is clicked).
   */
  location: string;
}

/**
 * Properties related to indexing of documents. This type is only useful for
 * backends working directly with documents being inserted or retrieved from
 * search indexes. When dealing with documents in the frontend, use
 * {@link SearchDocument}.
 * @beta
 */
export type IndexableDocument = SearchDocument & {
  /**
   * Optional authorization information to be used when determining whether this
   * search result should be visible to a given user.
   */
  authorization?: {
    /**
     * Identifier for the resource.
     */
    resourceRef: string;
  };
};

/**
 * Information about a specific document type. Intended to be used in the
 * {@link @backstage/search-backend-node#IndexBuilder} to collect information
 * about the types stored in the index.
 * @beta
 */
export type DocumentTypeInfo = {
  /**
   * The {@link @backstage/plugin-permission-common#Permission} that controls
   * visibility of resources associated with this collator's documents.
   */
  visibilityPermission?: Permission;
};

/**
 * Factory class for instantiating collators.
 * @beta
 */
export interface DocumentCollatorFactory {
  /**
   * The type or name of the document set returned by this collator. Used as an
   * index name by Search Engines.
   */
  readonly type: string;

  /**
   * The {@link @backstage/plugin-permission-common#Permission} that controls
   * visibility of resources associated with this collator's documents.
   */
  readonly visibilityPermission?: Permission;

  /**
   * Instantiates and resolves a document collator.
   */
  getCollator(): Promise<Readable>;
}

/**
 * Factory class for instantiating decorators.
 * @beta
 */
export interface DocumentDecoratorFactory {
  /**
   * An optional array of document/index types on which this decorator should
   * be applied. If no types are provided, this decorator will be applied to
   * all document/index types.
   */
  readonly types?: string[];

  /**
   * Instantiates and resolves a document decorator.
   */
  getDecorator(): Promise<Transform>;
}

/**
 * A type of function responsible for translating an abstract search query into
 * a concrete query relevant to a particular search engine.
 * @beta
 */
export type QueryTranslator = (query: SearchQuery) => unknown;

/**
 * Options when querying a search engine.
 * @beta
 */
export type QueryRequestOptions = {
  token?: string;
};

/**
 * Interface that must be implemented by specific search engines, responsible
 * for performing indexing and querying and translating abstract queries into
 * concrete, search engine-specific queries.
 * @beta
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
