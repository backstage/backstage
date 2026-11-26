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
import type { mockApis } from './mockApis';
import {
  OpaqueExternalRouteRef,
  OpaqueRouteRef,
  OpaqueSubRouteRef,
} from '@internal/frontend';

type MockRouteResolutionRouteRef =
  | RouteRef<AnyRouteRefParams>
  | SubRouteRef<AnyRouteRefParams>
  | ExternalRouteRef<AnyRouteRefParams>;

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

function getRouteParamCount(ref: MockRouteResolutionRouteRef): number {
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

/** Creates the implementation used by mockApis.routeResolution. @internal */
export function createMockRouteResolutionApi(
  options: NonNullable<Parameters<typeof mockApis.routeResolution>[0]> = {},
) {
  let routeMap: Map<MockRouteResolutionRouteRef, string> | undefined;
  if (options.routes) {
    routeMap = new Map(options.routes);
  }

  const resolveImpl: RouteResolutionApi['resolve'] =
    options.resolve ??
    ((anyRouteRef, _resolveOptions) => {
      const template = routeMap?.get(
        anyRouteRef as MockRouteResolutionRouteRef,
      );
      if (template === undefined) {
        return undefined;
      }
      const hasParams =
        getRouteParamCount(anyRouteRef as MockRouteResolutionRouteRef) > 0;
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

  const pathResolution = options.resolvePath;
  const resolvePath = jest.fn(
    typeof pathResolution === 'function'
      ? pathResolution
      : () => ({
          matches: (pathResolution?.matches ?? []).map(match => ({
            ...match,
            routePattern: match.routePattern ?? match.basePath,
            params: match.params ?? {},
            contributesPath: match.contributesPath ?? true,
          })),
        }),
  );
  return {
    resolve,
    resolvePath,
  };
}
