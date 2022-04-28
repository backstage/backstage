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
  createPlugin,
  configApiRef,
  createApiFactory,
  discoveryApiRef,
  createComponentExtension,
  fetchApiRef,
} from '@backstage/core-plugin-api';
import { newRelicDashboardApiRef, NewRelicDashboardClient } from './api';
import { rootRouteRef } from './routes';

export const newRelicDashboardPlugin = createPlugin({
  id: 'new-relic-dashboard',
  routes: {
    root: rootRouteRef,
  },
  apis: [
    createApiFactory({
      api: newRelicDashboardApiRef,
      deps: {
        configApi: configApiRef,
        discoveryApi: discoveryApiRef,
        fetchApi: fetchApiRef,
      },
      factory: ({ configApi, discoveryApi, fetchApi }) =>
        new NewRelicDashboardClient({
          discoveryApi,
          fetchApi,
          baseUrl: configApi.getOptionalString('newrelicdashboard.baseUrl'),
        }),
    }),
  ],
});
export const EntityNewRelicDashboardContent = newRelicDashboardPlugin.provide(
  createComponentExtension({
    name: 'EntityNewRelicDashboardPage',
    component: {
      lazy: () => import('./Router').then(m => m.Router),
    },
  }),
);

export const EntityNewRelicDashboardCard = newRelicDashboardPlugin.provide(
  createComponentExtension({
    name: 'EntityNewRelicDashboardListComponent',
    component: {
      lazy: () =>
        import('./components/NewRelicDashboard/DashboardEntityList').then(
          m => m.DashboardEntityList,
        ),
    },
  }),
);
/**
 * Render dashboard snapshots from Newrelic in backstage. Use dashboards which have the tag `isDashboardPage: true`
 *
 * @remarks
 * This can be helpful for rendering dashboards outside of Entity Catalog.
 *
 * @public
 */
export const DashboardSnapshotComponent = newRelicDashboardPlugin.provide(
  createComponentExtension({
    name: 'DashboardSnapshotComponent',
    component: {
      lazy: () =>
        import(
          './components/NewRelicDashboard/DashboardSnapshotList/DashboardSnapshot'
        ).then(m => m.DashboardSnapshot),
    },
  }),
);
