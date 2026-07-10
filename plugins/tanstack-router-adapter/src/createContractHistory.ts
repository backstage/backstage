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
  RoutingBlockerTransition,
  RoutingContract,
  RoutingLocation,
} from '@backstage/frontend-plugin-api';
import { parseHref } from '@tanstack/history';
import type {
  HistoryAction,
  HistoryLocation,
  NavigationBlocker,
  ParsedHistoryState,
  RouterHistory,
} from '@tanstack/history';
import { TANSTACK_ADAPTER_ID } from './constants';

/**
 * Options for {@link createContractHistory}.
 *
 * @internal
 */
export interface CreateContractHistoryOptions {
  /**
   * App basename prefix prepended by TanStack history `createHref`.
   * Defaults to `''`.
   */
  appBasename?: string;
}

type TanStackAdapterMeta = {
  __TSR_index: number;
  __TSR_key?: string;
  key?: string;
};

type SubscriberHistoryAction =
  | { type: Exclude<HistoryAction, 'GO'> }
  | { type: 'GO'; index: number };

type SubscriberArgs = {
  location: HistoryLocation;
  action: SubscriberHistoryAction;
};

function createRandomKey(): string {
  return (Math.random() + 1).toString(36).substring(7);
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function splitState(state: unknown): {
  userState: unknown;
  adapterMeta: TanStackAdapterMeta;
} {
  const key = createRandomKey();
  if (!isRecord(state)) {
    return {
      userState: state,
      adapterMeta: { __TSR_index: 0, __TSR_key: key, key },
    };
  }

  const {
    __TSR_index,
    __TSR_key,
    key: legacyKey,
    ...rest
  } = state as Record<string, unknown> & Partial<TanStackAdapterMeta>;

  const userKeys = Object.keys(rest);
  const userState = userKeys.length === 0 ? undefined : rest;

  return {
    userState,
    adapterMeta: {
      __TSR_index: typeof __TSR_index === 'number' ? __TSR_index : 0,
      __TSR_key: typeof __TSR_key === 'string' ? __TSR_key : key,
      key: typeof legacyKey === 'string' ? legacyKey : key,
    },
  };
}

function readAdapterMeta(contract: RoutingContract): TanStackAdapterMeta {
  const stored = contract.getAdapterState(TANSTACK_ADAPTER_ID);
  if (isRecord(stored) && typeof stored.__TSR_index === 'number') {
    return {
      __TSR_index: stored.__TSR_index,
      __TSR_key:
        typeof stored.__TSR_key === 'string' ? stored.__TSR_key : undefined,
      key: typeof stored.key === 'string' ? stored.key : undefined,
    };
  }

  const key = createRandomKey();
  return {
    __TSR_index: contract.canGoBack()
      ? Math.max(contract.historyLength - 1, 1)
      : 0,
    __TSR_key: key,
    key,
  };
}

function mergeUserState(
  adapterMeta: TanStackAdapterMeta,
  userState: unknown,
): ParsedHistoryState {
  const base = {
    __TSR_index: adapterMeta.__TSR_index,
    __TSR_key: adapterMeta.__TSR_key,
    key: adapterMeta.key,
  } as ParsedHistoryState;

  if (userState === undefined || userState === null) {
    return base;
  }
  if (isRecord(userState)) {
    return { ...base, ...userState } as ParsedHistoryState;
  }
  return { ...base, state: userState } as ParsedHistoryState;
}

function toHistoryLocation(
  contract: RoutingContract,
  scoped: RoutingLocation,
): HistoryLocation {
  const adapterMeta = readAdapterMeta(contract);
  const href = `${scoped.pathname}${scoped.search}${scoped.hash}`;
  return parseHref(href, mergeUserState(adapterMeta, scoped.state));
}

function readCurrentScoped(contract: RoutingContract): RoutingLocation {
  let current: RoutingLocation = {
    pathname: '/',
    search: '',
    hash: '',
    state: undefined,
  };
  const sub = contract.location$.subscribe(loc => {
    current = loc;
  });
  sub.unsubscribe();
  return current;
}

/**
 * Hand-rolled TanStack `RouterHistory` that projects a RoutingContract.
 *
 * Never writes `window.history`. Never owns an `entries[]` stack — location,
 * length, and back/forward come from the contract / NavigationController.
 * TanStack `__TSR_*` metadata is stored under the `tanstack-router` adapter
 * namespace via `adapterState`.
 *
 * `history.block` registers into the framework's shared blocker seam via
 * {@link RoutingContract.block} — the same registry chrome/framework
 * navigate and every other adapter check. Blockers run for push/replace
 * initiated through this history (or through chrome/another adapter using
 * the same contract), never for go/back/forward, matching TanStack's
 * `createHistory`.
 *
 * @internal
 */
export function createContractHistory(
  contract: RoutingContract,
  options?: CreateContractHistoryOptions,
): RouterHistory {
  if (!contract) {
    throw new Error(
      'createContractHistory requires a RoutingContract. Ensure this component is rendered inside a page that provides RoutingContractContext.',
    );
  }

  const appBasename = options?.appBasename ?? '';
  const subscribers = new Set<(opts: SubscriberArgs) => void>();
  let subscription: { unsubscribe(): void } | undefined;
  let suppressContractNotify = false;
  // Set right before a push/replace initiated through this history so the
  // location$ subscription below can attribute the resulting emission to
  // the right SubscriberHistoryAction — including when the write is
  // deferred pending an async framework blocker.
  let pendingAction: SubscriberHistoryAction | undefined;
  let latestLocation: HistoryLocation = toHistoryLocation(
    contract,
    readCurrentScoped(contract),
  );

  const notify = (action: SubscriberHistoryAction) => {
    subscribers.forEach(subscriber =>
      subscriber({ location: latestLocation, action }),
    );
  };

  const syncFromContract = () => {
    latestLocation = toHistoryLocation(contract, readCurrentScoped(contract));
  };

  const ensureSubscription = () => {
    if (subscription) {
      return;
    }
    let isFirstEmission = true;
    subscription = contract.location$.subscribe(loc => {
      latestLocation = toHistoryLocation(contract, loc);
      // Skip the mandatory sync emission on subscribe — only notify for
      // subsequent controller-driven updates (back/forward, chrome nav,
      // self-initiated push/replace).
      if (isFirstEmission) {
        isFirstEmission = false;
        return;
      }
      if (suppressContractNotify) {
        return;
      }
      const action = pendingAction ?? { type: 'GO', index: 0 };
      pendingAction = undefined;
      notify(action);
    });
  };

  const tearDownSubscription = () => {
    subscription?.unsubscribe();
    subscription = undefined;
  };

  const toContractPath = (path: string): string => {
    const url = new URL(path, 'http://localhost');
    const appPath = `${url.pathname}${url.search}${url.hash}`;
    if (contract.basePath === '/') {
      return appPath;
    }
    if (
      url.pathname === contract.basePath ||
      url.pathname.startsWith(`${contract.basePath}/`)
    ) {
      const scopedPath =
        url.pathname === contract.basePath
          ? '/'
          : url.pathname.slice(contract.basePath.length) || '/';
      return `${scopedPath}${url.search}${url.hash}`;
    }
    // Already scoped (or out of scope — contract.navigate will warn/block).
    return appPath;
  };

  // Reverse of toContractPath: project an app-rooted RoutingLocation (as
  // seen by shared framework blockers) into this router's scoped location.
  const toScopedLocation = (location: RoutingLocation): RoutingLocation => {
    const scopedPath = toContractPath(
      `${location.pathname}${location.search}${location.hash}`,
    );
    const url = new URL(scopedPath, 'http://localhost');
    return {
      pathname: url.pathname,
      search: url.search,
      hash: url.hash,
      state: location.state,
    };
  };

  const toBlockerHistoryLocation = (
    location: RoutingLocation,
  ): HistoryLocation => {
    const scoped = toScopedLocation(location);
    const state = isRecord(scoped.state) ? scoped.state : {};
    return parseHref(`${scoped.pathname}${scoped.search}${scoped.hash}`, {
      __TSR_index: 0,
      ...state,
    } as ParsedHistoryState);
  };

  const navigateThroughContract = (
    path: string,
    state: unknown,
    replace: boolean,
    ignoreBlockers?: boolean,
  ) => {
    const { userState, adapterMeta } = splitState(state);
    let nextIndex = contract.historyLength;
    if (replace) {
      nextIndex = contract.canGoBack()
        ? Math.max(contract.historyLength - 1, 0)
        : 0;
    }

    pendingAction = { type: replace ? 'REPLACE' : 'PUSH' };
    contract.navigate(toContractPath(path), {
      replace,
      state: userState,
      adapterState: {
        [TANSTACK_ADAPTER_ID]: {
          ...adapterMeta,
          __TSR_index: nextIndex,
        },
      },
      ignoreBlockers,
    });
    // Unblocked navigation runs synchronously — the location$ subscription
    // above (if attached) has already fired and consumed pendingAction.
    // Resyncing here is a no-op for the deferred (blocked-pending) case.
    syncFromContract();
  };

  const history: RouterHistory = {
    get location() {
      return latestLocation;
    },
    get length() {
      return contract.historyLength;
    },
    subscribers,
    subscribe: (cb: (opts: SubscriberArgs) => void) => {
      subscribers.add(cb);
      ensureSubscription();
      return () => {
        subscribers.delete(cb);
        if (subscribers.size === 0) {
          tearDownSubscription();
        }
      };
    },
    push: (path, state, navigateOpts) => {
      navigateThroughContract(path, state, false, navigateOpts?.ignoreBlocker);
    },
    replace: (path, state, navigateOpts) => {
      navigateThroughContract(path, state, true, navigateOpts?.ignoreBlocker);
    },
    go: (index, _navigateOpts) => {
      // Match @tanstack/history: GO does not run blockers (push/replace only).
      suppressContractNotify = true;
      try {
        contract.go(index);
        syncFromContract();
      } finally {
        suppressContractNotify = false;
      }
      notify({ type: 'GO', index });
    },
    back: navigateOpts => {
      history.go(-1, navigateOpts);
    },
    forward: navigateOpts => {
      history.go(1, navigateOpts);
    },
    canGoBack: () => contract.canGoBack(),
    createHref: (href: string) => {
      // History locations are contract-scoped; only prepend the app basename.
      // Absolute browser hrefs for chrome are built by the navigation controller.
      if (!appBasename) {
        return href;
      }
      const url = new URL(href, 'http://localhost');
      return `${appBasename}${url.pathname}${url.search}${url.hash}`;
    },
    block: (blocker: NavigationBlocker) => {
      // Registers into the framework's shared blocker seam (RoutingContract
      // / NavigationController), so chrome navigate and every other adapter
      // using this contract are blocked too — not just this router's own
      // push/replace.
      return contract.block((transition: RoutingBlockerTransition) =>
        blocker.blockerFn({
          currentLocation: toBlockerHistoryLocation(transition.currentLocation),
          nextLocation: toBlockerHistoryLocation(transition.nextLocation),
          action: transition.action,
        }),
      );
    },
    flush: () => {},
    destroy: () => {
      tearDownSubscription();
      subscribers.clear();
    },
    notify,
  };

  return history;
}
