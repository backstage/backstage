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
import LibraryBooks from '@material-ui/icons/LibraryBooks';
import {
  createFrontendPlugin,
  ApiBlueprint,
  PageBlueprint,
  NavItemBlueprint,
} from '@backstage/frontend-plugin-api';
import { SearchResultListItemBlueprint } from '@backstage/plugin-search-react/alpha';
import {
  configApiRef,
  createApiFactory,
  discoveryApiRef,
  fetchApiRef,
} from '@backstage/core-plugin-api';
import {
  compatWrapper,
  convertLegacyRouteRef,
  convertLegacyRouteRefs,
} from '@backstage/core-compat-api';
import {
  techdocsApiRef,
  techdocsStorageApiRef,
} from '@backstage/plugin-techdocs-react';
import { TechDocsClient, TechDocsStorageClient } from './client';
import {
  rootCatalogDocsRouteRef,
  rootDocsRouteRef,
  rootRouteRef,
} from './routes';
import { EntityContentBlueprint } from '@backstage/plugin-catalog-react/alpha';

/** @alpha */
const techDocsStorageApi = ApiBlueprint.make({
  name: 'storage',
  params: {
    factory: createApiFactory({
      api: techdocsStorageApiRef,
      deps: {
        configApi: configApiRef,
        discoveryApi: discoveryApiRef,
        fetchApi: fetchApiRef,
      },
      factory: ({ configApi, discoveryApi, fetchApi }) =>
        new TechDocsStorageClient({
          configApi,
          discoveryApi,
          fetchApi,
        }),
    }),
  },
});

/** @alpha */
const techDocsClientApi = ApiBlueprint.make({
  params: {
    factory: createApiFactory({
      api: techdocsApiRef,
      deps: {
        configApi: configApiRef,
        discoveryApi: discoveryApiRef,
        fetchApi: fetchApiRef,
      },
      factory: ({ configApi, discoveryApi, fetchApi }) =>
        new TechDocsClient({
          configApi,
          discoveryApi,
          fetchApi,
        }),
    }),
  },
});

/** @alpha */
export const techDocsSearchResultListItemExtension =
  SearchResultListItemBlueprint.makeWithOverrides({
    config: {
      schema: {
        title: z => z.string().optional(),
        lineClamp: z => z.number().default(5),
        asLink: z => z.boolean().default(true),
        asListItem: z => z.boolean().default(true),
      },
    },
    factory(originalFactory, { config }) {
      return originalFactory({
        predicate: result => result.type === 'techdocs',
        component: async () => {
          const { TechDocsSearchResultListItem } = await import(
            './search/components/TechDocsSearchResultListItem'
          );
          return props =>
            compatWrapper(
              <TechDocsSearchResultListItem {...props} {...config} />,
            );
        },
      });
    },
  });

/**
 * Responsible for rendering the provided router element
 *
 * @alpha
 */
const techDocsPage = PageBlueprint.make({
  params: {
    defaultPath: '/docs',
    routeRef: convertLegacyRouteRef(rootRouteRef),
    loader: () =>
      import('./home/components/TechDocsIndexPage').then(m =>
        compatWrapper(<m.TechDocsIndexPage />),
      ),
  },
});

/**
 * Component responsible for composing a TechDocs reader page experience
 *
 * @alpha
 */
const techDocsReaderPage = PageBlueprint.make({
  name: 'reader',
  params: {
    defaultPath: '/docs/:namespace/:kind/:name',
    routeRef: convertLegacyRouteRef(rootDocsRouteRef),
    loader: () =>
      import('./reader/components/TechDocsReaderPage').then(m =>
        compatWrapper(<m.TechDocsReaderPage />),
      ),
  },
});

/**
 * Component responsible for rendering techdocs on entity pages
 *
 * @alpha
 */
const techDocsEntityContent = EntityContentBlueprint.make({
  params: {
    defaultPath: 'docs',
    defaultTitle: 'TechDocs',
    loader: () =>
      import('./Router').then(m => compatWrapper(<m.EmbeddedDocsRouter />)),
  },
});

/** @alpha */
const techDocsNavItem = NavItemBlueprint.make({
  params: {
    icon: LibraryBooks,
    title: 'Docs',
    routeRef: convertLegacyRouteRef(rootRouteRef),
  },
});

/** @alpha */
export default createFrontendPlugin({
  id: 'techdocs',
  extensions: [
    techDocsClientApi,
    techDocsStorageApi,
    techDocsNavItem,
    techDocsPage,
    techDocsReaderPage,
    techDocsEntityContent,
    techDocsSearchResultListItemExtension,
  ],
  routes: convertLegacyRouteRefs({
    root: rootRouteRef,
    docRoot: rootDocsRouteRef,
    entityContent: rootCatalogDocsRouteRef,
  }),
});
