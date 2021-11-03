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
import { JsonObject } from '@backstage/types';

export interface SearchQuery {
  term: string;
  filters?: JsonObject;
  types?: string[];
  pageCursor?: string;
}

export interface SearchResult {
  type: string;
  document: IndexableDocument;
}

export interface SearchResultSet {
  results: SearchResult[];
  nextPageCursor?: string;
  previousPageCursor?: string;
}

/**
 * Base properties that all indexed documents must include, as well as some
 * common properties that documents are encouraged to use where appropriate.
 */
export interface IndexableDocument {
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
 * Interface that must be implemented in order to expose new documents to
 * search.
 */
export interface DocumentCollator {
  /**
   * The type or name of the document set returned by this collator. Used as an
   * index name by Search Engines.
   */
  readonly type: string;
  execute(): Promise<IndexableDocument[]>;
}

/**
 * Interface that must be implemented in order to decorate existing documents with
 * additional metadata.
 */
export interface DocumentDecorator {
  /**
   * An optional array of document/index types on which this decorator should
   * be applied. If no types are provided, this decorator will be applied to
   * all document/index types.
   */
  readonly types?: string[];
  execute(documents: IndexableDocument[]): Promise<IndexableDocument[]>;
}

/**
 * A type of function responsible for translating an abstract search query into
 * a concrete query relevant to a particular search engine.
 */
export type QueryTranslator = (query: SearchQuery) => unknown;

/**
 * Interface that must be implemented by specific search engines, responsible
 * for performing indexing and querying and translating abstract queries into
 * concrete, search engine-specific queries.
 */
export interface SearchEngine {
  /**
   * Override the default translator provided by the SearchEngine.
   */
  setTranslator(translator: QueryTranslator): void;

  /**
   * Add the given documents to the SearchEngine index of the given type.
   */
  index(type: string, documents: IndexableDocument[]): Promise<void>;

  /**
   * Perform a search query against the SearchEngine.
   */
  query(query: SearchQuery): Promise<SearchResultSet>;
}
