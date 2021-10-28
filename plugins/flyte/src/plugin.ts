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
import {
  createApiFactory,
  createPlugin,
  createRoutableExtension,
} from '@backstage/core-plugin-api';
import { flyteApiRef, FlyteClient } from './api';

import {
  rootRouteRef,
  flyteDomainRouteRef,
  flyteWorkflowExecutionsRouteRef,
} from './routes';

export const flytePlugin = createPlugin({
  id: 'flyte',
  routes: {
    root: rootRouteRef,
    flyteDomainPage: flyteDomainRouteRef,
  },
  apis: [
    createApiFactory({
      api: flyteApiRef,
      deps: {},
      factory() {
        return new FlyteClient();
      },
    }),
  ],
});

export const FlytePage = flytePlugin.provide(
  createRoutableExtension({
    name: 'FlytePage',
    component: () =>
      import('./components/FlyteComponent').then(m => m.FlyteComponent),
    mountPoint: rootRouteRef,
  }),
);

export const FlyteDomainPage = flytePlugin.provide(
  createRoutableExtension({
    name: 'FlyteDomainPage',
    component: () =>
      import('./components/FlyteDomainComponent').then(
        m => m.FlyteDomainComponent,
      ),
    mountPoint: flyteDomainRouteRef,
  }),
);

export const FlyteWorkflowExecutionsPage = flytePlugin.provide(
  createRoutableExtension({
    name: 'FlyteWorkflowExecutionsPage',
    component: () =>
      import('./components/FlyteWorkflowExecutionsComponent').then(
        m => m.FlyteWorkflowExecutionsComponent,
      ),
    mountPoint: flyteWorkflowExecutionsRouteRef,
  }),
);
