/*
 * Copyright 2022 The Backstage Authors
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
  createComponentExtension,
  createRoutableExtension,
  configApiRef,
  errorApiRef,
  githubAuthApiRef,
} from '@backstage/core-plugin-api';
import { githubIssuesApi, githubIssuesApiRef } from './api';
import { rootRouteRef } from './routes';

/** @public */
export const githubIssuesPlugin = createPlugin({
  id: 'github-issues',
  apis: [
    createApiFactory({
      api: githubIssuesApiRef,
      deps: {
        configApi: configApiRef,
        githubAuthApi: githubAuthApiRef,
        errorApi: errorApiRef,
      },
      factory: ({ configApi, githubAuthApi, errorApi }) =>
        githubIssuesApi(githubAuthApi, configApi, errorApi),
    }),
  ],
  routes: {
    root: rootRouteRef,
  },
});

/** @public */
export const GithubIssuesCard = githubIssuesPlugin.provide(
  createComponentExtension({
    name: 'GithubIssuesCard',
    component: {
      lazy: () => import('./components/GithubIssues').then(m => m.GithubIssues),
    },
  }),
);

/** @public */
export const GithubIssuesPage = githubIssuesPlugin.provide(
  createRoutableExtension({
    name: 'GithubIssuesPage',
    component: () =>
      import('./components/GithubIssues').then(m => m.GithubIssues),
    mountPoint: rootRouteRef,
  }),
);
