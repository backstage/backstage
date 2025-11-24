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
import {
  defaultEntityContentGroups,
  EntityContentBlueprint,
  EntityContextMenuItemBlueprint,
  EntityHeaderBlueprint,
  EntityLayoutBlueprint,
} from '@backstage/plugin-catalog-react/alpha';
import { rootRouteRef } from '../routes';
import { useEntityFromUrl } from '../components/CatalogEntityPage/useEntityFromUrl';
import { buildFilterFn } from './filter/FilterWrapper';
import { EntityLayoutRouteProps } from './components/EntityLayout/EntityLayout.tsx';
import { EntityHeader } from './components/EntityHeader';
import sortBy from 'lodash/sortBy';
import { Fragment, useMemo } from 'react';
import { EntityContextMenu } from './components/EntityContextMenu';

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
      routeRef: convertLegacyRouteRef(rootRouteRef),
      loader: async () => {
        const { BaseCatalogPage } = await import('../components/CatalogPage');
        const filters = inputs.filters.map(filter =>
          filter.get(coreExtensionData.reactElement),
        );
        return compatWrapper(
          <BaseCatalogPage
            filters={<>{filters}</>}
            pagination={config.pagination}
          />,
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
      EntityHeaderBlueprint.dataRefs.component.optional(),
      EntityHeaderBlueprint.dataRefs.filterFunction.optional(),
      EntityHeaderBlueprint.dataRefs.order.optional(),
    ]),
    contents: createExtensionInput([
      coreExtensionData.reactElement,
      coreExtensionData.routePath,
      coreExtensionData.routeRef.optional(),
      EntityContentBlueprint.dataRefs.title,
      EntityContentBlueprint.dataRefs.filterFunction.optional(),
      EntityContentBlueprint.dataRefs.filterExpression.optional(),
      EntityContentBlueprint.dataRefs.group.optional(),
    ]),
    contextMenuItems: createExtensionInput([
      coreExtensionData.reactElement,
      EntityContextMenuItemBlueprint.dataRefs.filterFunction.optional(),
      EntityContextMenuItemBlueprint.dataRefs.portalElement.optional(),
    ]),
    layouts: createExtensionInput([
      EntityLayoutBlueprint.dataRefs.component,
      EntityLayoutBlueprint.dataRefs.order.optional(),
      EntityLayoutBlueprint.dataRefs.filterFunction.optional(),
    ]),
  },
  config: {
    schema: {
      groups: z =>
        z
          .array(z.record(z.string(), z.object({ title: z.string() })))
          .optional(),
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
          id: item.node.spec.id,
          element: item.get(coreExtensionData.reactElement),
          portalElement: item.get(
            EntityContextMenuItemBlueprint.dataRefs.portalElement,
          ),
          filter:
            item.get(EntityContextMenuItemBlueprint.dataRefs.filterFunction) ??
            (() => true),
        }));

        type Groups = Record<
          string,
          { title: string; items: Array<(typeof inputs.contents)[0]> }
        >;

        // Get available headers, sorted by order or existence of filter.
        const headers = sortBy(
          inputs.headers.map(header => ({
            element: header.get(EntityHeaderBlueprint.dataRefs.element),
            component: header.get(EntityHeaderBlueprint.dataRefs.component),
            filter: header.get(EntityHeaderBlueprint.dataRefs.filterFunction),
            order: header.get(EntityHeaderBlueprint.dataRefs.order),
          })),
          [({ order }) => order, ({ filter }) => filter],
        );

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
              [groupId]: { title: groupValue.title, items: [] },
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

        const layouts = sortBy(
          inputs.layouts.map(header => ({
            component: header.get(EntityLayoutBlueprint.dataRefs.component),
            filter: header.get(EntityLayoutBlueprint.dataRefs.filterFunction),
            order: header.get(EntityLayoutBlueprint.dataRefs.order),
          })),
          [({ order }) => order, ({ filter }) => filter],
        );

        const Component = () => {
          const entityFromUrl = useEntityFromUrl();
          const { entity } = entityFromUrl;
          const filteredMenuItems = entity
            ? menuItems.filter(i => i.filter(entity))
            : [];
          const contextMenuItems = filteredMenuItems.map(i => i.element);
          const contextMenuPortals = filteredMenuItems.flatMap(item =>
            item.portalElement
              ? [<Fragment key={item.id}>{item.portalElement}</Fragment>]
              : [],
          );

          const { component: HeaderComponent, element: headerElement } =
            headers.find(h => !h.filter || (entity && h.filter(entity))) ?? {};

          const contextMenu = contextMenuItems.length ? (
            <EntityContextMenu contextMenuItems={contextMenuItems} />
          ) : undefined;

          const header = HeaderComponent ? (
            <HeaderComponent contextMenu={contextMenu} />
          ) : (
            headerElement ?? <EntityHeader contextMenu={contextMenu} />
          );

          const Layout =
            layouts.find(l => !l.filter || l.filter(entity!))?.component ??
            EntityLayout;

          const groupedRoutes = useMemo(
            () =>
              Object.values(groups).flatMap(({ title, items }) =>
                items.flatMap(output => {
                  const filterFn = buildFilterFn(
                    output.get(EntityContentBlueprint.dataRefs.filterFunction),
                    output.get(
                      EntityContentBlueprint.dataRefs.filterExpression,
                    ),
                  );

                  if (!entity || (filterFn && !filterFn(entity))) {
                    return [];
                  }
                  return [
                    {
                      group: title,
                      path: output.get(coreExtensionData.routePath),
                      title: output.get(EntityContentBlueprint.dataRefs.title),
                      children: output.get(coreExtensionData.reactElement),
                    } satisfies EntityLayoutRouteProps,
                  ];
                }),
              ),
            [entity],
          );

          return (
            <AsyncEntityProvider {...entityFromUrl}>
              {contextMenuPortals}
              <Layout header={header} groupedRoutes={groupedRoutes} />
            </AsyncEntityProvider>
          );
        };

        return compatWrapper(<Component />);
      },
    });
  },
});

export default [catalogPage, catalogEntityPage];
