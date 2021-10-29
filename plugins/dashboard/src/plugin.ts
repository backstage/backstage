import { createPlugin, createRoutableExtension, createApiFactory, configApiRef } from '@backstage/core-plugin-api';
import { Config } from '@backstage/config';
import { rootRouteRef } from './routes';
import { dashboardApiRef, DashboardRestApi } from './api/api';

export const dashboardPlugin = createPlugin({
  id: 'dashboard',
  routes: {
    root: rootRouteRef,
  },
  apis: [
    createApiFactory({
      api: dashboardApiRef,
      deps: { configApi: configApiRef },
      factory: ({ configApi }) => DashboardRestApi.fromConfig(configApi as Config),
    })
  ]
});

export const DashboardPage = dashboardPlugin.provide(
  createRoutableExtension({
    component: () =>
      import('./components/DashboardComponent').then(m => m.DashboardComponent),
    mountPoint: rootRouteRef,
  }),
);
