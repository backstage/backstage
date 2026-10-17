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
  createRouteRef,
  PageBlueprint,
} from '@backstage/frontend-plugin-api';

const rootRouteRef = createRouteRef();

const reviewPage = PageBlueprint.make({
  params: {
    path: '/ai-code-review',
    routeRef: rootRouteRef,
    title: 'AI Code Review',
    loader: () => import('./components/ReviewPage').then(m => <m.ReviewPage />),
  },
});

/**
 * Demo plugin that reviews a GitHub pull request with the AI gateway. The
 * diff is fetched in the browser with the signed-in user's token, which is
 * never sent to a Backstage backend.
 */
export default createFrontendPlugin({
  pluginId: 'example-ai-code-review',
  info: { packageJson: () => import('../package.json') },
  routes: { root: rootRouteRef },
  extensions: [reviewPage],
});
