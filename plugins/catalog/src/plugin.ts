/*
 * Copyright 2020 Spotify AB
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

import { CatalogClient } from '@backstage/catalog-client';
import {
  createApiFactory,
  createPlugin,
  discoveryApiRef,
  createRoutableExtension,
  identityApiRef,
} from '@backstage/core';
import {
  catalogApiRef,
  catalogRouteRef,
  entityRouteRef,
} from '@backstage/plugin-catalog-react';
import { CatalogClientWrapper } from './CatalogClientWrapper';

export const catalogPlugin = createPlugin({
  id: 'catalog',
  apis: [
    createApiFactory({
      api: catalogApiRef,
      deps: { discoveryApi: discoveryApiRef, identityApi: identityApiRef },
      factory: ({ discoveryApi, identityApi }) =>
        new CatalogClientWrapper({
          client: new CatalogClient({ discoveryApi }),
          identityApi,
        }),
    }),
  ],
  routes: {
    catalogIndex: catalogRouteRef,
    catalogEntity: entityRouteRef,
  },
});

export const CatalogIndexPage = catalogPlugin.provide(
  createRoutableExtension({
    component: () =>
      import('./components/CatalogPage').then(m => m.CatalogPage),
    mountPoint: catalogRouteRef,
  }),
);

export const CatalogEntityPage = catalogPlugin.provide(
  createRoutableExtension({
    component: () =>
      import('./components/CatalogEntityPage/CatalogEntityPage').then(
        m => m.CatalogEntityPage,
      ),
    mountPoint: entityRouteRef,
  }),
);
