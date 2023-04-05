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
} from '@backstage/core-plugin-api';

import { puppetDbApiRef, PuppetDbClient } from './api';
import { puppetDbRouteRef } from './routes';

/**
 * Create the PuppetDB frontend plugin.
 *
 * @public
 * */
export const puppetdbPlugin = createPlugin({
  id: 'puppetDb',
  apis: [
    createApiFactory({
      api: puppetDbApiRef,
      deps: { discoveryApi: discoveryApiRef, fetchApi: fetchApiRef },
      factory: ({ discoveryApi, fetchApi }) =>
        new PuppetDbClient({ discoveryApi, fetchApi }),
    }),
  ],
});

/**
 * Creates a routable extension for the PuppetDB plugin content.
 *
 * @public
 */
export const PuppetDbContent = puppetdbPlugin.provide(
  createRoutableExtension({
    name: 'PuppetDbContent',
    component: () => import('./components/Router').then(m => m.Router),
    mountPoint: puppetDbRouteRef,
  }),
);
