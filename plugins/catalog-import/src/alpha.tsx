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
  discoveryApiRef,
  fetchApiRef,
} from '@backstage/core-plugin-api';
import {
  createFrontendPlugin,
  PageBlueprint,
  ApiBlueprint,
} from '@backstage/frontend-plugin-api';
import {
  scmAuthApiRef,
  scmIntegrationsApiRef,
} from '@backstage/integration-react';
import { CatalogImportClient, catalogImportApiRef } from './api';
import { rootRouteRef } from './plugin';
import { catalogApiRef } from '@backstage/plugin-catalog-react';
import { RequirePermission } from '@backstage/plugin-permission-react';
import { catalogEntityCreatePermission } from '@backstage/plugin-catalog-common/alpha';

export * from './translation';

// TODO: It's currently possible to override the import page with a custom one. We need to decide
//       whether this type of override is typically done with an input or by overriding the entire extension.
const catalogImportPage = PageBlueprint.make({
  params: {
    path: '/catalog-import',
    routeRef: rootRouteRef,
    loader: () =>
      import('./components/ImportPage').then(m => (
        <RequirePermission permission={catalogEntityCreatePermission}>
          <m.ImportPage />
        </RequirePermission>
      )),
  },
});

const catalogImportApi = ApiBlueprint.make({
  params: defineParams =>
    defineParams({
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
});

/** @alpha */
export default createFrontendPlugin({
  pluginId: 'catalog-import',
  info: { packageJson: () => import('../package.json') },
  extensions: [catalogImportApi, catalogImportPage],
  routes: {
    importPage: rootRouteRef,
  },
});

export { catalogImportTranslationRef } from './translation';
