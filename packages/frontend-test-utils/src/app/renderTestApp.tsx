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

import { prepareSpecializedApp } from '@backstage/frontend-app-api';
import {
  coreExtensionData,
  ExtensionDefinition,
  FrontendFeature,
  RouteRef,
  ExternalRouteRef,
  identityApiRef,
} from '@backstage/frontend-plugin-api';
import { render } from '@testing-library/react';
import appPlugin from '@backstage/plugin-app';
import { JsonObject } from '@backstage/types';
import { ConfigReader } from '@backstage/config';
// eslint-disable-next-line @backstage/no-relative-monorepo-imports
import type { CreateSpecializedAppInternalOptions } from '../../../frontend-app-api/src/wiring/createSpecializedApp';
// eslint-disable-next-line @backstage/no-relative-monorepo-imports
import { getBasePath } from '../../../frontend-app-api/src/routing/getBasePath';
import { TestApiPairs } from '../apis/TestApiProvider';
import {
  createTestNavigation,
  type TestAppRenderResult,
} from './createTestNavigation';
import { prepareTestAppFeatures } from './prepareTestAppFeatures';

export type { TestAppRenderResult };

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
   * Initial route entries for the in-memory navigation controller history.
   * The last entry is the starting location.
   */
  initialRouteEntries?: string[];

  /**
   * An object of paths to mount route refs on, with the key being the path and
   * the value being the route ref that the path will be bound to. This allows
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
  mountedRoutes?: { [path: string]: RouteRef | ExternalRouteRef };

  /**
   * API overrides to provide to the test app. Use `mockApis` helpers
   * from `@backstage/frontend-test-utils` to create mock implementations.
   *
   * @example
   * ```ts
   * import { mockApis } from '@backstage/frontend-test-utils';
   *
   * renderTestApp({
   *   apis: [mockApis.identity({ userEntityRef: 'user:default/guest' })],
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
 * Navigation is owned by a {@link @backstage/frontend-plugin-api#AppHistoryApi}
 * with in-memory history — the same seam as production — rather than a
 * test-only root React Router as the long-term harness.
 *
 * @public
 */
export function renderTestApp<const TApiPairs extends any[] = any[]>(
  options?: RenderTestAppOptions<TApiPairs>,
): TestAppRenderResult {
  const extensions = [...(options?.extensions ?? [])];
  const configData = options?.config ?? DEFAULT_MOCK_CONFIG;
  const { controller, basename } = createTestNavigation({
    initialEntries: options?.initialRouteEntries,
    config: configData,
  });

  const { features, apiFactoryOverrides, externalBindings } =
    prepareTestAppFeatures({
      extensions,
      navigation: { controller, basename },
      appPluginOverride,
      mountedRoutes: options?.mountedRoutes,
      features: options?.features,
      apis: options?.apis,
      mountedRouteAttachTo: { id: 'app/routes', input: 'routes' },
    });

  const identityOverrideFactory = apiFactoryOverrides.find(
    factory => factory.api.id === identityApiRef.id,
  );

  const config = ConfigReader.fromConfigs([
    {
      context: 'render-config',
      data: configData,
    },
  ]);

  const app = prepareSpecializedApp({
    features,
    config,
    __internal: {
      apiFactoryOverrides: apiFactoryOverrides.filter(
        factory => factory.api.id !== identityApiRef.id,
      ),
    },
    bindRoutes:
      externalBindings.size > 0
        ? ({ bind }) => {
            for (const [externalRef, targetRef] of externalBindings) {
              bind({ ref: externalRef }, { ref: targetRef });
            }
          }
        : undefined,
  } as CreateSpecializedAppInternalOptions).finalize();

  if (identityOverrideFactory) {
    // identityApiRef always resolves to the app's internal AppIdentityProxy
    // (AppRouter requires this), so the override can't replace the factory.
    // setTarget is now idempotent (first write wins), so we just need to
    // set it before AppRouter's own guest-identity fallback does, which
    // happens during this same synchronous render call.
    const proxy = app.apis.get(identityApiRef as any) as any;
    proxy?.setTarget?.(identityOverrideFactory.factory({}), {
      signOutTargetUrl: getBasePath(config) || '/',
    });
  }

  const result = render(
    app.tree.root.instance!.getData(coreExtensionData.reactElement),
  );

  return Object.assign(result, { navigationController: controller });
}
