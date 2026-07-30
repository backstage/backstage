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
  /** Navigate to an app-relative path. */
  navigate(path: string, options?: FrameworkNavigateOptions): void;
  /** Observable of the current location (basename-stripped, app-relative). */
  readonly location$: Observable<FrameworkLocation>;
  /** Resolve an app-relative path to a browser-ready href. */
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
