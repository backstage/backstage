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
  RoutingBlocker,
  RoutingBlockerAction,
  FrameworkLocation,
} from '@backstage/frontend-plugin-api';

/**
 * Internal history entry envelope: user-visible state is separate from
 * namespaced adapter metadata.
 *
 * @internal
 */
export interface HistoryStateEnvelope {
  /** User-visible navigation state (exposed on {@link FrameworkLocation.state}). */
  state?: unknown;
  /**
   * Adapter metadata keyed by adapter id (e.g. `tanstack-router`).
   * Never exposed on {@link FrameworkLocation.state}.
   */
  adapterState?: Record<string, unknown>;
  /**
   * Session-relative stack index used by the window backend for
   * {@link HistoryBackend.canGoBack} / {@link HistoryBackend.canGoForward}.
   * Not exposed on {@link FrameworkLocation}.
   */
  index?: number;
}

/**
 * Options for {@link HistoryBackend} push/replace.
 *
 * @internal
 */
export interface HistoryWriteOptions {
  state?: unknown;
  adapterState?: Record<string, unknown>;
  /**
   * Bypass registered blockers for this write only. Mirrors TanStack
   * Router's `ignoreBlocker` navigate option.
   */
  ignoreBlockers?: boolean;
}

/**
 * Swappable history storage for {@link NavigationController}.
 *
 * Production uses the window History API; tests inject an in-memory backend
 * so the same controller module owns navigation without touching `window.history`.
 *
 * @internal
 */
export interface HistoryBackend {
  /** Current location including pathname, search, hash, and user state only. */
  getLocation(): FrameworkLocation;
  /**
   * Read namespaced adapter metadata for the current entry.
   * Returns `undefined` when the adapter has not stored state on this entry.
   */
  getAdapterState(adapterId: string): unknown;
  /** Whether the stack can move back from the current entry. */
  canGoBack(): boolean;
  /** Whether the stack can move forward from the current entry. */
  canGoForward(): boolean;
  /** Number of entries in the session history stack. */
  readonly length: number;
  /**
   * Push a new entry. `url` is pathname + search + hash (no origin).
   *
   * Returns `true` when the write happened synchronously (no registered
   * blockers, or `options.ignoreBlockers`). Returns `false` when a blocker
   * check is pending — the write happens (and `listen` subscribers are
   * notified) asynchronously if no blocker cancels it.
   */
  push(url: string, options?: HistoryWriteOptions): boolean;
  /**
   * Replace the current entry. `url` is pathname + search + hash (no origin).
   * Return semantics match {@link HistoryBackend.push}.
   */
  replace(url: string, options?: HistoryWriteOptions): boolean;
  /**
   * Move forward/back in the history stack by `delta` entries.
   * Notifies `listen` subscribers (e.g. via popstate or an in-memory notify).
   * Never runs blockers, matching TanStack `createHistory`.
   */
  go(delta: number): void;
  /**
   * Subscribe to location changes that the backend did not initiate
   * synchronously via push/replace (e.g. browser back/forward, or a
   * push/replace that was deferred pending an async blocker). Returns an
   * unsubscribe function.
   *
   * Synchronous push/replace do not notify listeners — the controller emits
   * after those calls itself.
   */
  listen(listener: () => void): () => void;
  /**
   * Register a pre-navigation blocker for push/replace. Never runs for
   * go/back/forward. Returns an unblock function.
   */
  block(blocker: RoutingBlocker): () => void;
  /** Release any external listeners (e.g. popstate). */
  dispose(): void;
}

/**
 * Shared blocker registry used by both {@link createWindowHistoryBackend}
 * and {@link createMemoryHistoryBackend}. Blockers run sequentially and stop
 * at the first one that cancels the navigation, matching
 * `@tanstack/history`'s `createHistory`.
 */
function createBlockerGate() {
  let blockers: RoutingBlocker[] = [];

  return {
    block(blocker: RoutingBlocker): () => void {
      blockers = [...blockers, blocker];
      return () => {
        blockers = blockers.filter(b => b !== blocker);
      };
    },
    get hasBlockers(): boolean {
      return blockers.length > 0;
    },
    async isBlocked(transition: {
      currentLocation: FrameworkLocation;
      nextLocation: FrameworkLocation;
      action: RoutingBlockerAction;
    }): Promise<boolean> {
      for (const blocker of blockers) {
        // eslint-disable-next-line no-await-in-loop
        if (await blocker(transition)) {
          return true;
        }
      }
      return false;
    },
  };
}

function parseRoutingLocation(url: string, state?: unknown): FrameworkLocation {
  const parsed = new URL(url, 'http://localhost');
  return {
    pathname: parsed.pathname,
    search: parsed.search,
    hash: parsed.hash,
    state,
  };
}

const ENVELOPE_MARKER = '__backstageHistoryEnvelope' as const;

type StoredEnvelope = HistoryStateEnvelope & {
  [ENVELOPE_MARKER]: true;
};

