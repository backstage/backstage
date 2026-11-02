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

import { createApiRef } from '../apis/system';
import type { AppLocation, AppNavigateOptions } from './AppLocation';

/** The operation that selected or updated a history entry. @public */
export type AppHistoryAction = 'PUSH' | 'REPLACE' | 'POP';

/** The current entry within the history range tracked by the host. @public */
export interface AppHistoryEntry {
  /** Opaque entry identity: new on push, preserved on replace and traversal. */
  readonly key: string;
  /**
   * Zero-based position within the tracked history range, when known.
   * Indices remain comparable across traversals so their difference represents
   * traversal distance.
   */
  readonly index?: number;
}

/** An immutable snapshot of the app's committed history state. @public */
export interface AppHistorySnapshot {
  /** App location. Retains its identity when only history metadata changes. */
  readonly location: AppLocation;
  /**
   * How the current entry was selected or updated. POP includes all history
   * traversals. Omitted initially or when the operation is unknown.
   */
  readonly action?: AppHistoryAction;
  /** Current history entry, when its identity is available. */
  readonly entry?: AppHistoryEntry;
  /**
   * Number of entries in the host's tracked history range, when known.
   * Uses the same range as entry.index, which need not cover the browser's
   * entire session history.
   */
  readonly length?: number;
}

/**
 * The app's shared navigation and location interface, used by plugins and
 * app chrome. The default implementation owns browser history; apps can provide
 * a custom implementation through an API factory.
 *
 * The public navigation surface mirrors the `navigate` + `useHref` pattern
 * used by libraries like react-aria: `AppHistoryApi.navigate` performs
 * navigation, and {@link AppHistoryApi.createHref} (paired with the public
 * {@link useAppHref} hook) resolves an app-absolute path (starting at `/`,
 * without the deployment basename) to a browser-ready href.
 *
 * @public
 */
export interface AppHistoryApi {
  /**
   * Navigate to an app-absolute path or an external URL.
   *
   * Path targets must start with `/` and exclude the deployment basename.
   * Empty, query-only, and hash-only targets use the current pathname.
   * An empty target clears query and hash. Path-relative
   * targets, including `.` and `..`, are rejected; use a page routing adapter
   * for library-relative navigation.
   *
   * Absolute URLs (including same-origin URLs), protocol-relative URLs, and
   * schemes such as `mailto:` are handled by the browser. The `replace`
   * option replaces the browser history entry; `state` is only used for
   * app-absolute path navigation. Executable URL schemes are replaced with
   * `about:blank` and a warning.
   *
   * Successful app-absolute pushes and replacements update getSnapshot()
   * and notify subscribers synchronously before returning.
   * Numeric history traversal may complete asynchronously and is observed
   * through `subscribe`. External navigation does not synchronously update
   * the app location.
   */
  navigate(path: string, options?: AppNavigateOptions): void;
  /** Traverse a relative number of history entries. */
  navigate(delta: number): void;
  /**
   * Reads the current immutable history snapshot without writing history.
   *
   * Returns the same object until history changes. Each committed navigation
   * publishes a new snapshot, even when its URL and state are unchanged.
   * The nested location retains its identity while its fields are unchanged.
   *
   * This function has a stable identity and can be called without binding it
   * to the API instance, including as useSyncExternalStore's getSnapshot.
   */
  getSnapshot(): AppHistorySnapshot;
  /**
   * Subscribes to history changes. The snapshot is updated before listeners
   * are called. Successful internal pushes and replacements notify
   * synchronously before navigate returns; traversals may finish asynchronously.
   *
   * Subscribing does not invoke the listener immediately. Read getSnapshot
   * for the current value. Returns an idempotent unsubscribe function.
   *
   * This function has a stable identity and can be called without binding it
   * to the API instance, including as useSyncExternalStore's subscribe.
   */
  subscribe(listener: () => void): () => void;
  /**
   * Resolve a path to a browser-ready href, including the app's deploy
   * basename.
   *
   * Executable URL schemes are replaced with `about:blank` and a warning.
   *
   * Paths must start with `/` and exclude the deployment basename. Relative
   * paths are rejected. Empty, query-only, and hash-only targets, such as `?tab=readme`
   * or `#section`, use the current pathname.
   *
   * Absolute URLs, protocol-relative URLs, and schemes such as `mailto:`
   * and `tel:` pass through without the basename, after sanitization.
   *
   * Only the path portion is inspected, so `/search?query=https://example.com`
   * is an ordinary app-absolute target.
   */
  createHref(to: string): string;
}

/**
 * The `ApiRef` of {@link AppHistoryApi}.
 *
 * @public
 */
export const appHistoryApiRef = createApiRef<AppHistoryApi>().with({
  id: 'core.app-history',
  pluginId: 'app',
});
