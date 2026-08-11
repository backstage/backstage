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

import { createContext, useContext } from 'react';

/**
 * The routing capability used by BUI components.
 *
 * @remarks
 * The three operations form one capability because navigation, href
 * resolution, and active-state detection must all observe the same routing
 * authority. The functions prefixed with `use` are React hooks and may read
 * routing context owned by the host application.
 * `useHref` produces browser-ready hrefs, while `useLocation` returns the
 * router's logical location with any deployment basename removed.
 *
 * @public
 */
export type BUIRouter = {
  navigate: (href: string, options?: { replace?: boolean }) => void;
  /** Returns external targets unchanged. */
  useHref: (href: string) => string;
  /** Returns the logical location, excluding any deployment basename. */
  useLocation: () => { pathname: string; search: string; hash: string };
};

/**
 * Converts a browser-ready href from a {@link BUIRouter} back to the router's
 * logical pathname by removing the basename represented by its resolved root.
 *
 * @internal
 */
export function toBUIRouterLogicalPathname(
  resolvedHref: string,
  resolvedRootHref: string,
): string | undefined {
  try {
    const origin = 'http://bui.local';
    const targetUrl = new URL(resolvedHref, origin);
    const rootUrl = new URL(resolvedRootHref, origin);
    if (targetUrl.origin !== origin || rootUrl.origin !== origin) {
      return undefined;
    }

    const basename =
      rootUrl.pathname === '/' ? '' : rootUrl.pathname.replace(/\/$/, '');

    if (!basename) {
      return targetUrl.pathname;
    }
    if (targetUrl.pathname === basename) {
      return '/';
    }
    if (targetUrl.pathname.startsWith(`${basename}/`)) {
      return targetUrl.pathname.slice(basename.length);
    }
    return targetUrl.pathname;
  } catch {
    return undefined;
  }
}

/** @internal */
export const BUIRouterContext = createContext<BUIRouter | undefined>(undefined);

/** @internal */
export const BUIRouterHandlesRawHrefContext = createContext(false);

/** @internal */
export function useOptionalBUIRouter(): BUIRouter | undefined {
  return useContext(BUIRouterContext);
}

/**
 * Whether the selected router must receive hrefs exactly as authored.
 *
 * The explicit host capability resolves against a page mount that an ambient
 * React Router context may not represent. The ambient fallback is React
 * Router itself, so existing OFS components keep resolving their definition
 * props before handing them to React Aria.
 *
 * @internal
 */
export function useBUIRouterHandlesRawHref(): boolean {
  return useContext(BUIRouterHandlesRawHrefContext);
}
