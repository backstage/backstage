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

export const TeamPullRequestsTable = githubPullRequestsBoardPlugin.provide(
  createComponentExtension({
    name: 'TeamPullRequestsTable',
    component: {
      lazy: () =>
        import('./components/TeamPullRequestsTable').then(
          m => m.TeamPullRequestsTable,
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
