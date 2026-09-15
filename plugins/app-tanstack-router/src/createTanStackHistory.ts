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
  parseHref,
  type HistoryLocation,
  type NavigationBlocker,
  type ParsedHistoryState,
  type RouterHistory,
} from '@tanstack/history';

type HistoryNotify = RouterHistory['notify'];
type HistoryNotifyAction = Parameters<HistoryNotify>[0];
type HistorySubscriber = Parameters<RouterHistory['subscribe']>[0];

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

/** Conservative entry facts when the host supplies locations only. */
const SYNTHESIZED_FIRST_ENTRY: AppHistoryMetadata = Object.freeze({
  action: 'POP',
  key: 'default',
  index: 0,
  length: 1,
  canGoBack: false,
});

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
 * so entry-based restoration is unavailable. Known synchronous navigations
 * retain their action; uncorrelated updates are reported as GO with delta 0.
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
    metadata: AppHistoryMetadata,
  ): HistoryLocation {
    const href = `${scopedPathname}${appLoc.search}${appLoc.hash}`;
    const userState = appLoc.state;
    const tsrState = {
      key: metadata.key,
      __TSR_index: metadata.index,
      __TSR_key: metadata.key,
    } as ParsedHistoryState;
    let state: ParsedHistoryState = tsrState;
    if (isRecord(userState)) {
      state = { ...userState, ...tsrState } as ParsedHistoryState;
    } else if (userState !== undefined) {
      state = { ...tsrState, state: userState } as ParsedHistoryState;
    }
    return parseHref(href, state);
  }

  const subscribers = new Set<HistorySubscriber>();
  let subscription: { unsubscribe(): void } | undefined;
  let sourceLocation: AppLocation = appHistory.location;
  let latestMetadata: AppHistoryMetadata =
    readAppHistoryMetadata(appHistory) ?? SYNTHESIZED_FIRST_ENTRY;
  let latestLocation: HistoryLocation = toHistoryLocation(
    sourceLocation,
    splitScope(sourceLocation.pathname)?.scoped ?? '/',
    latestMetadata,
  );
  let blockers: NavigationBlocker[] = [];
  let pendingAction: HistoryNotifyAction | undefined;
  let fallbackKey = 0;

  /** The host owns entry identity and stack position when it supplies them. */
  function resolveMetadata(
    metadata: AppHistoryMetadata | undefined,
    action?: HistoryNotifyAction,
  ): AppHistoryMetadata {
    if (metadata) {
      return metadata;
    }
    return {
      ...SYNTHESIZED_FIRST_ENTRY,
      action:
        action?.type === 'PUSH' || action?.type === 'REPLACE'
          ? action.type
          : 'POP',
      key:
        action?.type === 'REPLACE'
          ? latestMetadata.key
          : `tanstack-${fallbackKey++}`,
    };
  }

  function commit(
    appLoc: AppLocation,
    scope: PageScope,
    metadata: AppHistoryMetadata,
  ): void {
    basePath = scope.base;
    sourceLocation = appLoc;
    latestMetadata = metadata;
    latestLocation = toHistoryLocation(appLoc, scope.scoped, metadata);
  }

  const notify: HistoryNotify = action => {
    subscribers.forEach(subscriber =>
      subscriber({ location: latestLocation, action }),
    );
  };

  const ensureSubscription = () => {
    if (subscription) {
      return;
    }
    subscription = appHistory.location$.subscribe(loc => {
      const rawMetadata = readAppHistoryMetadata(appHistory);
      // `AppHistoryApi.location` is a stable reference, so an observable that
      // replays its current value on subscribe is already accounted for.
      // Without the metadata capability there is no reported key or action to
      // compare — the synthesized record is this adapter's own bookkeeping, so
      // comparing against it would say nothing about the history — leaving the
      // location identity, plus the fact that no navigation of ours is in
      // flight, as what identifies a replay.
      const isReplay = rawMetadata
        ? loc === sourceLocation &&
          rawMetadata.key === latestMetadata.key &&
          rawMetadata.action === latestMetadata.action
        : loc === sourceLocation && pendingAction === undefined;
      if (isReplay) {
        return;
      }
      const action = pendingAction;
      pendingAction = undefined;
      const metadata = resolveMetadata(rawMetadata, action);
      const scope = splitScope(loc.pathname);
      if (!scope) {
        // The app has navigated off this page, so this page is on its way
        // out and its scoped history has nothing to say about a location
        // that is not on it. Keeping the last in-scope location is what makes
        // the split and the re-add exact inverses: an off-page pathname
        // parked in the scoped location would be re-prefixed by the next
        // push.
        return;
      }
      const previousIndex = latestMetadata.index;
      commit(loc, scope, metadata);
      if (action) {
        notify(action);
      } else if (metadata.action === 'PUSH') {
        notify({ type: 'PUSH' });
      } else if (metadata.action === 'REPLACE') {
        notify({ type: 'REPLACE' });
      } else {
        notify(toTraversalAction(metadata.index - previousIndex));
      }
    });
  };

  const tearDownSubscription = () => {
    subscription?.unsubscribe();
    subscription = undefined;
  };

  const performNavigate = (path: string, state: unknown, replace: boolean) => {
    const action: HistoryNotifyAction = {
      type: replace ? 'REPLACE' : 'PUSH',
    };
    performNavigation(action, () => {
      appHistory.navigate(toAppAbsolute(path), { replace, state });
    });
  };

  function performNavigation(
    action: HistoryNotifyAction,
    navigate: () => void,
  ) {
    pendingAction = action;
    let handledBySubscription: boolean;
    try {
      navigate();
      handledBySubscription = pendingAction === undefined;
    } finally {
      // Only a synchronous notification can be correlated with this call.
      // A no-op, exception, or delayed host update must not leave a marker.
      pendingAction = undefined;
    }
    if (handledBySubscription || subscription) {
      // A subscribed host may publish its updated snapshot before notifying.
      // Wait for that emission rather than turning it into a suppressed replay.
      return;
    }
    const loc = appHistory.location;
    const rawMetadata = readAppHistoryMetadata(appHistory);
    if (
      loc === sourceLocation &&
      (!rawMetadata ||
        (rawMetadata.key === latestMetadata.key &&
          rawMetadata.action === latestMetadata.action))
    ) {
      return;
    }
    const scope = splitScope(loc.pathname);
    if (scope) {
      commit(loc, scope, resolveMetadata(rawMetadata, action));
    }
  }

  const navigateThroughAppHistory = (
    path: string,
    state: unknown,
    replace: boolean,
    ignoreBlocker?: boolean,
  ) => {
    if (blockers.length === 0 || ignoreBlocker) {
      performNavigate(path, state, replace);
      return;
    }
    const nextLocation = parseHref(
      path,
      state as ParsedHistoryState | undefined,
    );
    const action: 'PUSH' | 'REPLACE' = replace ? 'REPLACE' : 'PUSH';
    void (async () => {
      for (const blocker of blockers) {
        // eslint-disable-next-line no-await-in-loop
        const blocked = await blocker.blockerFn({
          currentLocation: latestLocation,
          nextLocation,
          action,
        });
        if (blocked) {
          return;
        }
      }
      performNavigate(path, state, replace);
    })();
  };

  const traverse = (delta: number) => {
    performNavigation(toTraversalAction(delta), () =>
      appHistory.navigate(delta),
    );
  };

  const history = {
    get location() {
      return latestLocation;
    },
    get length() {
      return latestMetadata.length;
    },
    subscribers,
    subscribe: (cb: HistorySubscriber) => {
      subscribers.add(cb);
      ensureSubscription();
      return () => {
        subscribers.delete(cb);
        if (subscribers.size === 0) {
          tearDownSubscription();
        }
      };
    },
    push: (
      path: string,
      state?: unknown,
      navigateOpts?: { ignoreBlocker?: boolean },
    ) => {
      navigateThroughAppHistory(
        path,
        state,
        false,
        navigateOpts?.ignoreBlocker,
      );
    },
    replace: (
      path: string,
      state?: unknown,
      navigateOpts?: { ignoreBlocker?: boolean },
    ) => {
      navigateThroughAppHistory(path, state, true, navigateOpts?.ignoreBlocker);
    },
    go: (delta: number) => traverse(delta),
    back: () => traverse(-1),
    forward: () => traverse(1),
    canGoBack: () => latestMetadata.canGoBack,
    createHref: (href: string) => appHistory.createHref(toAppAbsolute(href)),
    block: (blocker: NavigationBlocker) => {
      blockers = [...blockers, blocker];
      return () => {
        blockers = blockers.filter(b => b !== blocker);
      };
    },
    flush: () => {},
    destroy: () => {
      tearDownSubscription();
      subscribers.clear();
    },
    notify,
  };

  // Cast: `@tanstack/history` may appear twice in the type graph (devDep vs
  // peer), which makes structurally identical subscriber sets incompatible.
  return history as unknown as RouterHistory;
}
