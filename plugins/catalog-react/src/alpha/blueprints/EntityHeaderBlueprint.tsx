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
  coreExtensionData,
  ExtensionBoundary,
} from '@backstage/frontend-plugin-api';
import { EntityPredicate } from '../predicates/types';
import { Entity } from '@backstage/catalog-model';
import { resolveEntityFilterData } from './resolveEntityFilterData';
import { createEntityPredicateSchema } from '../predicates/createEntityPredicateSchema';
import {
  entityFilterExpressionDataRef,
  entityFilterFunctionDataRef,
} from './extensionData';

/** @alpha */
export const EntityHeaderBlueprint = createExtensionBlueprint({
  kind: 'entity-header',
  attachTo: { id: 'page:catalog/entity', input: 'headers' },
  dataRefs: {
    filterFunction: entityFilterFunctionDataRef,
    element: coreExtensionData.reactElement,
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
  ],
  *factory(
    params: {
      loader: () => Promise<JSX.Element>;
      filter?: EntityPredicate | ((entity: Entity) => boolean);
    },
    { node, config },
  ) {
    const { loader, filter } = params;

    yield* resolveEntityFilterData(filter, config, node);

    if (loader) {
      yield coreExtensionData.reactElement(
        ExtensionBoundary.lazy(node, loader),
      );
    }
  },
});
