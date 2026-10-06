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
import type { Observable } from '@backstage/types';
import type { AppLocation, AppNavigateOptions } from './AppLocation';

/**
 * The app's shared navigation and location interface, used by plugins and
 * app chrome. The default implementation owns browser history; apps can provide
 * a custom implementation through an API factory.
 *
 * The public navigation surface mirrors the `navigate` + `useHref` pattern
 * used by libraries like react-aria: `AppHistoryApi.navigate` performs
 * navigation, and {@link AppHistoryApi.createHref} (paired with the public
 * {@link useHref} hook) resolves an app-relative path to a browser-ready
 * href (including the app's deploy basename).
 *
 * @public
 */
export interface AppHistoryApi {
  /**
   * Navigate to an app-relative path or an external URL.
   *
   * Absolute URLs (including same-origin URLs), protocol-relative URLs, and
   * schemes such as `mailto:` are handled by the browser. The `replace`
   * option replaces the browser history entry; `state` is only used for
   * app-relative navigation. Executable URL schemes are replaced with
   * `about:blank` and a warning.
   *
   * Implementations used with the TanStack page adapter must expose the new
   * `location` synchronously when an app-relative push or replace completes.
   * Numeric history traversal may complete asynchronously and is observed
   * through `location$`. External navigation does not synchronously update
   * the app location.
   */
  navigate(path: string, options?: AppNavigateOptions): void;
  /** Traverse a relative number of history entries. */
  navigate(delta: number): void;
  /**
   * The current location (basename-stripped, app-relative).
   *
   * The reference only changes when the location changes, so this can be read
   * directly as the snapshot for `useSyncExternalStore` and compared by
   * identity.
   */
  readonly location: AppLocation;
  /** Observable of the current location (basename-stripped, app-relative). */
  readonly location$: Observable<AppLocation>;
  /**
   * Resolve a path to a browser-ready href, including the app's deploy
   * basename.
   *
   * Executable URL schemes are replaced with `about:blank` and a warning.
   *
   * Paths resolve against the app root. Use {@link useHref} for targets
   * relative to the current page: it resolves the matched route ancestry
   * before calling this method. A target with no pathname of its own, such
   * as `?tab=readme` or `#section`, stays at the current location.
   *
   * Absolute URLs, protocol-relative URLs, and schemes such as `mailto:`
   * and `tel:` pass through without the basename, after sanitization.
   *
   * Only the path portion is inspected, so `/search?query=https://example.com`
   * is an ordinary app-relative target.
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
