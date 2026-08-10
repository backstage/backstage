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
import { parseHref } from '@tanstack/history';
import type {
  HistoryLocation,
  NavigationBlocker,
  ParsedHistoryState,
  RouterHistory,
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
}

/** An app-absolute pathname split at the page's mount point. */
interface PageScope {
  /** The page's concrete mount prefix within that pathname. */
  base: string;
  /** The remainder, as the page's own scoped pathname. */
  scoped: string;
}

function toSegments(path: string): string[] {
  return path.split('/').filter(Boolean);
}

function createRandomKey(): string {
  return (Math.random() + 1).toString(36).substring(7);
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

/**
 * Creates a `RouterHistory` bound to the framework's {@link AppHistoryApi}.
 *
 * Never writes `window.history`. Locations are kept **scoped** to the page:
 * the mount prefix is derived from `routePattern` and the app location on
 * every emission, so it is always the prefix of the location it is stripping
 * from. A concrete `basePath` handed in from React could not do that —
 * `AppHistoryApi` emits synchronously from `navigate()`, before the re-render
 * that would have updated it, so navigating from one concrete prefix to
 * another (entity A → entity B) would strip against the old prefix and leave
 * an app-absolute pathname parked in the scoped location, which the next push
 * re-prefixes into `/page/page/sub`.
 *
 * TanStack's own `__TSR_index` / `__TSR_key` bookkeeping is tracked locally by
 * this history instance only — `AppHistoryApi` has no namespaced adapter-state
 * channel to persist it in, so it does not survive a full remount and is not
 * shared with other adapters or app chrome.
 *
 * `history.block` is a **local** blocker seam: it only intercepts push /
 * replace initiated through this history (e.g. a TanStack `<Link>` or
 * `router.navigate`). It is not shared with framework/chrome navigation —
 * `AppHistoryApi` has no shared blocker registry.
 *
 * `go` / `back` / `forward` are not supported by `AppHistoryApi` (there is a
 * single, real browser history) — they warn and no-op rather than touching
 * `window.history`, matching the framework root router.
 *
 * @internal
 */
export function createTanStackHistory(
  appHistory: AppHistoryApi,
  options: CreateTanStackHistoryOptions,
): RouterHistory {
  let tsrIndex = 0;

  const mountSegments = toSegments(options.routePattern);

  /**
   * Splits an app-absolute pathname into this page's mount prefix and the
   * page-scoped remainder, or `undefined` when the pathname is not on this
   * page at all.
   *
   * The page's concrete `basePath` is its `routePattern` with the params
   * substituted, one segment each, so the pattern fixes both how many leading
   * segments belong to the mount and which of them are literal. That makes
   * the split a pure function of the pattern and the location — it cannot go
   * stale between the two the way a captured prefix can.
   */
  function splitScope(appPathname: string): PageScope | undefined {
    const segments = toSegments(appPathname);
    if (segments.length < mountSegments.length) {
      return undefined;
    }
    for (let i = 0; i < mountSegments.length; i++) {
      const patternSegment = mountSegments[i];
      const isDynamic =
        patternSegment.startsWith(':') || patternSegment === '*';
      if (!isDynamic && patternSegment !== segments[i]) {
        return undefined;
      }
    }
    const rest = segments.slice(mountSegments.length).join('/');
    return {
      base: mountSegments.length
        ? `/${segments.slice(0, mountSegments.length).join('/')}`
        : '/',
      scoped: rest ? `/${rest}` : '/',
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
  ): HistoryLocation {
    const href = `${scopedPathname}${appLoc.search}${appLoc.hash}`;
    const userState = appLoc.state;
    const tsrState = {
      __TSR_index: tsrIndex,
      __TSR_key: createRandomKey(),
    } as ParsedHistoryState;
    let state: ParsedHistoryState = tsrState;
    if (isRecord(userState)) {
      state = { ...tsrState, ...userState } as ParsedHistoryState;
    } else if (userState !== undefined) {
      state = { ...tsrState, state: userState } as ParsedHistoryState;
    }
    return parseHref(href, state);
  }

  const subscribers = new Set<HistorySubscriber>();
  let subscription: { unsubscribe(): void } | undefined;
  let sourceLocation: AppLocation = appHistory.location;
  let latestLocation: HistoryLocation = toHistoryLocation(
    sourceLocation,
    splitScope(sourceLocation.pathname)?.scoped ?? '/',
  );
  let blockers: NavigationBlocker[] = [];
  let pendingAction: HistoryNotifyAction | undefined;

  function commit(appLoc: AppLocation, scope: PageScope): void {
    basePath = scope.base;
    sourceLocation = appLoc;
    latestLocation = toHistoryLocation(appLoc, scope.scoped);
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
      // `AppHistoryApi.location` is a stable reference, so an observable that
      // replays its current value on subscribe is already accounted for.
      if (loc === sourceLocation) {
        return;
      }
      const action = pendingAction;
      pendingAction = undefined;
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
      if (!action) {
        // External navigation (browser back/forward, or a navigate from
        // outside this TanStack-owned page). There's no reliable way to
        // know the true delta without a shared history-depth channel —
        // best-effort local bookkeeping only.
        tsrIndex += 1;
      }
      commit(loc, scope);
      notify(action ?? { type: 'GO', index: 0 });
    });
  };

  const tearDownSubscription = () => {
    subscription?.unsubscribe();
    subscription = undefined;
  };

  const performNavigate = (path: string, state: unknown, replace: boolean) => {
    tsrIndex = replace ? tsrIndex : tsrIndex + 1;
    pendingAction = { type: replace ? 'REPLACE' : 'PUSH' };
    appHistory.navigate(toAppAbsolute(path), { replace, state });
    // Unblocked navigation runs synchronously — the location$ subscription
    // above (if attached) has already fired and consumed pendingAction.
    // Resyncing here is a no-op for that case, and covers the case where no
    // subscriber is attached yet.
    pendingAction = undefined;
    const loc = appHistory.location;
    if (loc !== sourceLocation) {
      const scope = splitScope(loc.pathname);
      if (scope) {
        commit(loc, scope);
      }
    }
  };

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
    const nextLocation = parseHref(path, undefined);
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

  const warnUnsupportedGo = () => {
    if (process.env.NODE_ENV !== 'production') {
      // eslint-disable-next-line no-console
      console.warn(
        '[createTanStackHistory] history.go()/back()/forward() are not ' +
          'supported by the framework app history; use the browser’s ' +
          'own back/forward instead.',
      );
    }
  };

  const history = {
    get location() {
      return latestLocation;
    },
    get length() {
      return tsrIndex + 1;
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
    go: () => warnUnsupportedGo(),
    back: () => warnUnsupportedGo(),
    forward: () => warnUnsupportedGo(),
    canGoBack: () => tsrIndex > 0,
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
