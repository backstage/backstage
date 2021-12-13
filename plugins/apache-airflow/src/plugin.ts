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

import { rootRouteRef } from './routes';
import { apacheAirflowApiRef, ApacheAirflowClient } from './api';
import {
  createApiFactory,
  createPlugin,
  createRoutableExtension,
  discoveryApiRef,
  configApiRef,
} from '@backstage/core-plugin-api';

export const apacheAirflowPlugin = createPlugin({
  id: 'apache-airflow',
  routes: {
    root: rootRouteRef,
  },
  apis: [
    createApiFactory({
      api: apacheAirflowApiRef,
      deps: { configApi: configApiRef, discoveryApi: discoveryApiRef },
      factory: ({ configApi, discoveryApi }) =>
        new ApacheAirflowClient({
          discoveryApi,
          baseUrl: configApi.getString('apacheAirflow.baseUrl'),
        }),
    }),
  ],
});

export const ApacheAirflowPage = apacheAirflowPlugin.provide(
  createRoutableExtension({
    name: 'ApacheAirflowPage',
    component: () => import('./components/HomePage').then(m => m.HomePage),
    mountPoint: rootRouteRef,
  }),
);
