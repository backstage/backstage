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

/**
 * The Backstage backend plugin that provides the Backstage catalog
 *
 * @packageDocumentation
 */

export type {
  DeferredEntity,
  EntityRelationSpec,
  CatalogProcessor,
  CatalogProcessorParser,
  CatalogProcessorCache,
  CatalogProcessorEmit,
  CatalogProcessorLocationResult,
  CatalogProcessorEntityResult,
  CatalogProcessorRelationResult,
  CatalogProcessorErrorResult,
  CatalogProcessorRefreshKeysResult,
  CatalogProcessorResult,
  EntityProvider,
  EntityProviderConnection,
  EntityProviderMutation,
} from '@backstage/plugin-catalog-node';
export { processingResult } from '@backstage/plugin-catalog-node';

export * from './catalog';
export * from './ingestion';
export * from './modules';
export * from './processing';
export * from './search';
export * from './service';
export * from './util';

import { LocationSpec as NonDeprecatedLocationSpec } from '@backstage/plugin-catalog-common';

/**
 * Holds the entity location information.
 *
 * @remarks
 *
 *  `presence` flag: when using repo importer plugin, location is being created before the component yaml file is merged to the main branch.
 *  This flag is then set to indicate that the file can be not present.
 *  default value: 'required'.
 *
 * @public
 * @deprecated use the same type from `@backstage/plugin-catalog-common` instead
 */
export type LocationSpec = NonDeprecatedLocationSpec;
