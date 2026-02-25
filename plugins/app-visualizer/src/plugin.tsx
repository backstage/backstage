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

import {
  createFrontendPlugin,
  createRouteRef,
  NavItemBlueprint,
  PageBlueprint,
  PluginHeaderActionBlueprint,
  SubPageBlueprint,
} from '@backstage/frontend-plugin-api';
import { RiEyeLine } from '@remixicon/react';

const rootRouteRef = createRouteRef();

const appVisualizerPage = PageBlueprint.make({
  params: {
    path: '/visualizer',
    routeRef: rootRouteRef,
    title: 'Visualizer',
  },
});

const treeRouteRef = createRouteRef();
const detailedRouteRef = createRouteRef();
const textRouteRef = createRouteRef();

const appVisualizerTreePage = SubPageBlueprint.make({
  name: 'tree',
  params: {
    path: 'tree',
    routeRef: treeRouteRef,
    title: 'Tree',
    loader: () =>
      import('./components/AppVisualizerPage/TreeVisualizer').then(m => (
        <m.TreeVisualizer />
      )),
  },
});
const appVisualizerDetailedPage = SubPageBlueprint.make({
  name: 'details',
  params: {
    path: 'details',
    routeRef: detailedRouteRef,
    title: 'Detailed',
    loader: () =>
      import('./components/AppVisualizerPage/DetailedVisualizer').then(m => (
        <m.DetailedVisualizer />
      )),
  },
});
const appVisualizerTextPage = SubPageBlueprint.make({
  name: 'text',
  params: {
    path: 'text',
    routeRef: textRouteRef,
    title: 'Text',
    loader: () =>
      import('./components/AppVisualizerPage/TextVisualizer').then(m => (
        <m.TextVisualizer />
      )),
  },
});

const copyTreeAsJson = PluginHeaderActionBlueprint.make({
  params: defineParams =>
    defineParams({
      loader: () =>
        import('./components/CopyTreeButton').then(m => <m.CopyTreeButton />),
    }),
});

export const appVisualizerNavItem = NavItemBlueprint.make({
  params: {
    title: 'Visualizer',
    icon: () => <RiEyeLine />,
    routeRef: rootRouteRef,
  },
});

/** @public */
export const visualizerPlugin = createFrontendPlugin({
  pluginId: 'app-visualizer',
  title: 'App Visualizer',
  icon: <RiEyeLine />,
  info: { packageJson: () => import('../package.json') },
  extensions: [
    appVisualizerPage,
    appVisualizerTreePage,
    appVisualizerDetailedPage,
    appVisualizerTextPage,
    appVisualizerNavItem,
    copyTreeAsJson,
  ],
});
