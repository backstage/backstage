/*
 * Copyright 2023 The Backstage Authors
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
import { OCTOPUS_DEPLOY_PROJECT_ID_ANNOTATION } from './constants';
import { octopusDeployEntityContentRouteRef } from './routes';

import { OctopusDeployClient, octopusDeployApiRef } from './api';

import {
  createApiFactory,
  createPlugin,
  createRoutableExtension,
  discoveryApiRef,
  fetchApiRef,
} from '@backstage/core-plugin-api';

import { Entity } from '@backstage/catalog-model';

/** @public */
export const isOctopusDeployAvailable = (entity: Entity) =>
  Boolean(entity.metadata.annotations?.[OCTOPUS_DEPLOY_PROJECT_ID_ANNOTATION]);

/** @public */
export const octopusDeployPlugin = createPlugin({
  id: 'octopus-deploy',
  apis: [
    createApiFactory({
      api: octopusDeployApiRef,
      deps: { discoveryApi: discoveryApiRef, fetchApi: fetchApiRef },
      factory: ({ discoveryApi, fetchApi }) =>
        new OctopusDeployClient({ discoveryApi, fetchApi }),
    }),
  ],
});

/** @public */
export const EntityOctopusDeployContent = octopusDeployPlugin.provide(
  createRoutableExtension({
    name: 'EntityOctopusDeployContent',
    component: () =>
      import('./components/EntityPageOctopusDeploy').then(
        m => m.EntityPageOctopusDeploy,
      ),
    mountPoint: octopusDeployEntityContentRouteRef,
  }),
);
