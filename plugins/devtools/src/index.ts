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
  createRoutableExtension,
  createComponentExtension,
} from '@backstage/core-plugin-api';

import { devtoolsRouteRef } from './route';

import packageJson from '../package.json';

export * from './types';
export * from './hooks';
export { PluginLink } from './components/plugin-link';

export { devtoolsRouteRef };

export const devtoolsPlugin = createPlugin({
  id: 'devtools',
  apis: [],
  routes: {
    root: devtoolsRouteRef,
  },
  info: { packageJson },
});

export const DevToolsPage = devtoolsPlugin.provide(
  createRoutableExtension({
    name: 'DevToolsPage',
    component: () => import('./page-wrapper/root-page').then(m => m.RootPage),
    mountPoint: devtoolsRouteRef,
  }),
);

export const ApiIcon = devtoolsPlugin.provide(
  createComponentExtension({
    name: 'ApiIcon',
    component: {
      lazy: () => import('./components/api-icon').then(m => m.ApiIcon),
    },
  }),
);
