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

import { createExtensionBlueprint, createExtensionDataRef } from '../wiring';
import type { PageRouterComponent } from '../apis/definitions/PageRouterApi';

const componentDataRef = createExtensionDataRef<PageRouterComponent>().with({
  id: 'core.page.router',
});

/**
 * Creates an extension that replaces the router adapter for a page (or
 * subpage). By default attaches to a page's optional `router` input; override
 * `attachTo` to target a sub-page (for example
 * `id: 'sub-page:my-plugin/overview', input: 'router'`) to override the
 * app-plugin default (React Router v6).
 *
 * @public
 * @example
 * ```tsx
 * const myV7Router = PageRouterBlueprint.make({
 *   attachTo: { id: 'page:my-plugin', input: 'router' },
 *   params: {
 *     component: MyReactRouterV7Adapter,
 *   },
 * });
 *
 * const mySubpageRouter = PageRouterBlueprint.make({
 *   attachTo: { id: 'sub-page:my-plugin/overview', input: 'router' },
 *   params: {
 *     component: MyReactRouterV7Adapter,
 *   },
 * });
 * ```
 */
export const PageRouterBlueprint = createExtensionBlueprint({
  kind: 'page-router',
  attachTo: { relative: { kind: 'page' }, input: 'router' },
  output: [componentDataRef],
  dataRefs: {
    component: componentDataRef,
  },
  *factory(params: { component: PageRouterComponent }) {
    yield componentDataRef(params.component);
  },
});
