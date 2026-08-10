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

/**
 * A page-level router adapter that provides library routing context for a
 * page or sub-page, without owning browser history.
 *
 * An adapter's only job is to render `children` inside its library's context,
 * scoped to the mount it is given. The content is opaque: it is whatever the
 * page author supplied (a `PageBlueprint` `loader`, or a sub-page's own
 * content), and which sub-page of a page is showing has already been decided
 * by the framework's own route matching one level above.
 *
 * An adapter therefore never builds a route, and is never handed another
 * routing library's route tree to host — which is what used to make sub-pages
 * work only under React Router adapters.
 *
 * @public
 */
export type PageRouterComponent = ComponentType<{
  /** Concrete app-absolute URL prefix this page is mounted at. */
  basePath: string;
  /** Registered route pattern this page is mounted at. */
  routePattern: string;
  /** Opaque content to render inside the adapter's routing context. */
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
