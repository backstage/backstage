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
const PageMountContext = createVersionedContext<{
  1: PageMount;
  2: { chain: readonly PageMount[] };
}>('page-mount-context');

/** Shared so that "not on a page" is a stable value for effect and memo deps. */
const EMPTY_CHAIN: readonly PageMount[] = Object.freeze([]);

/**
 * Provides the page mount that {@link usePageMount} reads.
 *
 * The value is memoized on the mount's fields rather than on the object
 * identity, so callers that build a fresh `PageMount` on every render (page
 * matching does) do not force every consumer of this context to re-render.
 *
 * Nesting one provider inside another is what makes a sub-page a sub-page, so
 * the chain of mounts is assembled here rather than at either call site: the
 * provider is the only place that sees both the mount being published and the
 * one it is published inside.
 */
export function PageMountProvider(props: {
  mount: PageMount;
  children: ReactNode;
}) {
  const { basePath, routePattern } = props.mount;
  // Memoized by the provider above, so its identity only changes when that
  // mount does and it is usable as a dependency directly.
  const parentChain = useContext(PageMountContext)?.atVersion(2)?.chain;

  const versionedValue = useMemo(() => {
    const mount = { basePath, routePattern };
    return createVersionedValueMap({
      1: mount,
      2: { chain: [...(parentChain ?? EMPTY_CHAIN), mount] },
    });
  }, [basePath, routePattern, parentChain]);

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

/**
 * Returns the mounts this content is rendered inside, outermost first and
 * ending with the mount it is rendered at — a page, then the sub-page of that
 * page the location selected.
 *
 * This is the framework's own record of how deeply a piece of content is
 * nested, which is what a router adapter needs to know to publish a match
 * stack of the right depth. Reading the nesting out of a routing library's
 * context instead only answers while every mount in the chain happens to use
 * that same library.
 *
 * Empty outside of a page, and a single mount when the provider in context is
 * too old to know about the chain.
 */
export function usePageMountChain(): readonly PageMount[] {
  const versioned = useContext(PageMountContext);
  const chain = versioned?.atVersion(2)?.chain;
  const mount = versioned?.atVersion(1);
  return useMemo(() => {
    if (chain) {
      return chain;
    }
    return mount ? [mount] : EMPTY_CHAIN;
  }, [chain, mount]);
}
