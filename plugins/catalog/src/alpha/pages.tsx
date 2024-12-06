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

import {
  compatWrapper,
  convertLegacyRouteRef,
} from '@backstage/core-compat-api';
import {
  coreExtensionData,
  createExtensionInput,
  PageBlueprint,
} from '@backstage/frontend-plugin-api';
import {
  AsyncEntityProvider,
  entityRouteRef,
} from '@backstage/plugin-catalog-react';
import { EntityContentBlueprint } from '@backstage/plugin-catalog-react/alpha';
import { rootRouteRef } from '../routes';
import { useEntityFromUrl } from '../components/CatalogEntityPage/useEntityFromUrl';
import { buildFilterFn } from './filter/FilterWrapper';

export const catalogPage = PageBlueprint.makeWithOverrides({
  inputs: {
    filters: createExtensionInput([coreExtensionData.reactElement]),
  },
  factory(originalFactory, { inputs }) {
    return originalFactory({
      defaultPath: '/catalog',
      routeRef: convertLegacyRouteRef(rootRouteRef),
      loader: async () => {
        const { BaseCatalogPage } = await import('../components/CatalogPage');
        const filters = inputs.filters.map(filter =>
          filter.get(coreExtensionData.reactElement),
        );
        return compatWrapper(<BaseCatalogPage filters={<>{filters}</>} />);
      },
    });
  },
});

export const catalogEntityPage = PageBlueprint.makeWithOverrides({
  name: 'entity',
  inputs: {
    contents: createExtensionInput([
      coreExtensionData.reactElement,
      coreExtensionData.routePath,
      coreExtensionData.routeRef.optional(),
      EntityContentBlueprint.dataRefs.title,
      EntityContentBlueprint.dataRefs.filterFunction.optional(),
      EntityContentBlueprint.dataRefs.filterExpression.optional(),
    ]),
  },
  factory(originalFactory, { inputs }) {
    return originalFactory({
      defaultPath: '/catalog/:namespace/:kind/:name',
      routeRef: convertLegacyRouteRef(entityRouteRef),
      loader: async () => {
        const { EntityLayout } = await import('../components/EntityLayout');
        const Component = () => {
          return (
            <AsyncEntityProvider {...useEntityFromUrl()}>
              <EntityLayout>
                {inputs.contents.map(output => {
                  return (
                    <EntityLayout.Route
                      key={output.get(coreExtensionData.routePath)}
                      path={output.get(coreExtensionData.routePath)}
                      title={output.get(EntityContentBlueprint.dataRefs.title)}
                      if={buildFilterFn(
                        output.get(
                          EntityContentBlueprint.dataRefs.filterFunction,
                        ),
                        output.get(
                          EntityContentBlueprint.dataRefs.filterExpression,
                        ),
                      )}
                    >
                      {output.get(coreExtensionData.reactElement)}
                    </EntityLayout.Route>
                  );
                })}
              </EntityLayout>
            </AsyncEntityProvider>
          );
        };
        return compatWrapper(<Component />);
      },
    });
  },
});

export default [catalogPage, catalogEntityPage];
