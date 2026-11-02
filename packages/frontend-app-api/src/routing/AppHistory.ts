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
  AppHistoryAction,
  AppHistorySnapshot,
  AppLocation,
  AppNavigateOptions,
} from '@backstage/frontend-plugin-api';
import { resolveAppTarget, isExternalTarget } from '@internal/frontend';
import {
  createWindowHistoryBackend,
  type HistoryBackend,
} from './HistoryBackend';

type HistoryListener = () => void;

// Allow long subscriber redirect chains, but stop cycles before stack exhaustion.
const MAX_NESTED_NAVIGATIONS = 100;

/**
 * Options for constructing an {@link AppHistory}.
 *
 * @internal
 */
export interface AppHistoryOptions {
  /** App basename prefix stripped from locations and prepended on navigate. */
  basename?: string;
  /**
   * History storage backend. Defaults to the window History API.
   * Tests should inject {@link createMemoryHistoryBackend}.
   */
  history?: HistoryBackend;
}

/**
 * AppHistory is the sole writer to app history (via a swappable backend) and
 * is the concrete implementation behind {@link AppHistoryApi}.
 *
 * Prefer {@link createAppHistory} over constructing this class.
 *
 * @internal
 */
export class AppHistory implements AppHistoryApi {
  private readonly basename: string;
  private readonly history: HistoryBackend;
  private readonly subscribers: Set<HistoryListener> = new Set();
  private readonly unlisten: () => void;
  private disposed = false;
  private notificationDepth = 0;
  private current: AppHistorySnapshot;

  /** @internal */
  static create(options?: AppHistoryOptions): AppHistory {
    return new AppHistory(options);
  }

  private constructor(options?: AppHistoryOptions) {
    this.basename = options?.basename ?? '';
    this.history = options?.history ?? createWindowHistoryBackend();
    const { key, index, length } = this.history.getEntry();
    this.current = {
      location: this.readLocation(),
      entry: { key, index },
      length,
    };

    this.unlisten = this.history.listen(action => {
      this.emit(action);
    });
  }

  /** Reads live backend state while retaining unchanged snapshot references. */
  readonly getSnapshot = (): AppHistorySnapshot => this.refresh();

  readonly subscribe = (listener: HistoryListener): (() => void) => {
    // Each subscription owns a handler, even when callbacks are shared.
    const handler = () => listener();
    this.subscribers.add(handler);
    return () => {
      this.subscribers.delete(handler);
    };
  };

  private refresh(action?: AppHistoryAction): AppHistorySnapshot {
    const next = this.readLocation();
    const { key, index, length } = this.history.getEntry();
    const { location, entry } = this.current;
    const locationChanged =
      location.pathname !== next.pathname ||
      location.search !== next.search ||
      location.hash !== next.hash ||
      !Object.is(location.state, next.state);
    const entryChanged = entry?.key !== key || entry?.index !== index;
    if (
      action ||
      locationChanged ||
      entryChanged ||
      this.current.length !== length
    ) {
      this.current = {
        location: locationChanged ? next : location,
        entry: entryChanged ? { key, index } : entry,
        length,
        action,
      };
    }
    return this.current;
  }

  /**
   * Navigate to an app-root-relative path or a browser-owned URL.
   */
  navigate(to: string, options?: AppNavigateOptions): void;
  navigate(delta: number): void;
  navigate(to: string | number, options?: AppNavigateOptions): void {
    if (this.notificationDepth >= MAX_NESTED_NAVIGATIONS) {
      throw new Error(
        `App history exceeded ${MAX_NESTED_NAVIGATIONS} synchronous nested navigations. A history subscriber may be causing a navigation loop.`,
      );
    }
    if (typeof to === 'number') {
      this.history.go(to);
      return;
    }
    const safeTo = resolveAppTarget(to, this.getSnapshot().location.pathname);
    if (isExternalTarget(safeTo)) {
      this.history.navigateExternal(safeTo, { replace: options?.replace });
      return;
    }
    const url = new URL(safeTo, 'http://localhost');
    const fullPath = this.basename + url.pathname + url.search + url.hash;
    const writeOptions = { state: options?.state };

    if (options?.replace) {
      this.history.replace(fullPath, writeOptions);
    } else {
      this.history.push(fullPath, writeOptions);
    }
    // Emit directly rather than relying on backend listen for push/replace.
    // popstate should only fire for real back/forward navigation.
    this.emit(options?.replace ? 'REPLACE' : 'PUSH');
  }

  /**
   * Resolve a path to a browser-ready href, prefixed with the app's deploy
   * basename.
   *
   * Paths must start with `/` and are relative to the app root;
   * a target with no pathname, such as `?tab=readme` or `#section`, stays at
   * the current location.
   *
   * A target with no pathname of its own is resolved against the location this
   * history is standing at *now*, so a caller that renders such an href has to
   * re-render when the location changes — first-party chrome does that by
   * subscribing through `useAppHistoryLocation`.
   *
   * External URLs pass through without the basename. Executable URL schemes
   * are replaced with `about:blank` and a warning, as in `navigate`.
   */
  createHref(to: string): string {
    const safeTo = resolveAppTarget(to, this.getSnapshot().location.pathname);
    if (isExternalTarget(safeTo)) {
      return safeTo;
    }
    const url = new URL(safeTo, 'http://localhost');
    return `${this.basename}${url.pathname}${url.search}${url.hash}`;
  }

  /** Stop listening to history changes and clear all subscribers. */
  dispose(): void {
    if (this.disposed) {
      return;
    }
    this.disposed = true;
    this.unlisten();
    this.subscribers.clear();
  }

  private readLocation(): AppLocation {
    const raw = this.history.getLocation();
    return {
      pathname: this.stripBasename(raw.pathname),
      search: raw.search,
      hash: raw.hash,
      // History API may return null; normalize to undefined for STYLE.
      state: raw.state ?? undefined,
    };
  }

  private stripBasename(pathname: string): string {
    if (
      this.basename &&
      (pathname === this.basename || pathname.startsWith(`${this.basename}/`))
    ) {
      return pathname.slice(this.basename.length) || '/';
    }
    return pathname;
  }

  private emit(action: AppHistoryAction): void {
    this.refresh(action);
    this.notificationDepth += 1;
    try {
      const handlers = [...this.subscribers];
      for (const handler of handlers) {
        handler();
      }
    } finally {
      this.notificationDepth -= 1;
    }
  }
}

/**
 * Creates an {@link AppHistory}, the sole writer to app history.
 *
 * The caller owns the returned instance. Creating one attaches a listener to
 * the history backend — a `popstate` listener on the window for the default
 * backend — which stays attached until `dispose()` is called, so repeated
 * creation without disposal accumulates listeners.
 *
 * @internal
 */
export function createAppHistory(options?: AppHistoryOptions): AppHistory {
  return AppHistory.create(options);
}
