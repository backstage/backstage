/*
 * Copyright 2026 The Backstage Authors
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

/**
 * A module for the search backend that implements search using OpenSearch.
 *
 * @packageDocumentation
 */

export { default } from './module';
export * from './module';

export {
  decodePageCursor as decodeOpenSearchPageCursor,
  encodePageCursor as encodeOpenSearchPageCursor,
  OpenSearchClientWrapper,
  OpenSearchSearchEngine,
  OpenSearchSearchEngineIndexer,
} from './engines';
export type {
  OpenSearchAliasAction,
  OpenSearchClientOptions,
  OpenSearchClientResponse,
  OpenSearchClientResponsePromise,
  OpenSearchConcreteQuery,
  OpenSearchHighlightConfig,
  OpenSearchHighlightOptions,
  OpenSearchIndexAction,
  OpenSearchIndexTemplate,
  OpenSearchOptions,
  OpenSearchQueryConfig,
  OpenSearchQueryTranslator,
  OpenSearchQueryTranslatorOptions,
  OpenSearchSearchEngineIndexerOptions,
  OpenSearchSearchEngineOptions,
} from './engines';

export {
  awsOpenSearchProvider,
  builtInOpenSearchProviders,
  defaultOpenSearchProvider,
} from './builtinProviders';
