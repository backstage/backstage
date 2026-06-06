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
 * The catalog-assistant backend plugin lets users ask natural-language
 * questions about their Backstage catalog and get answers grounded in
 * catalog entities, with citations.
 *
 * @packageDocumentation
 */

export { catalogAssistantPlugin as default } from './plugin';
export type {
  CatalogContextRetriever,
  ScoredEntity,
} from './services/CatalogContextRetriever';
export type {
  GenerateTextFn,
  QueryResult,
  QueryService,
} from './services/QueryService';
