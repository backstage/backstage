/*
 * Copyright 2026 The Backstage Authors
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
  createFrontendPlugin,
  PageBlueprint,
  SubPageBlueprint,
} from '@backstage/frontend-plugin-api';
import { RiMedalLine } from '@remixicon/react';
import { checksRouteRef, overviewRouteRef, rootRouteRef } from './routes';

const scorecardPage = PageBlueprint.make({
  params: {
    path: '/lazy-scorecard',
    routeRef: rootRouteRef,
  },
});

const overviewSubPage = SubPageBlueprint.make({
  name: 'overview',
  params: {
    path: 'overview',
    title: 'Overview',
    routeRef: overviewRouteRef,
    loader: () =>
      import('./components/ScorecardList').then(m => <m.ScorecardList />),
  },
});

const checksSubPage = SubPageBlueprint.make({
  name: 'checks',
  params: {
    path: 'checks',
    title: 'Checks',
    routeRef: checksRouteRef,
    loader: () => import('./components/ChecksPage').then(m => <m.ChecksPage />),
  },
});

/**
 * Demo plugin with a page and two sub-pages, so the CLI can defer it. The
 * plugin is loaded the first time one of its pages is visited.
 */
export default createFrontendPlugin({
  pluginId: 'lazy-scorecard',
  title: 'Lazy Scorecard',
  icon: <RiMedalLine />,
  extensions: [scorecardPage, overviewSubPage, checksSubPage],
  routes: {
    root: rootRouteRef,
    overview: overviewRouteRef,
    checks: checksRouteRef,
  },
});
