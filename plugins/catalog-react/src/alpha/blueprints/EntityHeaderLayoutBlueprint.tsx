/*
 * Copyright 2026 The Backstage Authors
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
import {
  FilterPredicate,
  createZodV4FilterPredicateSchema,
  filterPredicateToFilterFunction,
} from '@backstage/filter-predicates';
import {
  createExtensionBlueprint,
  createExtensionDataRef,
  ExtensionBoundary,
} from '@backstage/frontend-plugin-api';
import { JSX } from 'react';
import { entityFilterFunctionDataRef } from './extensionData';

/** @alpha */
export interface EntityHeaderLayoutProps {
  tabs: Array<
    | {
        id: string;
        label: string;
        href: string;
      }
    | {
        id: string;
        label: string;
        items: Array<{
          id: string;
          label: string;
          href: string;
        }>;
      }
  >;
  activeTabId?: string;
}

const entityHeaderLayoutComponentDataRef = createExtensionDataRef<
  (props: EntityHeaderLayoutProps) => JSX.Element
>().with({
  id: 'catalog.entity-header-layout.component',
});

/** @alpha */
export const EntityHeaderLayoutBlueprint = createExtensionBlueprint({
  kind: 'entity-header-layout',
  attachTo: { id: 'page:catalog/entity', input: 'headerLayouts' },
  output: [
    entityFilterFunctionDataRef.optional(),
    entityHeaderLayoutComponentDataRef,
  ],
  dataRefs: {
    filterFunction: entityFilterFunctionDataRef,
    component: entityHeaderLayoutComponentDataRef,
  },
  configSchema: {
    filter: createZodV4FilterPredicateSchema().optional(),
  },
  *factory(
    {
      loader,
      filter,
    }: {
      filter?: FilterPredicate | ((entity: Entity) => boolean);
      loader: () => Promise<(props: EntityHeaderLayoutProps) => JSX.Element>;
    },
    { node, config },
  ) {
    if (config.filter) {
      yield entityFilterFunctionDataRef(
        filterPredicateToFilterFunction(config.filter),
      );
    } else if (typeof filter === 'function') {
      yield entityFilterFunctionDataRef(filter);
    } else if (filter) {
      yield entityFilterFunctionDataRef(
        filterPredicateToFilterFunction(filter),
      );
    }
    yield entityHeaderLayoutComponentDataRef(
      ExtensionBoundary.lazyComponent(node, loader),
    );
  },
});
