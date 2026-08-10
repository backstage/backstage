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

import { ReactNode } from 'react';
import { useApiHolder } from '../apis/system';
import {
  pageRouterApiRef,
  type PageRouterComponent,
} from '../apis/definitions/PageRouterApi';
import type { PageMount } from '@internal/frontend';

/**
 * Props for {@link PageRouterWrapper}.
 */
export interface PageRouterWrapperProps {
  /** The mount this content is rendered at, or `undefined` when unmounted. */
  mount: PageMount | undefined;
  /** Adapter from the page's (or sub-page's) `router` extension input. */
  RouterOverride?: PageRouterComponent;
  /** The content to render inside the adapter's context. */
  children?: ReactNode;
}

/**
 * Renders a page's or sub-page's content region with its own router input
 * override, or the app-plugin default from {@link pageRouterApiRef}.
 *
 * The content is opaque to the adapter: which sub-page of a page is showing is
 * decided by top-level route matching, so no adapter ever has to build routes
 * of its own and no routing library has to host another library's routes. The
 * page chrome around this (header, tabs, breadcrumbs) is framework-owned and
 * deliberately sits outside the adapter: it resolves its links from the page
 * mount and the route resolution API, so it must not require any particular
 * routing library to be in context.
 *
 * When there is no mount (e.g. isolated `renderInTestApp` without
 * `AppRouteSwitch`) there is nothing to scope an adapter to, so the content
 * renders without one.
 */
export function PageRouterWrapper(props: PageRouterWrapperProps) {
  const { mount, RouterOverride, children } = props;
  const apiHolder = useApiHolder();

  if (!mount) {
    return <>{children}</>;
  }

  const Router = RouterOverride ?? apiHolder.get(pageRouterApiRef);

  if (!Router) {
    return <>{children}</>;
  }

  return (
    <Router basePath={mount.basePath} routePattern={mount.routePattern}>
      {children}
    </Router>
  );
}
