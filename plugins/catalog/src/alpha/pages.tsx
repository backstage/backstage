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

import { Fragment } from 'react';
import { convertLegacyRouteRef } from '@backstage/core-compat-api';
import {
  coreExtensionData,
  createExtensionInput,
  PageBlueprint,
} from '@backstage/frontend-plugin-api';
import { z } from 'zod/v4';
import {
  AsyncEntityProvider,
  entityRouteRef,
} from '@backstage/plugin-catalog-react';
import {
  defaultEntityContentGroupDefinitions,
  EntityContentBlueprint,
  EntityContextMenuItemBlueprint,
  EntityHeaderBlueprint,
  EntityContentGroupDefinitions,
} from '@backstage/plugin-catalog-react/alpha';
import CategoryIcon from '@material-ui/icons/Category';
import { rootRouteRef } from '../routes';
import { useEntityFromUrl } from '../components/CatalogEntityPage/useEntityFromUrl';
import { buildFilterFn } from './filter/FilterWrapper';
import {
  BuiContextMenuItem,
  MuiContextMenuItem,
} from './components/EntityContextMenu/items';

export const catalogPage = PageBlueprint.makeWithOverrides({
  inputs: {
    filters: createExtensionInput([coreExtensionData.reactElement]),
  },
  configSchema: {
    pagination: z
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
  factory(originalFactory, { inputs, config }) {
    return originalFactory({
      path: '/catalog',
      routeRef: rootRouteRef,
      icon: <CategoryIcon fontSize="inherit" />,
      title: 'Catalog',
      loader: async () => {
        const { NfsDefaultCatalogPage } = await import(
          '../components/CatalogPage/DefaultCatalogPage'
        );
        const filters = inputs.filters.map(filter =>
          filter.get(coreExtensionData.reactElement),
        );
        return (
          <NfsDefaultCatalogPage
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
      coreExtensionData.reactElement.optional(),
      EntityContextMenuItemBlueprint.dataRefs.data.optional(),
      EntityContextMenuItemBlueprint.dataRefs.filterFunction.optional(),
    ]),
  },
  configSchema: {
    groups: z
      .array(
        z.record(
          z.string(),
          z.object({
            title: z.string(),
            icon: z.string().optional(),
            aliases: z.array(z.string()).optional(),
            contentOrder: z.enum(['title', 'natural']).optional(),
          }),
        ),
      )
      .optional(),
    defaultContentOrder: z
      .enum(['title', 'natural'])
      .optional()
      .default('title'),
    showNavItemIcons: z.boolean().optional().default(false),
    useBuiHeader: z.boolean().optional().default(false),
  },
  factory(originalFactory, { config, inputs }) {
    return originalFactory({
      path: '/catalog/:namespace/:kind/:name',
      noHeader: !config.useBuiHeader,
      title: 'Catalog Entity',
      // NOTE: The `convertLegacyRouteRef` call here ensures that this route ref
      // is mutated to support the new frontend system. Removing this conversion
      // is a potentially breaking change since this is a singleton and the
      // route refs from `core-plugin-api` used to not support the new format.
      // This shouldn't be removed until we completely deprecate the
      // `core-compat-api` package.
      routeRef: convertLegacyRouteRef(entityRouteRef), // READ THE ABOVE
      loader: async () => {
        const [{ EntityLayout }, { EntityLayoutBui }] = await Promise.all([
          import('./components/EntityLayout'),
          import('./components/EntityLayout/EntityLayoutBui'),
        ]);

        const menuItems = inputs.contextMenuItems.map(item => ({
          element: item.get(coreExtensionData.reactElement),
          data: item.get(EntityContextMenuItemBlueprint.dataRefs.data),
          filter:
            item.get(EntityContextMenuItemBlueprint.dataRefs.filterFunction) ??
            (() => true),
        }));

        // TODO(blam): support a priority on EntityHeaderBlueprint dataRefs so
        // header selection isn't a binary "has filter" sort.
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
            {} as EntityContentGroupDefinitions,
          ) ?? defaultEntityContentGroupDefinitions;

        const routes = inputs.contents.map(output => (
          <EntityLayout.Route
            group={output.get(EntityContentBlueprint.dataRefs.group)}
            key={output.get(coreExtensionData.routePath)}
            path={output.get(coreExtensionData.routePath)}
            title={output.get(EntityContentBlueprint.dataRefs.title)}
            icon={output.get(EntityContentBlueprint.dataRefs.icon)}
            if={buildFilterFn(
              output.get(EntityContentBlueprint.dataRefs.filterFunction),
              output.get(EntityContentBlueprint.dataRefs.filterExpression),
            )}
          >
            {output.get(coreExtensionData.reactElement)}
          </EntityLayout.Route>
        ));

        const Component = () => {
          const entityFromUrl = useEntityFromUrl();
          const { entity } = entityFromUrl;
          const filteredItems = entity
            ? menuItems.filter(i => i.filter(entity))
            : [];

          const header = entity
            ? headers.find(h => !h.filter || h.filter(entity))?.element
            : undefined;

          // BUI header is incompatible with custom MUI headers from
          // EntityHeaderBlueprint, so legacy wins whenever one matches
          // even if BUI is opted into.
          const useBui = config.useBuiHeader && !header;

          if (useBui) {
            const buiContextMenuItems = filteredItems.flatMap((item, index) =>
              item.data
                ? [<BuiContextMenuItem key={index} data={item.data} />]
                : [],
            );
            return (
              <AsyncEntityProvider {...entityFromUrl}>
                <EntityLayoutBui
                  groupDefinitions={groupDefinitions}
                  defaultContentOrder={config.defaultContentOrder}
                  contextMenuItems={buiContextMenuItems}
                >
                  {routes}
                </EntityLayoutBui>
              </AsyncEntityProvider>
            );
          }

          const muiContextMenuItems = filteredItems.flatMap((item, index) => {
            if (item.element)
              return [<Fragment key={index}>{item.element}</Fragment>];
            if (item.data)
              return [<MuiContextMenuItem key={index} data={item.data} />];
            return [];
          });

          return (
            <AsyncEntityProvider {...entityFromUrl}>
              <EntityLayout
                header={header}
                contextMenuItems={muiContextMenuItems}
                groupDefinitions={groupDefinitions}
                defaultContentOrder={config.defaultContentOrder}
                showNavItemIcons={config.showNavItemIcons}
              >
                {routes}
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
