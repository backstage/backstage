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
import { stringifyEntityRef } from '@backstage/catalog-model';
import { useRouteRefParams } from '@backstage/core-plugin-api';
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
  EntityHeaderLayoutBlueprint,
  EntityContentGroupDefinitions,
} from '@backstage/plugin-catalog-react/alpha';
import CategoryIcon from '@material-ui/icons/Category';
import { rootRouteRef } from '../routes';
import { useEntityFromUrl } from '../components/CatalogEntityPage/useEntityFromUrl';
import { buildFilterFn } from './filter/FilterWrapper';
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
    headerLayouts: createExtensionInput([
      EntityHeaderLayoutBlueprint.dataRefs.component,
      EntityHeaderLayoutBlueprint.dataRefs.filterFunction.optional(),
    ]),
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
      EntityContextMenuItemBlueprint.dataRefs.data,
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
        const [{ EntityLayout }, { EntityLayoutBui }] = await Promise.all([
          import('./components/EntityLayout'),
          import('./components/EntityLayout/EntityLayoutBui'),
        ]);

        const menuItems = inputs.contextMenuItems.map(item => ({
          data: item.get(EntityContextMenuItemBlueprint.dataRefs.data),
          node: item.node,
          filter:
            item.get(EntityContextMenuItemBlueprint.dataRefs.filterFunction) ??
            (() => true),
        }));

        // Get available headers, sorted by if they have a filter function or not.
        // TODO(blam): we should really have priority or some specificity here which can be used to sort the headers.
        // That can be done with embedding the priority in the dataRef alongside the filter function.
        const headerLayouts = inputs.headerLayouts
          .map(layout => {
            const filterFunction = layout.get(
              EntityHeaderLayoutBlueprint.dataRefs.filterFunction,
            );
            return {
              Component: layout.get(
                EntityHeaderLayoutBlueprint.dataRefs.component,
              ),
              filter: filterFunction ?? (() => true),
              hasFilter: Boolean(filterFunction),
            };
          })
          .sort((a, b) => Number(b.hasFilter) - Number(a.hasFilter));

        const headers = inputs.headers
          .map(header => {
            const filterFunction = header.get(
              EntityHeaderBlueprint.dataRefs.filterFunction,
            );
            return {
              element: header.get(EntityHeaderBlueprint.dataRefs.element),
              filter: filterFunction ?? (() => true),
              hasFilter: Boolean(filterFunction),
            };
          })
          .sort((a, b) => Number(b.hasFilter) - Number(a.hasFilter));

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
          const routeParams = useRouteRefParams(entityRouteRef);
          const entityFromUrl = useEntityFromUrl();
          const entity =
            entityFromUrl.entity &&
            stringifyEntityRef(entityFromUrl.entity) ===
              stringifyEntityRef(routeParams)
              ? entityFromUrl.entity
              : undefined;
          const entityProviderProps = { ...entityFromUrl, entity };
          const filteredMenuItems = entity
            ? menuItems
                .filter(i => i.filter(entity))
                .map(({ data, node }) => ({ data, node }))
            : [];

          const HeaderComponent = entity
            ? headerLayouts.find(layout => layout.filter(entity))?.Component
            : undefined;
          const legacyHeader = entity
            ? headers.find(header => header.filter(entity))?.element
            : undefined;

          const layout =
            HeaderComponent || !legacyHeader ? (
              <EntityLayoutBui
                HeaderComponent={HeaderComponent}
                contextMenuItems={filteredMenuItems}
                groupDefinitions={groupDefinitions}
                defaultContentOrder={config.defaultContentOrder}
              >
                {routes}
              </EntityLayoutBui>
            ) : (
              <EntityLayout
                header={legacyHeader}
                contextMenuItems={filteredMenuItems}
                groupDefinitions={groupDefinitions}
                defaultContentOrder={config.defaultContentOrder}
                showNavItemIcons={config.showNavItemIcons}
              >
                {routes}
              </EntityLayout>
            );

          return (
            <AsyncEntityProvider {...entityProviderProps}>
              {layout}
            </AsyncEntityProvider>
          );
        };

        return <Component />;
      },
    });
  },
});

export default [catalogPage, catalogEntityPage];
