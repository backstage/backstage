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

import { createContext, useContext, useMemo, type Context } from 'react';
import { unwrapReactRouterContext } from '@internal/frontend';
import {
  UNSAFE_DataRouterContext,
  UNSAFE_LocationContext,
  UNSAFE_NavigationContext,
  UNSAFE_RouteContext,
} from 'react-router-dom';

interface LocationContextValue {
  location: import('./AppLocation').AppLocation;
}

interface NavigationContextValue {
  basename: string;
  navigator: {
    createHref(to: {
      pathname?: string;
      search?: string;
      hash?: string;
    }): string;
    go(delta: number): void;
    push(to: unknown, state?: unknown, options?: unknown): void;
    replace(to: unknown, state?: unknown, options?: unknown): void;
  };
  future?: { v7_relativeSplatPath?: boolean };
}

interface RouteContextValue {
  outlet: unknown;
  matches: Array<{
    pathname: string;
    pathnameBase: string;
    params: Record<string, string | undefined>;
    route: { path?: string };
  }>;
  isDataRoute: boolean;
}

/*
 * React Router v6 beta does not export the `UNSAFE_*` contexts. The stand-ins
 * keep every context read unconditional and safe there; nothing provides
 * them, so they correctly report that no inspectable router is available.
 * Stable v6 supplies the real contexts, which lets old frontend fallbacks use
 * React Router while routerless new frontend chrome sees `undefined` instead
 * of throwing during render.
 */
export const LocationContext: Context<LocationContextValue> =
  (UNSAFE_LocationContext as unknown as Context<LocationContextValue>) ??
  createContext<LocationContextValue>(null!);
export const NavigationContext: Context<NavigationContextValue> =
  (UNSAFE_NavigationContext as unknown as Context<NavigationContextValue>) ??
  createContext<NavigationContextValue>(null!);
export const RouteContext: Context<RouteContextValue> =
  (UNSAFE_RouteContext as unknown as Context<RouteContextValue>) ??
  createContext<RouteContextValue>({
    outlet: null,
    matches: [],
    isDataRoute: false,
  });
export const DataRouterContext: Context<object> =
  (UNSAFE_DataRouterContext as unknown as Context<object>) ??
  createContext<object>(null!);

/** Reads a React Router context without requiring a router to be present. */
export function useRouterContext<T>(context: Context<T>): T | undefined {
  return unwrapReactRouterContext(useContext(context)) ?? undefined;
}

/**
 * The route bases a relative target resolves against, derived exactly the way
 * React Router's `useResolvedPath` derives them: the `pathnameBase` of every
 * match that contributes a path segment, or the leaf's full `pathname` when the
 * `v7_relativeSplatPath` future flag is on.
 *
 * Empty when there is no router, and equally inside one where nothing matched —
 * both mean relative targets resolve against the app root.
 */
export function useRouteBasePaths(): string[] {
  const matches = unwrapReactRouterContext(useContext(RouteContext)).matches;
  const relativeSplatPath =
    useRouterContext(NavigationContext)?.future?.v7_relativeSplatPath ?? false;

  return useMemo(() => {
    const contributing = matches.filter(
      (match, index) => index === 0 || !!match.route.path,
    );
    return contributing.map((match, index) =>
      relativeSplatPath && index === contributing.length - 1
        ? match.pathname
        : match.pathnameBase,
    );
  }, [matches, relativeSplatPath]);
}
