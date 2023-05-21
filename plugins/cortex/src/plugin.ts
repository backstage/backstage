import {
  createApiFactory,
  createPlugin,
  createRoutableExtension,
  discoveryApiRef,
  fetchApiRef,
} from '@backstage/core-plugin-api';

import { cortexRouteRef } from './routes';
import { CortexApiClient, CortexApiRef } from './api';

export const cortexPlugin = createPlugin({
  id: 'cortex',
  apis: [
    createApiFactory({
      api: CortexApiRef,
      deps: { discoveryApi: discoveryApiRef, fetchApi: fetchApiRef },
      factory: ({ discoveryApi, fetchApi }) =>
        new CortexApiClient({ discoveryApi, fetchApi }),
    }),
  ],
});

export const CortexPage = cortexPlugin.provide(
  createRoutableExtension({
    name: 'CortexPage',
    component: () =>
      import('./components/Router').then(m => m.Router),
    mountPoint: cortexRouteRef,
  }),
);
