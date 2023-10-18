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
import HomeIcon from '@material-ui/icons/Home';
import {
  createApiFactory,
  discoveryApiRef,
  fetchApiRef,
  storageApiRef,
} from '@backstage/core-plugin-api';
import { CatalogClient } from '@backstage/catalog-client';
import {
  createSchemaFromZod,
  createApiExtension,
  createPageExtension,
  createPlugin,
  createNavItemExtension,
  createExtension,
  coreExtensionData,
  AnyExtensionInputMap,
  PortableSchema,
  ExtensionBoundary,
  createExtensionInput,
} from '@backstage/frontend-plugin-api';
import {
  AsyncEntityProvider,
  catalogApiRef,
  entityRouteRef,
  starredEntitiesApiRef,
} from '@backstage/plugin-catalog-react';
import { createSearchResultListItemExtension } from '@backstage/plugin-search-react/alpha';
import { DefaultStarredEntitiesApi } from './apis';
import { rootRouteRef } from './routes';
import { Progress } from '@backstage/core-components';
import { useEntityFromUrl } from './components/CatalogEntityPage/useEntityFromUrl';

/** @alpha */
export const CatalogApi = createApiExtension({
  factory: createApiFactory({
    api: catalogApiRef,
    deps: {
      discoveryApi: discoveryApiRef,
      fetchApi: fetchApiRef,
    },
    factory: ({ discoveryApi, fetchApi }) =>
      new CatalogClient({ discoveryApi, fetchApi }),
  }),
});

/** @alpha */
export const StarredEntitiesApi = createApiExtension({
  factory: createApiFactory({
    api: starredEntitiesApiRef,
    deps: { storageApi: storageApiRef },
    factory: ({ storageApi }) => new DefaultStarredEntitiesApi({ storageApi }),
  }),
});

/** @alpha */
export const CatalogSearchResultListItemExtension =
  createSearchResultListItemExtension({
    id: 'catalog',
    predicate: result => result.type === 'software-catalog',
    component: () =>
      import('./components/CatalogSearchResultListItem').then(
        m => m.CatalogSearchResultListItem,
      ),
  });

/** @alpha */
export function createCatalogFilterExtension<
  TInputs extends AnyExtensionInputMap,
  TConfig = never,
>(options: {
  id: string;
  inputs?: TInputs;
  configSchema?: PortableSchema<TConfig>;
  loader: (options: { config: TConfig }) => Promise<JSX.Element>;
}) {
  return createExtension({
    id: `catalog.filter.${options.id}`,
    attachTo: { id: 'catalog', input: 'filters' },
    inputs: options.inputs ?? {},
    configSchema: options.configSchema,
    output: {
      element: coreExtensionData.reactElement,
    },
    factory({ bind, config, source }) {
      const LazyComponent = React.lazy(() =>
        options
          .loader({ config })
          .then(element => ({ default: () => element })),
      );

      bind({
        element: (
          <ExtensionBoundary source={source}>
            <React.Suspense fallback={<Progress />}>
              <LazyComponent />
            </React.Suspense>
          </ExtensionBoundary>
        ),
      });
    },
  });
}

/** @alpha */
export const CatalogEntityTagFilter = createCatalogFilterExtension({
  id: 'entity.tag',
  loader: async () => {
    const { EntityTagPicker } = await import('@backstage/plugin-catalog-react');
    return <EntityTagPicker />;
  },
});

/** @alpha */
export const CatalogEntityKindFilter = createCatalogFilterExtension({
  id: 'entity.kind',
  configSchema: createSchemaFromZod(z =>
    z.object({
      initialFilter: z.string().default('component'),
    }),
  ),
  loader: async ({ config }) => {
    const { EntityKindPicker } = await import(
      '@backstage/plugin-catalog-react'
    );
    return <EntityKindPicker initialFilter={config.initialFilter} />;
  },
});

