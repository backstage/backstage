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

import {
  configApiRef,
  createApiFactory,
  createPlugin,
  createRoutableExtension,
  createRouteRef,
  discoveryApiRef,
  fetchApiRef,
} from '@backstage/core-plugin-api';
import {
  scmAuthApiRef,
  scmIntegrationsApiRef,
} from '@backstage/integration-react';
import { catalogApiRef } from '@backstage/plugin-catalog-react';
import { catalogImportApiRef, CatalogImportClient } from './api';

export const rootRouteRef = createRouteRef({
  id: 'catalog-import',
});

/**
 * A plugin that helps the user in importing projects and YAML files into the
 * catalog.
 *
 * @public
 */
export const catalogImportPlugin = createPlugin({
  id: 'catalog-import',
  apis: [
    createApiFactory({
      api: catalogImportApiRef,
      deps: {
        discoveryApi: discoveryApiRef,
        scmAuthApi: scmAuthApiRef,
        fetchApi: fetchApiRef,
        scmIntegrationsApi: scmIntegrationsApiRef,
        catalogApi: catalogApiRef,
        configApi: configApiRef,
      },
      factory: ({
        discoveryApi,
        scmAuthApi,
        fetchApi,
        scmIntegrationsApi,
        catalogApi,
        configApi,
      }) =>
        new CatalogImportClient({
          discoveryApi,
          scmAuthApi,
          scmIntegrationsApi,
          fetchApi,
          catalogApi,
          configApi,
        }),
    }),
  ],
  routes: {
    importPage: rootRouteRef,
  },
});

/**
 * The page for importing projects and YAML files into the catalog.
 *
 * @public
 */
export const CatalogImportPage = catalogImportPlugin.provide(
  createRoutableExtension({
    name: 'CatalogImportPage',
    component: () => import('./components/ImportPage').then(m => m.ImportPage),
    mountPoint: rootRouteRef,
  }),
);
