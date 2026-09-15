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
  SubPageBlueprint,
} from '@backstage/frontend-plugin-api';

import { ReactRouterV6PageRouter } from '@backstage/plugin-app-react-router-v6';

import { catalogUnprocessedEntitiesApiRef } from '../api';
import { RiStackLine } from '@remixicon/react';
import { rootRouteRef } from '../routes';
import { CatalogUnprocessedEntitiesClient } from '@backstage/plugin-catalog-unprocessed-entities-common';

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
  disabled: true,
  params: {
    path: '/catalog-unprocessed-entities',
    routeRef: rootRouteRef,
    title: 'Unprocessed Entities',
    icon: <RiStackLine />,
    // Disabled by default, but that is an opt-in an app can turn on rather
    // than dead code, and when it is on the failed-entities table expands each
    // row into the processing errors rendered through `MarkdownContent`, which
    // renders `Link` from `@backstage/core-components` for every anchor in the
    // message and that `Link` renders react-router's `Link` for any href
    // without a URL scheme. The framework provides no routing library context
    // at page depth, so the page declares the one it uses. Error messages
    // carry app-absolute or in-page targets, so this needs a router to exist
    // rather than needing this particular scope.
    loader: () =>
      import('../components/UnprocessedEntities').then(m => (
        <ReactRouterV6PageRouter>
          <m.NfsUnprocessedEntities />
        </ReactRouterV6PageRouter>
      )),
  },
});

/**
 * DevTools content for catalog unprocessed entities.
 *
 * @alpha
 */
export const unprocessedEntitiesDevToolsContent = SubPageBlueprint.make({
  attachTo: { id: 'page:devtools', input: 'pages' },
  params: {
    path: 'unprocessed-entities',
    title: 'Unprocessed Entities',
    loader: async () => {
      const [m, { Container }] = await Promise.all([
        import('../components/UnprocessedEntities'),
        import('@backstage/ui'),
      ]);
      return (
        <ReactRouterV6PageRouter>
          <Container>
            <m.UnprocessedEntitiesContent />
          </Container>
        </ReactRouterV6PageRouter>
      );
    },
  },
});

/** @alpha */
export default createFrontendPlugin({
  pluginId: 'catalog-unprocessed-entities',
  title: 'Unprocessed Entities',
  icon: <RiStackLine />,
  info: { packageJson: () => import('../../package.json') },
  routes: {
    root: rootRouteRef,
  },
  extensions: [
    catalogUnprocessedEntitiesApi,
    catalogUnprocessedEntitiesPage,
    unprocessedEntitiesDevToolsContent,
  ],
});
