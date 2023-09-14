import { 
  configApiRef,
  createApiFactory,
  createPlugin, 
  createRoutableExtension } from '@backstage/core-plugin-api';

import { rootRouteRef } from './routes';
import { FianuApiClient, fianuApiRef } from './api';

export const fianuPlugin = createPlugin({
  id: 'fianu',
  apis: [
    createApiFactory({
      api: fianuApiRef,
      deps: {
        configApi: configApiRef,
      },
      factory: ({ configApi }) => new FianuApiClient({ configApi }),
    }),
  ],  
  routes: {
    root: rootRouteRef,
  },
});

export const FianuPage = fianuPlugin.provide(
  createRoutableExtension({
    name: 'FianuPage',
    component: () =>
      import('./components/FianuComponent').then(m => m.FianuComponent),
    mountPoint: rootRouteRef,
  }),
);
