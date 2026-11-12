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
} from '@backstage/frontend-plugin-api';
import { RiFlashlightLine } from '@remixicon/react';
import { rootRouteRef } from './routes';

const LazyDemoPage = PageBlueprint.make({
  params: {
    path: '/lazy-demo',
    routeRef: rootRouteRef,
    loader: () => import('./components/HeavyPage').then(m => <m.HeavyPage />),
  },
});

const LazyDemoDetailsPage = PageBlueprint.make({
  name: 'details',
  params: {
    path: '/lazy-demo/details',
    loader: () =>
      import('./components/DetailsPage').then(m => <m.DetailsPage />),
  },
});

/**
 * Demo plugin that only provides pages, so the CLI can defer it.
 */
export default createFrontendPlugin({
  pluginId: 'lazy-demo',
  title: 'Lazy Demo',
  icon: <RiFlashlightLine />,
  extensions: [LazyDemoPage, LazyDemoDetailsPage],
  routes: {
    root: rootRouteRef,
  },
});
