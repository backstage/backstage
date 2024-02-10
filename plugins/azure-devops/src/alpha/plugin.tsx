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

import React from 'react';
import {
  createApiExtension,
  createApiFactory,
  createPageExtension,
  createPlugin,
  discoveryApiRef,
  identityApiRef,
} from '@backstage/frontend-plugin-api';
import { azureDevOpsApiRef, AzureDevOpsClient } from '../api';
import {
  compatWrapper,
  convertLegacyRouteRef,
} from '@backstage/core-compat-api';
import {
  createEntityCardExtension,
  createEntityContentExtension,
} from '@backstage/plugin-catalog-react/alpha';
import { azurePullRequestDashboardRouteRef } from '../routes';

/** @alpha */
export const azureDevOpsApi = createApiExtension({
  factory: createApiFactory({
    api: azureDevOpsApiRef,
    deps: { discoveryApi: discoveryApiRef, identityApi: identityApiRef },
    factory: ({ discoveryApi, identityApi }) =>
      new AzureDevOpsClient({ discoveryApi, identityApi }),
  }),
});

/** @alpha */
export const azureDevOpsPullRequestPage = createPageExtension({
  defaultPath: '/azure-pull-requests',
  routeRef: convertLegacyRouteRef(azurePullRequestDashboardRouteRef),
  loader: () =>
    import('../components/PullRequestsPage').then(m =>
      compatWrapper(<m.PullRequestsPage />),
    ),
});

/** @alpha */
export const azureDevOpsPipelinesEntityContent = createEntityContentExtension({
  name: 'pipelines',
  defaultPath: '/pipelines',
  defaultTitle: 'Pipelines',
  loader: () =>
    import('../components/EntityPageAzurePipelines').then(m =>
      compatWrapper(<m.EntityPageAzurePipelines />),
    ),
});

/** @alpha */
export const azureDevOpsGitTagsEntityContent = createEntityContentExtension({
  name: 'git-tags',
  defaultPath: '/git-tags',
  defaultTitle: 'Git Tags',
  loader: () =>
    import('../components/EntityPageAzureGitTags').then(m =>
      compatWrapper(<m.EntityPageAzureGitTags />),
    ),
});

/** @alpha */
export const azureDevOpsPullRequestsEntityContent =
  createEntityContentExtension({
    name: 'pull-requests',
    defaultPath: '/pull-requests',
    defaultTitle: 'Pull Requests',
    loader: () =>
      import('../components/EntityPageAzurePullRequests').then(m =>
        compatWrapper(<m.EntityPageAzurePullRequests />),
      ),
  });

/** @alpha */
export const azureDevOpsReadmeEntityCard = createEntityCardExtension({
  name: 'readme',
  loader: async () =>
    import('../components/ReadmeCard').then(m =>
      compatWrapper(<m.ReadmeCard />),
    ),
});

/** @alpha */
export default createPlugin({
  id: 'azure-devops',
  extensions: [
    azureDevOpsApi,
    azureDevOpsReadmeEntityCard,
    azureDevOpsPipelinesEntityContent,
    azureDevOpsGitTagsEntityContent,
    azureDevOpsPullRequestsEntityContent,
    azureDevOpsPullRequestPage,
  ],
});
