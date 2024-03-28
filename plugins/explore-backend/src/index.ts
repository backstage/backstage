/*
 * Copyright 2022 The Backstage Authors
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
 * A Backstage plugin for building an exploration page of your software ecosystem
 *
 * @packageDocumentation
 */

export { explorePlugin as default } from './plugin';
export * from './service';
export * from './tools';

/**
 * @internal Example only - do not use in production
 */
export { exampleTools } from './example/exampleTools';

import { ToolDocumentCollatorFactory as _ToolDocumentCollatorFactory } from '@backstage/plugin-search-backend-module-explore';
import type {
  ToolDocument as _ToolDocument,
  ToolDocumentCollatorFactoryOptions as _ToolDocumentCollatorFactoryOptions,
} from '@backstage/plugin-search-backend-module-explore';

/**
 * @public
 * @deprecated import from `@backstage/plugin-search-backend-module-explore` instead
 */
export const ToolDocumentCollatorFactory = _ToolDocumentCollatorFactory;

/**
 * @public
 * @deprecated import from `@backstage/plugin-search-backend-module-explore` instead
 */
export type ToolDocument = _ToolDocument;

/**
 * @public
 * @deprecated import from `@backstage/plugin-search-backend-module-explore` instead
 */
export type ToolDocumentCollatorFactoryOptions =
  _ToolDocumentCollatorFactoryOptions;
