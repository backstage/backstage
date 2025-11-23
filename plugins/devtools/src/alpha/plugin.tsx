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

import { devToolsApiRef, DevToolsClient } from '../api';
import BuildIcon from '@material-ui/icons/Build';
import { rootRouteRef } from '../routes';

/** @alpha */
export const devToolsApi = ApiBlueprint.make({
  params: defineParams =>
    defineParams({
      api: devToolsApiRef,
      deps: {
        discoveryApi: discoveryApiRef,
        fetchApi: fetchApiRef,
      },
      factory: ({ discoveryApi, fetchApi }) =>
        new DevToolsClient({ discoveryApi, fetchApi }),
    }),
});

/** @alpha */
export const devToolsPage = PageBlueprint.make({
  params: {
    path: '/devtools',
    routeRef: rootRouteRef,
    loader: () =>
      import('../components/DevToolsPage').then(m => <m.DevToolsPage />),
  },
});

/** @alpha */
export const devToolsNavItem = NavItemBlueprint.make({
  params: {
    title: 'DevTools',
    routeRef: rootRouteRef,
    icon: BuildIcon,
  },
});

/** @alpha */
export default createFrontendPlugin({
  pluginId: 'devtools',
  info: { packageJson: () => import('../../package.json') },
  routes: {
    root: rootRouteRef,
  },
  extensions: [devToolsApi, devToolsPage, devToolsNavItem],
});
