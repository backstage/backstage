/*
 * Copyright 2021 The Backstage Authors
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
import { fireHydrantApiRef, FireHydrantAPIClient } from './api';
import {
  createApiFactory,
  createPlugin,
  discoveryApiRef,
  createRoutableExtension,
} from '@backstage/core-plugin-api';

import { rootRouteRef } from './routes';

export const firehydrantPlugin = createPlugin({
  id: 'firehydrant',
  apis: [
    createApiFactory({
      api: fireHydrantApiRef,
      deps: { discoveryApi: discoveryApiRef },
      factory: ({ discoveryApi }) => new FireHydrantAPIClient({ discoveryApi }),
    }),
  ],
  routes: {
    root: rootRouteRef,
  },
});

export const FirehydrantPage = firehydrantPlugin.provide(
  createRoutableExtension({
    component: () =>
      import('./components/ServiceDetailsCard').then(m => m.ServiceDetailsCard),
    mountPoint: rootRouteRef,
  }),
);
