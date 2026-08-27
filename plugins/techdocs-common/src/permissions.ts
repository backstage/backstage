/*
 * Copyright 2024 The Backstage Authors
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

import { createPermission } from '@backstage/plugin-permission-common';

/**
 * This permission is used to authorize actions that involve reading TechDocs
 * documentation for one or more entities.
 *
 * If this permission is not authorized, the user will not be able to access
 * the documentation for the entity, even if they can see the entity in the
 * catalog.
 *
 * @public
 */
export const techDocsEntityReadPermission = createPermission({
  name: 'techdocs.entity.read',
  attributes: {
    action: 'read',
  },
  // Matches the catalog's `catalog-entity` resource type so that catalog
  // permission conditions can be reused when authorizing TechDocs access. The
  // literal is inlined to avoid coupling this public API to an alpha export.
  resourceType: 'catalog-entity',
});

/**
 * List of all TechDocs permissions.
 * @public
 */
export const techDocsPermissions = [techDocsEntityReadPermission];
