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
import type {
  FrameworkLocation,
  FrameworkNavigateOptions,
} from './FrameworkLocation';

/**
 * A thin facade over the app's browser history, shared by every plugin and
 * app chrome. This is the sole writer to `window.history`.
 *
 * The public navigation surface mirrors the `navigate` + `useHref` pattern
 * used by libraries like react-aria: {@link AppHistoryApi.navigate} performs
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
   * Throws for targets that are not app-relative — absolute
   * (`https://example.com/x`), protocol-relative (`//example.com/x`), and
   * opaque schemes such as `mailto:` and `tel:`. Navigation is an explicit
   * action with a single correct answer, so a wrong target is a bug worth
   * surfacing. {@link AppHistoryApi.createHref} passes the same targets
   * through instead.
   */
  navigate(path: string, options?: FrameworkNavigateOptions): void;
  /**
   * The current location (basename-stripped, app-relative).
   *
   * The reference only changes when the location changes, so this can be read
   * directly as the snapshot for `useSyncExternalStore` and compared by
   * identity.
   */
  readonly location: FrameworkLocation;
  /** Observable of the current location (basename-stripped, app-relative). */
  readonly location$: Observable<FrameworkLocation>;
  /**
   * Resolve an app-relative path to a browser-ready href, including the app's
   * deploy basename.
   *
   * Targets that are not app-relative — absolute (`https://example.com/x`),
   * protocol-relative (`//example.com/x`), and opaque schemes such as
   * `mailto:` and `tel:` — are returned unchanged. Prefixing them would
   * silently produce a broken internal link, and throwing is not an option
   * either: hrefs are resolved during render, where an error takes out the
   * whole tree. So `<a href={useHref(props.url)}>` is safe for a possibly
   * external URL. Use {@link AppHistoryApi.navigate} when a target must be
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
