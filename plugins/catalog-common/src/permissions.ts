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

import { Permission } from '@backstage/plugin-permission-common';

export const RESOURCE_TYPE_CATALOG_ENTITY = 'catalog-entity';
export const RESOURCE_TYPE_CATALOG_LOCATION = 'catalog-location';

/**
 * This permission is used to designate actions that involve reading a singular
 * or multiple entities from the catalog. It can be passed into calls to {@link
 * @backstage/plugin-permission-common/PermissionClient#authorize} (from the
 * backend) or to {@link @backstage/plugin-permission-react#usePermission} (from
 * the frontend).
 *
 * If this permission is not authorized, it will appear that the entity does not
 * exist in the catalog — both in the frontend and in API responses.
 * @public
 */
export const catalogEntityReadPermission: Permission = {
  name: 'catalog.entity.read',
  attributes: {
    action: 'read',
  },
  resourceType: RESOURCE_TYPE_CATALOG_ENTITY,
};

/**
 * This permission is used to designate actions that involve unregistering an
 * entity from the catalog. It can be passed into calls to {@link
 * @backstage/plugin-permission-common/PermissionClient#authorize} (from the
 * backend) or to {@link @backstage/plugin-permission-react#usePermission} (from
 * the frontend).
 * @public
 */
export const catalogEntityUnregisterPermission: Permission = {
  name: 'catalog.entity.unregister',
  attributes: {
    action: 'delete',
  },
  resourceType: RESOURCE_TYPE_CATALOG_ENTITY,
};

/**
 * This permission is used to designate refreshing an entity from the catalog.
 * It can be passed into calls to {@link
 * @backstage/plugin-permission-common/PermissionClient#authorize} (from the
 * backend) or to {@link @backstage/plugin-permission-react#usePermission} (from
 * the frontend).
 * @public
 */
export const catalogEntityRefreshPermission: Permission = {
  name: 'catalog.entity.refresh',
  attributes: {
    action: 'update',
  },
  resourceType: RESOURCE_TYPE_CATALOG_ENTITY,
};

/**
 * This permission is used to designate actions that involve reading a singular
 * or multiple locations from the catalog. It can be passed into calls to {@link
 * @backstage/plugin-permission-common/PermissionClient#authorize} (from the
 * backend) or to {@link @backstage/plugin-permission-react#usePermission} (from
 * the frontend).
 *
 * If this permission is not authorized, it will appear that the location does
 * not exist in the catalog — both in the frontend and in API responses.
 * @public
 */
export const catalogLocationReadPermission: Permission = {
  name: 'catalog.location.read',
  attributes: {
    action: 'read',
  },
  resourceType: RESOURCE_TYPE_CATALOG_LOCATION,
};

/**
 * This permission is used to designate actions that involve creating a catalog
 * location. It can be passed into calls to {@link
 * @backstage/plugin-permission-common/PermissionClient#authorize} (from the
 * backend) or to {@link @backstage/plugin-permission-react#usePermission} (from
 * the frontend).
 * @public
 */
export const catalogLocationCreatePermission: Permission = {
  name: 'catalog.location.create',
  attributes: {
    action: 'create',
  },
  resourceType: RESOURCE_TYPE_CATALOG_LOCATION,
};

/**
 * This permission is used to designate actions that involve deleting a location
 * from the catalog. It can be passed into calls to {@link
 * @backstage/plugin-permission-common/PermissionClient#authorize} (from the
 * backend) or to {@link @backstage/plugin-permission-react#usePermission} (from
 * the frontend).
 * @public
 */
export const catalogLocationDeletePermission: Permission = {
  name: 'catalog.location.delete',
  attributes: {
    action: 'delete',
  },
  resourceType: RESOURCE_TYPE_CATALOG_LOCATION,
};
