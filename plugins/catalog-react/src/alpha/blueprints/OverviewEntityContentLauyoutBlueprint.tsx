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

import { Entity } from '@backstage/catalog-model';
import {
  createExtensionDataRef,
  createExtensionBlueprint,
  ExtensionBoundary,
} from '@backstage/frontend-plugin-api';
import React, { lazy as reactLazy, ComponentProps } from 'react';
import { EntityCardBlueprint } from './EntityCardBlueprint';

/** @alpha */
export interface OverviewEntityContentLayoutProps {
  buildFilterFn: (
    filterFunction?: (entity: Entity) => boolean,
    filterExpression?: string,
  ) => (entity: Entity) => boolean;
  cards: Array<{
    area?: string;
    element: React.JSX.Element;
    filterFunction?: (entity: Entity) => boolean;
    filterExpression?: string;
  }>;
}

const catalogOverviewEntityContentLayoutAreasDataRef = createExtensionDataRef<
  Array<string>
>().with({
  id: 'catalog.overview-entity-content.layout.areas',
});

const catalogOverviewEntityContentLayoutFilterFunctionDataRef =
  createExtensionDataRef<(entity: Entity) => boolean>().with({
    id: 'catalog.overview-entity-content.layout.filter-function',
  });

const catalogOverviewEntityContentLayoutFilterExpressionDataRef =
  createExtensionDataRef<string>().with({
    id: 'catalog.overview-entity-content.layout.filter-expression',
  });

const catalogOverviewEntityContentLayoutComponentDataRef =
  createExtensionDataRef<
    (props: OverviewEntityContentLayoutProps) => React.JSX.Element
  >().with({
    id: 'catalog.overview-entity-content.layout.page-component',
  });

/** @alpha */
export const OverviewEntityContentLauyoutBlueprint = createExtensionBlueprint({
  kind: 'catalog-overview-entity-content-layout',
  attachTo: { id: 'entity-content:catalog/overview', input: 'layouts' },
  output: [
    catalogOverviewEntityContentLayoutAreasDataRef,
    EntityCardBlueprint.dataRefs.area,
    catalogOverviewEntityContentLayoutFilterFunctionDataRef.optional(),
    catalogOverviewEntityContentLayoutFilterExpressionDataRef.optional(),
    catalogOverviewEntityContentLayoutComponentDataRef,
  ],
  dataRefs: {
    areas: catalogOverviewEntityContentLayoutAreasDataRef,
    defaultArea: EntityCardBlueprint.dataRefs.area,
    filterFunction: catalogOverviewEntityContentLayoutFilterFunctionDataRef,
    filterExpression: catalogOverviewEntityContentLayoutFilterExpressionDataRef,
    component: catalogOverviewEntityContentLayoutComponentDataRef,
  },
  config: {
    schema: {
      area: z => z.string().optional(),
      filter: z => z.string().optional(),
    },
  },
  *factory(
    {
      loader,
      areas,
      defaultArea,
      defaultFilter = () => false, // do not use the layout if a default filter is undefined
    }: {
      areas: Array<string>;
      defaultArea: (typeof areas)[number]; // fixed typescript area type
      defaultFilter?:
        | typeof catalogOverviewEntityContentLayoutFilterFunctionDataRef.T
        | typeof catalogOverviewEntityContentLayoutFilterExpressionDataRef.T;
      loader: () => Promise<
        (props: OverviewEntityContentLayoutProps) => React.JSX.Element
      >;
    },
    { node, config },
  ) {
    yield catalogOverviewEntityContentLayoutAreasDataRef(areas);

    yield EntityCardBlueprint.dataRefs.area(config.area ?? defaultArea);

    if (config.filter) {
      yield catalogOverviewEntityContentLayoutFilterExpressionDataRef(
        config.filter,
      );
    } else if (typeof defaultFilter === 'string') {
      yield catalogOverviewEntityContentLayoutFilterExpressionDataRef(
        defaultFilter,
      );
    } else if (typeof defaultFilter === 'function') {
      yield catalogOverviewEntityContentLayoutFilterFunctionDataRef(
        defaultFilter,
      );
    }

    const ExtensionComponent = reactLazy(() =>
      loader().then(component => ({ default: component })),
    );

    yield catalogOverviewEntityContentLayoutComponentDataRef(
      (props: ComponentProps<typeof ExtensionComponent>) => {
        return (
          <ExtensionBoundary node={node}>
            <ExtensionComponent {...props} />
          </ExtensionBoundary>
        );
      },
    );
  },
});
