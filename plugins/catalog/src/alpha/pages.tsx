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
  createExtensionDataRef,
  createExtensionBlueprint,
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
  EntityLayoutBlueprint,
  EntityContentGroupDefinitions,
  SubRoute,
} from '@backstage/plugin-catalog-react/alpha';
import CategoryIcon from '@material-ui/icons/Category';
import { rootRouteRef } from '../routes';
import { useEntityFromUrl } from '../components/CatalogEntityPage/useEntityFromUrl';
import { buildFilterFn } from './filter/FilterWrapper';
import { EntityHeader } from './components/EntityHeader';
import sortBy from 'lodash/sortBy';
import { Fragment, useMemo } from 'react';
import { EntityContextMenu } from './components/EntityContextMenu';
import type { CatalogExportSettings } from '../components/CatalogExportButton';

const catalogExportConfigDataRef = createExtensionDataRef<{
  exporters?: CatalogExportSettings['exporters'];
  columns?: CatalogExportSettings['columns'];
  onSuccess?: CatalogExportSettings['onSuccess'];
  onError?: CatalogExportSettings['onError'];
}>().with({
  id: 'catalog.export-customization',
});

/**
 * Blueprint for creating catalog export configuration extensions.
 * @public
 */
export const CatalogExportConfigBlueprint = createExtensionBlueprint({
  kind: 'catalog-export-config',
  attachTo: { id: 'page:catalog', input: 'exportConfig' },
  output: [catalogExportConfigDataRef],
  factory(params: {
    exporters?: CatalogExportSettings['exporters'];
    columns?: CatalogExportSettings['columns'];
    onSuccess?: CatalogExportSettings['onSuccess'];
    onError?: CatalogExportSettings['onError'];
  }) {
    return [catalogExportConfigDataRef(params)];
  },
});

export const catalogPage = PageBlueprint.makeWithOverrides({
  inputs: {
    filters: createExtensionInput([coreExtensionData.reactElement]),
    exportConfig: createExtensionInput([catalogExportConfigDataRef.optional()]),
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
    exportSettings: z
      .object({
        /** When true, displays the export button in the catalog interface. */
        enabled: z.boolean().optional(),
        /**
         * When true, hides the built-in CSV and JSON export options.
         * Useful when only custom exporters (provided via extensions) should be available.
         */
        disableBuiltinExporters: z.boolean().optional(),
      })
      .optional(),
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

        // Merge export customizers from all attached extensions
        const mergedExportSettings: CatalogExportSettings = {
          ...config.exportSettings,
        };

        for (const exportConfigInput of inputs.exportConfig) {
          const data = exportConfigInput.get(catalogExportConfigDataRef);
          if (data) {
            if (data.exporters) {
              mergedExportSettings.exporters = {
                ...mergedExportSettings.exporters,
                ...data.exporters,
              };
            }
            if (data.columns && !mergedExportSettings.columns) {
              mergedExportSettings.columns = data.columns;
            }
            if (data.onSuccess && !mergedExportSettings.onSuccess) {
              mergedExportSettings.onSuccess = data.onSuccess;
            }
            if (data.onError && !mergedExportSettings.onError) {
              mergedExportSettings.onError = data.onError;
            }
          }
        }

        return (
          <NfsDefaultCatalogPage
            filters={<>{filters}</>}
            pagination={config.pagination}
            exportSettings={
              mergedExportSettings.enabled ? mergedExportSettings : undefined
            }
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
      EntityContentBlueprint.dataRefs.icon.optional(),
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
  },
  factory(originalFactory, { config, inputs }) {
    return originalFactory({
      path: '/catalog/:namespace/:kind/:name',
      noHeader: true,
      title: 'Catalog Entity',
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

        // Get available headers, sorted by explicit order first, then by
        // whether they have a filter so that more specific (filtered) headers
        // win over generic ones when no explicit order is set.
        const headers = sortBy(
          inputs.headers.map(header => ({
            element: header.get(EntityHeaderBlueprint.dataRefs.element),
            component: header.get(EntityHeaderBlueprint.dataRefs.component),
            filter: header.get(EntityHeaderBlueprint.dataRefs.filterFunction),
            order: header.get(EntityHeaderBlueprint.dataRefs.order),
          })),
          [({ order }) => order, ({ filter }) => (filter ? 0 : 1)],
        );

        const groupDefinitions =
          config.groups?.reduce(
            (rest, group) => ({ ...rest, ...group }),
            {} as EntityContentGroupDefinitions,
          ) ?? defaultEntityContentGroupDefinitions;

        const layouts = sortBy(
          inputs.layouts.map(header => ({
            component: header.get(EntityLayoutBlueprint.dataRefs.component),
            filter: header.get(EntityLayoutBlueprint.dataRefs.filterFunction),
            order: header.get(EntityLayoutBlueprint.dataRefs.order),
          })),
          [({ order }) => order, ({ filter }) => (filter ? 0 : 1)],
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
            layouts.find(l => !l.filter || (entity && l.filter(entity)))
              ?.component ?? EntityLayout;

          const groupedRoutes = useMemo(
            () =>
              inputs.contents.flatMap(output => {
                const filterFn = buildFilterFn(
                  output.get(EntityContentBlueprint.dataRefs.filterFunction),
                  output.get(EntityContentBlueprint.dataRefs.filterExpression),
                );

                if (!entity || (filterFn && !filterFn(entity))) {
                  return [];
                }
                return [
                  {
                    group: output.get(EntityContentBlueprint.dataRefs.group),
                    path: output.get(coreExtensionData.routePath),
                    title: output.get(EntityContentBlueprint.dataRefs.title),
                    icon: output.get(EntityContentBlueprint.dataRefs.icon),
                    children: output.get(coreExtensionData.reactElement),
                  } satisfies SubRoute,
                ];
              }),
            [entity],
          );

          return (
            <AsyncEntityProvider {...entityFromUrl}>
              {contextMenuPortals}
              <Layout
                header={header}
                groupedRoutes={groupedRoutes}
                groupDefinitions={groupDefinitions}
                defaultContentOrder={config.defaultContentOrder}
                showNavItemIcons={config.showNavItemIcons}
              />
            </AsyncEntityProvider>
          );
        };

        return <Component />;
      },
    });
  },
});

export default [catalogPage, catalogEntityPage];
