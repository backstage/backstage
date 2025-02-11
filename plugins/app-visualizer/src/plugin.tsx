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
} from '@backstage/frontend-plugin-api';
import VisualizerIcon from '@material-ui/icons/Visibility';

const rootRouteRef = createRouteRef();

const appVisualizerPage = PageBlueprint.make({
  params: {
    defaultPath: '/visualizer',
    routeRef: rootRouteRef,
    loader: () =>
      import('./components/AppVisualizerPage').then(m => (
        <m.AppVisualizerPage />
      )),
  },
});

export const appVisualizerNavItem = NavItemBlueprint.make({
  params: {
    title: 'Visualizer',
    icon: VisualizerIcon,
    routeRef: rootRouteRef,
  },
});

/** @public */
export const visualizerPlugin = createFrontendPlugin({
  id: 'app-visualizer',
  extensions: [appVisualizerPage, appVisualizerNavItem],
});
