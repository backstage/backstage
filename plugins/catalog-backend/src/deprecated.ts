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
  locationSpecToMetadataName as nodeLocationSpecToMetadataName,
  locationSpecToLocationEntity as nodeLocationSpecToLocationEntity,
  processingResult as nodeProcessingResult,
  type DeferredEntity as NodeDeferredEntity,
  type EntityRelationSpec as NodeEntityRelationSpec,
  type CatalogProcessor as NodeCatalogProcessor,
  type CatalogProcessorParser as NodeCatalogProcessorParser,
  type CatalogProcessorCache as NodeCatalogProcessorCache,
  type CatalogProcessorEmit as NodeCatalogProcessorEmit,
  type CatalogProcessorLocationResult as NodeCatalogProcessorLocationResult,
  type CatalogProcessorEntityResult as NodeCatalogProcessorEntityResult,
  type CatalogProcessorRelationResult as NodeCatalogProcessorRelationResult,
  type CatalogProcessorErrorResult as NodeCatalogProcessorErrorResult,
  type CatalogProcessorRefreshKeysResult as NodeCatalogProcessorRefreshKeysResult,
  type CatalogProcessorResult as NodeCatalogProcessorResult,
  type EntityProvider as NodeEntityProvider,
  type EntityProviderConnection as NodeEntityProviderConnection,
  type EntityProviderMutation as NodeEntityProviderMutation,
} from '@backstage/plugin-catalog-node';
import { type LocationSpec as CommonLocationSpec } from '@backstage/plugin-catalog-common';

/**
 * @public
 * @deprecated import from `@backstage/plugin-catalog-node` instead
 */
export const locationSpecToMetadataName = nodeLocationSpecToMetadataName;
/**
 * @public
 * @deprecated import from `@backstage/plugin-catalog-node` instead
 */
export const locationSpecToLocationEntity = nodeLocationSpecToLocationEntity;
/**
 * @public
 * @deprecated import from `@backstage/plugin-catalog-node` instead
 */
export const processingResult = nodeProcessingResult;
/**
 * @public
 * @deprecated import from `@backstage/plugin-catalog-node` instead
 */
export type DeferredEntity = NodeDeferredEntity;
/**
 * @public
 * @deprecated import from `@backstage/plugin-catalog-node` instead
 */
export type EntityRelationSpec = NodeEntityRelationSpec;
/**
 * @public
 * @deprecated import from `@backstage/plugin-catalog-node` instead
 */
export type CatalogProcessor = NodeCatalogProcessor;
/**
 * @public
 * @deprecated import from `@backstage/plugin-catalog-node` instead
 */
export type CatalogProcessorParser = NodeCatalogProcessorParser;
/**
 * @public
 * @deprecated import from `@backstage/plugin-catalog-node` instead
 */
export type CatalogProcessorCache = NodeCatalogProcessorCache;
/**
 * @public
 * @deprecated import from `@backstage/plugin-catalog-node` instead
 */
export type CatalogProcessorEmit = NodeCatalogProcessorEmit;
/**
 * @public
 * @deprecated import from `@backstage/plugin-catalog-node` instead
 */
export type CatalogProcessorLocationResult = NodeCatalogProcessorLocationResult;
/**
 * @public
 * @deprecated import from `@backstage/plugin-catalog-node` instead
 */
export type CatalogProcessorEntityResult = NodeCatalogProcessorEntityResult;
/**
 * @public
 * @deprecated import from `@backstage/plugin-catalog-node` instead
 */
export type CatalogProcessorRelationResult = NodeCatalogProcessorRelationResult;
/**
 * @public
 * @deprecated import from `@backstage/plugin-catalog-node` instead
 */
export type CatalogProcessorErrorResult = NodeCatalogProcessorErrorResult;
/**
 * @public
 * @deprecated import from `@backstage/plugin-catalog-node` instead
 */
export type CatalogProcessorRefreshKeysResult =
  NodeCatalogProcessorRefreshKeysResult;
/**
 * @public
 * @deprecated import from `@backstage/plugin-catalog-node` instead
 */
export type CatalogProcessorResult = NodeCatalogProcessorResult;
/**
 * @public
 * @deprecated import from `@backstage/plugin-catalog-node` instead
 */
export type EntityProvider = NodeEntityProvider;
/**
 * @public
 * @deprecated import from `@backstage/plugin-catalog-node` instead
 */
export type EntityProviderConnection = NodeEntityProviderConnection;
/**
 * @public
 * @deprecated import from `@backstage/plugin-catalog-node` instead
 */
export type EntityProviderMutation = NodeEntityProviderMutation;

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
export type LocationSpec = CommonLocationSpec;
