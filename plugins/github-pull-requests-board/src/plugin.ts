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
  createComponentExtension,
  createRoutableExtension,
} from '@backstage/core-plugin-api';
import { rootRouteRef } from './routes';

const githubPullRequestsBoardPlugin = createPlugin({
  id: 'github-pull-requests-board',
  routes: {
    root: rootRouteRef,
  },
});

export const TeamPullRequestsBoard = githubPullRequestsBoardPlugin.provide(
  createComponentExtension({
    name: 'TeamPullRequestsBoard',
    component: {
      lazy: () =>
        import('./components/TeamPullRequestsBoard').then(
          m => m.TeamPullRequestsBoard,
        ),
    },
  }),
);

export const TeamPullRequestsPage = githubPullRequestsBoardPlugin.provide(
  createRoutableExtension({
    name: 'PullRequestPage',
    component: () =>
      import('./components/TeamPullRequestsPage').then(m => m.TeamPullRequestsPage),
    mountPoint: rootRouteRef,
  }),
);
