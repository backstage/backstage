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

import { Suspense, useSyncExternalStore, type ReactNode } from 'react';
import { prepareSpecializedApp } from '@backstage/frontend-app-api';
import type { RenderTestAppOptions } from './renderTestApp';
import { render } from '@testing-library/react';
import { ConfigReader } from '@backstage/config';
import {
  createExtension,
  ExtensionBoundary,
  ExtensionDefinition,
  coreExtensionData,
  identityApiRef,
  useApi,
  routeResolutionApiRef,
  type AppNode,
  coreApis,
} from '@backstage/frontend-plugin-api';
import { createTestAppPlugin } from './testAppPlugin';
// eslint-disable-next-line @backstage/no-relative-monorepo-imports
import type { CreateSpecializedAppInternalOptions } from '../../../frontend-app-api/src/wiring/prepareSpecializedApp';
// eslint-disable-next-line @backstage/no-relative-monorepo-imports
import { getBasePath } from '../../../frontend-app-api/src/routing/getBasePath';
import { throwOnAppErrors } from './throwOnAppErrors';
import {
  createTestNavigation,
  type TestAppRenderResult,
} from './createTestNavigation';
import { prepareTestAppFeatures } from './prepareTestAppFeatures';
import { TestRouteResolver } from '../internal/TestRouteResolver';

export type { TestAppRenderResult };

const DEFAULT_MOCK_CONFIG = {
  app: { baseUrl: 'http://localhost:3000' },
  backend: { baseUrl: 'http://localhost:7007' },
};

/**
 * Options to customize the behavior of the test app.
 *
 * Extends the options of {@link renderTestApp}; see
 * {@link RenderTestAppOptions} for the shared app, route, and API options.
 *
 * @public
 */
export type TestAppOptions<TApiPairs extends any[] = any[]> =
  RenderTestAppOptions<TApiPairs> & {
    /**
     * The route path pattern that the test element is rendered at.
     *
     * The element is treated as a page mounted at this pattern, so targets
     * written relative to the page — a tab href, a `..` climb — resolve against
     * it rather than against the app root, as they would in a real app, and
     * `useParams` binds the params the pattern names.
     *
     * This publishes a framework page mount. Wrap the element in its page's
     * adapter when it uses a routing library, or read framework params through
     * `useParams`. Defaults to the app root.
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
     * What the element is in the app, which decides where it is rendered.
     *
     * - `'page'` (the default) publishes a framework page mount. Wrap the element
     *   in its page adapter when it needs routing-library context.
     * - `'chrome'` mounts it on `app/root`'s `elements` input, where a sidebar, an
     *   error page or any other app-wide element goes. Chrome renders above every
     *   page and inside the app's own root React Router context, so it keeps one
     *   here too, and `mountPath` does not apply — chrome is not mounted at a
     *   route.
     *
     * Reach for `'chrome'` only for something that really is app-wide.
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
  };

const testAppPlugin = createTestAppPlugin([
  'app/layout',
  'app/routes',
  'app/nav',
]);

// Match through the same framework API that supplies page params and adapters.
function TestAppPage({
  node,
  children,
}: {
  node: AppNode;
  children: ReactNode;
}) {
  const history = useApi(coreApis.appHistory);
  const routes = useApi(routeResolutionApiRef);
  const { location } = useSyncExternalStore(
    history.subscribe,
    history.getSnapshot,
  );
  const { matches } = routes.resolvePath({ pathname: location.pathname, node });
  return matches.length > 0 ? <>{children}</> : null;
}

/**
 * @public
 * Renders the given element in a test app, for use in unit tests.
 *
 * Elements that do not suspend render immediately. If a descendant suspends,
 * the entire element renders nothing until it is ready; use asynchronous queries
 * such as `findByText` to await it. Supply an inner Suspense boundary to isolate
 * suspended content or provide a custom fallback. Rendering errors are not caught
 * by the Suspense boundary.
 *
 * Navigation is owned by a {@link @backstage/frontend-plugin-api#AppHistoryApi}
 * with in-memory history, the same seam as production. Access it through
 * `apis.get(coreApis.appHistory)` on the render result.
 *
 * The element renders under the app's root React Router v6 projection, as in
 * production. Wrap the element in its page's adapter when it needs routing-library
 * context. Page matching and navigation use the framework routing APIs.
 * App-wide elements such as sidebars can use `renderAs: 'chrome'` to render on
 * the app root's elements input.
 */
export function renderInTestApp<const TApiPairs extends any[] = any[]>(
  element: JSX.Element,
  options?: TestAppOptions<TApiPairs>,
): TestAppRenderResult {
  const asChrome = options?.renderAs === 'chrome';
  const mountPath = options?.mountPath ?? '/';
  const configData = options?.config ?? DEFAULT_MOCK_CONFIG;
  const defaultAppHistory = createTestNavigation({
    initialEntries: options?.initialRouteEntries,
    config: configData,
  });

  const extensions: Array<ExtensionDefinition> = [
    ...(options?.extensions ?? []),
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
      factory: ({ node }) => {
        const suspendedElement = <Suspense fallback={null}>{element}</Suspense>;
        if (asChrome) {
          return [coreExtensionData.reactElement(suspendedElement)];
        }
        const routePath =
          mountPath.replace(/\/\*$/, '').replace(/\/$/, '') || '/';
        const content = (
          <TestRouteResolver
            routeObjects={[
              {
                path: routePath,
                appNode: node,
                routeRefs: new Set(),
                caseSensitive: false,
                children: [
                  {
                    path: '*',
                    routeRefs: new Set(),
                    caseSensitive: false,
                  },
                ],
              },
            ]}
          >
            <TestAppPage node={node}>
              <ExtensionBoundary node={node}>
                {suspendedElement}
              </ExtensionBoundary>
            </TestAppPage>
          </TestRouteResolver>
        );

        return [coreExtensionData.reactElement(content)];
      },
    }),
  ];

  const { features, apiFactoryOverrides, externalBindings } =
    prepareTestAppFeatures({
      extensions,
      appHistory: defaultAppHistory,
      appPluginOverride: testAppPlugin,
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

  throwOnAppErrors(app.errors, {
    description: 'Failed to create the test app',
    isExpectedError: options?.isExpectedError,
  });

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

  return Object.assign(result, { apis: app.apis });
}
