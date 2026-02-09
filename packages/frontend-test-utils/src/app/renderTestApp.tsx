/*
 * Copyright 2025 The Backstage Authors
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

import { Fragment } from 'react';
import { createSpecializedApp } from '@backstage/frontend-app-api';
import {
  coreExtensionData,
  createApiFactory,
  createExtension,
  createFrontendModule,
  createFrontendPlugin,
  ExtensionDefinition,
  FrontendFeature,
  RouteRef,
} from '@backstage/frontend-plugin-api';
import { render } from '@testing-library/react';
import appPlugin from '@backstage/plugin-app';
import { JsonObject } from '@backstage/types';
import { ConfigReader } from '@backstage/config';
import { MemoryRouter } from 'react-router-dom';
import { RouterBlueprint } from '@backstage/plugin-app-react';
import { type TestApiPairs } from '../utils';
// eslint-disable-next-line @backstage/no-relative-monorepo-imports
import type { CreateSpecializedAppInternalOptions } from '../../../frontend-app-api/src/wiring/createSpecializedApp';

const DEFAULT_MOCK_CONFIG = {
  app: { baseUrl: 'http://localhost:3000' },
  backend: { baseUrl: 'http://localhost:7007' },
};

/**
 * Options for `renderTestApp`.
 *
 * @public
 */
export type RenderTestAppOptions<TApiPairs extends any[] = any[]> = {
  /**
   * Additional configuration passed to the app when rendering elements inside it.
   */
  config?: JsonObject;
  /**
   * Additional extensions to add to the test app.
   */
  extensions?: ExtensionDefinition<any>[];

  /**
   * Additional features to add to the test app.
   */
  features?: FrontendFeature[];

  /**
   * Initial route entries to use for the router.
   */
  initialRouteEntries?: string[];

  /**
   * An object of paths to mount route refs on, with the key being the path and
   * the value being the RouteRef that the path will be bound to. This allows
   * the route refs to be used by `useRouteRef` in the rendered elements.
   *
   * @example
   * ```ts
   * renderTestApp({
   *   mountedRoutes: {
   *     '/my-path': myRouteRef,
   *   },
   *   extensions: [...],
   * })
   * ```
   */
  mountedRoutes?: { [path: string]: RouteRef };

  /**
   * API overrides to provide to the test app. Use `mockApis` helpers
   * from `@backstage/frontend-test-utils` to create mock implementations.
   *
   * @example
   * ```ts
   * import { identityApiRef } from '@backstage/frontend-plugin-api';
   * import { mockApis } from '@backstage/frontend-test-utils';
   *
   * renderTestApp({
   *   apis: [[identityApiRef, mockApis.identity({ userEntityRef: 'user:default/guest' })]],
   *   extensions: [...],
   * })
   * ```
   */
  apis?: readonly [...TestApiPairs<TApiPairs>];
};

const appPluginOverride = appPlugin.withOverrides({
  extensions: [
    appPlugin.getExtension('sign-in-page:app').override({
      disabled: true,
    }),
  ],
});

/**
 * Renders the provided extensions inside a Backstage app, returning the same
 * utilities as `@testing-library/react` `render` function.
 *
 * @public
 */
export function renderTestApp<TApiPairs extends any[] = any[]>(
  options: RenderTestAppOptions<TApiPairs>,
) {
  const extensions = [...(options.extensions ?? [])];

  if (options.mountedRoutes) {
    for (const [path, routeRef] of Object.entries(options.mountedRoutes)) {
      extensions.push(
        createExtension({
          kind: 'test-route',
          name: path,
          attachTo: { id: 'app/routes', input: 'routes' },
          output: [
            coreExtensionData.reactElement,
            coreExtensionData.routePath,
            coreExtensionData.routeRef,
          ],
          factory: () => [
            coreExtensionData.reactElement(<Fragment />),
            coreExtensionData.routePath(path),
            coreExtensionData.routeRef(routeRef),
          ],
        }),
      );
    }
  }

  const features: FrontendFeature[] = [
    createFrontendModule({
      pluginId: 'app',
      extensions: [
        RouterBlueprint.make({
          params: {
            component: ({ children }) => (
              <MemoryRouter
                initialEntries={options.initialRouteEntries}
                future={{
                  v7_relativeSplatPath: true,
                  v7_startTransition: true,
                }}
              >
                {children}
              </MemoryRouter>
            ),
          },
        }),
      ],
    }),
    createFrontendPlugin({
      pluginId: 'test',
      extensions,
    }),
    appPluginOverride,
  ];

  if (options.features) {
    features.push(...options.features);
  }

  const app = createSpecializedApp({
    features,
    config: ConfigReader.fromConfigs([
      {
        context: 'render-config',
        data: options?.config ?? DEFAULT_MOCK_CONFIG,
      },
    ]),
    __internal: options?.apis && {
      apiFactoryOverrides: options.apis.map(([apiRef, implementation]) =>
        createApiFactory(apiRef, implementation),
      ),
    },
  } as CreateSpecializedAppInternalOptions);

  return render(
    app.tree.root.instance!.getData(coreExtensionData.reactElement),
  );
}
