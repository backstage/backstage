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

import type { ReactNode } from 'react';
import type { PageRouterSubPage } from '@backstage/frontend-plugin-api';
import { TanStackRouterHost } from './TanStackRouterHost';

/**
 * TanStack Router page adapter. Projects the framework's `AppHistoryApi`
 * into a hand-rolled TanStack history, scoped to the page's own mount, and
 * renders the page under a TanStack route tree. Never writes
 * `window.history` via push/replace.
 *
 * Register as a page override via `PageRouterBlueprint`, or as the
 * `pageRouterApiRef` default.
 *
 * Sub-pages (tabs) are supported: the framework hands them over as data, so
 * this adapter compiles them into real TanStack routes rather than being
 * handed a React Router tree it cannot host. A page's own opaque `children`
 * are rendered under a single root route — if that content uses React Router
 * internally, that is the page author's choice, made alongside their choice
 * of this adapter.
 *
 * Programmatic back/forward and cross-adapter navigation blockers are not
 * supported — there is a single, real browser history with no shared
 * blocker seam; `useBlocker` still works for navigation initiated through
 * this page's own TanStack `<Link>` / `router.navigate`.
 *
 * @public
 */
export function TanStackPageRouter(props: {
  /**
   * Concrete app-absolute URL prefix this page is mounted at. Not read by
   * this adapter: the scoped history derives the prefix from `routePattern`
   * and the live location, so it is never a step behind the location it is
   * scoping.
   */
  basePath: string;
  /** Registered route pattern this page is mounted at. */
  routePattern: string;
  /** The page's sub-pages, for this adapter to route between. */
  subPages?: readonly PageRouterSubPage[];
  /** Sub-page path the page root redirects to. */
  indexPath?: string;
  children?: ReactNode;
}) {
  return (
    <TanStackRouterHost
      routePattern={props.routePattern}
      subPages={props.subPages}
      indexPath={props.indexPath}
    >
      {props.children}
    </TanStackRouterHost>
  );
}
