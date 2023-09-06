/*
 * Copyright 2023 The Backstage Authors
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
  locationSpecToMetadataName as _locationSpecToMetadataName,
  locationSpecToLocationEntity as _locationSpecToLocationEntity,
  processingResult as _processingResult,
  type DeferredEntity as _DeferredEntity,
  type EntityRelationSpec as _EntityRelationSpec,
  type CatalogProcessor as _CatalogProcessor,
  type CatalogProcessorParser as _CatalogProcessorParser,
  type CatalogProcessorCache as _CatalogProcessorCache,
  type CatalogProcessorEmit as _CatalogProcessorEmit,
  type CatalogProcessorLocationResult as _CatalogProcessorLocationResult,
  type CatalogProcessorEntityResult as _CatalogProcessorEntityResult,
  type CatalogProcessorRelationResult as _CatalogProcessorRelationResult,
  type CatalogProcessorErrorResult as _CatalogProcessorErrorResult,
  type CatalogProcessorRefreshKeysResult as _CatalogProcessorRefreshKeysResult,
  type CatalogProcessorResult as _CatalogProcessorResult,
  type EntityProvider as _EntityProvider,
  type EntityProviderConnection as _EntityProviderConnection,
  type EntityProviderMutation as _EntityProviderMutation,
} from '@backstage/plugin-catalog-node';
import { type LocationSpec as _LocationSpec } from '@backstage/plugin-catalog-common';
import { SystemEntityModelProcessor } from '@backstage/plugin-catalog-backend-module-system-entity-model';

/**
 * @public
 * @deprecated import from `@backstage/plugin-catalog-node` instead
 */
export const locationSpecToMetadataName = _locationSpecToMetadataName;
/**
 * @public
 * @deprecated import from `@backstage/plugin-catalog-node` instead
 */
export const locationSpecToLocationEntity = _locationSpecToLocationEntity;
/**
 * @public
 * @deprecated import from `@backstage/plugin-catalog-node` instead
 */
export const processingResult = _processingResult;
/**
 * @public
 * @deprecated import from `@backstage/plugin-catalog-node` instead
 */
export type DeferredEntity = _DeferredEntity;
/**
 * @public
 * @deprecated import from `@backstage/plugin-catalog-node` instead
 */
export type EntityRelationSpec = _EntityRelationSpec;
/**
 * @public
 * @deprecated import from `@backstage/plugin-catalog-node` instead
 */
export type CatalogProcessor = _CatalogProcessor;
/**
 * @public
 * @deprecated import from `@backstage/plugin-catalog-node` instead
 */
export type CatalogProcessorParser = _CatalogProcessorParser;
/**
 * @public
 * @deprecated import from `@backstage/plugin-catalog-node` instead
 */
export type CatalogProcessorCache = _CatalogProcessorCache;
/**
 * @public
 * @deprecated import from `@backstage/plugin-catalog-node` instead
 */
export type CatalogProcessorEmit = _CatalogProcessorEmit;
/**
 * @public
 * @deprecated import from `@backstage/plugin-catalog-node` instead
 */
export type CatalogProcessorLocationResult = _CatalogProcessorLocationResult;
/**
 * @public
 * @deprecated import from `@backstage/plugin-catalog-node` instead
 */
export type CatalogProcessorEntityResult = _CatalogProcessorEntityResult;
/**
 * @public
 * @deprecated import from `@backstage/plugin-catalog-node` instead
 */
export type CatalogProcessorRelationResult = _CatalogProcessorRelationResult;
/**
 * @public
 * @deprecated import from `@backstage/plugin-catalog-node` instead
 */
export type CatalogProcessorErrorResult = _CatalogProcessorErrorResult;
/**
 * @public
 * @deprecated import from `@backstage/plugin-catalog-node` instead
 */
export type CatalogProcessorRefreshKeysResult =
  _CatalogProcessorRefreshKeysResult;
/**
 * @public
 * @deprecated import from `@backstage/plugin-catalog-node` instead
 */
export type CatalogProcessorResult = _CatalogProcessorResult;
/**
 * @public
 * @deprecated import from `@backstage/plugin-catalog-node` instead
 */
export type EntityProvider = _EntityProvider;
/**
 * @public
 * @deprecated import from `@backstage/plugin-catalog-node` instead
 */
export type EntityProviderConnection = _EntityProviderConnection;
/**
 * @public
 * @deprecated import from `@backstage/plugin-catalog-node` instead
 */
export type EntityProviderMutation = _EntityProviderMutation;

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
export type LocationSpec = _LocationSpec;

/**
 * @public
 * @deprecated Import `SystemEntityModelProcessor` from `@backstage/plugin-catalog-backend-module-entity-model` instead
 */
export const BuiltinKindsEntityProcessor = SystemEntityModelProcessor;
