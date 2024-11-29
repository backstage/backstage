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
  createApiFactory,
  createPlugin,
  createRoutableExtension,
  discoveryApiRef,
  fetchApiRef,
} from '@backstage/core-plugin-api';

import { rootRouteRef } from './routes';
import {
  CatalogUnprocessedEntitiesClient,
  catalogUnprocessedEntitiesApiRef,
} from './api';

/**
 * Plugin entry point
 *
 * @public
 */
export const catalogUnprocessedEntitiesPlugin = createPlugin({
  id: 'catalog-unprocessed-entities',
  routes: {
    root: rootRouteRef,
  },
  apis: [
    createApiFactory({
      api: catalogUnprocessedEntitiesApiRef,
      deps: { discoveryApi: discoveryApiRef, fetchApi: fetchApiRef },
      factory: ({ discoveryApi, fetchApi }) =>
        new CatalogUnprocessedEntitiesClient(discoveryApi, fetchApi),
    }),
  ],
});

/**
 * Tool page for the Catalog Unprocessed Entities Plugin
 *
 * @public
 */
export const CatalogUnprocessedEntitiesPage =
  catalogUnprocessedEntitiesPlugin.provide(
    createRoutableExtension({
      name: 'CatalogUnprocessedEntitiesPage',
      component: () =>
        import('./components/UnprocessedEntities').then(
          m => m.UnprocessedEntities,
        ),
      mountPoint: rootRouteRef,
    }),
  );
