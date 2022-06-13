/*
 * Copyright 2022 The Backstage Authors
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
import { dynatraceApiRef, DynatraceClient } from './api';
import {
  createApiFactory,
  createPlugin,
  discoveryApiRef,
  fetchApiRef,
  createRoutableExtension,
} from '@backstage/core-plugin-api';

import { Entity } from '@backstage/catalog-model';
import { DYNATRACE_ID_ANNOTATION } from './constants';

import { rootRouteRef } from './routes';

/**
 * Create the Dynatrace plugin.
 * @public
 */
export const dynatracePlugin = createPlugin({
  id: 'dynatrace',
  apis: [
    createApiFactory({
      api: dynatraceApiRef,
      deps: {
        discoveryApi: discoveryApiRef,
        fetchApi: fetchApiRef,
      },
      factory: ({ discoveryApi, fetchApi }) =>
        new DynatraceClient({
          discoveryApi,
          fetchApi,
        }),
    }),
  ],
});

/**
 * Checks if the entity has a dynatrace id annotation.
 * @public
 * @param entity {Entity} - The entity to check for the dynatrace id annotation.
 */
export const isDynatraceAvailable = (entity: Entity) =>
  Boolean(entity.metadata.annotations?.[DYNATRACE_ID_ANNOTATION]);

/**
 * Creates a routable extension for the dynatrace plugin tab.
 * @public
 */
export const DynatraceTab = dynatracePlugin.provide(
  createRoutableExtension({
    name: 'DynatraceTab',
    component: () =>
      import('./components/DynatraceTab').then(m => m.DynatraceTab),
    mountPoint: rootRouteRef,
  }),
);
