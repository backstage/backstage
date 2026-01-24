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

import { createExtensionPoint } from '@backstage/backend-plugin-api';
import { Entity, Validators } from '@backstage/catalog-model';
import {
  CatalogProcessor,
  CatalogProcessorParser,
  EntitiesSearchFilter,
  EntityProvider,
  PlaceholderResolver,
  LocationAnalyzer,
  ScmLocationAnalyzer,
} from '@backstage/plugin-catalog-node';
import {
  Permission,
  PermissionRuleParams,
} from '@backstage/plugin-permission-common';
import { PermissionRule } from '@backstage/plugin-permission-node';

/**
 * @alpha
 */
export interface CatalogLocationsExtensionPoint {
  /**
   * Allows setting custom location types, such as showcased in: https://backstage.io/docs/features/software-catalog/external-integrations/#creating-a-catalog-data-reader-processor
   * @param locationTypes - List of location types to allow, default is "url" and "file"
   */
  setAllowedLocationTypes(locationTypes: Array<string>): void;
}

/**
 * @alpha
 */
export const catalogLocationsExtensionPoint =
  createExtensionPoint<CatalogLocationsExtensionPoint>({
    id: 'catalog.locations',
  });

/**
 * @alpha
 */
export interface CatalogProcessingExtensionPoint {
  /**
   * Adds entity processors. These are responsible for reading, parsing, and
   * processing entities before they are persisted in the catalog.
   *
   * This function also can replace a Default processor if the provided processor
   * matches the processor name.
   *
   * @param processors - One or more processors
   */
  addProcessor(
    ...processors: Array<CatalogProcessor | Array<CatalogProcessor>>
  ): void;

  /**
   * Adds or replaces entity providers. These are responsible for bootstrapping
   * the list of entities out of original data sources. For example, there is
   * one entity source for the config locations, and one for the database
   * stored locations. If you ingest entities out of a third party system, you
   * may want to implement that in terms of an entity provider as well.
   *
   * @param providers - One or more entity providers
   */
  addEntityProvider(
    ...providers: Array<EntityProvider | Array<EntityProvider>>
  ): void;

  /**
   * Adds, or overwrites, a handler for placeholders (e.g. $file) in entity
   * definition files.
   *
   * @param key - The key that identifies the placeholder, e.g. "file"
   * @param resolver - The resolver that gets values for this placeholder
   */
  addPlaceholderResolver(key: string, resolver: PlaceholderResolver): void;

  setOnProcessingErrorHandler(
    handler: (event: {
      unprocessedEntity: Entity;
      errors: Error[];
    }) => Promise<void> | void,
  ): void;
}

/** @alpha */
export interface CatalogModelExtensionPoint {
  /**
   * Sets the validator function to use for one or more special fields of an
   * entity. This is useful if the default rules for formatting of fields are
   * not sufficient.
   *
   * @param validators - The (subset of) validators to set
   */
  setFieldValidators(validators: Partial<Validators>): void;

  /**
   * Sets the entity data parser which is used to read raw data from locations
   * @param parser - Parser which will used to extract entities from raw data
   */
  setEntityDataParser(parser: CatalogProcessorParser): void;
}

/**
 * @alpha
 */
export const catalogProcessingExtensionPoint =
  createExtensionPoint<CatalogProcessingExtensionPoint>({
    id: 'catalog.processing',
  });

/**
 * @alpha
 */
export interface CatalogAnalysisExtensionPoint {
  /**
   * Replaces the entire location analyzer with a new one.
   *
   * @remarks
   *
   * By providing a factory function you can access all the SCM analyzers that
   * have been added through `addScmLocationAnalyzer`. If you provide a
   * `LocationAnalyzer` directly, the SCM analyzers will be ignored.
   */
  setLocationAnalyzer(
    analyzerOrFactory:
      | LocationAnalyzer
      | ((options: {
          scmLocationAnalyzers: ScmLocationAnalyzer[];
        }) => Promise<{ locationAnalyzer: LocationAnalyzer }>),
  ): void;

  /**
   * Adds an analyzer for a specific SCM type to the default location analyzer.
   */
  addScmLocationAnalyzer(analyzer: ScmLocationAnalyzer): void;
}

/**
 * @alpha
 */
export const catalogAnalysisExtensionPoint =
  createExtensionPoint<CatalogAnalysisExtensionPoint>({
    id: 'catalog.analysis',
  });

/** @alpha */
export const catalogModelExtensionPoint =
  createExtensionPoint<CatalogModelExtensionPoint>({
    id: 'catalog.model',
  });

/**
 * @alpha
 * @deprecated Use the `coreServices.permissionsRegistry` instead.
 */
export type CatalogPermissionRuleInput<
  TParams extends PermissionRuleParams = PermissionRuleParams,
> = PermissionRule<Entity, EntitiesSearchFilter, 'catalog-entity', TParams>;

/**
 * @alpha
 * @deprecated Use the `coreServices.permissionsRegistry` instead.
 */
export interface CatalogPermissionExtensionPoint {
  addPermissions(...permissions: Array<Permission | Array<Permission>>): void;
  addPermissionRules(
    ...rules: Array<
      CatalogPermissionRuleInput | Array<CatalogPermissionRuleInput>
    >
  ): void;
}

/**
 * @alpha
 * @deprecated Use the `coreServices.permissionsRegistry` instead.
 */
export const catalogPermissionExtensionPoint =
  createExtensionPoint<CatalogPermissionExtensionPoint>({
    id: 'catalog.permission',
  });
