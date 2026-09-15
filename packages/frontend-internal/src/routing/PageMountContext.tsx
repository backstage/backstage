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
import type { AppNode } from '@backstage/frontend-plugin-api';
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
   * Authored accumulated route pattern (e.g. `/catalog` or
   * `/catalog/:namespace/:kind/:name`), retaining optional segments and splats.
   */
  routePattern: string;
  /** Parameters bound by the matched extension ancestry, when available. */
  params?: Record<string, string>;
  /** Whether the authored route has a path, including omitted optional segments. */
  contributesPath?: boolean;
  /** Resolves this node's mount in the selected branch for another pathname. */
  resolve?: (pathname: string) => PageMount | undefined;
}

/** A matched route-bearing extension from the app route tree. */
export interface AppRouteMatch extends PageMount {
  node: AppNode;
}

/**
 * Shared across independently compiled copies of @internal/frontend. Root
 * chrome has an empty chain; isolated mounts have no selected app branch.
 */
const PageMountContext = createVersionedContext<{
  1: { chain: readonly PageMount[]; matches?: readonly AppRouteMatch[] };
}>('page-mount-context');

/** Shared so that "not on a page" is a stable value for effect and memo deps. */
const EMPTY_CHAIN: readonly PageMount[] = Object.freeze([]);

/** Provides an explicit mount for isolated content or nested adapter tests. */
export function PageMountProvider(props: {
  mount: PageMount;
  /** Start an explicitly supplied isolated mount, without an app route tree. */
  isolated?: boolean;
  children: ReactNode;
}) {
  const { basePath, routePattern, params, contributesPath, resolve } =
    props.mount;
  // Memoized by the provider above, so its identity only changes when that
  // mount does and it is usable as a dependency directly.
  const context = useContext(PageMountContext)?.atVersion(1);
  const parentChain = props.isolated
    ? EMPTY_CHAIN
    : context?.chain ?? EMPTY_CHAIN;
  const matches = props.isolated ? undefined : context?.matches;

  const versionedValue = useMemo(() => {
    const mount = { basePath, routePattern, params, contributesPath, resolve };
    return createVersionedValueMap({
      1: { chain: [...parentChain, mount], matches },
    });
  }, [
    basePath,
    routePattern,
    params,
    contributesPath,
    resolve,
    parentChain,
    matches,
  ]);

  return (
    <PageMountContext.Provider value={versionedValue}>
      {props.children}
    </PageMountContext.Provider>
  );
}

/**
 * Returns the current page's mount point, or `undefined` outside of a page
 * (e.g. an isolated `renderInTestApp` without `AppRouteSwitch`).
 */
export function usePageMount(): PageMount | undefined {
  const chain = usePageMountChain();
  return chain[chain.length - 1];
}

/**
 * Resolves the current route node against the authoritative app tree before
 * React has committed a new location. Isolated mounts have no resolver;
 * an undefined result from a resolver means the node is inactive.
 */
export function usePageMountResolver(): PageMount['resolve'] {
  return usePageMount()?.resolve;
}

/** Returns the extension's matched route ancestry, outermost first. */
export function usePageMountChain(): readonly PageMount[] {
  return useContext(PageMountContext)?.atVersion(1)?.chain ?? EMPTY_CHAIN;
}

/**
 * The mounts that contribute a path for relative navigation. An empty-path
 * extension retains its node and params in the full chain, but does not add
 * another parent step. An omitted optional segment still contributes a route.
 */
export function usePageMountBasePaths(): string[] {
  const chain = usePageMountChain();
  return useMemo(
    () =>
      chain
        .filter(
          (mount, index) => index === 0 || mount.contributesPath !== false,
        )
        .map(mount => mount.basePath),
    [chain],
  );
}

/** Publishes the selected extension branch without choosing what to render. */
export function AppRouteMatchesProvider(props: {
  matches: readonly AppRouteMatch[];
  children: ReactNode;
}) {
  const value = useMemo(
    () =>
      createVersionedValueMap({
        1: { chain: EMPTY_CHAIN, matches: props.matches },
      }),
    [props.matches],
  );
  return (
    <PageMountContext.Provider value={value}>
      {props.children}
    </PageMountContext.Provider>
  );
}

/** Returns the selected branch, or undefined outside app route matching. */
export function useAppRouteMatches(): readonly AppRouteMatch[] | undefined {
  return useContext(PageMountContext)?.atVersion(1)?.matches;
}

/** Scopes routing to this extension's actual ancestors in the app tree. */
export function AppNodeRouteProvider(props: {
  node: AppNode;
  children: ReactNode;
}) {
  const matches = useAppRouteMatches();
  const value = useMemo(() => {
    if (!matches) {
      return undefined;
    }
    const ancestors = new Set<AppNode>();
    for (
      let node: AppNode | undefined = props.node;
      node;
      node = node.edges.attachedTo?.node
    ) {
      ancestors.add(node);
    }
    const chain = matches.filter(match => ancestors.has(match.node));
    return createVersionedValueMap({
      1: { chain, matches },
    });
  }, [matches, props.node]);
  if (!value) {
    return <>{props.children}</>;
  }
  return (
    <PageMountContext.Provider value={value}>
      {props.children}
    </PageMountContext.Provider>
  );
}