function isStoredEnvelope(value: unknown): value is StoredEnvelope {
  return (
    typeof value === 'object' &&
    value !== null &&
    (value as StoredEnvelope)[ENVELOPE_MARKER] === true
  );
}

/**
 * Options for packing a History API state envelope, including the optional
 * session stack index used by the window backend.
 *
 * @internal
 */
export interface PackHistoryStateOptions extends HistoryWriteOptions {
  /** Session-relative stack index for canGoBack / canGoForward. */
  index?: number;
}

/**
 * Pack user state, adapter namespaces, and optional stack index into a single
 * History API value.
 *
 * Legacy (pre-envelope) history.state values are treated as user state only.
 *
 * @internal
 */
export function packHistoryState(
  options?: PackHistoryStateOptions,
): unknown | null {
  const hasUserState = options?.state !== undefined;
  const hasAdapterState =
    options?.adapterState !== undefined &&
    Object.keys(options.adapterState).length > 0;
  const hasIndex = options?.index !== undefined;

  if (!hasUserState && !hasAdapterState && !hasIndex) {
    return null;
  }

  const envelope: StoredEnvelope = {
    [ENVELOPE_MARKER]: true,
  };
  if (hasUserState) {
    envelope.state = options!.state;
  }
  if (hasAdapterState) {
    envelope.adapterState = { ...options!.adapterState };
  }
  if (hasIndex) {
    envelope.index = options!.index;
  }
  return envelope;
}

/**
 * Unpack a History API state value into user state, adapter namespaces, and
 * optional stack index.
 *
 * @internal
 */
export function unpackHistoryState(raw: unknown): HistoryStateEnvelope {
  if (raw === null || raw === undefined) {
    return {};
  }
  if (isStoredEnvelope(raw)) {
    return {
      state: raw.state,
      adapterState: raw.adapterState ? { ...raw.adapterState } : undefined,
      index: raw.index,
    };
  }
  // Legacy / external history.state — treat as user state only.
  return { state: raw };
}

function readWindowEnvelope(): HistoryStateEnvelope {
  return unpackHistoryState(window.history.state);
}

/**
 * History backend backed by `window.history` / `window.location`.
 *
 * The browser History API does not expose the current stack index, so this
 * backend stores a session-relative `index` on each envelope entry and tracks
 * the highest index written (`tipIndex`). That makes `canGoForward()` false at
 * the stack tip and `canGoBack()` false at the first tracked entry — unlike
 * using `history.length > 1` for both directions.
 *
 * @internal
 */
export function createWindowHistoryBackend(): HistoryBackend {
  let popstateListener: (() => void) | undefined;
  const deferredListeners = new Set<() => void>();
  const gate = createBlockerGate();

  // Stamp a session index on the current entry when missing so canGo* does not
  // fall back to history.length for either direction.
  if (readWindowEnvelope().index === undefined) {
    const existing = readWindowEnvelope();
    window.history.replaceState(
      packHistoryState({
        state: existing.state,
        adapterState: existing.adapterState,
        index: 0,
      }),
      '',
      `${window.location.pathname}${window.location.search}${window.location.hash}`,
    );
  }

  let tipIndex = readWindowEnvelope().index ?? 0;

  const currentIndex = (): number => readWindowEnvelope().index ?? 0;

  const writeState = (
    method: 'pushState' | 'replaceState',
    url: string,
    options: HistoryWriteOptions | undefined,
    index: number,
  ): void => {
    window.history[method](packHistoryState({ ...options, index }), '', url);
  };

  const readLocation = (): FrameworkLocation => {
    const { state } = readWindowEnvelope();
    return {
      pathname: window.location.pathname,
      search: window.location.search,
      hash: window.location.hash,
      state: state ?? undefined,
    };
  };

  const notifyDeferred = () => {
    for (const listener of [...deferredListeners]) {
      listener();
    }
  };

  const guardedWrite = (
    action: RoutingBlockerAction,
    url: string,
    options: HistoryWriteOptions | undefined,
    performWrite: () => void,
  ): boolean => {
    if (!gate.hasBlockers || options?.ignoreBlockers) {
      performWrite();
      return true;
    }
    const transition = {
      currentLocation: readLocation(),
      nextLocation: parseRoutingLocation(url, options?.state),
      action,
    };
    void gate.isBlocked(transition).then(blocked => {
      if (blocked) {
        return;
      }
      performWrite();
      notifyDeferred();
    });
    return false;
  };

  return {
    getLocation: readLocation,
    getAdapterState(adapterId: string): unknown {
      return readWindowEnvelope().adapterState?.[adapterId];
    },
    canGoBack(): boolean {
      return currentIndex() > 0;
    },
    canGoForward(): boolean {
      return currentIndex() < tipIndex;
    },
    get length() {
      return window.history.length;
    },
    push(url: string, options?: HistoryWriteOptions): boolean {
      return guardedWrite('PUSH', url, options, () => {
        const nextIndex = currentIndex() + 1;
        // Push truncates any forward entries.
        tipIndex = nextIndex;
        writeState('pushState', url, options, nextIndex);
      });
    },
    replace(url: string, options?: HistoryWriteOptions): boolean {
      return guardedWrite('REPLACE', url, options, () => {
        writeState('replaceState', url, options, currentIndex());
      });
    },
    go(delta: number): void {
      window.history.go(delta);
    },
    block: gate.block,
    listen(listener: () => void): () => void {
      deferredListeners.add(listener);
      const onPopState = () => {
        const idx = readWindowEnvelope().index;
        if (idx !== undefined && idx > tipIndex) {
          tipIndex = idx;
        }
        listener();
      };
      popstateListener = onPopState;
      window.addEventListener('popstate', onPopState);
      return () => {
        deferredListeners.delete(listener);
        window.removeEventListener('popstate', onPopState);
        if (popstateListener === onPopState) {
          popstateListener = undefined;
        }
      };
    },
    dispose(): void {
      if (popstateListener) {
        window.removeEventListener('popstate', popstateListener);
        popstateListener = undefined;
      }
      deferredListeners.clear();
    },
  };
}

