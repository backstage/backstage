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
import {
  createApiFactory,
  createFrontendPlugin,
  discoveryApiRef,
  fetchApiRef,
  ApiBlueprint,
  PageBlueprint,
  NavItemBlueprint,
} from '@backstage/frontend-plugin-api';

import {
  catalogUnprocessedEntitiesApiRef,
  CatalogUnprocessedEntitiesClient,
} from '../api';
import {
  compatWrapper,
  convertLegacyRouteRef,
} from '@backstage/core-compat-api';
import QueueIcon from '@material-ui/icons/Queue';
import { rootRouteRef } from '../routes';

/** @alpha */
export const catalogUnprocessedEntitiesApi = ApiBlueprint.make({
  params: {
    factory: createApiFactory({
      api: catalogUnprocessedEntitiesApiRef,
      deps: {
        discoveryApi: discoveryApiRef,
        fetchApi: fetchApiRef,
      },
      factory: ({ discoveryApi, fetchApi }) =>
        new CatalogUnprocessedEntitiesClient(discoveryApi, fetchApi),
    }),
  },
});

/** @alpha */
export const catalogUnprocessedEntitiesPage = PageBlueprint.make({
  params: {
    defaultPath: '/catalog-unprocessed-entities',
    routeRef: convertLegacyRouteRef(rootRouteRef),
    loader: () =>
      import('../components/UnprocessedEntities').then(m =>
        compatWrapper(<m.UnprocessedEntities />),
      ),
  },
});

/** @alpha */
export const catalogUnprocessedEntitiesNavItem = NavItemBlueprint.make({
  params: {
    title: 'Unprocessed Entities',
    routeRef: convertLegacyRouteRef(rootRouteRef),
    icon: QueueIcon,
  },
});

/** @alpha */
export default createFrontendPlugin({
  id: 'catalog-unprocessed-entities',
  routes: {
    root: convertLegacyRouteRef(rootRouteRef),
  },
  extensions: [
    catalogUnprocessedEntitiesApi,
    catalogUnprocessedEntitiesPage,
    catalogUnprocessedEntitiesNavItem,
  ],
});
