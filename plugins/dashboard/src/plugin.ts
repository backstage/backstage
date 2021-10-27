import { createPlugin, createRoutableExtension } from '@backstage/core-plugin-api';

import { rootRouteRef } from './routes';

export const dashboardPlugin = createPlugin({
  id: 'dashboard',
  routes: {
    root: rootRouteRef,
  },
});

export const DashboardPage = dashboardPlugin.provide(
  createRoutableExtension({
    component: () =>
      import('./components/ExampleComponent').then(m => m.ExampleComponent),
    mountPoint: rootRouteRef,
  }),
);
