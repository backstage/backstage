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
 * An adapter's only job is to render `children` inside its library's context.
 * The content is opaque: it is whatever the page author supplied (a
 * `PageBlueprint` `loader`, or a sub-page's own content), and which sub-page
 * of a page is showing has already been decided by the framework's own route
 * matching one level above. First-party adapters read mount details from a
 * private framework context, keeping that representation out of this API.
 *
 * The framework never asks an adapter to reconstruct the page or sub-page
 * route tree, and never hands it another routing library's routes. An adapter
 * may still host a plugin-owned route tree inside the page content, for
 * example through `createTanStackPageRouter`.
 *
 * @public
 */
export type PageRouterComponent = ComponentType<{
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
