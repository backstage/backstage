/*
 * Copyright 2026 The Backstage Authors
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
  identityApiRef,
} from '@backstage/core-plugin-api';
import {
  goldenPathsApiRef,
  rootRouteRef,
} from '@backstage/plugin-golden-paths-react';

import { GoldenPathsClient } from './api';
import {
  ApiBlueprint,
  createFrontendPlugin,
  PageBlueprint,
} from '@backstage/frontend-plugin-api';

export const goldenPathsPlugin = createPlugin({
  id: 'golden-paths',
  apis: [
    createApiFactory({
      api: goldenPathsApiRef,
      deps: {
        discoveryApi: discoveryApiRef,
        fetchApi: fetchApiRef,
        identityApi: identityApiRef,
      },
      factory: ({ discoveryApi, fetchApi, identityApi }) =>
        new GoldenPathsClient({ discoveryApi, fetchApi, identityApi }),
    }),
  ],
  routes: {
    root: rootRouteRef,
  },
});

export const GoldenPathsPage = goldenPathsPlugin.provide(
  createRoutableExtension({
    name: 'GoldenPathsPage',
    component: () => import('./components/Router').then(m => m.Router),
    mountPoint: rootRouteRef,
  }),
);

export const goldenPathsPageExtension = PageBlueprint.make({
  params: {
    path: '/golden-paths',
    title: 'Golden Paths',
    routeRef: rootRouteRef,
    loader: () => import('./components/Router').then(m => <m.Router />),
  },
});

export const goldenPathsApiExtension = ApiBlueprint.make({
  name: 'golden-paths',
  params: defineParams =>
    defineParams({
      api: goldenPathsApiRef,
      deps: {
        discoveryApi: discoveryApiRef,
        fetchApi: fetchApiRef,
        identityApi: identityApiRef,
      },
      factory({ discoveryApi, fetchApi, identityApi }) {
        return new GoldenPathsClient({ discoveryApi, fetchApi, identityApi });
      },
    }),
});

export default createFrontendPlugin({
  pluginId: 'golden-paths',
  extensions: [goldenPathsPageExtension, goldenPathsApiExtension],
});
