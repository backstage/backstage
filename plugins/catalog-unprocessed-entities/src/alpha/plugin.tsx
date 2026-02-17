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
import QueueIcon from '@material-ui/icons/Queue';
import { rootRouteRef } from '../routes';

/** @alpha */
export const catalogUnprocessedEntitiesApi = ApiBlueprint.make({
  params: defineParams =>
    defineParams({
      api: catalogUnprocessedEntitiesApiRef,
      deps: {
        discoveryApi: discoveryApiRef,
        fetchApi: fetchApiRef,
      },
      factory: ({ discoveryApi, fetchApi }) =>
        new CatalogUnprocessedEntitiesClient(discoveryApi, fetchApi),
    }),
});

/** @alpha */
export const catalogUnprocessedEntitiesPage = PageBlueprint.make({
  params: {
    path: '/catalog-unprocessed-entities',
    routeRef: rootRouteRef,
    loader: () =>
      import('../components/UnprocessedEntities').then(m => (
        <m.UnprocessedEntities />
      )),
  },
});

/** @alpha */
export const catalogUnprocessedEntitiesNavItem = NavItemBlueprint.make({
  params: {
    title: 'Unprocessed Entities',
    routeRef: rootRouteRef,
    icon: QueueIcon,
  },
});

/** @alpha */
export default createFrontendPlugin({
  pluginId: 'catalog-unprocessed-entities',
  title: 'Unprocessed Entities',
  icon: <QueueIcon />,
  info: { packageJson: () => import('../../package.json') },
  routes: {
    root: rootRouteRef,
  },
  extensions: [
    catalogUnprocessedEntitiesApi,
    catalogUnprocessedEntitiesPage,
    catalogUnprocessedEntitiesNavItem,
  ],
});
