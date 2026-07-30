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
  FrameworkLocation,
} from '@backstage/frontend-plugin-api';
import { parseHref } from '@tanstack/history';
import type {
  HistoryLocation,
  NavigationBlocker,
  ParsedHistoryState,
  RouterHistory,
} from '@tanstack/history';
import type { MutableRefObject } from 'react';

type HistoryNotify = RouterHistory['notify'];
type HistoryNotifyAction = Parameters<HistoryNotify>[0];
type HistorySubscriber = Parameters<RouterHistory['subscribe']>[0];

function createRandomKey(): string {
  return (Math.random() + 1).toString(36).substring(7);
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

/**
 * Creates a `RouterHistory` bound to the framework's {@link AppHistoryApi}.
 *
 * Never writes `window.history`. Locations are kept **scoped** to `basePath`
 * (read from `basePathRef` on every conversion, so navigating between
 * concrete prefixes under the same page — e.g. entity A → entity B — doesn't
 * require recreating the TanStack router). TanStack's own `__TSR_index` /
 * `__TSR_key` bookkeeping is tracked locally by this history instance only —
 * `AppHistoryApi` has no namespaced adapter-state channel to persist it in,
 * so it does not survive a full remount and is not shared with other
 * adapters or app chrome.
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
  basePathRef: MutableRefObject<string>,
): RouterHistory {
  let tsrIndex = 0;

  function toScopedPathname(appPathname: string): string {
    const basePath = basePathRef.current;
    if (basePath === '/') {
      return appPathname || '/';
    }
    if (appPathname === basePath) {
      return '/';
    }
    if (appPathname.startsWith(`${basePath}/`)) {
      return appPathname.slice(basePath.length) || '/';
    }
    // Out of scope — pass through; appHistory.navigate will still route it.
    return appPathname;
  }

  function toAppAbsolute(scopedPathname: string): string {
    const basePath = basePathRef.current;
    if (basePath === '/') {
      return scopedPathname || '/';
    }
    if (scopedPathname === '/' || scopedPathname === '') {
      return basePath;
    }
    const suffix = scopedPathname.startsWith('/')
      ? scopedPathname
      : `/${scopedPathname}`;
    return `${basePath}${suffix}`;
  }

  function readCurrentAppLocation(): FrameworkLocation {
    let current!: FrameworkLocation;
    const sub = appHistory.location$.subscribe(loc => {
      current = loc;
    });
    sub.unsubscribe();
    return current;
  }

  function toHistoryLocation(appLoc: FrameworkLocation): HistoryLocation {
    const scopedPathname = toScopedPathname(appLoc.pathname);
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
  let latestLocation: HistoryLocation = toHistoryLocation(
    readCurrentAppLocation(),
  );
  let blockers: NavigationBlocker[] = [];
  let pendingAction: HistoryNotifyAction | undefined;

  const notify: HistoryNotify = action => {
    subscribers.forEach(subscriber =>
      subscriber({ location: latestLocation, action }),
    );
  };

  const ensureSubscription = () => {
    if (subscription) {
      return;
    }
    let isFirstEmission = true;
    subscription = appHistory.location$.subscribe(loc => {
      if (isFirstEmission) {
        isFirstEmission = false;
        latestLocation = toHistoryLocation(loc);
        return;
      }
      const action = pendingAction;
      pendingAction = undefined;
      if (!action) {
        // External navigation (browser back/forward, or a navigate from
        // outside this TanStack-owned page). There's no reliable way to
        // know the true delta without a shared history-depth channel —
        // best-effort local bookkeeping only.
        tsrIndex += 1;
      }
      latestLocation = toHistoryLocation(loc);
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
    latestLocation = toHistoryLocation(readCurrentAppLocation());
    pendingAction = undefined;
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
          'supported by the framework app history; use the browser\u2019s ' +
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
