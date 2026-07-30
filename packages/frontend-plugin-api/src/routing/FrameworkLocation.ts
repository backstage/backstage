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

/**
 * A location within the app, as seen by framework navigation.
 *
 * @public
 */
export interface FrameworkLocation {
  pathname: string;
  search: string;
  hash: string;
  /** User-visible navigation state for this location. */
  state: unknown;
}

/**
 * Options for framework navigation.
 *
 * @public
 */
export interface FrameworkNavigateOptions {
  replace?: boolean;
  /** User-visible navigation state (exposed on {@link FrameworkLocation.state}). */
  state?: unknown;
}
