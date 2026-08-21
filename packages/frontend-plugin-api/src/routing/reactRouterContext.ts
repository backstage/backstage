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

import { createContext, useContext, type Context } from 'react';
import {
  UNSAFE_DataRouterContext,
  UNSAFE_LocationContext,
  UNSAFE_NavigationContext,
  UNSAFE_RouteContext,
} from 'react-router-dom';

interface LocationContextValue {
  location: { pathname: string };
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
  return useContext(context) ?? undefined;
}
