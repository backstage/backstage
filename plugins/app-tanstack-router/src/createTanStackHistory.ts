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

import type {
  AppHistoryApi,
  AppLocation,
} from '@backstage/frontend-plugin-api';
import {
  matchPath,
  readAppHistoryMetadata,
  type AppHistoryMetadata,
  type PageMount,
} from '@internal/frontend';
import {
  createHistory,
  parseHref,
  type HistoryLocation,
  type NavigationBlocker,
  type RouterHistory,
} from '@tanstack/history';

type HistoryNotifyAction = Parameters<RouterHistory['notify']>[0];

/**
 * Options for {@link createTanStackHistory}.
 *
 * @internal
 */
export interface CreateTanStackHistoryOptions {
  /**
   * Registered page route pattern this history is scoped to (e.g. `/catalog`
   * or `/catalog/:namespace/:kind/:name`).
   */
  routePattern: string;
  /** Resolves this extension's mount from the app's selected route branch. */
  resolveMount?: (pathname: string) => PageMount | undefined;
}

/** An app-absolute pathname split at the page's mount point. */
interface PageScope {
  /** The page's concrete mount prefix within that pathname. */
  base: string;
  /** The remainder, as the page's own scoped pathname. */
  scoped: string;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function toTraversalAction(delta: number): HistoryNotifyAction {
  if (delta === -1) {
    return { type: 'BACK' };
  }
  if (delta === 1) {
    return { type: 'FORWARD' };
  }
  return { type: 'GO', index: delta };
}

/**
 * Creates a `RouterHistory` bound to the framework's {@link AppHistoryApi}.
 *
 * Never writes `window.history`. Locations are scoped to the page using the
 * framework's selected mount for each emitted pathname. Isolated
 * contexts fall back to matching the route pattern. Resolution happens during
 * the history notification, before React rerenders, so changing a concrete
 * prefix cannot leave an old base attached to a new location.
 *
 * TanStack's entry fields project the framework's optional private metadata.
 * Without it, the adapter exposes a single synthetic slot (index 0, length 1,
 * cannot go back). Keys identify observed locations, not recoverable entries,
 * so entry-based restoration is unavailable. Push and replace require the host
 * to update its location snapshot synchronously. Traversals notify when the
 * host emits; without metadata their delta is unknown and reported as GO 0.
 *
 * `history.block` is a **local** blocker seam: it only intercepts push /
 * replace initiated through this history (e.g. a TanStack `<Link>` or
 * `router.navigate`). It is not shared with framework/chrome navigation —
 * `AppHistoryApi` has no shared blocker registry.
 *
 * `go` / `back` / `forward` delegate to `AppHistoryApi`; this adapter never
 * reaches around the framework to write or traverse `window.history` itself.
 *
 * @internal
 */
export function createTanStackHistory(
  appHistory: AppHistoryApi,
  options: CreateTanStackHistoryOptions,
): RouterHistory {
  /**
   * Splits an app-absolute pathname into this page's mount prefix and the
   * page-scoped remainder, or `undefined` when the pathname is not on this
   * page at all.
   *
   * Resolve the branch for this exact pathname instead of capturing the mount
   * from a React render. An optional parent must not consume its child's path.
   */
  function splitScope(appPathname: string): PageScope | undefined {
    const base = options.resolveMount
      ? options.resolveMount(appPathname)?.basePath
      : matchPath(options.routePattern, appPathname, false)?.pathnameBase;
    if (base === undefined) {
      return undefined;
    }
    const rest = appPathname.slice(base === '/' ? 1 : base.length);
    return {
      base,
      scoped: rest ? `${rest.startsWith('/') ? '' : '/'}${rest}` : '/',
    };
  }

  let basePath = splitScope(appHistory.location.pathname)?.base ?? '/';

  /**
   * Re-adds the page's mount prefix to a scoped href. Exactly inverts the
   * split above for every scoped location this history can hold, so a
   * round-trip through `AppHistoryApi` never accumulates a prefix.
   */
  function toAppAbsolute(scopedHref: string): string {
    const { pathname, search, hash } = parseHref(scopedHref, undefined);
    if (basePath === '/') {
      return `${pathname || '/'}${search}${hash}`;
    }
    // The page root *is* the base path, so a scoped `/` contributes nothing —
    // otherwise `/` + `?q=1` would come out as `/page/?q=1`.
    const suffix =
      pathname === '/' || pathname === ''
        ? ''
        : `${pathname.startsWith('/') ? '' : '/'}${pathname}`;
    return `${basePath}${suffix}${search}${hash}`;
  }

  function toHistoryLocation(
    appLoc: AppLocation,
    scopedPathname: string,
    metadata: AppHistoryMetadata | undefined,
  ): HistoryLocation {
    const href = `${scopedPathname}${appLoc.search}${appLoc.hash}`;
    let userState: Record<string, unknown> | undefined;
    if (isRecord(appLoc.state)) {
      userState = appLoc.state;
    } else if (appLoc.state !== undefined) {
      userState = { state: appLoc.state };
    }
    const location = parseHref(href, undefined);
    location.state = {
      ...location.state,
      ...userState,
      ...(metadata
        ? {
            key: metadata.key,
            __TSR_key: metadata.key,
            __TSR_index: metadata.index,
          }
        : { __TSR_index: 0 }),
    };
    return location;
  }

  let subscription: { unsubscribe(): void } | undefined;
  let sourceLocation = appHistory.location;
  let latestMetadata = readAppHistoryMetadata(appHistory);
  let latestLocation = toHistoryLocation(
    sourceLocation,
    splitScope(sourceLocation.pathname)?.scoped ?? '/',
    latestMetadata,
  );
  let blockers: NavigationBlocker[] = [];
  let writing = false;
  let writtenLocation: AppLocation | undefined;
  let pendingEchoes = new WeakSet<AppLocation>();

  function commit(location: AppLocation): boolean {
    const scope = splitScope(location.pathname);
    if (!scope) {
      // Retain the last page location while the app is unmounting this page.
      return false;
    }
    basePath = scope.base;
    sourceLocation = location;
    latestMetadata = readAppHistoryMetadata(appHistory);
    latestLocation = toHistoryLocation(location, scope.scoped, latestMetadata);
    return true;
  }

  function write(path: string, state: unknown, replace: boolean) {
    // Native history notifies after this callback returns. Suppress only the
    // actual host write, so host navigation during an async blocker still flows.
    writing = true;
    writtenLocation = undefined;
    try {
      appHistory.navigate(toAppAbsolute(path), { state, replace });
      const location = appHistory.location;
      if (
        subscription &&
        writtenLocation !== location &&
        sourceLocation !== location
      ) {
        pendingEchoes.add(location);
      }
      commit(location);
    } finally {
      writing = false;
    }
  }

  function unsubscribeFromHost() {
    subscription?.unsubscribe();
    subscription = undefined;
    pendingEchoes = new WeakSet();
  }

  const history = createHistory({
    getLocation: () => {
      if (!subscription) {
        commit(appHistory.location);
      }
      return latestLocation;
    },
    getLength: () => latestMetadata?.length ?? 1,
    pushState: (path, state) => write(path, state, false),
    replaceState: (path, state) => write(path, state, true),
    go: delta => appHistory.navigate(delta),
    back: () => appHistory.navigate(-1),
    forward: () => appHistory.navigate(1),
    createHref: href => appHistory.createHref(toAppAbsolute(href)),
    getBlockers: () => blockers,
    setBlockers: next => {
      blockers = next;
    },
    notifyOnIndexChange: false,
    destroy: () => {
      unsubscribeFromHost();
      history.subscribers.clear();
    },
  });

  // Subscribe lazily: creating a router during a discarded React render must
  // not leave an app-history listener behind. Native history owns subscribers;
  // this wrapper only ties the host subscription to their lifetime.
  const subscribe = history.subscribe;
  history.subscribe = callback => {
    const unsubscribe = subscribe(callback);
    if (!subscription) {
      subscription = appHistory.location$.subscribe(location => {
        if (writing) {
          writtenLocation = location;
          return;
        }
        if (pendingEchoes.delete(location)) {
          return;
        }
        const metadata = readAppHistoryMetadata(appHistory);
        if (
          location === sourceLocation &&
          metadata?.key === latestMetadata?.key &&
          metadata?.action === latestMetadata?.action
        ) {
          return;
        }
        const previousIndex = latestMetadata?.index ?? 0;
        if (!commit(location)) {
          return;
        }
        if (metadata?.action === 'PUSH' || metadata?.action === 'REPLACE') {
          history.notify({ type: metadata.action });
        } else {
          history.notify(
            toTraversalAction((metadata?.index ?? 0) - previousIndex),
          );
        }
      });
    }
    return () => {
      unsubscribe();
      if (history.subscribers.size === 0) {
        unsubscribeFromHost();
      }
    };
  };

  return history;
}
