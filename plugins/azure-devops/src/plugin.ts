/*
 * Copyright 2021 The Backstage Authors
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

import {
  AZURE_DEVOPS_BUILD_DEFINITION_ANNOTATION,
  AZURE_DEVOPS_PROJECT_ANNOTATION,
  AZURE_DEVOPS_REPO_ANNOTATION,
} from './constants';
import {
  azurePipelinesEntityContentRouteRef,
  azurePullRequestDashboardRouteRef,
  azureGitTagsEntityContentRouteRef,
  azurePullRequestsEntityContentRouteRef,
} from './routes';
import {
  createApiFactory,
  createPlugin,
  createRoutableExtension,
  createComponentExtension,
  discoveryApiRef,
  identityApiRef,
} from '@backstage/core-plugin-api';

import { AzureDevOpsClient } from './api/AzureDevOpsClient';
import { Entity } from '@backstage/catalog-model';
import { azureDevOpsApiRef } from './api/AzureDevOpsApi';

/** @public */
export const isAzureDevOpsAvailable = (entity: Entity) =>
  Boolean(entity.metadata.annotations?.[AZURE_DEVOPS_REPO_ANNOTATION]);

/** @public */
export const isAzurePipelinesAvailable = (entity: Entity) =>
  Boolean(entity.metadata.annotations?.[AZURE_DEVOPS_REPO_ANNOTATION]) ||
  (Boolean(entity.metadata.annotations?.[AZURE_DEVOPS_PROJECT_ANNOTATION]) &&
    Boolean(
      entity.metadata.annotations?.[AZURE_DEVOPS_BUILD_DEFINITION_ANNOTATION],
    ));

/** @public */
export const azureDevOpsPlugin = createPlugin({
  id: 'azureDevOps',
  apis: [
    createApiFactory({
      api: azureDevOpsApiRef,
      deps: { discoveryApi: discoveryApiRef, identityApi: identityApiRef },
      factory: ({ discoveryApi, identityApi }) =>
        new AzureDevOpsClient({ discoveryApi, identityApi }),
    }),
  ],
});

/** @public */
export const AzurePullRequestsPage = azureDevOpsPlugin.provide(
  createRoutableExtension({
    name: 'AzurePullRequestsPage',
    component: () =>
      import('./components/PullRequestsPage').then(m => m.PullRequestsPage),
    mountPoint: azurePullRequestDashboardRouteRef,
  }),
);

/** @public */
export const EntityAzurePipelinesContent = azureDevOpsPlugin.provide(
  createRoutableExtension({
    name: 'EntityAzurePipelinesContent',
    component: () =>
      import('./components/EntityPageAzurePipelines').then(
        m => m.EntityPageAzurePipelines,
      ),
    mountPoint: azurePipelinesEntityContentRouteRef,
  }),
);

/** @public */
export const EntityAzureGitTagsContent = azureDevOpsPlugin.provide(
  createRoutableExtension({
    name: 'EntityAzureGitTagsContent',
    component: () =>
      import('./components/EntityPageAzureGitTags').then(
        m => m.EntityPageAzureGitTags,
      ),
    mountPoint: azureGitTagsEntityContentRouteRef,
  }),
);

/** @public */
export const EntityAzurePullRequestsContent = azureDevOpsPlugin.provide(
  createRoutableExtension({
    name: 'EntityAzurePullRequestsContent',
    component: () =>
      import('./components/EntityPageAzurePullRequests').then(
        m => m.EntityPageAzurePullRequests,
      ),
    mountPoint: azurePullRequestsEntityContentRouteRef,
  }),
);

/** @public */
export const EntityAzureReadmeCard = azureDevOpsPlugin.provide(
  createComponentExtension({
    name: 'EntityAzureReadmeCard',
    component: {
      lazy: () => import('./components/ReadmeCard').then(m => m.ReadmeCard),
    },
  }),
);
