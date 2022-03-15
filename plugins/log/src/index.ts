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

import { createPlugin, createReactExtension } from '@backstage/core-plugin-api';

export * from './hooks';

import packageJson from '../package.json';

export const devtoolsPlugin = createPlugin({
  id: 'logs',
  apis: [],
  info: { packageJson },
});

export const LogsPaneProvider = devtoolsPlugin.provide(
  createReactExtension({
    name: 'LogsPaneProvider',
    component: {
      lazy: () =>
        import('./components/log-pane-provider').then(m => m.LogPaneProvider),
    },
  }),
);

export const LogsPane = devtoolsPlugin.provide(
  createReactExtension({
    name: 'LogsPane',
    component: {
      lazy: () => import('./components/log-pane').then(m => m.LogPane),
    },
  }),
);
