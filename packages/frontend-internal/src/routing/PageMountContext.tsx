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

import { useContext, useMemo, type ReactNode } from 'react';
import {
  createVersionedContext,
  createVersionedValueMap,
} from '@backstage/version-bridge';

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
 * Versioned for the same reason `api-context`, `app-context` and
 * `routing-context` are. `@internal/frontend` is an inline package, so its
 * source is compiled into every consumer: an adopter can end up running
 * `@backstage/core-components` and `@backstage/frontend-app-api` built from
 * different vintages of this module, sharing one context object through the
 * global singleton while disagreeing about what the value looks like. A raw
 * payload gives that mismatch no way to negotiate — the reader simply sees
 * fields that are not there. Going through a version map means a future shape
 * can be added as version 2 while version 1 keeps answering older readers.
 *
 * Deliberately not exported: provider and consumer both go through the helpers
 * below, so no call site has to know a version number, and adding one later
 * does not touch them.
 */
const PageMountContext = createVersionedContext<{ 1: PageMount }>(
  'page-mount-context',
);

/**
 * Provides the page mount that {@link usePageMount} reads.
 *
 * The value is memoized on the mount's fields rather than on the object
 * identity, so callers that build a fresh `PageMount` on every render (page
 * matching does) do not force every consumer of this context to re-render.
 */
export function PageMountProvider(props: {
  mount: PageMount;
  children: ReactNode;
}) {
  const { basePath, routePattern } = props.mount;

  const versionedValue = useMemo(
    () => createVersionedValueMap({ 1: { basePath, routePattern } }),
    [basePath, routePattern],
  );

  return (
    <PageMountContext.Provider value={versionedValue}>
      {props.children}
    </PageMountContext.Provider>
  );
}

/**
 * Returns the current page's mount point, or `undefined` outside of a page
 * (e.g. an isolated `renderInTestApp` without `AppRouteSwitch`), and equally
 * when the provider in context is too old to know about this version.
 */
export function usePageMount(): PageMount | undefined {
  return useContext(PageMountContext)?.atVersion(1);
}
