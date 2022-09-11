import {
  createApiFactory,
  createComponentExtension,
  createPlugin,
  createRouteRef,
  discoveryApiRef,
  identityApiRef
} from '@backstage/core-plugin-api';
import { azureFunctionsApiRef, AzureFunctionsBackendClient } from './api';

export const entityContentRouteRef = createRouteRef({
  id: 'Azure Functions Entity Content',
});

export const azureFunctionsPlugin = createPlugin({
  id: 'azure-functions',
  apis: [
    createApiFactory({
      api: azureFunctionsApiRef,
      deps: {
        discoveryApi: discoveryApiRef,
        identityApi: identityApiRef,
      },
      factory: ({ discoveryApi, identityApi }) =>
        new AzureFunctionsBackendClient({ discoveryApi, identityApi }),
    })
  ],
  routes: {
    entityContent: entityContentRouteRef,
  },
});

export const EntityAzureFunctionsOverviewCard = azureFunctionsPlugin.provide(
  createComponentExtension({
    name: 'EntityAzureFunctionsOverviewCard',
    component: {
      lazy: () =>
        import('./components/AzureFunctionsOverview/AzureFunctionsOverview').then(
          m => m.AzureFunctionsOverviewWidget,
        ),
    },
  }),
);