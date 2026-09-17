/*
 * Copyright 2025 The Backstage Authors
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
  createPlugin,
  createRoutableExtension,
} from '@backstage/core-plugin-api';
import {
  createFrontendPlugin,
  PageBlueprint,
} from '@backstage/frontend-plugin-api';
import { rootRouteRef } from './routes';

// Old system
/** @public */
export const buiThemerPlugin = createPlugin({
  id: 'mui-to-bui',
  routes: {
    root: rootRouteRef,
  },
});

/** @public */
export const BuiThemerPage = buiThemerPlugin.provide(
  createRoutableExtension({
    name: 'BuiThemerPage',
    component: () =>
      import('./components/BuiThemerPage').then(m => m.BuiThemerPage),
    mountPoint: rootRouteRef,
  }),
);

// New system
/** @public */
export default createFrontendPlugin({
  pluginId: 'mui-to-bui',
  extensions: [
    PageBlueprint.make({
      params: {
        path: '/mui-to-bui',
        loader: () =>
          import('./components/BuiThemerPage').then(m => <m.BuiThemerPage />),
        routeRef: rootRouteRef,
      },
    }),
  ],
  routes: {
    root: rootRouteRef,
  },
});
