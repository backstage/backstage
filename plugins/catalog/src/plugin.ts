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

import { CatalogApi, CatalogClient } from '@backstage/catalog-client';
import {
  createApiFactory,
  createApiRef,
  createPlugin,
  discoveryApiRef,
} from '@backstage/core';
import { catalogRouteRef, entityRouteRef } from './routes';

export const catalogApiRef = createApiRef<CatalogApi>({
  id: 'plugin.catalog.service',
  description:
    'Used by the Catalog plugin to make requests to accompanying backend',
});

export const plugin = createPlugin({
  id: 'catalog',
  apis: [
    createApiFactory({
      api: catalogApiRef,
      deps: { discoveryApi: discoveryApiRef },
      factory: ({ discoveryApi }) => new CatalogClient({ discoveryApi }),
    }),
  ],
  routes: {
    catalogIndex: catalogRouteRef,
    catalogEntity: entityRouteRef,
  },
});
