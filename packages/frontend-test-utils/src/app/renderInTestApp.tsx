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

import React from 'react';
import {
  RouteRef,
  coreExtensionData,
  createExtension,
} from '@backstage/frontend-plugin-api';
import { createExtensionTester } from './createExtensionTester';

/**
 * Options to customize the behavior of the test app.
 * @public
 */
export type TestAppOptions = {
  /**
   * An object of paths to mount route ref on, with the key being the path and the value
   * being the RouteRef that the path will be bound to. This allows the route refs to be
   * used by `useRouteRef` in the rendered elements.
   *
   * @example
   * ```ts
   * renderInTestApp(<MyComponent />, {
   *   mountedRoutes: {
   *     '/my-path': myRouteRef,
   *   }
   * })
   * // ...
   * const link = useRouteRef(myRouteRef)
   * ```
   */
  mountedRoutes?: { [path: string]: RouteRef };
};

/**
 * @public
 * Renders the given element in a test app, for use in unit tests.
 */
export function renderInTestApp(
  element: JSX.Element,
  options?: TestAppOptions,
) {
  const extension = createExtension({
    namespace: 'test',
    attachTo: { id: 'app', input: 'root' },
    output: {
      element: coreExtensionData.reactElement,
    },
    factory: () => ({ element }),
  });
  const tester = createExtensionTester(extension);

  if (options?.mountedRoutes) {
    for (const [path, routeRef] of Object.entries(options.mountedRoutes)) {
      // TODO(Rugvip): add support for external route refs
      tester.add(
        createExtension({
          kind: 'test-route',
          name: path,
          attachTo: { id: 'app/root', input: 'elements' },
          output: {
            element: coreExtensionData.reactElement,
            path: coreExtensionData.routePath,
            routeRef: coreExtensionData.routeRef,
          },
          factory() {
            return { element: <React.Fragment />, path, routeRef };
          },
        }),
      );
    }
  }
  return tester.render();
}
