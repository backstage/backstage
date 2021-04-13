/*
 * Copyright 2021 Spotify AB
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
  configApiRef,
  createPlugin,
  createApiFactory,
  githubAuthApiRef,
  createRoutableExtension,
} from '@backstage/core';

import { githubReleaseManagerApiRef } from './api/serviceApiRef';
import { PluginApiClientConfig } from './api/PluginApiClientConfig';
import { rootRouteRef } from './routes';

export const gitHubReleaseManagerPlugin = createPlugin({
  id: 'github-release-manager',
  routes: {
    root: rootRouteRef,
  },
  apis: [
    createApiFactory({
      api: githubReleaseManagerApiRef,
      deps: {
        configApi: configApiRef,
        githubAuthApi: githubAuthApiRef,
      },
      factory: ({ configApi, githubAuthApi }) =>
        new PluginApiClientConfig({ configApi, githubAuthApi }),
    }),
  ],
});

export const GitHubReleaseManagerPage = gitHubReleaseManagerPlugin.provide(
  createRoutableExtension({
    component: () =>
      import('./GitHubReleaseManager').then(m => m.GitHubReleaseManager),
    mountPoint: rootRouteRef,
  }),
);
