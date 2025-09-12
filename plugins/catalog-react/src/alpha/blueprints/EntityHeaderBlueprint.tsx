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
  coreExtensionData,
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

/** @alpha */
export interface EntityContentLayoutHeaderProps {
  contextMenu?: JSX.Element;
}

const entityLayoutHeaderComponentDataRef = createExtensionDataRef<
  (props: EntityContentLayoutHeaderProps) => JSX.Element
>().with({
  id: 'catalog.entity-header.component',
});

/** @alpha */
export const EntityHeaderBlueprint = createExtensionBlueprint({
  kind: 'entity-header',
  attachTo: { id: 'page:catalog/entity', input: 'headers' },
  dataRefs: {
    filterFunction: entityFilterFunctionDataRef,
    element: coreExtensionData.reactElement,
    order: entityLayoutOrderRef,
    component: entityLayoutHeaderComponentDataRef,
  },
  config: {
    schema: {
      filter: z => createEntityPredicateSchema(z).optional(),
    },
  },
  output: [
    entityFilterFunctionDataRef.optional(),
    entityFilterExpressionDataRef.optional(),
    coreExtensionData.reactElement.optional(),
    entityLayoutHeaderComponentDataRef.optional(),
    entityLayoutOrderRef.optional(),
  ],
  *factory(
    params: {
      filter?: EntityPredicate | ((entity: Entity) => boolean);
      order?: number;
    } & (
      | {
          loader: () => Promise<JSX.Element>;
        }
      | {
          componentLoader: () => Promise<
            (props: EntityContentLayoutHeaderProps) => JSX.Element
          >;
        }
    ),
    { node, config },
  ) {
    const { filter, order } = params;

    yield* resolveEntityFilterData(filter, config, node);

    if ('componentLoader' in params) {
      yield entityLayoutHeaderComponentDataRef(
        ExtensionBoundary.lazyComponent(node, params.componentLoader),
      );
    } else if ('loader' in params) {
      yield coreExtensionData.reactElement(
        ExtensionBoundary.lazy(node, params.loader),
      );
    }

    if (order) {
      yield entityLayoutOrderRef(order);
    }
  },
});
