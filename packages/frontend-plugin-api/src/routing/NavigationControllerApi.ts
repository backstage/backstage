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
  RoutingBlocker,
  RoutingContract,
  FrameworkLocation,
  FrameworkNavigateOptions,
} from './RoutingContract';

/**
 * Options for {@link NavigationControllerApi.createContract}.
 *
 * @public
 */
export interface CreateContractOptions {
  /**
   * Registered route pattern for this contract (e.g.
   * `/catalog/:namespace/:kind/:name`). When it contains dynamic segments,
   * {@link RoutingContract.basePath} projects from the current location so
   * the same contract instance stays valid across concrete prefix changes.
   *
   * Defaults to `basePath` (static mount).
   */
  routePattern?: string;
}

/** @public */
export interface NavigationControllerApi {
  navigate(path: string, options?: FrameworkNavigateOptions): void;
  /**
   * Move forward or back in the history stack by `delta` entries
   * (same semantics as `history.go`).
   *
   * @remarks
   * Adapter/chrome support — ordinary plugin code should prefer scoped
   * {@link RoutingContract.navigate}.
   */
  go(delta: number): void;
  /**
   * Whether the history stack can move back from the current entry.
   *
   * @remarks
   * Adapter/chrome support.
   */
  canGoBack(): boolean;
  /**
   * Whether the history stack can move forward from the current entry.
   *
   * @remarks
   * Adapter/chrome support.
   */
  canGoForward(): boolean;
  /**
   * Number of entries in the session history stack.
   *
   * @remarks
   * Adapter/chrome support.
   */
  readonly historyLength: number;
  /**
   * Read namespaced adapter metadata for the current history entry.
   * Returns `undefined` when the adapter has not stored state on this entry.
   *
   * @remarks
   * Adapter/chrome support.
   */
  getAdapterState(adapterId: string): unknown;
  readonly location$: Observable<FrameworkLocation>;
  /**
   * Register a pre-navigation blocker shared with every adapter's
   * {@link RoutingContract.block}. Only runs for {@link NavigationControllerApi.navigate}
   * push/replace — never for {@link NavigationControllerApi.go} or browser back/forward. Returns
   * an unblock function.
   *
   * @remarks
   * Intentional HistoryBackend policy seam shared by chrome and adapters.
   */
  block(blocker: RoutingBlocker): () => void;
  /**
   * Create a scoped routing contract for a concrete URL prefix.
   *
   * `basePath` must be a concrete matched path (e.g. `/catalog` or
   * `/catalog/default/component/foo`), not a parameterized pattern.
   *
   * When `options.routePattern` includes dynamic segments, the returned
   * contract keeps a stable identity while {@link RoutingContract.basePath}
   * projects to the concrete prefix for the current location. Use the
   * registered page pattern (e.g. `/catalog/:namespace/:kind/:name`) so
   * entity-style navigations do not dispose scoped router adapters.
   */
  createContract(
    basePath: string,
    options?: CreateContractOptions,
  ): RoutingContract;
}

/**
 * The `ApiRef` of {@link NavigationControllerApi}.
 *
 * @public
 */
export const navigationControllerApiRef =
  createApiRef<NavigationControllerApi>().with({
    id: 'core.navigation-controller',
    pluginId: 'app',
  });
