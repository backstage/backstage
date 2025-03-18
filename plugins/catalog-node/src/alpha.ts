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
  coreServices,
  createServiceFactory,
  createServiceRef,
} from '@backstage/backend-plugin-api';
import { catalogServiceRef as _catalogServiceRef } from './catalogService';
import { CatalogApi, CatalogClient } from '@backstage/catalog-client';
import { RESOURCE_TYPE_CATALOG_ENTITY } from '@backstage/plugin-catalog-common/alpha';
import { createPermissionResourceRef } from '@backstage/plugin-permission-node';
import { Entity } from '@backstage/catalog-model';
import { EntitiesSearchFilter } from '@backstage/plugin-catalog-node';

/** @alpha */
export const catalogEntityPermissionResourceRef = createPermissionResourceRef<
  Entity,
  EntitiesSearchFilter
>().with({
  pluginId: 'catalog',
  resourceType: RESOURCE_TYPE_CATALOG_ENTITY,
});

/**
 * @alpha
 * @deprecated Use {@link @backstage/plugin-catalog-node#catalogServiceRef} instead
 */
export const catalogServiceRef = createServiceRef<CatalogApi>({
  id: 'catalog-client',
  defaultFactory: async service =>
    createServiceFactory({
      service,
      deps: {
        discoveryApi: coreServices.discovery,
      },
      async factory({ discoveryApi }) {
        return new CatalogClient({ discoveryApi });
      },
    }),
});

export type { CatalogLocationsExtensionPoint } from './extensions';
export { catalogLocationsExtensionPoint } from './extensions';
export type { CatalogProcessingExtensionPoint } from './extensions';
export { catalogProcessingExtensionPoint } from './extensions';
export type { CatalogAnalysisExtensionPoint } from './extensions';
export { catalogAnalysisExtensionPoint } from './extensions';
export type { CatalogPermissionRuleInput } from './extensions';
export type { CatalogPermissionExtensionPoint } from './extensions';
export { catalogPermissionExtensionPoint } from './extensions';
export type { CatalogModelExtensionPoint } from './extensions';
export { catalogModelExtensionPoint } from './extensions';
