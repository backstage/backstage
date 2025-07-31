/*
 * Copyright 2024 The Backstage Authors
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
} from '@backstage/core-plugin-api';

import { rootRouteRef } from './routes';

/**
 * The welcome plugin instance
 *
 * @public
 */
export const welcomePlugin = createPlugin({
  id: 'welcome',
  routes: {
    root: rootRouteRef,
  },
});

/**
 * The Router and main entrypoint to the welcome plugin.
 *
 * @public
 */
export const WelcomePage = welcomePlugin.provide(
  createRoutableExtension({
    name: 'WelcomePage',
    component: () =>
      import('./components/WelcomePage').then(m => m.WelcomePage),
    mountPoint: rootRouteRef,
  }),
);