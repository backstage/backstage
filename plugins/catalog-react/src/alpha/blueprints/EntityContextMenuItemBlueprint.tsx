/*
 * Copyright 2025 The Backstage Authors
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
  createExtensionBlueprint,
  type IconElement,
} from '@backstage/frontend-plugin-api';
import {
  FilterPredicate,
  filterPredicateToFilterFunction,
  createZodV4FilterPredicateSchema,
} from '@backstage/filter-predicates';
import type { Entity } from '@backstage/catalog-model';
import {
  entityContextMenuItemDataRef,
  entityFilterFunctionDataRef,
  type UseProps,
} from './extensionData';

export type { EntityContextMenuItemData, UseProps } from './extensionData';

/** @alpha */
export type EntityContextMenuItemParams = {
  useProps: UseProps;
  icon: IconElement;
  filter?: FilterPredicate | ((entity: Entity) => boolean);
};

/** @alpha */
export const EntityContextMenuItemBlueprint = createExtensionBlueprint({
  kind: 'entity-context-menu-item',
  attachTo: { id: 'page:catalog/entity', input: 'contextMenuItems' },
  output: [
    entityContextMenuItemDataRef,
    entityFilterFunctionDataRef.optional(),
  ],
  dataRefs: {
    data: entityContextMenuItemDataRef,
    filterFunction: entityFilterFunctionDataRef,
  },
  configSchema: {
    filter: createZodV4FilterPredicateSchema().optional(),
  },
  *factory(params: EntityContextMenuItemParams, { config }) {
    yield entityContextMenuItemDataRef({
      icon: params.icon,
      useProps: params.useProps,
    });

    if (config.filter) {
      yield entityFilterFunctionDataRef(
        filterPredicateToFilterFunction(config.filter),
      );
    } else if (typeof params.filter === 'function') {
      yield entityFilterFunctionDataRef(params.filter);
    } else if (params.filter) {
      yield entityFilterFunctionDataRef(
        filterPredicateToFilterFunction(params.filter),
      );
    }
  },
});
