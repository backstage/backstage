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
  RoutingContract,
  FrameworkLocation,
  FrameworkNavigateOptions,
} from '@backstage/frontend-plugin-api';
import type { Observable, Subscription } from '@backstage/types';
import {
  createWindowHistoryBackend,
  type HistoryBackend,
} from './HistoryBackend';
import { createScopedContract } from './ScopedRouting';

type LocationHandler = (location: FrameworkLocation) => void;

/**
 * Options for constructing a {@link NavigationController}.
 *
 * @internal
 */
export interface NavigationControllerOptions {
  /** App basename prefix stripped from locations and prepended on navigate. */
  basename?: string;
  /**
   * History storage backend. Defaults to the window History API.
   * Tests should inject {@link createMemoryHistoryBackend}.
   */
  history?: HistoryBackend;
}

/**
 * NavigationController owns browser history (via a swappable backend) and
 * provides scoped RoutingContract instances to plugins.
 *
 * The location$ observable never signals error or complete — it represents
 * a continuous location stream that lives for the duration of the app.
 * Calling dispose() stops emissions but does not signal complete to observers.
 *
 * Prefer {@link createNavigationController} over constructing this class.
 *
 * @internal
 */
export class NavigationController {
  private readonly basename: string;
  private readonly history: HistoryBackend;
  private readonly subscribers: Set<LocationHandler> = new Set();
  private readonly unlisten: () => void;
  private disposed = false;

  /** @internal */
  static create(options?: NavigationControllerOptions): NavigationController {
    return new NavigationController(options);
  }

  private constructor(options?: NavigationControllerOptions) {
    this.basename = options?.basename ?? '';
    this.history = options?.history ?? createWindowHistoryBackend();

    this.unlisten = this.history.listen(() => {
      this.emit();
    });
  }

  /** Observable of the current location (basename-stripped). */
  readonly location$: Observable<FrameworkLocation> = {
    subscribe: (
      observerOrOnNext?:
        | { next?: (value: FrameworkLocation) => void }
        | ((value: FrameworkLocation) => void),
      _onError?: (error: Error) => void,
      _onComplete?: () => void,
    ): Subscription => {
      let isClosed = false;
      const onNext =
        typeof observerOrOnNext === 'function'
          ? observerOrOnNext
          : observerOrOnNext?.next?.bind(observerOrOnNext);

      const handler: LocationHandler = (loc: FrameworkLocation) => {
        if (!isClosed && onNext) {
          onNext(loc);
        }
      };

      this.subscribers.add(handler);

      // Emit current location immediately on subscribe
      handler(this.getCurrentLocation());

      return {
        unsubscribe: () => {
          isClosed = true;
          this.subscribers.delete(handler);
        },
        get closed() {
          return isClosed;
        },
      };
    },
    [Symbol.observable]() {
      return this;
    },
  };

  /**
   * Navigate to a path (relative to the app root, not basename).
   *
   * When a registered {@link RoutingBlocker} cancels the navigation, this
   * returns without touching history or emitting. When a blocker is pending
   * (async), the write — and the resulting emission — happen later, driven
   * by the history backend's `listen` notification (see
   * {@link HistoryBackend.push}).
   */
  navigate(to: string, options?: FrameworkNavigateOptions): void {
    if (to.startsWith('//') || to.includes('://')) {
      throw new Error(
        'NavigationController.navigate does not support absolute or protocol-relative URLs',
      );
    }
    const url = new URL(to, 'http://localhost');
    const fullPath = this.basename + url.pathname + url.search + url.hash;
    const writeOptions = {
      state: options?.state,
      adapterState: options?.adapterState,
      ignoreBlockers: options?.ignoreBlockers,
    };

    const performed = options?.replace
      ? this.history.replace(fullPath, writeOptions)
      : this.history.push(fullPath, writeOptions);

    if (performed) {
      // Emit directly rather than relying on backend listen for push/replace.
      // popstate / go() should only fire for real back/forward navigation.
      this.emit();
    }
  }

  /**
   * Register a pre-navigation blocker shared with chrome/framework
   * navigation and every scoped contract's {@link RoutingContract.block}.
   * Only runs for {@link navigate} push/replace — never for {@link go} or
   * browser back/forward. Returns an unblock function.
   *
   * Locations passed to `blocker` are basename-stripped, matching
   * {@link location$}.
   */
  block(blocker: RoutingBlocker): () => void {
    const basenameStrippedBlocker: RoutingBlocker = transition =>
      blocker({
        currentLocation: this.stripBasenameFromLocation(
          transition.currentLocation,
        ),
        nextLocation: this.stripBasenameFromLocation(transition.nextLocation),
        action: transition.action,
      });
    return this.history.block(basenameStrippedBlocker);
  }

  /**
   * Move forward or back in the history stack by `delta` entries.
   * Location updates are delivered via the history backend's listen path.
   */
  go(delta: number): void {
    this.history.go(delta);
  }

  canGoBack(): boolean {
    return this.history.canGoBack();
  }

  canGoForward(): boolean {
    return this.history.canGoForward();
  }

  get historyLength(): number {
    return this.history.length;
  }

  getAdapterState(adapterId: string): unknown {
    return this.history.getAdapterState(adapterId);
  }

  /**
   * Create a scoped RoutingContract for a plugin basePath.
   *
   * `basePath` must be a concrete URL prefix (e.g. `/catalog` or
   * `/catalog/default/component/foo`), never a parameterized pattern such as
   * `/catalog/:namespace/:kind/:name`. App route matching should pass the
   * concrete matched path from the route table.
   *
   * Pass `options.routePattern` (the registered page pattern) so the same
   * contract instance can project `basePath` across concrete prefixes under
   * that pattern without recreating scoped router adapters.
   *
   * Scope logic lives in {@link createScopedContract}; this controller only
   * supplies history-backed host callbacks.
   */
  createContract(
    basePath: string,
    options?: { routePattern?: string },
  ): RoutingContract {
    const getHistoryLength = () => this.historyLength;
    return createScopedContract(
      {
        getLocation: () => this.getCurrentLocation(),
        navigate: (to, opts) => this.navigate(to, opts),
        go: delta => this.go(delta),
        canGoBack: () => this.canGoBack(),
        canGoForward: () => this.canGoForward(),
        get historyLength() {
          return getHistoryLength();
        },
        getAdapterState: adapterId => this.getAdapterState(adapterId),
        addSubscriber: h => this.subscribers.add(h),
        removeSubscriber: h => this.subscribers.delete(h),
        block: blocker => this.block(blocker),
      },
      basePath,
      options,
    );
  }

  /** Stop listening to history changes and clear all subscribers. */
  dispose(): void {
    if (this.disposed) {
      return;
    }
    this.disposed = true;
    this.unlisten();
    this.history.dispose();
    this.subscribers.clear();
  }

  private getCurrentLocation(): FrameworkLocation {
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

  private stripBasenameFromLocation(
    location: FrameworkLocation,
  ): FrameworkLocation {
    return { ...location, pathname: this.stripBasename(location.pathname) };
  }

  private emit(): void {
    const location = this.getCurrentLocation();
    const handlers = [...this.subscribers];
    for (const handler of handlers) {
      handler(location);
    }
  }
}

/**
 * Creates a {@link NavigationController}, the sole writer to app history.
 *
 * @internal
 */
export function createNavigationController(
  options?: NavigationControllerOptions,
): NavigationController {
  return NavigationController.create(options);
}
