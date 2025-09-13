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
  createExtensionBlueprint,
  ExtensionBoundary,
} from '@backstage/frontend-plugin-api';
import { devToolsRouteDataRef } from './devToolsRouteDataRef';
import { JSX } from 'react';

/**
 * Parameters for creating a DevTools route extension
 * @public
 */
export interface DevToolsRouteBlueprintParams {
  path: string;
  title: string;
  loader: () => Promise<JSX.Element>;
}

/**
 * Extension blueprint for creating DevTools routes
 *
 * @example
 * ```tsx
 * const myDevToolsRoute = DevToolsRouteBlueprint.make({
 *   params: {
 *     path: 'my-feature',
 *     title: 'My Feature',
 *     loader: () => import('./MyContent').then(m => ({ default: m.MyContent }))
 *   }
 * });
 * ```
 * @public
 */
export const DevToolsRouteBlueprint = createExtensionBlueprint({
  kind: 'devtools-route',
  attachTo: { id: 'page:devtools', input: 'routes' },
  output: [devToolsRouteDataRef],
  factory(params: DevToolsRouteBlueprintParams, { node }) {
    const children = ExtensionBoundary.lazy(node, params.loader);

    return [
      devToolsRouteDataRef({
        path: params.path,
        title: params.title,
        children,
      }),
    ];
  },
  dataRefs: {
    route: devToolsRouteDataRef,
  },
});
