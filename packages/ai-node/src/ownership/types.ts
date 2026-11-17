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

import type { Fence, Namespace } from '../contracts';

/**
 * One page of namespaces owned by a plugin.
 *
 * @internal
 */
export interface PageOfNamespaces {
  readonly namespaces: readonly Namespace[];
  /** Opaque cursor for the next page; absent at the end of the enumeration. */
  readonly next?: string;
}

/**
 * The exclusive, database-arbitrated ownership of managed AI namespaces.
 *
 * @remarks
 *
 * This is the internal seam from the module design: production uses the Knex
 * adapter on the `ai_namespace_leases` table, tests may inject a deterministic
 * clock adapter. The lease is not an independently exposed plugin capability.
 *
 * @internal
 */
export interface NamespaceLease {
  /**
   * Acquires the namespace, or returns `undefined` when another live lease
   * holds it. A live lease held by the same owner is extended and its current
   * token returned, so an owner never races itself.
   */
  acquire(namespace: Namespace, owner: string): Promise<Fence | undefined>;
  /** Extends the lease if it is still the current, unexpired generation. */
  renew(fence: Fence): Promise<boolean>;
  /**
   * Expires the lease if `fence` is still the current generation. A stale
   * release never affects a successor's lease, and a lease row is never
   * deleted, so the token can never restart.
   */
  release(fence: Fence): Promise<void>;
  /**
   * Enumerates every namespace of a plugin, oldest key first, including
   * released and expired ones, so a recovering replica can eventually examine
   * all of them. Enumeration is keyset-paginated and stable while other
   * replicas acquire normally.
   */
  enumerate(pluginId: string, cursor?: string): Promise<PageOfNamespaces>;
}

/** Why a local fence stopped being trusted. */
export type LeaseInvalidationReason = 'renewal-rejected' | 'renewal-error';

/**
 * A running keepalive for one fence.
 *
 * @internal
 */
export interface LeaseKeepalive {
  /** Whether this generation was invalidated; every later outcome is final. */
  readonly invalidated: boolean;
  /** Stops renewing. Does not release the lease. Idempotent. */
  stop(): Promise<void>;
}

/**
 * Options for {@link startLeaseKeepalive}.
 *
 * @internal
 */
export type LeaseKeepaliveOptions = Readonly<{
  /** Renewal cadence; must be shorter than the lease lifetime. */
  readonly intervalMs: number;
  /**
   * Invoked exactly once when this fence stops being trusted: a rejected
   * renewal, a failed renewal, or a failed check. The subscriber must
   * invalidate all local handles, abort in-flight work and drain.
   */
  readonly onInvalidated: (reason: LeaseInvalidationReason) => void;
}>;
