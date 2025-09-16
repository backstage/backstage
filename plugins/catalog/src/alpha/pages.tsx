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

import { convertLegacyRouteRef } from '@backstage/core-compat-api';
import {
  coreExtensionData,
  createExtensionInput,
  PageBlueprint,
} from '@backstage/frontend-plugin-api';
import {
  AsyncEntityProvider,
  entityRouteRef,
} from '@backstage/plugin-catalog-react';
import {
  defaultEntityContentGroupDefinitions,
  EntityContentBlueprint,
  EntityContextMenuItemBlueprint,
  EntityHeaderBlueprint,
  GroupDefinitions,
} from '@backstage/plugin-catalog-react/alpha';
import { rootRouteRef } from '../routes';
import { useEntityFromUrl } from '../components/CatalogEntityPage/useEntityFromUrl';
import { buildFilterFn } from './filter/FilterWrapper';

export const catalogPage = PageBlueprint.makeWithOverrides({
  inputs: {
    filters: createExtensionInput([coreExtensionData.reactElement]),
  },
  config: {
    schema: {
      pagination: z =>
        z
          .union([
            z.boolean(),
            z.object({
              mode: z.enum(['cursor', 'offset']),
              limit: z.number().optional(),
              offset: z.number().optional(),
            }),
          ])
          .default(true),
    },
  },
  factory(originalFactory, { inputs, config }) {
    return originalFactory({
      path: '/catalog',
      routeRef: rootRouteRef,
      loader: async () => {
        const { BaseCatalogPage } = await import('../components/CatalogPage');
        const filters = inputs.filters.map(filter =>
          filter.get(coreExtensionData.reactElement),
        );
        return (
          <BaseCatalogPage
            filters={<>{filters}</>}
            pagination={config.pagination}
          />
        );
      },
    });
  },
});

export const catalogEntityPage = PageBlueprint.makeWithOverrides({
  name: 'entity',
  inputs: {
    headers: createExtensionInput([
      EntityHeaderBlueprint.dataRefs.element.optional(),
      EntityHeaderBlueprint.dataRefs.filterFunction.optional(),
    ]),
    contents: createExtensionInput([
      coreExtensionData.reactElement,
      coreExtensionData.routePath,
      coreExtensionData.routeRef.optional(),
      EntityContentBlueprint.dataRefs.title,
      EntityContentBlueprint.dataRefs.filterFunction.optional(),
      EntityContentBlueprint.dataRefs.filterExpression.optional(),
      EntityContentBlueprint.dataRefs.group.optional(),
      EntityContentBlueprint.dataRefs.icon.optional(),
    ]),
    contextMenuItems: createExtensionInput([
      coreExtensionData.reactElement,
      EntityContextMenuItemBlueprint.dataRefs.filterFunction.optional(),
    ]),
  },
  config: {
    schema: {
      groups: z =>
        z
          .array(
            z.record(
              z.string(),
              z.object({
                title: z.string(),
                icon: z.string().optional(),
              }),
            ),
          )
          .optional(),
      showIcons: z => z.boolean().optional().default(false),
    },
  },
  factory(originalFactory, { config, inputs }) {
    return originalFactory({
      path: '/catalog/:namespace/:kind/:name',
      // NOTE: The `convertLegacyRouteRef` call here ensures that this route ref
      // is mutated to support the new frontend system. Removing this conversion
      // is a potentially breaking change since this is a singleton and the
      // route refs from `core-plugin-api` used to not support the new format.
      // This shouldn't be removed until we completely deprecate the
      // `core-compat-api` package.
      routeRef: convertLegacyRouteRef(entityRouteRef), // READ THE ABOVE
      loader: async () => {
        const { EntityLayout } = await import('./components/EntityLayout');

        const menuItems = inputs.contextMenuItems.map(item => ({
          element: item.get(coreExtensionData.reactElement),
          filter:
            item.get(EntityContextMenuItemBlueprint.dataRefs.filterFunction) ??
            (() => true),
        }));

        // Get available headers, sorted by if they have a filter function or not.
        // TODO(blam): we should really have priority or some specificity here which can be used to sort the headers.
        // That can be done with embedding the priority in the dataRef alongside the filter function.
        const headers = inputs.headers
          .map(header => ({
            element: header.get(EntityHeaderBlueprint.dataRefs.element),
            filter: header.get(EntityHeaderBlueprint.dataRefs.filterFunction),
          }))
          .sort((a, b) => {
            if (a.filter && !b.filter) return -1;
            if (!a.filter && b.filter) return 1;
            return 0;
          });

        const groupDefinitions =
          config.groups?.reduce(
            (rest, group) => ({ ...rest, ...group }),
            {} as GroupDefinitions,
          ) ?? defaultEntityContentGroupDefinitions;

        const Component = () => {
          const entityFromUrl = useEntityFromUrl();
          const { entity } = entityFromUrl;
          const filteredMenuItems = entity
            ? menuItems.filter(i => i.filter(entity)).map(i => i.element)
            : [];

          const header = headers.find(
            h => !h.filter || h.filter(entity!),
          )?.element;

          return (
            <AsyncEntityProvider {...entityFromUrl}>
              <EntityLayout
                header={header}
                contextMenuItems={filteredMenuItems}
                groupDefinitions={groupDefinitions}
                showIcons={config.showIcons}
              >
                {inputs.contents.map(output => (
                  <EntityLayout.Route
                    group={output.get(EntityContentBlueprint.dataRefs.group)}
                    key={output.get(coreExtensionData.routePath)}
                    path={output.get(coreExtensionData.routePath)}
                    title={output.get(EntityContentBlueprint.dataRefs.title)}
                    icon={output.get(EntityContentBlueprint.dataRefs.icon)}
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
                ))}
              </EntityLayout>
            </AsyncEntityProvider>
          );
        };

        return <Component />;
      },
    });
  },
});

export default [catalogPage, catalogEntityPage];
