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
  identityApiRef,
} from '@backstage/core-plugin-api';

import { rootRouteRef } from './routes';
import { toolkitApiRef, ToolkitClient } from './api';

export const toolkitPlugin = createPlugin({
  id: 'toolkit',
  routes: {
    root: rootRouteRef,
  },
  apis: [
    createApiFactory({
      api: toolkitApiRef,
      deps: {
        identityApi: identityApiRef,
        discoveryApi: discoveryApiRef,
        fetchApi: fetchApiRef,
      },
      factory: ({ identityApi, discoveryApi, fetchApi }) =>
        new ToolkitClient({ identityApi, discoveryApi, fetchApi }),
    }),
  ],
});

export const ToolkitPage = toolkitPlugin.provide(
  createRoutableExtension({
    name: 'ToolkitDetails',
    component: () =>
      import('./components/ToolkitDetails').then(m => m.ToolkitDetails),
    mountPoint: rootRouteRef,
  }),
);
export const Toolkit = toolkitPlugin.provide(
  createRoutableExtension({
    name: 'Toolkit',
    component: () => import('./components/Toolkit').then(m => m.default),
    mountPoint: rootRouteRef,
  }),
);
