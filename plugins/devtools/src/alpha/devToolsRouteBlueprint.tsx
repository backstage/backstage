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

import { createExtensionBlueprint } from '@backstage/frontend-plugin-api';
import { devToolsRouteDataRef } from './devToolsRouteDataRef';
import { lazy, Suspense, JSX } from 'react';

/**
 * Parameters for creating a DevTools route extension
 * @alpha
 */
export interface DevToolsRouteBlueprintParams {
  path: string;
  title: string;
  loader: () => Promise<{ default: () => JSX.Element }> | (() => JSX.Element);
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
 * 
 * @alpha
 */
export const DevToolsRouteBlueprint = createExtensionBlueprint({
  kind: 'devtools-route',
  attachTo: { id: 'page:devtools', input: 'routes' },
  output: [devToolsRouteDataRef],
  factory(params: DevToolsRouteBlueprintParams) {
    // Handle both sync and async component loading
    const Component = typeof params.loader === 'function' 
      ? (() => {
          const result = params.loader();
          if (result instanceof Promise) {
            // Create a lazy component for async loading
            return lazy(() => result);
          } 
            // Direct component function
            return result;
          
        })()
      : params.loader;

    const children = typeof Component === 'function' 
      ? <Suspense fallback={<div>Loading...</div>}><Component /></Suspense>
      : Component;

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