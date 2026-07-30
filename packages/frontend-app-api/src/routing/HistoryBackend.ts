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

import type { FrameworkLocation } from '@backstage/frontend-plugin-api';

/**
 * Options for {@link HistoryBackend} push/replace.
 *
 * @internal
 */
export interface HistoryWriteOptions {
  state?: unknown;
}

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
  getLocation(): FrameworkLocation;
  /**
   * Push a new entry. `url` is pathname + search + hash (no origin).
   */
  push(url: string, options?: HistoryWriteOptions): void;
  /**
   * Replace the current entry. `url` is pathname + search + hash (no origin).
   */
  replace(url: string, options?: HistoryWriteOptions): void;
  /**
   * Subscribe to location changes the backend did not initiate itself (e.g.
   * browser back/forward via popstate). Returns an unsubscribe function.
   *
   * Synchronous push/replace do not notify listeners — the caller emits
   * after those calls itself.
   */
  listen(listener: () => void): () => void;
  /** Release any external listeners (e.g. popstate). */
  dispose(): void;
}

/**
 * History backend backed by `window.history` / `window.location`.
 *
 * @internal
 */
export function createWindowHistoryBackend(): HistoryBackend {
  let popstateListener: (() => void) | undefined;

  const readLocation = (): FrameworkLocation => ({
    pathname: window.location.pathname,
    search: window.location.search,
    hash: window.location.hash,
    state: window.history.state ?? undefined,
  });

  return {
    getLocation: readLocation,
    push(url: string, options?: HistoryWriteOptions): void {
      window.history.pushState(options?.state ?? null, '', url);
    },
    replace(url: string, options?: HistoryWriteOptions): void {
      window.history.replaceState(options?.state ?? null, '', url);
    },
    listen(listener: () => void): () => void {
      const onPopState = () => listener();
      popstateListener = onPopState;
      window.addEventListener('popstate', onPopState);
      return () => {
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
};

function parseEntry(url: string, options?: HistoryWriteOptions): MemoryEntry {
  const parsed = new URL(url, 'http://localhost');
  return {
    pathname: parsed.pathname,
    search: parsed.search,
    hash: parsed.hash,
    state: options?.state,
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

  const listeners = new Set<() => void>();

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

  return {
    getLocation: readLocation,
    push(url: string, writeOptions?: HistoryWriteOptions): void {
      entries.splice(index + 1);
      entries.push(parseEntry(url, writeOptions));
      index = entries.length - 1;
    },
    replace(url: string, writeOptions?: HistoryWriteOptions): void {
      entries[index] = parseEntry(url, writeOptions);
    },
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
