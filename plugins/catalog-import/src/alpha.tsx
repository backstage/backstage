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
  configApiRef,
  createApiFactory,
  discoveryApiRef,
  identityApiRef,
} from '@backstage/core-plugin-api';
import { convertLegacyRouteRef } from '@backstage/core-plugin-api/alpha';
import {
  createApiExtension,
  createPageExtension,
  createPlugin,
} from '@backstage/frontend-plugin-api';
import {
  scmAuthApiRef,
  scmIntegrationsApiRef,
} from '@backstage/integration-react';
import React from 'react';
import { CatalogImportClient, catalogImportApiRef } from './api';
import { rootRouteRef } from './plugin';
import { catalogApiRef } from '@backstage/plugin-catalog-react';

// TODO: It's currently possible to override the import page with a custom one. We need to decide
//       whether this type of override is typically done with an input or by overriding the entire extension.
const CatalogImportPageExtension = createPageExtension({
  id: 'plugin.catalog-import.page',
  defaultPath: '/catalog-import',
  routeRef: convertLegacyRouteRef(rootRouteRef),
  loader: () => import('./components/ImportPage').then(m => <m.ImportPage />),
});

const CatalogImportService = createApiExtension({
  factory: createApiFactory({
    api: catalogImportApiRef,
    deps: {
      discoveryApi: discoveryApiRef,
      scmAuthApi: scmAuthApiRef,
      identityApi: identityApiRef,
      scmIntegrationsApi: scmIntegrationsApiRef,
      catalogApi: catalogApiRef,
      configApi: configApiRef,
    },
    factory: ({
      discoveryApi,
      scmAuthApi,
      identityApi,
      scmIntegrationsApi,
      catalogApi,
      configApi,
    }) =>
      new CatalogImportClient({
        discoveryApi,
        scmAuthApi,
        scmIntegrationsApi,
        identityApi,
        catalogApi,
        configApi,
      }),
  }),
});

/** @alpha */
export default createPlugin({
  id: 'catalog-import',
  extensions: [CatalogImportService, CatalogImportPageExtension],
  routes: {
    importPage: convertLegacyRouteRef(rootRouteRef),
  },
});
