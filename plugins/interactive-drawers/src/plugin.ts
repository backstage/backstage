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
} from '@backstage/core-plugin-api';

/** @public */
export const interactiveDrawersPlugin = createPlugin({
  id: 'interactive-drawers',
});

/** @public */
export const InteractiveLink = interactiveDrawersPlugin.provide(
  createComponentExtension({
    name: 'InteractiveLink',
    component: {
      lazy: () =>
        import('./links/interactive-link').then(m => m.InteractiveLink),
    },
  }),
);

/** @public */
export const SidebarProvider = interactiveDrawersPlugin.provide(
  createComponentExtension({
    name: 'SidebarProvider',
    component: {
      lazy: () =>
        import('./contexts/sidebar-provider').then(m => m.SidebarProvider),
    },
  }),
);
