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

import { type ReactNode } from 'react';
import { Route, Routes, useMatch } from 'react-router-dom';
import { PageMountProvider } from '@internal/frontend';
import { prepareSpecializedApp } from '@backstage/frontend-app-api';
import { render } from '@testing-library/react';
import { ConfigReader } from '@backstage/config';
import { JsonObject } from '@backstage/types';
import {
  createExtension,
  ExtensionDefinition,
  coreExtensionData,
  RouteRef,
  FrontendFeature,
  ExternalRouteRef,
  identityApiRef,
} from '@backstage/frontend-plugin-api';
import appPlugin from '@backstage/plugin-app';
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
 * Publishes the page mount for an element rendered at `mountPath`.
 *
 * The test app owns navigation through an app history, the same seam as
 * production, so page-relative targets are resolved against the page they are
 * written in rather than against React Router. The page mount is what carries
 * that page. In a real app it is published while the location is matched to a
 * page; here the element is rendered directly, with no `AppRouteSwitch` above
 * it to do so, and `mountPath` is the caller saying where the element sits.
 *
 * Without this, everything page-relative inside the element under test — a tab
 * href, a `..` climb, a fragment-only target — would resolve against the app
 * root, which is a place the element is not mounted.
 *
 * The pattern is published alongside the concrete base because a leading `..`
 * climbs one route match rather than one path segment, and only the pattern
 * says where the match ends: an element at `/catalog/:namespace/:kind/:name`
 * is one route however many segments its address has.
 */
function TestPageMount(props: {
  routePath: string;
  routePattern: string;
  children: ReactNode;
}) {
  const { routePath, routePattern, children } = props;
  // Rendered as the route's own element, so this matches by construction. The
  // guard is for the caller whose `initialRouteEntries` do not reach
  // `mountPath`: publishing a mount the location is not actually at would be
  // worse than publishing none.
  const match = useMatch(routePath);
  if (!match) {
    return <>{children}</>;
  }
  return (
    <PageMountProvider mount={{ basePath: match.pathnameBase, routePattern }}>
      {children}
    </PageMountProvider>
  );
}

/**
 * Options to customize the behavior of the test app.
 * @public
 */
export type TestAppOptions<TApiPairs extends any[] = any[]> = {
  /**
   * An object of paths to mount route ref on, with the key being the path and the value
   * being the route ref that the path will be bound to. This allows the route refs to be
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
  mountedRoutes?: { [path: string]: RouteRef | ExternalRouteRef };

  /**
   * Additional configuration passed to the app when rendering elements inside it.
   */
  config?: JsonObject;

  /**
   * Additional features to add to the test app.
   */
  features?: FrontendFeature[];

  /**
   * The route path pattern that the test element is rendered at. When set,
   * the element is wrapped in a `<Route>` with this path, enabling
   * `useParams()` to extract parameters from the URL.
   *
   * The element is also treated as a page mounted at this pattern, so targets
   * written relative to the page — a tab href, a `..` climb — resolve against
   * it rather than against the app root, as they would in a real app.
   *
   * Should be used together with `initialRouteEntries` to set a concrete
   * URL that matches the pattern.
   *
   * @example
   * ```ts
   * renderInTestApp(<EntityPage />, {
   *   mountPath: '/catalog/:namespace/:kind/:name',
   *   initialRouteEntries: ['/catalog/default/component/my-entity'],
   * })
   * ```
   */
  mountPath?: string;

  /**
   * Initial route entries for the in-memory app history.
   * The last entry is the starting location.
   */
  initialRouteEntries?: string[];

  /**
   * API overrides to provide to the test app. Use `mockApis` helpers
   * from `@backstage/frontend-test-utils` to create mock implementations.
   *
   * @example
   * ```ts
   * import { mockApis } from '@backstage/frontend-test-utils';
   *
   * renderInTestApp(<MyComponent />, {
   *   apis: [mockApis.identity({ userEntityRef: 'user:default/guest' })],
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
    appPlugin.getExtension('app/layout').override({
      disabled: true,
    }),
    appPlugin.getExtension('app/routes').override({
      disabled: true,
    }),
    appPlugin.getExtension('app/nav').override({
      disabled: true,
    }),
  ],
});

/**
 * @public
 * Renders the given element in a test app, for use in unit tests.
 *
 * Navigation is owned by a {@link @backstage/frontend-plugin-api#AppHistoryApi}
 * with in-memory history, the same seam as production, and is returned as
 * `appHistory`.
 */
export function renderInTestApp<const TApiPairs extends any[] = any[]>(
  element: JSX.Element,
  options?: TestAppOptions<TApiPairs>,
): TestAppRenderResult {
  const mountPath = options?.mountPath;
  const configData = options?.config ?? DEFAULT_MOCK_CONFIG;
  const { appHistory, basename } = createTestNavigation({
    initialEntries: options?.initialRouteEntries,
    config: configData,
  });

  const extensions: Array<ExtensionDefinition> = [
    createExtension({
      attachTo: { id: 'app/root', input: 'children' },
      output: [coreExtensionData.reactElement],
      factory: () => {
        let content: JSX.Element = element;

        if (mountPath) {
          const routePath =
            mountPath === '/' || mountPath.endsWith('/*')
              ? mountPath
              : `${mountPath.replace(/\/$/, '')}/*`;
          // The pattern the caller mounted at, which is `routePath` without
          // the splat the wrapping route needs in order to host nested routes.
          const routePattern =
            routePath === '/' ? '/' : routePath.replace(/\/\*$/, '') || '/';
          content = (
            <Routes>
              <Route
                path={routePath}
                element={
                  <TestPageMount
                    routePath={routePath}
                    routePattern={routePattern}
                  >
                    {content}
                  </TestPageMount>
                }
              />
            </Routes>
          );
        }

        return [coreExtensionData.reactElement(content)];
      },
    }),
  ];

  const { features, apiFactoryOverrides, externalBindings } =
    prepareTestAppFeatures({
      extensions,
      navigation: { appHistory, basename },
      appPluginOverride,
      mountedRoutes: options?.mountedRoutes,
      features: options?.features,
      apis: options?.apis,
      mountedRouteAttachTo: { id: 'app/root', input: 'elements' },
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

  return Object.assign(result, { appHistory });
}
