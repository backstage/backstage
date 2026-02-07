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
  coreExtensionData,
  createExtensionBlueprint,
  ExtensionBoundary,
  RouteRef,
} from '@backstage/frontend-plugin-api';
import { JSX } from 'react';

/**
 * Parameters for creating a DevTools route extension
 * @public
 */
export interface DevToolsContentBlueprintParams {
  path: string;
  title: string;
  loader: () => Promise<JSX.Element>;
  routeRef?: RouteRef;
}

/**
 * Extension blueprint for creating DevTools content pages (appearing as tabs)
 *
 * @example
 * ```tsx
 * const myDevToolsContent = DevToolsContentBlueprint.make({
 *  {
 *     params: {
 *       path: 'my-dev-tools',
 *       title: 'My DevTools',
 *       loader: () =>
 *         import('../components/MyDevTools').then(m =>
 *           compatWrapper(<m.MyDevTools />),
 *         ),
 *     },
 *   },
 * });
 * ```
 * @public
 */
export const DevToolsContentBlueprint = createExtensionBlueprint({
  kind: 'devtools-content',
  attachTo: { id: 'page:devtools', input: 'contents' },
  output: [
    coreExtensionData.reactElement,
    coreExtensionData.routePath,
    coreExtensionData.routeRef.optional(),
    coreExtensionData.title,
  ],
  config: {
    schema: {
      path: z => z.string().optional(),
      title: z => z.string().optional(),
    },
  },
  *factory(params: DevToolsContentBlueprintParams, { node, config }) {
    const path = config.path ?? params.path;
    const title = config.title ?? params.title;

    yield coreExtensionData.reactElement(
      ExtensionBoundary.lazy(node, params.loader),
    );

    yield coreExtensionData.routePath(path);

    yield coreExtensionData.title(title);

    if (params.routeRef) {
      yield coreExtensionData.routeRef(params.routeRef);
    }
  },
});
