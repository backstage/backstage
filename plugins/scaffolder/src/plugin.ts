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
  identityApiRef,
  configApiRef,
  createRoutableExtension,
} from '@backstage/core';
import { rootRouteRef } from './routes';
import { scaffolderApiRef, ScaffolderClient } from './api';

export const scaffolderPlugin = createPlugin({
  id: 'scaffolder',
  apis: [
    createApiFactory({
      api: scaffolderApiRef,
      deps: {
        discoveryApi: discoveryApiRef,
        identityApi: identityApiRef,
        configApi: configApiRef,
      },
      factory: ({ discoveryApi, identityApi, configApi }) =>
        new ScaffolderClient({ discoveryApi, identityApi, configApi }),
    }),
  ],
  routes: {
    root: rootRouteRef,
  },
});

export const ScaffolderPage = scaffolderPlugin.provide(
  createRoutableExtension({
    component: () => import('./components/Router').then(m => m.Router),
    mountPoint: rootRouteRef,
  }),
);
