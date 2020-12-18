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

import {
  createPlugin,
  createApiFactory,
  discoveryApiRef,
  createRoutableExtension,
} from '@backstage/core';
import { circleCIApiRef, CircleCIApi } from './api';
import { rootRouteRef, buildRouteRef } from './route-refs';

export const plugin = createPlugin({
  id: 'circleci',
  apis: [
    createApiFactory({
      api: circleCIApiRef,
      deps: { discoveryApi: discoveryApiRef },
      factory: ({ discoveryApi }) => new CircleCIApi({ discoveryApi }),
    }),
  ],
  routes: {
    root: rootRouteRef,
    build: buildRouteRef,
  },
});

export const CircleCiPage = plugin.provide(
  createRoutableExtension({
    mountPoint: rootRouteRef,
    component: () => import('./components/Router').then(m => m.Router),
  }),
);
