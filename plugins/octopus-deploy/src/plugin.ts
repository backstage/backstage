import {
  OCTOPUS_DEPLOY_PROJECT_ID_ANNOTATION
} from './constants';
import {
  octopusDeployEntityContentRouteRef
} from './routes';

import { OctopusDeployClient, octopusDeployApiRef } from './api';

import { createApiFactory, createPlugin, createRoutableExtension, discoveryApiRef, identityApiRef } from '@backstage/core-plugin-api';

import { Entity } from '@backstage/catalog-model';

/** @public */
export const isOctopusDeployAvailable = (entity: Entity) =>
  Boolean(entity.metadata.annotations?.[OCTOPUS_DEPLOY_PROJECT_ID_ANNOTATION]);

export const octopusDeployPlugin = createPlugin({
  id: 'octopus-deploy',
  apis: [
    createApiFactory({
      api: octopusDeployApiRef,
      deps: { discoveryApi: discoveryApiRef, identityApi: identityApiRef },
      factory: ({ discoveryApi, identityApi }) => new OctopusDeployClient({ discoveryApi, identityApi })
    })
  ]
});

/*
export const OctopusDeployPage = octopusDeployPlugin.provide(
  createRoutableExtension({
    name: 'OctopusDeployPage',
    component: () =>
      import('./components/ExampleComponent').then(m => m.ExampleComponent),
    mountPoint: rootRouteRef,
  }),
);
*/

export const EntityOctopusDeployContent = octopusDeployPlugin.provide(
  createRoutableExtension({
    name: 'EntityOctopusDeployContent',
    component: () =>
      import('./components/EntityPageOctopusDeploy').then(
        m => m.EntityPageOctopusDeploy
      ),
    mountPoint: octopusDeployEntityContentRouteRef
  })
)