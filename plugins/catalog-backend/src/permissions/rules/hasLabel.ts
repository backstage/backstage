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

import { Entity } from '@backstage/catalog-model';
import { RESOURCE_TYPE_CATALOG_ENTITY } from '@backstage/plugin-catalog-common';
import { createCatalogPermissionRule } from './util';

/**
 * A catalog {@link @backstage/plugin-permission-node#PermissionRule} which
 * filters for entities with a specified label in its metadata.
 * @alpha
 */
export const hasLabel = createCatalogPermissionRule({
  name: 'HAS_LABEL',
  description: 'Allow entities which have the specified label metadata.',
  resourceType: RESOURCE_TYPE_CATALOG_ENTITY,
  apply: (resource: Entity, label: string) =>
    !!resource.metadata.labels?.hasOwnProperty(label),
  toQuery: (label: string) => ({
    key: `metadata.labels.${label}`,
  }),
});
