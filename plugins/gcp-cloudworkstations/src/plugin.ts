/*
 * Copyright 2024 The Backstage Authors
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
  googleAuthApiRef,
  errorApiRef,
  createComponentExtension,
} from '@backstage/core-plugin-api';

import { rootRouteRef } from './routes';
import { WorkstationsApiClient, cloudWorkstationsApiRef } from './api';

export const gcpCloudworkstationsPlugin = createPlugin({
  id: 'gcp-cloudworkstations',
  apis: [
    createApiFactory({
      api: cloudWorkstationsApiRef,
      deps: {
        fetchApi: fetchApiRef,
        googleApi: googleAuthApiRef,
        errorApi: errorApiRef,
      },
      factory({ fetchApi, googleApi, errorApi }) {
        return new WorkstationsApiClient(fetchApi, googleApi, errorApi);
      },
    }),
  ],
  routes: {
    root: rootRouteRef,
  },
});

/** @public */
export const WorkstationsCard = gcpCloudworkstationsPlugin.provide(
  createComponentExtension({
    name: 'WorkstationsCard',
    component: {
      lazy: () =>
        import('./components/WorkstationsCard').then(m => m.WorkstationsCard),
    },
  }),
);

/** @public */
export const WorkstationsContent = gcpCloudworkstationsPlugin.provide(
  createComponentExtension({
    name: 'WorkstationsCardContent',
    component: {
      lazy: () =>
        import('./components/WorkstationsContent' as any).then(
          m => m.WorkstationsContent,
        ),
    },
  }),
);

/** @public */
export const GcpCloudworkstationsPage = gcpCloudworkstationsPlugin.provide(
  createRoutableExtension({
    name: 'GcpCloudworkstationsPage',
    component: () =>
      import('./components/WorkstationsCard').then(m => m.WorkstationsCard),
    mountPoint: rootRouteRef,
  }),
);
