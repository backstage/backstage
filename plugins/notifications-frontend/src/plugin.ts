import {
  createApiFactory,
  createPlugin,
  createRoutableExtension,
  identityApiRef,
} from '@backstage/core-plugin-api';

import { NotificationsApiImpl, notificationsApiRef } from './api';
import { rootRouteRef } from './routes';

export const notificationsPlugin = createPlugin({
  id: 'notifications',
  routes: {
    root: rootRouteRef,
  },
  apis: [
    createApiFactory({
      api: notificationsApiRef,
      deps: { identityApi: identityApiRef },
      factory({ identityApi }) {
        return new NotificationsApiImpl({
          identityApi,
        });
      },
    }),
  ],
});

export const NotificationsPage = notificationsPlugin.provide(
  createRoutableExtension({
    name: 'NotificationsPage',
    component: () =>
      import('./components/NotificationsPage').then(m => m.NotificationsPage),
    mountPoint: rootRouteRef,
  }),
);
