import { createPlugin, createRoutableExtension } from '@backstage/core';

import { rootRouteRef } from './routes';

export const dfdsCapabilityPluginPlugin = createPlugin({
  id: 'dfds-capability-plugin',
  routes: {
    root: rootRouteRef,
  },
});

export const DfdsCapabilityPluginPage = dfdsCapabilityPluginPlugin.provide(
  createRoutableExtension({
    component: () => import('./components/App/App').then(m => m.App),
    mountPoint: rootRouteRef,
  }),
);
