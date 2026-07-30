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
import { TanStackRouterHost } from './TanStackRouterHost';

/**
 * TanStack Router page adapter. Projects the framework's `AppHistoryApi`
 * into a hand-rolled TanStack history, scoped to the page's `basePath`, and
 * renders `children` under a single root route. Never writes
 * `window.history` via push/replace.
 *
 * Register as a page override via `PageRouterBlueprint`, or as the
 * `pageRouterApiRef` default.
 *
 * Opaque React Router content is not supported — there is no TanStack
 * opaque-children bridge, since this adapter fully owns rendering via its
 * own route tree (currently a single root route). Report
 * `supportsOpaqueChildren: false` via `getCapabilities()` when registering
 * this as the default page router so `PageBlueprint` fails fast instead of
 * silently dropping content.
 *
 * Programmatic back/forward and cross-adapter navigation blockers are not
 * supported — there is a single, real browser history with no shared
 * blocker seam; `useBlocker` still works for navigation initiated through
 * this page's own TanStack `<Link>` / `router.navigate`.
 *
 * @public
 */
export function TanStackPageRouter(props: {
  /** Concrete app-absolute URL prefix this page is mounted at. */
  basePath: string;
  /** Registered route pattern this page is mounted at. */
  routePattern: string;
  /** App deploy basename — unused; `AppHistoryApi.createHref` already applies it. */
  appBasename?: string;
  children: ReactNode;
}) {
  return (
    <TanStackRouterHost basePath={props.basePath}>
      {props.children}
    </TanStackRouterHost>
  );
}
