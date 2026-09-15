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

import { createApiRef } from '../apis';
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
   * Navigate to an app-relative path.
   *
   * A path throws when it is not app-relative — absolute
   * (`https://example.com/x`), protocol-relative (`//example.com/x`), and
   * opaque schemes such as `mailto:` and `tel:`. Navigation is an explicit
   * action with a single correct answer, so a wrong target is a bug worth
   * surfacing. {@link AppHistoryApi.createHref} passes the same targets
   * through instead.
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
   * Paths resolve against the app root. Use {@link useHref} for targets
   * relative to the current page: it resolves the matched route ancestry
   * before calling this method. A target with no pathname of its own, such
   * as `?tab=readme` or `#section`, stays at the current location.
   *
   * Targets that are not app-relative — absolute (`https://example.com/x`),
   * protocol-relative (`//example.com/x`), and opaque schemes such as
   * `mailto:` and `tel:` — are returned unchanged. Prefixing them would
   * silently produce a broken internal link, and throwing is not an option
   * either: hrefs are resolved during render, where an error takes out the
   * whole tree. So `<a href={useHref(props.url)}>` is safe for a possibly
   * external URL. Use `AppHistoryApi.navigate` when a target must be
   * app-relative — it throws for these instead.
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