/**
 * Options for {@link createMemoryHistoryBackend}.
 *
 * @internal
 */
export interface MemoryHistoryBackendOptions {
  /** Initial stack entries (pathname + optional search/hash). Defaults to `['/']`. */
  initialEntries?: string[];
  /** Index into `initialEntries` for the starting location. Defaults to the last entry. */
  initialIndex?: number;
}

type MemoryEntry = {
  pathname: string;
  search: string;
  hash: string;
  state: unknown;
  adapterState?: Record<string, unknown>;
};

function parseEntry(url: string, options?: HistoryWriteOptions): MemoryEntry {
  const parsed = new URL(url, 'http://localhost');
  return {
    pathname: parsed.pathname,
    search: parsed.search,
    hash: parsed.hash,
    state: options?.state,
    adapterState: options?.adapterState
      ? { ...options.adapterState }
      : undefined,
  };
}

/**
 * In-memory history backend for tests and non-browser environments.
 *
 * Does not touch `window.history`. Supports `go` for back/forward simulation
 * and exact `canGoBack` / `canGoForward` from the owned stack index.
 *
 * @internal
 */
export function createMemoryHistoryBackend(
  options?: MemoryHistoryBackendOptions,
): HistoryBackend {
  const initialEntries = options?.initialEntries?.length
    ? options.initialEntries
    : ['/'];
  const entries: MemoryEntry[] = initialEntries.map(entry => parseEntry(entry));
  let index =
    options?.initialIndex !== undefined
      ? options.initialIndex
      : entries.length - 1;

  if (index < 0 || index >= entries.length) {
    throw new Error(
      `createMemoryHistoryBackend: initialIndex ${index} is out of range for ${entries.length} entries`,
    );
  }

  const listeners = new Set<() => void>();
  const gate = createBlockerGate();

  const notify = () => {
    for (const listener of [...listeners]) {
      listener();
    }
  };

  const readLocation = (): FrameworkLocation => {
    const entry = entries[index];
    return {
      pathname: entry.pathname,
      search: entry.search,
      hash: entry.hash,
      state: entry.state ?? undefined,
    };
  };

  const guardedWrite = (
    action: RoutingBlockerAction,
    url: string,
    writeOptions: HistoryWriteOptions | undefined,
    performWrite: () => void,
  ): boolean => {
    if (!gate.hasBlockers || writeOptions?.ignoreBlockers) {
      performWrite();
      return true;
    }
    const transition = {
      currentLocation: readLocation(),
      nextLocation: parseRoutingLocation(url, writeOptions?.state),
      action,
    };
    void gate.isBlocked(transition).then(blocked => {
      if (blocked) {
        return;
      }
      performWrite();
      notify();
    });
    return false;
  };

  return {
    getLocation: readLocation,
    getAdapterState(adapterId: string): unknown {
      return entries[index].adapterState?.[adapterId];
    },
    canGoBack(): boolean {
      return index > 0;
    },
    canGoForward(): boolean {
      return index < entries.length - 1;
    },
    get length() {
      return entries.length;
    },
    push(url: string, writeOptions?: HistoryWriteOptions): boolean {
      return guardedWrite('PUSH', url, writeOptions, () => {
        entries.splice(index + 1);
        entries.push(parseEntry(url, writeOptions));
        index = entries.length - 1;
      });
    },
    replace(url: string, writeOptions?: HistoryWriteOptions): boolean {
      return guardedWrite('REPLACE', url, writeOptions, () => {
        entries[index] = parseEntry(url, writeOptions);
      });
    },
    block: gate.block,
    listen(listener: () => void): () => void {
      listeners.add(listener);
      return () => {
        listeners.delete(listener);
      };
    },
    dispose(): void {
      listeners.clear();
    },
    go(delta: number): void {
      const next = index + delta;
      if (next < 0 || next >= entries.length) {
        return;
      }
      index = next;
      notify();
    },
  };
}