/** @alpha */
export const CatalogEntityTypeFilter = createCatalogFilterExtension({
  id: 'entity.type',
  loader: async () => {
    const { EntityTypePicker } = await import(
      '@backstage/plugin-catalog-react'
    );
    return <EntityTypePicker />;
  },
});

/** @alpha */
export const CatalogEntityOwnerFilter = createCatalogFilterExtension({
  id: 'entity.mode',
  configSchema: createSchemaFromZod(z =>
    z.object({
      mode: z.enum(['owners-only', 'all']).optional(),
    }),
  ),
  loader: async ({ config }) => {
    const { EntityOwnerPicker } = await import(
      '@backstage/plugin-catalog-react'
    );
    return <EntityOwnerPicker mode={config.mode} />;
  },
});

/** @alpha */
export const CatalogEntityNamespaceFilter = createCatalogFilterExtension({
  id: 'entity.namespace',
  loader: async () => {
    const { EntityNamespacePicker } = await import(
      '@backstage/plugin-catalog-react'
    );
    return <EntityNamespacePicker />;
  },
});

/** @alpha */
export const CatalogEntityLifecycleFilter = createCatalogFilterExtension({
  id: 'entity.lifecycle',
  loader: async () => {
    const { EntityLifecyclePicker } = await import(
      '@backstage/plugin-catalog-react'
    );
    return <EntityLifecyclePicker />;
  },
});

/** @alpha */
export const CatalogEntityProcessingStatusFilter = createCatalogFilterExtension(
  {
    id: 'entity.processing.status',
    loader: async () => {
      const { EntityProcessingStatusPicker } = await import(
        '@backstage/plugin-catalog-react'
      );
      return <EntityProcessingStatusPicker />;
    },
  },
);

/** @alpha */
export const CatalogUserListFilter = createCatalogFilterExtension({
  id: 'user.list',
  configSchema: createSchemaFromZod(z =>
    z.object({
      initialFilter: z.enum(['owned', 'starred', 'all']).default('owned'),
    }),
  ),
  loader: async ({ config }) => {
    const { UserListPicker } = await import('@backstage/plugin-catalog-react');
    return <UserListPicker initialFilter={config.initialFilter} />;
  },
});

/** @alpha */
export const CatalogIndexPage = createPageExtension({
  id: 'catalog',
  defaultPath: '/catalog',
  routeRef: rootRouteRef,
  inputs: {
    filters: createExtensionInput({
      element: coreExtensionData.reactElement,
    }),
  },
  loader: async ({ inputs }) => {
    const { BaseCatalogPage } = await import('./components/CatalogPage');
    const filters = inputs.filters.map(filter => filter.element);
    return <BaseCatalogPage filters={<>{filters}</>} />;
  },
});

/** @alpha */
export const CatalogEntityPage = createPageExtension({
  id: 'catalog:entity',
  defaultPath: '/catalog/:namespace/:kind/:name',
  routeRef: entityRouteRef,
  loader: async () => {
    const Component = () => {
      return (
        <AsyncEntityProvider {...useEntityFromUrl()}>
          <div>🚧 Work In Progress</div>
        </AsyncEntityProvider>
      );
    };
    return <Component />;
  },
});

const CatalogNavItem = createNavItemExtension({
  id: 'catalog.nav.index',
  routeRef: rootRouteRef,
  title: 'Catalog',
  icon: HomeIcon,
});

/** @alpha */
export default createPlugin({
  id: 'catalog',
  extensions: [
    CatalogApi,
    StarredEntitiesApi,
    CatalogSearchResultListItemExtension,
    CatalogEntityKindFilter,
    CatalogEntityTypeFilter,
    CatalogUserListFilter,
    CatalogEntityOwnerFilter,
    CatalogEntityLifecycleFilter,
    CatalogEntityTagFilter,
    CatalogEntityProcessingStatusFilter,
    CatalogEntityNamespaceFilter,
    CatalogIndexPage,
    CatalogEntityPage,
    CatalogNavItem,
  ],
});
