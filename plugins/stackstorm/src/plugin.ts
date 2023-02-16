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
  configApiRef,
  createApiFactory,
  createPlugin,
  createRoutableExtension,
  discoveryApiRef,
  fetchApiRef,
} from '@backstage/core-plugin-api';
import { stackstormApiRef, StackstormClient } from './api';
import { rootRouteRef } from './routes';

/**
 * The Backstage plugin that holds stackstorm specific components
 *
 * @public
 */
export const stackstormPlugin = createPlugin({
  id: 'stackstorm',
  apis: [
    createApiFactory({
      api: stackstormApiRef,
      deps: {
        configApi: configApiRef,
        discoveryApi: discoveryApiRef,
        fetchApi: fetchApiRef,
      },
      factory: ({ configApi, discoveryApi, fetchApi }) =>
        StackstormClient.fromConfig(configApi, {
          discoveryApi,
          fetchApi,
        }),
    }),
  ],
  routes: {
    root: rootRouteRef,
  },
});

/**
 * A component to display a stackstorm home page
 *
 * @public
 */
export const StackstormPage = stackstormPlugin.provide(
  createRoutableExtension({
    name: 'StackstormPage',
    component: () =>
      import('./components/StackstormHome').then(m => m.StackstormHome),
    mountPoint: rootRouteRef,
  }),
);
