import {
  createPlugin,
  createRoutableExtension,
} from '@backstage/core-plugin-api';

import { rootRouteRef } from './routes';

export const uptimerobotPlugin = createPlugin({
  id: 'uptimerobot',
  routes: {
    root: rootRouteRef,
  },
});

export const UptimeRobotPage = uptimerobotPlugin.provide(
  createRoutableExtension({
    name: 'UptimeRobotPage',
    component: () =>
      import('./components/UptimeRobotComponent').then(m => m.UptimeRobotComponent),
    mountPoint: rootRouteRef,
  }),
);