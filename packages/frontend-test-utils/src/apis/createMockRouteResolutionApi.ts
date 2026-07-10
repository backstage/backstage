/*
 * Copyright 2026 The Backstage Authors
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
  AnyRouteRefParams,
  ExternalRouteRef,
  RouteFunc,
  RouteRef,
  RouteResolutionApi,
  SubRouteRef,
} from '@backstage/frontend-plugin-api';
import {
  OpaqueExternalRouteRef,
  OpaqueRouteRef,
  OpaqueSubRouteRef,
} from '@internal/frontend';

type AnyRouteRef =
  | RouteRef<AnyRouteRefParams>
  | SubRouteRef<AnyRouteRefParams>
  | ExternalRouteRef<AnyRouteRefParams>;

/**
 * Options for {@link createMockRouteResolutionApi}.
 *
 * @public
 */
export interface MockRouteResolutionApiOptions {
  /**
   * Map of route refs to absolute path templates. Path params use the
   * `:param` form (e.g. `'/catalog/:namespace/:kind/:name'`). When a mapped
   * route is resolved, params are substituted into the template.
   *
   * String values without `:` segments are returned as-is for parameter-less
   * refs.
   */
  routes?:
    | ReadonlyMap<AnyRouteRef, string>
    | ReadonlyArray<[AnyRouteRef, string]>;
  /**
   * Optional full `resolve` implementation. When set, it takes precedence
   * over {@link MockRouteResolutionApiOptions.routes}.
   */
  resolve?: RouteResolutionApi['resolve'];
}

/**
 * A mock {@link @backstage/frontend-plugin-api#RouteResolutionApi} for unit
 * tests of `RouteLink`, `useNavigateRouteRef`, and components that resolve
 * route refs under the new frontend system.
 *
 * @public
 */
export interface MockRouteResolutionApi extends RouteResolutionApi {
  /**
   * The underlying jest mock for {@link RouteResolutionApi.resolve}, useful
   * for call assertions.
   */
  resolve: jest.MockedFunction<RouteResolutionApi['resolve']>;
}

function substitutePath(
  template: string,
  params?: Record<string, string>,
): string {
  if (!params) {
    return template;
  }
  return template.replace(/:([A-Za-z0-9_]+)/g, (_, name: string) => {
    const value = params[name];
    if (value === undefined) {
      throw new Error(
        `Missing route param "${name}" for template "${template}"`,
      );
    }
    return encodeURIComponent(value);
  });
}

function getRouteParamCount(ref: AnyRouteRef): number {
  if (ref.$$type === '@backstage/RouteRef') {
    return OpaqueRouteRef.toInternal(ref).getParams().length;
  }
  if (ref.$$type === '@backstage/SubRouteRef') {
    return OpaqueSubRouteRef.toInternal(ref).getParams().length;
  }
  if (ref.$$type === '@backstage/ExternalRouteRef') {
    return OpaqueExternalRouteRef.toInternal(ref).getParams().length;
  }
  // Legacy route refs expose params as an array property.
  if ('params' in ref && Array.isArray((ref as { params?: unknown }).params)) {
    return (ref as { params: string[] }).params.length;
  }
  return 0;
}

/**
 * Creates a mock {@link @backstage/frontend-plugin-api#RouteResolutionApi}.
 *
 * Prefer {@link MockRouteResolutionApiOptions.routes} for declarative path
 * maps. Pass {@link MockRouteResolutionApiOptions.resolve} when you need a
 * custom implementation (including always returning `undefined`).
 *
 * Also available as {@link mockApis.routeResolution}. Pair with
 * {@link createMockNavigationController} and optionally
 * {@link createMockContract} under `RoutingContractContext` for NFS
 * `RouteLink` / `useNavigateRouteRef` tests.
 *
 * @public
 * @example
 * ```tsx
 * const navigate = jest.fn();
 * const catalogRouteRef = createRouteRef({ params: ['name'] });
 *
 * <TestApiProvider
 *   apis={[
 *     [
 *       routeResolutionApiRef,
 *       createMockRouteResolutionApi({
 *         routes: [[catalogRouteRef, '/catalog/:name']],
 *       }),
 *     ],
 *     [
 *       navigationControllerApiRef,
 *       createMockNavigationController({ navigate }),
 *     ],
 *   ]}
 * >
 *   <RoutingContractContext.Provider
 *     value={createMockContract({ basePath: '/create' })}
 *   >
 *     {children}
 *   </RoutingContractContext.Provider>
 * </TestApiProvider>
 * ```
 */
export function createMockRouteResolutionApi(
  options: MockRouteResolutionApiOptions = {},
): MockRouteResolutionApi {
  let routeMap: Map<AnyRouteRef, string> | undefined;
  if (options.routes) {
    routeMap = new Map(options.routes);
  }

  const resolveImpl: RouteResolutionApi['resolve'] =
    options.resolve ??
    ((anyRouteRef, _resolveOptions) => {
      const template = routeMap?.get(anyRouteRef as AnyRouteRef);
      if (template === undefined) {
        return undefined;
      }
      const hasParams = getRouteParamCount(anyRouteRef as AnyRouteRef) > 0;
      const routeFunc = (
        hasParams
          ? (params: Record<string, string>) => substitutePath(template, params)
          : () => template
      ) as RouteFunc<AnyRouteRefParams>;
      return routeFunc;
    });

  const resolve = jest.fn(resolveImpl) as jest.MockedFunction<
    RouteResolutionApi['resolve']
  >;

  return { resolve };
}
