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
  fetchApiRef,
} from '@backstage/core-plugin-api';
import { createCardExtension } from '@backstage/plugin-home-react';
import { rootRouteRef } from './routes';
import { ShouldIDeployCIClient, ShouldIDeployCIApiRef } from './api';
import { timeZones } from './helpers/timezones';

/** @public */
export const shouldIDeployPlugin = createPlugin({
  id: '@backstage/plugin-should-i-deploy',
  routes: {
    root: rootRouteRef,
  },
  apis: [
    createApiFactory({
      api: ShouldIDeployCIApiRef,
      deps: {
        fetchApi: fetchApiRef,
      },
      factory: ({ fetchApi }) =>
        new ShouldIDeployCIClient({
          fetchApi,
        }),
    }),
  ],
});

/** @public */
export const ShouldIDeployPage = shouldIDeployPlugin.provide(
  createRoutableExtension({
    name: 'ShouldIDeployPage',
    component: () =>
      import('./components/ShouldIDeployCard').then(m => m.Content),
    mountPoint: rootRouteRef,
  }),
);

/** @public */
export const ShouldIDeployCard = shouldIDeployPlugin.provide(
  createCardExtension<{ timeZone?: string; title?: string }>({
    name: 'ShouldIDeployCard',
    components: () => import('./components/ShouldIDeployCard'),
    layout: {
      height: { minRows: 4 },
      width: { minColumns: 3 },
    },
    settings: {
      schema: {
        title: 'Should I Deploy settings',
        type: 'object',
        properties: {
          timeZone: {
            title: 'config local timezone',
            type: 'string',
            enum: timeZones,
          },
        },
      },
    },
  }),
);
