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
import { getOrCreateGlobalSingleton } from '@backstage/version-bridge';

/**
 * Where a page (or subpage) is mounted in the app.
 */
export interface PageMount {
  /**
   * Concrete app-absolute URL prefix this page is mounted at (e.g.
   * `/catalog` or `/catalog/default/component/foo`).
   */
  basePath: string;
  /**
   * Registered route pattern this page is mounted at (e.g. `/catalog` or
   * `/catalog/:namespace/:kind/:name`). Equals `basePath` for static mounts.
   */
  routePattern: string;
}

/**
 * A global singleton React context carrying the current page's mount point,
 * shared between packages via `@backstage/version-bridge`.
 *
 * First-party chrome and adapters read this via `@internal/frontend` rather
 * than a public export on `@backstage/frontend-plugin-api`.
 */
export const PageMountContext = getOrCreateGlobalSingleton(
  'page-mount-context',
  () => createContext<PageMount | undefined>(undefined),
);

/**
 * Returns the current page's mount point, or `undefined` outside of a page
 * (e.g. an isolated `renderInTestApp` without `AppRouteSwitch`).
 */
export function usePageMount(): PageMount | undefined {
  return useContext(PageMountContext);
}
