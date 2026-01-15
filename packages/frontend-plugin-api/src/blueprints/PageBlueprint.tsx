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

import { RouteRef } from '../routing';
import { coreExtensionData, createExtensionBlueprint } from '../wiring';
import { ExtensionBoundary } from '../components';
import { ConditionalRender } from './ConditionalRender';
import { ExtensionConditionFunc } from './types';

/**
 * Createx extensions that are routable React page components.
 *
 * @public
 */
export const PageBlueprint = createExtensionBlueprint({
  kind: 'page',
  attachTo: { id: 'app/routes', input: 'routes' },
  output: [
    coreExtensionData.routePath,
    coreExtensionData.reactElement,
    coreExtensionData.routeRef.optional(),
  ],
  config: {
    schema: {
      path: z => z.string().optional(),
    },
  },
  *factory(
    params: {
      /**
       * @deprecated Use the `path` param instead.
       */
      defaultPath?: [Error: `Use the 'path' param instead`];
      path: string;
      loader: () => Promise<JSX.Element>;
      routeRef?: RouteRef;
      /**
       * Optional condition function that determines whether this page should be rendered.
       * The function receives access to the apiHolder for checking permissions, feature flags, config, etc.
       *
       * @example
       * ```typescript
       * if: async (originalDecision, { apiHolder }) => {
       *   const permissionApi = apiHolder.get(permissionApiRef);
       *   const result = await permissionApi?.authorize({ permission: catalogReadPermission });
       *   return result?.result === 'ALLOW';
       * }
       * ```
       */
      if?: ExtensionConditionFunc;
    },
    { config, node },
  ) {
    yield coreExtensionData.routePath(config.path ?? params.path);

    // Wrap loader with conditional rendering if condition provided
    const wrappedLoader = params.if
      ? async () => {
          const Component = await params.loader();
          return (
            <ConditionalRender condition={params.if!}>
              {Component}
            </ConditionalRender>
          );
        }
      : params.loader;

    yield coreExtensionData.reactElement(
      ExtensionBoundary.lazy(node, wrappedLoader),
    );
    if (params.routeRef) {
      yield coreExtensionData.routeRef(params.routeRef);
    }
  },
});
