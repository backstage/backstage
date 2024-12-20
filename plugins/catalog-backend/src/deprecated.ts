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
  type AnalyzeLocationEntityField as _AnalyzeLocationEntityField,
  type AnalyzeLocationExistingEntity as _AnalyzeLocationExistingEntity,
  type AnalyzeLocationGenerateEntity as _AnalyzeLocationGenerateEntity,
  type AnalyzeLocationRequest as _AnalyzeLocationRequest,
  type AnalyzeLocationResponse as _AnalyzeLocationResponse,
  type LocationSpec as _LocationSpec,
} from '@backstage/plugin-catalog-common';
import {
  locationSpecToMetadataName as _locationSpecToMetadataName,
  locationSpecToLocationEntity as _locationSpecToLocationEntity,
  processingResult as _processingResult,
  type EntitiesSearchFilter as _EntitiesSearchFilter,
  type EntityFilter as _EntityFilter,
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
  type AnalyzeOptions as _AnalyzeOptions,
  type PlaceholderResolver as _PlaceholderResolver,
  type PlaceholderResolverParams as _PlaceholderResolverParams,
  type PlaceholderResolverRead as _PlaceholderResolverRead,
  type PlaceholderResolverResolveUrl as _PlaceholderResolverResolveUrl,
  type LocationAnalyzer as _LocationAnalyzer,
  type ScmLocationAnalyzer as _ScmLocationAnalyzer,
} from '@backstage/plugin-catalog-node';
import {
  defaultCatalogCollatorEntityTransformer as _defaultCatalogCollatorEntityTransformer,
  type CatalogCollatorEntityTransformer as _CatalogCollatorEntityTransformer,
} from '@backstage/plugin-search-backend-module-catalog';

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
export type EntitiesSearchFilter = _EntitiesSearchFilter;
/**
 * @public
 * @deprecated import from `@backstage/plugin-catalog-node` instead
 */
export type EntityFilter = _EntityFilter;
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
 * @deprecated import from `@backstage/plugin-catalog-node` instead
 */
export type AnalyzeOptions = _AnalyzeOptions;
/**
 * @public
 * @deprecated import from `@backstage/plugin-catalog-node` instead
 */
export type LocationAnalyzer = _LocationAnalyzer;
/**
 * @public
 * @deprecated import from `@backstage/plugin-catalog-node` instead
 */
export type ScmLocationAnalyzer = _ScmLocationAnalyzer;

/**
 * @public
 * @deprecated import from `@backstage/plugin-catalog-node` instead
 */
export type PlaceholderResolver = _PlaceholderResolver;

/**
 * @public
 * @deprecated import from `@backstage/plugin-catalog-node` instead
 */
export type PlaceholderResolverParams = _PlaceholderResolverParams;

/**
 * @public
 * @deprecated import from `@backstage/plugin-catalog-node` instead
 */
export type PlaceholderResolverRead = _PlaceholderResolverRead;

/**
 * @public
 * @deprecated import from `@backstage/plugin-catalog-node` instead
 */
export type PlaceholderResolverResolveUrl = _PlaceholderResolverResolveUrl;

/**
 * @public
 * @deprecated use the same type from `@backstage/plugin-catalog-common` instead
 */
export type AnalyzeLocationRequest = _AnalyzeLocationRequest;
/**
 * @public
 * @deprecated use the same type from `@backstage/plugin-catalog-common` instead
 */
export type AnalyzeLocationResponse = _AnalyzeLocationResponse;

/**
 * If the folder pointed to already contained catalog info yaml files, they are
 * read and emitted like this so that the frontend can inform the user that it
 * located them and can make sure to register them as well if they weren't
 * already
 * @public
 * @deprecated use the same type from `@backstage/plugin-catalog-common` instead
 */
export type AnalyzeLocationExistingEntity = _AnalyzeLocationExistingEntity;
/**
 * This is some form of representation of what the analyzer could deduce.
 * We should probably have a chat about how this can best be conveyed to
 * the frontend. It'll probably contain a (possibly incomplete) entity, plus
 * enough info for the frontend to know what form data to show to the user
 * for overriding/completing the info.
 * @public
 * @deprecated use the same type from `@backstage/plugin-catalog-common` instead
 */
export type AnalyzeLocationGenerateEntity = _AnalyzeLocationGenerateEntity;

/**
 *
 * This is where I get really vague. Something like this perhaps? Or it could be
 * something like a json-schema that contains enough info for the frontend to
 * be able to present a form and explanations
 * @public
 * @deprecated use the same type from `@backstage/plugin-catalog-common` instead
 */
export type AnalyzeLocationEntityField = _AnalyzeLocationEntityField;

/**
 * @public
 * @deprecated import from `@backstage/plugin-search-backend-module-catalog` instead
 */
export const defaultCatalogCollatorEntityTransformer =
  _defaultCatalogCollatorEntityTransformer;

/**
 * @public
 * @deprecated import from `@backstage/plugin-search-backend-module-catalog` instead
 */
export type CatalogCollatorEntityTransformer =
  _CatalogCollatorEntityTransformer;
