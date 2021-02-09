/*
 * Copyright 2020 Spotify AB
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
  createPlugin,
  createApiFactory,
  createRoutableExtension,
} from '@backstage/core';
import ProfileCatalog from './components/ProfileCatalog';
import ClusterPage from './components/ClusterPage';
import ClusterList from './components/ClusterList';
import {
  gitOpsClusterListRoute,
  gitOpsClusterDetailsRoute,
  gitOpsClusterCreateRoute,
} from './routes';
import { gitOpsApiRef, GitOpsRestApi } from './api';

export const gitopsProfilesPlugin = createPlugin({
  id: 'gitops-profiles',
  apis: [
    createApiFactory(gitOpsApiRef, new GitOpsRestApi('http://localhost:3008')),
  ],
  register({ router }) {
    router.addRoute(gitOpsClusterListRoute, ClusterList);
    router.addRoute(gitOpsClusterDetailsRoute, ClusterPage);
    router.addRoute(gitOpsClusterCreateRoute, ProfileCatalog);
  },
  routes: {
    listPage: gitOpsClusterListRoute,
    detailsPage: gitOpsClusterDetailsRoute,
    createPage: gitOpsClusterCreateRoute,
  },
});

export const GitopsProfilesClusterListPage = gitopsProfilesPlugin.provide(
  createRoutableExtension({
    component: () => import('./components/ClusterList').then(m => m.default),
    mountPoint: gitOpsClusterListRoute,
  }),
);

export const GitopsProfilesClusterPage = gitopsProfilesPlugin.provide(
  createRoutableExtension({
    component: () => import('./components/ClusterPage').then(m => m.default),
    mountPoint: gitOpsClusterDetailsRoute,
  }),
);

export const GitopsProfilesCreatePage = gitopsProfilesPlugin.provide(
  createRoutableExtension({
    component: () => import('./components/ProfileCatalog').then(m => m.default),
    mountPoint: gitOpsClusterCreateRoute,
  }),
);
