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
  discoveryApiRef,
  fetchApiRef,
  createApiFactory,
  createPlugin,
  createRouteRef,
  createRoutableExtension,
  createComponentExtension,
} from '@backstage/core-plugin-api';

import { rootRouteRef } from './routes';
import { NomadHttpApi, nomadApiRef } from './api';

export const entityContentRouteRef = createRouteRef({
  id: 'nomad:entity-content',
});

/** @public */
export const nomadPlugin = createPlugin({
  id: 'nomad',
  apis: [
    createApiFactory({
      api: nomadApiRef,
      deps: { discoveryApi: discoveryApiRef, fetchApi: fetchApiRef },
      factory: ({ discoveryApi, fetchApi }) =>
        NomadHttpApi.create(discoveryApi, fetchApi),
    }),
  ],
  routes: {
    root: rootRouteRef,
    entityContent: entityContentRouteRef,
  },
});

/** @public */
export const EntityNomadContent = nomadPlugin.provide(
  createRoutableExtension({
    name: 'EntityNomadContent',
    component: () => import('./Router').then(m => m.EmbeddedRouter),
    mountPoint: entityContentRouteRef,
  }),
);

/**
 * Card used to show the list of Nomad job versions.
 *
 * @public
 */
export const EntityNomadJobVersionListCard = nomadPlugin.provide(
  createComponentExtension({
    name: 'EntityNomadJobVersionListCard',
    component: {
      lazy: () =>
        import('./components').then(m => m.EntityNomadJobVersionListCard),
    },
  }),
);

/**
 * Table used to show the list of Nomad allocations for a job and/or task-group.
 *
 * @public
 */
export const EntityNomadAllocationListTable = nomadPlugin.provide(
  createComponentExtension({
    name: 'EntityNomadAllocationListTable',
    component: {
      lazy: () =>
        import('./components').then(m => m.EntityNomadAllocationListTable),
    },
  }),
);
