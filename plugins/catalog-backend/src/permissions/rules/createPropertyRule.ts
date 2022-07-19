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

import { get } from 'lodash';
import { Entity } from '@backstage/catalog-model';
import { RESOURCE_TYPE_CATALOG_ENTITY } from '@backstage/plugin-catalog-common';
import { createCatalogPermissionRule } from './util';

export const createPropertyRule = (propertyType: 'metadata' | 'spec') =>
  createCatalogPermissionRule({
    name: `HAS_${propertyType.toUpperCase()}`,
    description: `Allow entities which have the specified ${propertyType} subfield.`,
    resourceType: RESOURCE_TYPE_CATALOG_ENTITY,
    apply: (resource: Entity, key: string, value?: string) => {
      const foundValue = get(resource[propertyType], key);
      if (value !== undefined) {
        return value === foundValue;
      }
      return !!foundValue;
    },
    toQuery: (key: string, value?: string) => ({
      key: `${propertyType}.${key}`,
      ...(value !== undefined && { values: [value] }),
    }),
  });
