/*
 * Copyright 2020 The Backstage Authors
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

import { techdocsApiRef, techdocsStorageApiRef } from './api';
import { TechDocsClient, TechDocsStorageClient } from './client';
import {
  rootDocsRouteRef,
  rootRouteRef,
  rootCatalogDocsRouteRef,
} from './routes';
import {
  configApiRef,
  createApiFactory,
  createPlugin,
  createRoutableExtension,
  discoveryApiRef,
  fetchApiRef,
  identityApiRef,
} from '@backstage/core-plugin-api';

/**
 * The Backstage plugin that renders technical documentation for your components
 *
 * @public
 */
export const techdocsPlugin = createPlugin({
  id: 'techdocs',
  apis: [
    createApiFactory({
      api: techdocsStorageApiRef,
      deps: {
        configApi: configApiRef,
        discoveryApi: discoveryApiRef,
        identityApi: identityApiRef,
        fetchApi: fetchApiRef,
      },
      factory: ({ configApi, discoveryApi, identityApi, fetchApi }) =>
        new TechDocsStorageClient({
          configApi,
          discoveryApi,
          identityApi,
          fetchApi,
        }),
    }),
    createApiFactory({
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
  ],
  routes: {
    root: rootRouteRef,
    docRoot: rootDocsRouteRef,
    entityContent: rootCatalogDocsRouteRef,
  },
});

/**
 * Routable extension used to render docs
 *
 * @public
 */
export const TechdocsPage = techdocsPlugin.provide(
  createRoutableExtension({
    name: 'TechdocsPage',
    component: () => import('./Router').then(m => m.Router),
    mountPoint: rootRouteRef,
  }),
);

/**
 * Routable extension used to render docs on Entity page
 *
 * @public
 */
export const EntityTechdocsContent = techdocsPlugin.provide(
  createRoutableExtension({
    name: 'EntityTechdocsContent',
    component: () => import('./Router').then(m => m.EmbeddedDocsRouter),
    mountPoint: rootCatalogDocsRouteRef,
  }),
);

/**
 * Component which takes a custom tabs config object and renders a documentation landing page.
 *
 * @public
 */
export const TechDocsCustomHome = techdocsPlugin.provide(
  createRoutableExtension({
    name: 'TechDocsCustomHome',
    component: () =>
      import('./home/components/TechDocsCustomHome').then(
        m => m.TechDocsCustomHome,
      ),
    mountPoint: rootRouteRef,
  }),
);

/**
 * Responsible for rendering the provided router element
 *
 * @public
 */
export const TechDocsIndexPage = techdocsPlugin.provide(
  createRoutableExtension({
    name: 'TechDocsIndexPage',
    component: () =>
      import('./home/components/TechDocsIndexPage').then(
        m => m.TechDocsIndexPage,
      ),
    mountPoint: rootRouteRef,
  }),
);

/**
 * Component responsible for composing a TechDocs reader page experience
 *
 * @public
 */
export const TechDocsReaderPage = techdocsPlugin.provide(
  createRoutableExtension({
    name: 'TechDocsReaderPage',
    component: () =>
      import('./reader/components/TechDocsReaderPage').then(
        m => m.TechDocsReaderPage,
      ),
    mountPoint: rootDocsRouteRef,
  }),
);
