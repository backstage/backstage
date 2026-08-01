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

import { ComponentType, ReactNode } from 'react';
import { createApiRef } from '../system';
import type { IconElement } from '../../icons/types';

/**
 * One sub-page of a page, as handed to a {@link PageRouterComponent}.
 *
 * This is **not** a route-description format. The framework does not model
 * paths, params, matching, or nesting here: `path` is the literal string the
 * plugin author wrote in `SubPageBlueprint` (for example `'overview'`), and
 * `element` is already rendered React. Nothing in this type needs compiling,
 * and nothing about it is specific to a routing library.
 *
 * @public
 */
export interface PageRouterSubPage {
  /**
   * The sub-page path exactly as the plugin author wrote it — an author-owned
   * string, not a framework path expression.
   *
   * The adapter applies its own library's prefix convention to it (React
   * Router appends `/*`, other libraries do whatever they do). The framework
   * deliberately performs no path translation of its own, so no routing
   * library's syntax leaks into the framework.
   */
  path: string;
  /** The sub-page's tab label, defaulting to {@link PageRouterSubPage.path}. */
  label: string;
  /** The sub-page's tab icon, if the author supplied one. */
  icon?: IconElement;
  /**
   * The fully rendered sub-page content, ready to be placed in a route.
   *
   * Framework concerns (breadcrumb registration, the sub-page's own mount
   * context, its extension boundary) are already applied, so an adapter never
   * has to learn about them — it only decides *when* this element renders.
   */
  element: ReactNode;
}

/**
 * A page-level router adapter that provides library routing context for a
 * page, without owning browser history.
 *
 * An adapter renders one of two things, and the framework only ever populates
 * one of them:
 *
 * - `subPages` — the page's sub-pages, handed over as **data** so the adapter
 *   builds the route tree with its own library. The framework used to compose
 *   these into a native React Router `<Routes>` tree and pass it as opaque
 *   `children`, which meant only React Router adapters could host a tabbed
 *   page: the children *were* React Router elements. Passing the list instead
 *   removes that hidden coupling — every adapter gets the same information the
 *   framework has, and applies its own path and matching conventions to it.
 *   This is not a route-description layer: see {@link PageRouterSubPage}.
 * - `children` — opaque content the page author supplied directly (a
 *   `PageBlueprint` `loader`, or a sub-page's own content). Whatever routing
 *   library it uses is the author's choice, made alongside their choice of
 *   adapter, so the adapter simply renders it inside its context.
 *
 * @public
 */
export type PageRouterComponent = ComponentType<{
  /** Concrete app-absolute URL prefix this page is mounted at. */
  basePath: string;
  /** Registered route pattern this page is mounted at. */
  routePattern: string;
  /**
   * The page's sub-pages, for the adapter to route between. Empty or absent
   * for pages that have no sub-pages.
   */
  subPages?: readonly PageRouterSubPage[];
  /**
   * The {@link PageRouterSubPage.path} to show at the page root, so that
   * visiting the page itself lands on its first tab. Adapters should redirect
   * rather than render in place, keeping the URL and the active tab in sync.
   */
  indexPath?: string;
  /** Opaque page content, when the page is not composed from sub-pages. */
  children?: ReactNode;
}>;

/**
 * The default page router adapter, used when a page does not override the
 * optional `router` extension input.
 *
 * Implementations live in adapter packages (e.g. React Router v6) and are
 * registered by the app plugin. Core page blueprints depend only on this API,
 * not on any specific router library.
 *
 * The API *is* the component, rather than a factory that returns one — there
 * is exactly one app-wide default, and it is a value the adapter package
 * already exports.
 *
 * @public
 */
export const pageRouterApiRef = createApiRef<PageRouterComponent>().with({
  id: 'core.page-router',
  pluginId: 'app',
});
