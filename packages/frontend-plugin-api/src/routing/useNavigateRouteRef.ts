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

import { useCallback } from 'react';
import { AnyRouteRefParams } from './types';
import { RouteRef } from './RouteRef';
import { SubRouteRef } from './SubRouteRef';
import { ExternalRouteRef } from './ExternalRouteRef';
import { useRouteRef } from './useRouteRef';
import { useAppNavigate } from './useFrameworkNavigation';
import type { FrameworkNavigateOptions } from './FrameworkLocation';

/**
 * A function that resolves a {@link RouteRef} to a path and navigates via
 * {@link useAppNavigate}.
 *
 * @public
 */
export type NavigateRouteRefFunc<TParams extends AnyRouteRefParams> = (
  ...[paramsOrOptions, options]: TParams extends undefined
    ? readonly [options?: FrameworkNavigateOptions]
    : readonly [params: TParams, options?: FrameworkNavigateOptions]
) => void;

/**
 * Combines {@link useRouteRef} with {@link useAppNavigate} for cross-plugin
 * programmatic navigation (framework controller when present, React Router
 * otherwise).
 *
 * Prefer this (or {@link RouteLink}) over React Router's `useNavigate` with an
 * absolute path resolved from a route ref, so navigation is not blocked by a
 * scoped routing contract under the new frontend system.
 *
 * Returns `undefined` when the route cannot be resolved.
 *
 * @public
 */
export function useNavigateRouteRef<TParams extends AnyRouteRefParams>(
  routeRef:
    | RouteRef<TParams>
    | SubRouteRef<TParams>
    | ExternalRouteRef<TParams>,
): NavigateRouteRefFunc<TParams> | undefined {
  const routeFunc = useRouteRef(routeRef);
  const navigate = useAppNavigate();

  const navigateRouteRef = useCallback(
    (...args: unknown[]) => {
      if (!routeFunc) {
        return;
      }
      if (routeFunc.length > 0) {
        const params = args[0] as TParams;
        const options = args[1] as FrameworkNavigateOptions | undefined;
        navigate(
          (routeFunc as unknown as (p: TParams) => string)(params),
          options,
        );
      } else {
        const options = args[0] as FrameworkNavigateOptions | undefined;
        navigate((routeFunc as unknown as () => string)(), options);
      }
    },
    [routeFunc, navigate],
  );

  if (!routeFunc) {
    return undefined;
  }

  return navigateRouteRef as unknown as NavigateRouteRefFunc<TParams>;
}
