/*
 * Copyright 2023 The Backstage Authors
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

import React from 'react';
import {
  compatWrapper,
  convertLegacyRouteRef,
} from '@backstage/core-compat-api';
import {
  createPageExtension,
  coreExtensionData,
  createExtensionInput,
} from '@backstage/frontend-plugin-api';
import {
  AsyncEntityProvider,
  entityRouteRef,
} from '@backstage/plugin-catalog-react';
import { catalogExtensionData } from '@backstage/plugin-catalog-react/alpha';
import { rootRouteRef } from '../routes';
import { useEntityFromUrl } from '../components/CatalogEntityPage/useEntityFromUrl';
import { buildFilterFn } from './filter/FilterWrapper';

export const catalogPage = createPageExtension({
  defaultPath: '/catalog',
  routeRef: convertLegacyRouteRef(rootRouteRef),
  inputs: {
    filters: createExtensionInput({
      element: coreExtensionData.reactElement,
    }),
  },
  loader: async ({ inputs }) => {
    const { BaseCatalogPage } = await import('../components/CatalogPage');
    const filters = inputs.filters.map(filter => filter.output.element);
    return compatWrapper(<BaseCatalogPage filters={<>{filters}</>} />);
  },
});

export const catalogEntityPage = createPageExtension({
  name: 'entity',
  defaultPath: '/catalog/:namespace/:kind/:name',
  routeRef: convertLegacyRouteRef(entityRouteRef),
  inputs: {
    contents: createExtensionInput({
      element: coreExtensionData.reactElement,
      path: coreExtensionData.routePath,
      routeRef: coreExtensionData.routeRef.optional(),
      title: catalogExtensionData.entityContentTitle,
      filterFunction: catalogExtensionData.entityFilterFunction.optional(),
      filterExpression: catalogExtensionData.entityFilterExpression.optional(),
    }),
  },
  loader: async ({ inputs }) => {
    const { EntityLayout } = await import('../components/EntityLayout');
    const Component = () => {
      return (
        <AsyncEntityProvider {...useEntityFromUrl()}>
          <EntityLayout>
            {inputs.contents.map(({ output }) => (
              <EntityLayout.Route
                key={output.path}
                path={output.path}
                title={output.title}
                if={buildFilterFn(
                  output.filterFunction,
                  output.filterExpression,
                )}
              >
                {output.element}
              </EntityLayout.Route>
            ))}
          </EntityLayout>
        </AsyncEntityProvider>
      );
    };
    return compatWrapper(<Component />);
  },
});

export default [catalogPage, catalogEntityPage];
