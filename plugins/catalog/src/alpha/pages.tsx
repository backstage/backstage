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
  EntityHeaderBlueprint,
  EntityContentBlueprint,
  defaultEntityContentGroups,
  EntityContextMenuItemBlueprint,
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

        type Groups = Record<
          string,
          {
            title: string;
            icon?: string;
            items: Array<(typeof inputs.contents)[0]>;
          }
        >;

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

        let groups = Object.entries(defaultEntityContentGroups).reduce<Groups>(
          (rest, group) => {
            const [groupId, groupValue] = group;
            return {
              ...rest,
              [groupId]: { title: groupValue, items: [] },
            };
          },
          {},
        );

        // config groups override default groups
        if (config.groups) {
          groups = config.groups.reduce<Groups>((rest, group) => {
            const [groupId, groupValue] = Object.entries(group)[0];
            return {
              ...rest,
              [groupId]: {
                title: groupValue.title,
                icon: config.showIcons ? groupValue.icon : undefined,
                items: [],
              },
            };
          }, {});
        }

        for (const output of inputs.contents) {
          const itemId = output.node.spec.id;
          const itemTitle = output.get(EntityContentBlueprint.dataRefs.title);
          const itemGroup = output.get(EntityContentBlueprint.dataRefs.group);
          const group = itemGroup && groups[itemGroup];
          if (!group) {
            groups[itemId] = { title: itemTitle, items: [output] };
            continue;
          }
          group.items.push(output);
        }

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
              >
                {Object.values(groups).flatMap(({ title, icon, items }) =>
                  items.map(output => (
                    <EntityLayout.Route
                      group={{ title, icon }}
                      key={output.get(coreExtensionData.routePath)}
                      path={output.get(coreExtensionData.routePath)}
                      title={output.get(EntityContentBlueprint.dataRefs.title)}
                      icon={
                        config.showIcons
                          ? output.get(EntityContentBlueprint.dataRefs.icon)
                          : undefined
                      }
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
                  )),
                )}
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
