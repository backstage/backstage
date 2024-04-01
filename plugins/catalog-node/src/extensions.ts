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
export interface CatalogProcessingExtensionPoint {
  addProcessor(
    ...processors: Array<CatalogProcessor | Array<CatalogProcessor>>
  ): void;
  addEntityProvider(
    ...providers: Array<EntityProvider | Array<EntityProvider>>
  ): void;
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
  addLocationAnalyzer(analyzer: ScmLocationAnalyzer): void;
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
 */
export type CatalogPermissionRuleInput<
  TParams extends PermissionRuleParams = PermissionRuleParams,
> = PermissionRule<Entity, EntitiesSearchFilter, 'catalog-entity', TParams>;

/**
 * @alpha
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
 */
export const catalogPermissionExtensionPoint =
  createExtensionPoint<CatalogPermissionExtensionPoint>({
    id: 'catalog.permission',
  });
