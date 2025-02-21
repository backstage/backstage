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
  createExtensionDataRef,
  createExtensionBlueprint,
  ExtensionBoundary,
} from '@backstage/frontend-plugin-api';
import {
  entityFilterExpressionDataRef,
  entityFilterFunctionDataRef,
  EntityCardType,
} from './extensionData';
import React from 'react';

/** @alpha */
export interface EntityContentLayoutProps {
  cards: Array<{
    type?: EntityCardType;
    element: React.JSX.Element;
  }>;
}

const entityCardLayoutComponentDataRef = createExtensionDataRef<
  (props: EntityContentLayoutProps) => React.JSX.Element
>().with({
  id: 'catalog.entity-content-layout.component',
});

/** @alpha */
export const EntityContentLayoutBlueprint = createExtensionBlueprint({
  kind: 'entity-content-layout',
  attachTo: { id: 'entity-content:catalog/overview', input: 'layouts' },
  output: [
    entityFilterFunctionDataRef.optional(),
    entityFilterExpressionDataRef.optional(),
    entityCardLayoutComponentDataRef,
  ],
  dataRefs: {
    filterFunction: entityFilterFunctionDataRef,
    filterExpression: entityFilterExpressionDataRef,
    component: entityCardLayoutComponentDataRef,
  },
  config: {
    schema: {
      type: z => z.string().optional(),
      filter: z => z.string().optional(),
    },
  },
  *factory(
    {
      loader,
      filter,
    }: {
      filter?:
        | typeof entityFilterFunctionDataRef.T
        | typeof entityFilterExpressionDataRef.T;
      loader: () => Promise<
        (props: EntityContentLayoutProps) => React.JSX.Element
      >;
    },
    { node, config },
  ) {
    if (config.filter) {
      yield entityFilterExpressionDataRef(config.filter);
    } else if (typeof filter === 'string') {
      yield entityFilterExpressionDataRef(filter);
    } else if (typeof filter === 'function') {
      yield entityFilterFunctionDataRef(filter);
    }

    yield entityCardLayoutComponentDataRef(
      ExtensionBoundary.lazyComponent(node, loader),
    );
  },
});
