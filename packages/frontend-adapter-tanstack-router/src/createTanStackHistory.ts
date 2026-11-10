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
  AppHistorySnapshot,
} from '@backstage/frontend-plugin-api';
import {
  createHistory,
  parseHref,
  type HistoryLocation,
  type NavigationBlocker,
  type RouterHistory,
} from '@tanstack/history';

type HistoryNotifyAction = Parameters<RouterHistory['notify']>[0];

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
 * Locations and destinations use app-absolute paths, excluding the deployment
 * basename. Only href creation adds that basename, through the app history.
 *
 * TanStack's entry fields project the app history snapshot's optional metadata.
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
): RouterHistory {
  function toHistoryLocation(snapshot: AppHistorySnapshot): HistoryLocation {
    const { location: appLoc, entry } = snapshot;
    const href = `${appLoc.pathname}${appLoc.search}${appLoc.hash}`;
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
      ...(entry ? { key: entry.key, __TSR_key: entry.key } : {}),
      __TSR_index: entry?.index ?? 0,
    };
    return location;
  }

  let unsubscribeFromHost: (() => void) | undefined;
  let sourceSnapshot = appHistory.getSnapshot();
  let latestLocation = toHistoryLocation(sourceSnapshot);
  let blockers: NavigationBlocker[] = [];
  let writing = false;

  function commit(snapshot: AppHistorySnapshot): void {
    sourceSnapshot = snapshot;
    latestLocation = toHistoryLocation(snapshot);
  }

  function write(path: string, state: unknown, replace: boolean) {
    // Native history notifies after this callback returns. Suppress only the
    // host write, so host navigation during an async blocker still flows.
    writing = true;
    try {
      appHistory.navigate(path, { state, replace });
      commit(appHistory.getSnapshot());
    } finally {
      writing = false;
    }
  }

  const history = createHistory({
    getLocation: () => {
      if (!unsubscribeFromHost) {
        commit(appHistory.getSnapshot());
      }
      return latestLocation;
    },
    getLength: () => {
      const snapshot = appHistory.getSnapshot();
      return snapshot.length ?? (snapshot.entry?.index ?? 0) + 1;
    },
    pushState: (path, state) => write(path, state, false),
    replaceState: (path, state) => write(path, state, true),
    go: delta => appHistory.navigate(delta),
    back: () => appHistory.navigate(-1),
    forward: () => appHistory.navigate(1),
    createHref: href => appHistory.createHref(href),
    getBlockers: () => blockers,
    setBlockers: next => {
      blockers = next;
    },
    notifyOnIndexChange: false,
    destroy: () => {
      unsubscribeFromHost?.();
      unsubscribeFromHost = undefined;
      history.subscribers.clear();
    },
  });

  // Subscribe lazily: creating a router during a discarded React render must
  // not leave an app-history listener behind. Native history owns subscribers;
  // this wrapper only ties the host subscription to their lifetime.
  const subscribe = history.subscribe;
  history.subscribe = callback => {
    const unsubscribe = subscribe(callback);
    if (!unsubscribeFromHost) {
      const onChange = () => {
        const snapshot = appHistory.getSnapshot();
        if (writing || snapshot === sourceSnapshot) {
          return;
        }
        const previousIndex = sourceSnapshot.entry?.index;
        commit(snapshot);
        if (snapshot.action === 'PUSH' || snapshot.action === 'REPLACE') {
          history.notify({ type: snapshot.action });
        } else {
          const index = snapshot.entry?.index;
          history.notify(
            toTraversalAction(
              index !== undefined && previousIndex !== undefined
                ? index - previousIndex
                : 0,
            ),
          );
        }
      };
      unsubscribeFromHost = appHistory.subscribe(onChange);
      // Catch up on changes made while no TanStack consumer was subscribed.
      onChange();
    }
    return () => {
      unsubscribe();
      if (history.subscribers.size === 0) {
        unsubscribeFromHost?.();
        unsubscribeFromHost = undefined;
      }
    };
  };

  return history;
}
