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
  configApiRef,
  createApiFactory,
  createComponentExtension,
  createPlugin,
  createRoutableExtension,
  discoveryApiRef,
} from '@backstage/core-plugin-api';

/** @public */
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

/** @public */
export const ApacheAirflowPage = apacheAirflowPlugin.provide(
  createRoutableExtension({
    name: 'ApacheAirflowPage',
    component: () => import('./components/HomePage').then(m => m.HomePage),
    mountPoint: rootRouteRef,
  }),
);

/**
 * Render the DAGs in a table
 * If the dagIds is specified, only those DAGs are loaded.
 * Otherwise, it's going to list all the DAGs
 * @public
 * @param dagIds - optional string[] of the DAGs to show in the table. If undefined, it will list all DAGs
 */
export const ApacheAirflowDagTable = apacheAirflowPlugin.provide(
  createComponentExtension({
    name: 'ApacheAirflowDagTable',
    component: {
      lazy: () =>
        import('./components/DagTableComponent').then(m => m.DagTableComponent),
    },
  }),
);
