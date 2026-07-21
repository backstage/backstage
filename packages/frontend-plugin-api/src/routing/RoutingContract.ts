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

import { Observable } from '@backstage/types';

/** @public */
export interface FrameworkLocation {
  pathname: string;
  search: string;
  hash: string;
  /**
   * User-visible navigation state for this location.
   *
   * Adapter metadata must not appear here — use
   * {@link FrameworkNavigateOptions.adapterState} when writing and
   * {@link RoutingContract.getAdapterState} when reading.
   */
  state: unknown;
}

/**
 * Options for framework and contract navigation.
 *
 * @public
 */
export interface FrameworkNavigateOptions {
  replace?: boolean;
  /** User-visible navigation state (exposed on {@link FrameworkLocation.state}). */
  state?: unknown;
  /**
   * Namespaced adapter metadata keyed by adapter id (e.g. `tanstack-router`).
   * Stored on the history entry separately from {@link FrameworkLocation.state}.
   *
   * @remarks
   * Adapter/chrome support — not required for ordinary plugin navigation.
   */
  adapterState?: Record<string, unknown>;
  /**
   * Bypass registered {@link RoutingBlocker}s for this navigation only.
   * Mirrors TanStack Router's `ignoreBlocker` navigate option.
   *
   * @internal
   */
  ignoreBlockers?: boolean;
}

/**
 * History action that can be cancelled by a {@link RoutingBlocker}.
 * Matches TanStack `createHistory`: blockers run for push/replace only.
 *
 * @public
 */
export type RoutingBlockerAction = 'PUSH' | 'REPLACE';

/**
 * Pending navigation presented to a {@link RoutingBlocker}.
 *
 * @public
 */
export interface RoutingBlockerTransition {
  currentLocation: FrameworkLocation;
  nextLocation: FrameworkLocation;
  action: RoutingBlockerAction;
}

/**
 * Pre-navigation blocker for framework and adapter push/replace.
 *
 * Return `true` (or a promise of `true`) to cancel the navigation. Blockers
 * never run for {@link RoutingContract.go} or browser back/forward.
 *
 * @public
 */
export type RoutingBlocker = (
  transition: RoutingBlockerTransition,
) => boolean | Promise<boolean>;

/**
 * A scoped routing surface for a plugin page (or subpage).
 *
 * @remarks
 *
 * The core triad for plugin authors is {@link RoutingContract.basePath},
 * {@link RoutingContract.location$}, and {@link RoutingContract.navigate}.
 * Additional members (`routePattern`, `go`, `canGoBack` / `canGoForward`,
 * `historyLength`, `getAdapterState`, `block`) support page-router adapters
 * and app chrome; they are not required for ordinary in-plugin navigation.
 *
 * @public
 */
export interface RoutingContract {
  /**
   * Concrete URL prefix for this contract's scope (e.g. `/catalog` or
   * `/catalog/default/component/foo`). Must not be a parameterized pattern.
   *
   * For contracts created with a dynamic {@link RoutingContract.routePattern},
   * this value is projected from the current location and may change when
   * navigating between concrete prefixes under the same pattern (e.g. entity
   * A → entity B) without replacing the contract instance.
   */
  readonly basePath: string;
  /**
   * Registered route pattern this contract is keyed by (e.g. `/catalog` or
   * `/catalog/:namespace/:kind/:name`). Equals the initial concrete
   * {@link RoutingContract.basePath} for static mounts.
   *
   * Optional for hand-rolled / mock contracts; framework-minted contracts
   * always set this.
   *
   * @remarks
   * Adapter/chrome support for stable contract identity across dynamic
   * prefixes — not part of the core plugin navigation triad.
   */
  readonly routePattern?: string;
  /**
   * Observable stream of the current location within this contract's scope.
   *
   * **Invariant:** Implementations MUST emit synchronously upon subscription,
   * even when the browser location is currently outside this contract's
   * `basePath`. When out of scope, emit the last in-scope location if one
   * exists; otherwise emit an empty sentinel with `pathname: '/'`, empty
   * `search`/`hash`, and no state. Router adapters and
   * `useObservableAsState`-style hooks depend on this sync emission to avoid
   * a missing initial value. Subsequent out-of-scope location changes need
   * not emit again until the location re-enters scope.
   *
   * Emitted locations expose only the user state slice — never adapter
   * namespaces.
   */
  readonly location$: Observable<FrameworkLocation>;
  navigate(to: string, options?: FrameworkNavigateOptions): void;
  /**
   * Move forward or back in the app history stack by `delta` entries
   * (same semantics as `history.go`).
   *
   * @remarks
   * Adapter/chrome support — not part of the core plugin navigation triad.
   */
  go(delta: number): void;
  /**
   * Whether the history stack can move back from the current entry.
   *
   * @remarks
   * Adapter/chrome support — not part of the core plugin navigation triad.
   */
  canGoBack(): boolean;
  /**
   * Whether the history stack can move forward from the current entry.
   *
   * @remarks
   * Adapter/chrome support — not part of the core plugin navigation triad.
   */
  canGoForward(): boolean;
  /**
   * Number of entries in the session history stack.
   *
   * @remarks
   * Adapter/chrome support — not part of the core plugin navigation triad.
   */
  readonly historyLength: number;
  /**
   * Read namespaced adapter metadata for the current history entry.
   * Returns `undefined` when the adapter has not stored state on this entry.
   *
   * @remarks
   * Adapter/chrome support — not part of the core plugin navigation triad.
   */
  getAdapterState(adapterId: string): unknown;
  /**
   * Register a pre-navigation blocker shared with chrome/framework
   * {@link NavigationControllerApi.navigate} and every page adapter.
   * Only runs for push/replace — never for {@link RoutingContract.go} or browser
   * back/forward. Returns an unblock function.
   *
   * @remarks
   * Adapter/chrome support — not part of the core plugin navigation triad.
   * HistoryBackend blockers are an intentional shared policy seam.
   */
  block(blocker: RoutingBlocker): () => void;
}
