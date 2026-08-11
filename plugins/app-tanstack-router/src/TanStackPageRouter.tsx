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
import type { PageRouterComponent } from '@backstage/frontend-plugin-api';
import { usePageMount } from '@internal/frontend';
import type { RouterHistory } from '@tanstack/history';
import type { AnyRouter } from '@tanstack/react-router';
import {
  TanStackRouterHost,
  createDefaultTanStackRouter,
} from './TanStackRouterHost';

/** Options for {@link createTanStackPageRouter}. @public */
export interface CreateTanStackPageRouterOptions {
  /**
   * Creates the TanStack router using history projected from the framework.
   * The route tree may render `TanStackPageContent` wherever the opaque
   * Backstage page element belongs.
   */
  createRouter(options: { history: RouterHistory }): AnyRouter;
}

/**
 * Creates a page-router component backed by a plugin-owned TanStack route
 * tree. The resulting component is suitable for `PageRouterBlueprint`.
 *
 * @public
 */
export function createTanStackPageRouter(
  options: CreateTanStackPageRouterOptions,
): PageRouterComponent {
  return function TanStackPageRouterAdapter(props: { children?: ReactNode }) {
    const routePattern = usePageMount()?.routePattern;

    if (!routePattern) {
      return <>{props.children}</>;
    }

    return (
      <TanStackRouterHost
        routePattern={routePattern}
        createRouter={options.createRouter}
      >
        {props.children}
      </TanStackRouterHost>
    );
  };
}

const DefaultTanStackPageRouter = createTanStackPageRouter({
  createRouter: createDefaultTanStackRouter,
});

/**
 * TanStack Router page adapter. Projects the framework's `AppHistoryApi`
 * into a hand-rolled TanStack history, scoped to the page's own mount, and
 * renders the page under a TanStack route tree. Never writes
 * `window.history` via push/replace.
 *
 * Register as a page override via `PageRouterBlueprint`, or as the
 * `pageRouterApiRef` default. Attach it to a sub-page the same way to give
 * that sub-page's content a TanStack context of its own, scoped to the
 * sub-page rather than to the page above it.
 *
 * The content is opaque: whichever sub-page of a page is showing has already
 * been decided by the framework's own route matching, so this adapter never
 * builds a route for one — and is never handed another library's route tree
 * to host. If the content uses another routing library internally, that is
 * the page author's choice, made alongside their choice of this adapter.
 *
 * Programmatic back and forward traverse the app-owned browser history.
 * Cross-adapter navigation blockers are not supported because there is no
 * shared blocker seam; `useBlocker` still works for navigation initiated
 * through this page's own TanStack `<Link>` / `router.navigate`.
 *
 * @public
 */
export function TanStackPageRouter(props: { children?: ReactNode }) {
  return (
    <DefaultTanStackPageRouter>{props.children}</DefaultTanStackPageRouter>
  );
}

export { TanStackPageContent } from './TanStackRouterHost';
