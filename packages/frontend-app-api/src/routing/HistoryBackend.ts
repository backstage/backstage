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

import type { AppLocation } from '@backstage/frontend-plugin-api';

/**
 * Options for {@link HistoryBackend} push/replace.
 *
 * @internal
 */
export interface HistoryWriteOptions {
  state?: unknown;
}

/** Metadata for the currently selected browser history entry. @internal */
export interface HistoryEntryMetadata {
  key: string;
  index: number;
  length: number;
  canGoBack: boolean;
}

/** The observable kind of a history change. @internal */
export type HistoryAction = 'PUSH' | 'REPLACE' | 'POP';

/**
 * Thin history storage facade for {@link AppHistory}.
 *
 * Production uses the window History API; tests inject an in-memory backend
 * so the same module owns navigation without touching `window.history`.
 *
 * @internal
 */
export interface HistoryBackend {
  /** Current location including pathname, search, hash, and state. */
  getLocation(): AppLocation;
  /** Router-facing facts about the current entry. */
  getEntry(): HistoryEntryMetadata;
  /**
   * Push a new entry. `url` is pathname + search + hash (no origin).
   */
  push(url: string, options?: HistoryWriteOptions): void;
  /**
   * Replace the current entry. `url` is pathname + search + hash (no origin).
   */
  replace(url: string, options?: HistoryWriteOptions): void;
  /** Traverse the current history stack by a relative number of entries. */
  go(delta: number): void;
  /**
   * Subscribe to location changes the backend did not initiate itself (e.g.
   * browser back/forward via popstate). Returns an unsubscribe function.
   *
   * Synchronous push/replace do not notify listeners — the caller emits
   * after those calls itself.
   */
  listen(listener: (action: HistoryAction) => void): () => void;
  /** Release any external listeners (e.g. popstate). */
  dispose(): void;
}

/**
 * History backend backed by `window.history` / `window.location`.
 *
 * @internal
 */
