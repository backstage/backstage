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

export {
  decodePageCursor as decodeElasticSearchPageCursor,
  ElasticSearchSearchEngine,
} from './ElasticSearchSearchEngine';
export { isOpenSearchCompatible } from './ElasticSearchClientOptions';
export type {
  BaseElasticSearchClientOptions,
  ElasticSearchAgentOptions,
  ElasticSearchConnectionConstructor,
  ElasticSearchElasticSearchClientOptions,
  ElasticSearchTransportConstructor,
  ElasticSearchNodeOptions,
  ElasticSearchAuth,
  OpenSearchAuth,
  OpenSearchConnectionConstructor,
  OpenSearchElasticSearchClientOptions,
  OpenSearchNodeOptions,
} from './ElasticSearchClientOptions';
export type {
  ElasticSearchAliasAction,
  ElasticSearchClientWrapper,
  ElasticSearchIndexAction,
} from './ElasticSearchClientWrapper';
export type {
  ElasticSearchConcreteQuery,
  ElasticSearchClientOptions,
  ElasticSearchQueryConfig,
  ElasticSearchHighlightConfig,
  ElasticSearchHighlightOptions,
  ElasticSearchQueryTranslator,
  ElasticSearchQueryTranslatorOptions,
  ElasticSearchOptions,
} from './ElasticSearchSearchEngine';
export type {
  ElasticSearchSearchEngineIndexer,
  ElasticSearchSearchEngineIndexerOptions,
} from './ElasticSearchSearchEngineIndexer';
export type {
  ElasticSearchCustomIndexTemplate,
  ElasticSearchCustomIndexTemplateBody,
} from './types';
