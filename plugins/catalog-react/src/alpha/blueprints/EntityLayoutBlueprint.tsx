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
  createExtensionDataRef,
  ExtensionBoundary,
} from '@backstage/frontend-plugin-api';
import { EntityPredicate } from '../predicates/types';
import { Entity } from '@backstage/catalog-model';
import { resolveEntityFilterData } from './resolveEntityFilterData';
import { createEntityPredicateSchema } from '../predicates/createEntityPredicateSchema';
import {
  entityFilterExpressionDataRef,
  entityFilterFunctionDataRef,
  entityLayoutOrderRef,
} from './extensionData';
import { JSX } from 'react';

export interface EntityLayoutBlueprintProps {
  groupedRoutes: Array<{
    path: string;
    title: string;
    group: string;
    children: JSX.Element;
  }>;
  header: JSX.Element;
}

const entityLayoutComponentDataRef = createExtensionDataRef<
  (props: EntityLayoutBlueprintProps) => JSX.Element
>().with({
  id: 'catalog.entity-layout.component',
});

/** @alpha */
export const EntityLayoutBlueprint = createExtensionBlueprint({
  kind: 'entity-layout',
  attachTo: { id: 'page:catalog/entity', input: 'layouts' },
  dataRefs: {
    filterFunction: entityFilterFunctionDataRef,
    order: entityLayoutOrderRef,
    component: entityLayoutComponentDataRef,
  },
  config: {
    schema: {
      filter: z => createEntityPredicateSchema(z).optional(),
    },
  },
  output: [
    entityFilterFunctionDataRef.optional(),
    entityFilterExpressionDataRef.optional(),
    entityLayoutComponentDataRef.optional(),
    entityLayoutOrderRef.optional(),
  ],
  *factory(
    params: {
      loader: () => Promise<(props: EntityLayoutBlueprintProps) => JSX.Element>;
      filter?: EntityPredicate | ((entity: Entity) => boolean);
      order?: number;
    },
    { node, config },
  ) {
    const { filter, order, loader } = params;

    yield* resolveEntityFilterData(filter, config, node);

    if (loader) {
      yield entityLayoutComponentDataRef(
        ExtensionBoundary.lazyComponent(node, loader),
      );
    }

    if (order) {
      yield entityLayoutOrderRef(order);
    }
  },
});
