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

import {
  createPermission,
  ResourcePermission,
} from '@backstage/plugin-permission-common';

/**
 * Permission resource type which corresponds to catalog entities.
 *
 * {@link https://backstage.io/docs/features/software-catalog/software-catalog-overview}
 * @alpha
 */
export const RESOURCE_TYPE_CATALOG_ENTITY = 'catalog-entity';

/**
 * Convenience type for catalog entity
 * {@link @backstage/plugin-permission-common#ResourcePermission}s.
 * @alpha
 */
export type CatalogEntityPermission = ResourcePermission<
  typeof RESOURCE_TYPE_CATALOG_ENTITY
>;

/**
 * This permission is used to authorize actions that involve reading one or more
 * entities from the catalog.
 *
 * If this permission is not authorized, it will appear that the entity does not
 * exist in the catalog — both in the frontend and in API responses.
 * @alpha
 */
export const catalogEntityReadPermission = createPermission({
  name: 'catalog.entity.read',
  attributes: {
    action: 'read',
  },
  resourceType: RESOURCE_TYPE_CATALOG_ENTITY,
});

/**
 * This permission is used to authorize actions that involve creating a new
 * catalog entity. This includes registering an existing component into the
 * catalog.
 * @alpha
 */
export const catalogEntityCreatePermission = createPermission({
  name: 'catalog.entity.create',
  attributes: {
    action: 'create',
  },
});

/**
 * This permission is used to designate actions that involve removing one or
 * more entities from the catalog.
 * @alpha
 */
export const catalogEntityDeletePermission = createPermission({
  name: 'catalog.entity.delete',
  attributes: {
    action: 'delete',
  },
  resourceType: RESOURCE_TYPE_CATALOG_ENTITY,
});

/**
 * This permission is used to designate refreshing one or more entities from the
 * catalog.
 * @alpha
 */
export const catalogEntityRefreshPermission = createPermission({
  name: 'catalog.entity.refresh',
  attributes: {
    action: 'update',
  },
  resourceType: RESOURCE_TYPE_CATALOG_ENTITY,
});

/**
 * This permission is used to designate actions that involve reading one or more
 * locations from the catalog.
 *
 * If this permission is not authorized, it will appear that the location does
 * not exist in the catalog — both in the frontend and in API responses.
 * @alpha
 */
export const catalogLocationReadPermission = createPermission({
  name: 'catalog.location.read',
  attributes: {
    action: 'read',
  },
});

/**
 * This permission is used to designate actions that involve creating catalog
 * locations.
 * @alpha
 */
export const catalogLocationCreatePermission = createPermission({
  name: 'catalog.location.create',
  attributes: {
    action: 'create',
  },
});

/**
 * This permission is used to designate actions that involve deleting locations
 * from the catalog.
 * @alpha
 */
export const catalogLocationDeletePermission = createPermission({
  name: 'catalog.location.delete',
  attributes: {
    action: 'delete',
  },
});