export function createWindowHistoryBackend(): HistoryBackend {
  const STATE_KEY = '__backstage_app_history_v1';
  type StoredState = {
    [STATE_KEY]: { key: string; index: number; length?: number };
    userState: unknown;
  };
  type NavigationLike = EventTarget & {
    currentEntry?: { key: string; index: number };
    canGoBack?: boolean;
    entries?(): unknown[];
  };

  const navigation = (window as unknown as { navigation?: NavigationLike })
    .navigation;
  const hasNavigationApi = Boolean(navigation?.currentEntry);
  let removeListener: (() => void) | undefined;
  let writing = false;

  const createKey = () => {
    const randomUuid = window.crypto?.randomUUID?.bind(window.crypto);
    return randomUuid
      ? randomUuid()
      : `${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}`;
  };

  const isStoredState = (state: unknown): state is StoredState => {
    if (typeof state !== 'object' || state === null) {
      return false;
    }
    const metadata = (state as Partial<StoredState>)[STATE_KEY];
    return (
      typeof metadata?.key === 'string' &&
      Number.isInteger(metadata.index) &&
      metadata.index >= 0 &&
      (metadata.length === undefined ||
        (Number.isInteger(metadata.length) && metadata.length > metadata.index))
    );
  };

  const wrapState = (
    userState: unknown,
    entry: Pick<HistoryEntryMetadata, 'key' | 'index' | 'length'>,
  ): StoredState => ({
    [STATE_KEY]: {
      key: entry.key,
      index: entry.index,
      length: entry.length,
    },
    userState,
  });

  let fallbackEntry: HistoryEntryMetadata;
  if (hasNavigationApi) {
    const currentEntry = navigation!.currentEntry!;
    fallbackEntry = {
      key: currentEntry.key,
      index: currentEntry.index,
      length: navigation!.entries?.().length ?? window.history.length,
      canGoBack: Boolean(navigation!.canGoBack),
    };
  } else if (isStoredState(window.history.state)) {
    const stored = window.history.state[STATE_KEY];
    const length = Math.max(stored.index + 1, stored.length ?? 0);
    fallbackEntry = {
      key: stored.key,
      index: stored.index,
      length,
      canGoBack: stored.index > 0,
    };
  } else {
    // The legacy History API exposes the total session-history length, but
    // not which entry is current. In particular, a reload can have forward
    // entries, so `history.length - 1` is not a truthful current index. Start
    // a local app-owned coordinate system and persist it into every entry we
    // encounter; it is exact for those entries from this point onward.
    fallbackEntry = {
      key: createKey(),
      index: 0,
      length: 1,
      canGoBack: false,
    };
    window.history.replaceState(
      wrapState(window.history.state, fallbackEntry),
      '',
      window.location.href,
    );
  }

  const readLocation = (): AppLocation => {
    const rawState = window.history.state;
    return {
      pathname: window.location.pathname,
      search: window.location.search,
      hash: window.location.hash,
      state:
        (isStoredState(rawState) ? rawState.userState : rawState) ?? undefined,
    };
  };

  const readEntry = (): HistoryEntryMetadata => {
    if (hasNavigationApi) {
      const currentEntry = navigation!.currentEntry!;
      return {
        key: currentEntry.key,
        index: currentEntry.index,
        length: navigation!.entries?.().length ?? window.history.length,
        canGoBack: Boolean(navigation!.canGoBack),
      };
    }
    const rawState = window.history.state;
    if (isStoredState(rawState)) {
      const stored = rawState[STATE_KEY];
      const length = Math.max(
        fallbackEntry.length,
        stored.index + 1,
        stored.length ?? 0,
      );
      fallbackEntry = {
        key: stored.key,
        index: stored.index,
        length,
        canGoBack: stored.index > 0,
      };
    } else {
      // Traversal may arrive at an entry created before AppHistory started.
      // Give it a stable local identity without guessing a direction that the
      // legacy History API does not reveal, and preserve its user state.
      const length = Math.max(1, fallbackEntry.length);
      const index = Math.min(fallbackEntry.index, length - 1);
      fallbackEntry = {
        key: createKey(),
        index,
        length,
        canGoBack: index > 0,
      };
      window.history.replaceState(
        wrapState(rawState, fallbackEntry),
        '',
        window.location.href,
      );
    }
    return fallbackEntry;
  };

  return {
    getLocation: readLocation,
    getEntry: readEntry,
    push(url: string, options?: HistoryWriteOptions): void {
      writing = true;
      try {
        if (hasNavigationApi) {
          window.history.pushState(options?.state ?? null, '', url);
        } else {
          fallbackEntry = {
            key: createKey(),
            index: fallbackEntry.index + 1,
            length: fallbackEntry.index + 2,
            canGoBack: true,
          };
          window.history.pushState(
            wrapState(options?.state, fallbackEntry),
            '',
            url,
          );
        }
      } finally {
        writing = false;
      }
    },
    replace(url: string, options?: HistoryWriteOptions): void {
      writing = true;
      try {
        window.history.replaceState(
          hasNavigationApi
            ? options?.state ?? null
            : wrapState(options?.state, fallbackEntry),
          '',
          url,
        );
      } finally {
        writing = false;
      }
    },
    go(delta: number): void {
      window.history.go(delta);
    },
    listen(listener: (action: HistoryAction) => void): () => void {
      let lastHref = window.location.href;
      let lastState = window.history.state;
      let lastKey = readEntry().key;
      const onChange = (event: Event) => {
        if (writing) {
          return;
        }
        const href = window.location.href;
        const key = readEntry().key;
        const state = window.history.state;
        if (
          href === lastHref &&
          Object.is(state, lastState) &&
          key === lastKey
        ) {
          return;
        }
        lastHref = href;
        lastState = state;
        lastKey = key;
        const navigationType = (
          event as Event & { navigationType?: 'push' | 'replace' }
        ).navigationType;
        let action: HistoryAction = 'POP';
        if (navigationType === 'push') {
          action = 'PUSH';
        } else if (navigationType === 'replace') {
          action = 'REPLACE';
        }
        listener(action);
      };

      if (hasNavigationApi) {
        navigation!.addEventListener('currententrychange', onChange);
        removeListener = () =>
          navigation!.removeEventListener('currententrychange', onChange);
      } else {
        window.addEventListener('popstate', onChange);
        window.addEventListener('hashchange', onChange);
        removeListener = () => {
          window.removeEventListener('popstate', onChange);
          window.removeEventListener('hashchange', onChange);
        };
      }
      return () => {
        removeListener?.();
        removeListener = undefined;
      };
    },
    dispose(): void {
      removeListener?.();
      removeListener = undefined;
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
  key: string;
};

let nextMemoryEntryKey = 0;

function parseEntry(url: string, options?: HistoryWriteOptions): MemoryEntry {
  const parsed = new URL(url, 'http://localhost');
  return {
    pathname: parsed.pathname,
    search: parsed.search,
    hash: parsed.hash,
    state: options?.state,
    key: `memory-${nextMemoryEntryKey++}`,
  };
}

/**
 * In-memory history backend for tests and non-browser environments.
 *
 * Does not touch `window.history`. Supports `go` (via the returned handle)
 * for simulating back/forward navigation in tests.
 *
 * @internal
 */
export function createMemoryHistoryBackend(
  options?: MemoryHistoryBackendOptions,
): HistoryBackend & { go(delta: number): void } {
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

  const listeners = new Set<(action: HistoryAction) => void>();

  const notify = () => {
    for (const listener of [...listeners]) {
      listener('POP');
    }
  };

  const readLocation = (): AppLocation => {
    const entry = entries[index];
    return {
      pathname: entry.pathname,
      search: entry.search,
      hash: entry.hash,
      state: entry.state ?? undefined,
    };
  };

  return {
    getLocation: readLocation,
    getEntry(): HistoryEntryMetadata {
      return {
        key: entries[index].key,
        index,
        length: entries.length,
        canGoBack: index > 0,
      };
    },
    push(url: string, writeOptions?: HistoryWriteOptions): void {
      entries.splice(index + 1);
      entries.push(parseEntry(url, writeOptions));
      index = entries.length - 1;
    },
    replace(url: string, writeOptions?: HistoryWriteOptions): void {
      entries[index] = {
        ...parseEntry(url, writeOptions),
        key: entries[index].key,
      };
    },
    go(delta: number): void {
      const next = index + delta;
      if (next < 0 || next >= entries.length) {
        return;
      }
      index = next;
      notify();
    },
    listen(listener: (action: HistoryAction) => void): () => void {
      listeners.add(listener);
      return () => {
        listeners.delete(listener);
      };
    },
    dispose(): void {
      listeners.clear();
    },
  };
}
