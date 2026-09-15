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

import { type ComponentType, type ReactNode } from 'react';
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
    <PageMountProvider
      isolated
      mount={{ basePath: match.pathnameBase, routePattern }}
    >
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
   * The route path pattern that the test element is rendered at.
   *
   * The element is treated as a page mounted at this pattern, so targets
   * written relative to the page — a tab href, a `..` climb — resolve against
   * it rather than against the app root, as they would in a real app, and
   * `useRouteRefParams` binds the params the pattern names.
   *
   * This publishes a framework page mount. Pass the page's adapter with
   * `router` when the element uses a routing library, or read framework params
   * through `useRouteRefParams`.
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
   * The page router adapter the element under test is rendered inside, mirroring
   * the adapter its page declares in production.
   *
   * The app retains its root React Router v6 projection. This option supplies
   * the explicit page scope used by the page in production, including for
   * adapters from other routing libraries.
   *
   * Pass the same adapter the page renders in its loader, and the element is
   * rendered inside it exactly as the page renders it. Reach for this only for
   * content that genuinely uses its routing library: `useRouteRef`,
   * `useRouteRefParams` and `useHref` answer from the framework and need no
   * adapter at all.
   *
   * Pairs with `mountPath`, which is what says where the page sits; without one
   * the element is treated as a page mounted at the app root.
   *
   * @example
   * ```ts
   * import { ReactRouterV6PageRouter } from '@backstage/plugin-app-react-router-v6';
   *
   * renderInTestApp(<EntityHeader />, {
   *   router: ReactRouterV6PageRouter,
   *   mountPath: '/catalog/:namespace/:kind/:name',
   *   initialRouteEntries: ['/catalog/default/component/my-entity'],
   * })
   * ```
   */
  router?: ComponentType<{ children?: ReactNode }>;

  /**
   * What the element is in the app, which decides where it is rendered.
   *
   * - `'page'` (the default) mounts it where a page goes, under the app's root
   *   React Router v6 projection. `router` supplies the page's explicit adapter.
   * - `'chrome'` mounts it on `app/root`'s `elements` input, where a sidebar, an
   *   error page or any other app-wide element goes. Chrome renders above every
   *   page and inside the app's own root React Router context, so it keeps one
   *   here too, and `mountPath` does not apply — chrome is not mounted at a
   *   route.
   *
   * Reach for `'chrome'` only for something that really is app-wide. `router`
   * is not the alternative for it: that is a page adapter, and it would give
   * chrome a page-scoped route context that no chrome has in a real app.
   *
   * @example
   * ```ts
   * renderInTestApp(<MySidebarItem />, {
   *   renderAs: 'chrome',
   *   initialRouteEntries: ['/catalog/default/component/my-entity'],
   * })
   * ```
   */
  renderAs?: 'page' | 'chrome';

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
 *
 * The element renders under the app's root React Router v6 projection, as in
 * production. Use `router` for the page's explicit adapter. Framework routing
 * hooks work without a page adapter. App-wide elements such as sidebars can
 * use `renderAs: 'chrome'` to render on the app root's elements input.
 */
export function renderInTestApp<const TApiPairs extends any[] = any[]>(
  element: JSX.Element,
  options?: TestAppOptions<TApiPairs>,
): TestAppRenderResult {
  const asChrome = options?.renderAs === 'chrome';
  const PageRouter = options?.router;
  // A page router adapter scopes a routing library to the page it renders, so
  // it needs a page to be mounted at. A caller who named an adapter but no
  // mount means the element under test *is* the page, so it is mounted at the
  // app root — the same place it sat before this option existed. The splat is
  // what lets that root mount host routes below it.
  const mountPath = options?.mountPath ?? (PageRouter ? '/*' : undefined);
  const configData = options?.config ?? DEFAULT_MOCK_CONFIG;
  const appHistory = createTestNavigation({
    initialEntries: options?.initialRouteEntries,
    config: configData,
  });

  const extensions: Array<ExtensionDefinition> = [
    createExtension({
      // Chrome is app-wide, so it goes where app-wide elements go: above every
      // page, inside the app's own root React Router projection. Nothing is
      // scoped away from it and nothing stands in for a page around it, which
      // is the whole difference — it is not a page and must not be tested as
      // one.
      attachTo: asChrome
        ? { id: 'app/root', input: 'elements' }
        : { id: 'app/root', input: 'children' },
      output: [coreExtensionData.reactElement],
      factory: () => {
        if (asChrome) {
          return [coreExtensionData.reactElement(element)];
        }
        let content = PageRouter ? <PageRouter>{element}</PageRouter> : element;

        if (mountPath) {
          // Every mount hosts what sits below it, the app root included: `'/'`
          // and `'/*'` are the same mount written two ways, and a bare `'/'`
          // route would match only the root itself, rendering nothing as soon
          // as `initialRouteEntries` points anywhere deeper.
          const routePath = mountPath.endsWith('/*')
            ? mountPath
            : `${mountPath.replace(/\/$/, '')}/*`;
          // The pattern the caller mounted at, which is `routePath` without
          // the splat the wrapping route needs in order to host nested routes.
          const routePattern = routePath.replace(/\/\*$/, '') || '/';
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
      appHistory,
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
