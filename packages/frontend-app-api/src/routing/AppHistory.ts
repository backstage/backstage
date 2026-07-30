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
  FrameworkNavigateOptions,
} from '@backstage/frontend-plugin-api';
import type { Observable, Subscription } from '@backstage/types';
import {
  createWindowHistoryBackend,
  type HistoryBackend,
} from './HistoryBackend';

type LocationHandler = (location: FrameworkLocation) => void;

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
 * The location$ observable never signals error or complete — it represents
 * a continuous location stream that lives for the duration of the app.
 * Calling dispose() stops emissions but does not signal complete to observers.
 *
 * Prefer {@link createAppHistory} over constructing this class.
 *
 * @internal
 */
export class AppHistory implements AppHistoryApi {
  private readonly basename: string;
  private readonly history: HistoryBackend;
  private readonly subscribers: Set<LocationHandler> = new Set();
  private readonly unlisten: () => void;
  private disposed = false;

  /** @internal */
  static create(options?: AppHistoryOptions): AppHistory {
    return new AppHistory(options);
  }

  private constructor(options?: AppHistoryOptions) {
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
   */
  navigate(to: string, options?: FrameworkNavigateOptions): void {
    if (to.startsWith('//') || to.includes('://')) {
      throw new Error(
        'AppHistory.navigate does not support absolute or protocol-relative URLs',
      );
    }
    const url = new URL(to, 'http://localhost');
    const fullPath = this.basename + url.pathname + url.search + url.hash;
    const writeOptions = { state: options?.state };

    if (options?.replace) {
      this.history.replace(fullPath, writeOptions);
    } else {
      this.history.push(fullPath, writeOptions);
    }
    // Emit directly rather than relying on backend listen for push/replace.
    // popstate should only fire for real back/forward navigation.
    this.emit();
  }

  /** Resolve an app-relative path to a browser-ready href. */
  createHref(to: string): string {
    const url = new URL(to, 'http://localhost');
    return `${this.basename}${url.pathname}${url.search}${url.hash}`;
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

  private emit(): void {
    const location = this.getCurrentLocation();
    const handlers = [...this.subscribers];
    for (const handler of handlers) {
      handler(location);
    }
  }
}

/**
 * Creates an {@link AppHistory}, the sole writer to app history.
 *
 * @internal
 */
export function createAppHistory(options?: AppHistoryOptions): AppHistory {
  return AppHistory.create(options);
}
