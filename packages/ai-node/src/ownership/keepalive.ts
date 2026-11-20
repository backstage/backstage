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

import type { Fence } from '../contracts';
import type {
  LeaseInvalidationReason,
  LeaseKeepalive,
  LeaseKeepaliveOptions,
  NamespaceLease,
} from './types';

/**
 * Keeps one fence alive by renewing it on a fixed cadence.
 *
 * @remarks
 *
 * A rejected renewal (the lease was taken over or expired) or a failed
 * renewal (the outcome is unknown, so the fence must not be trusted) invalidates
 * this generation exactly once and notifies the subscriber. That subscriber is
 * what the managed service uses to invalidate all local handles, abort
 * in-flight work and drain; this module provides the mechanism, not the wiring.
 *
 * Renewals never overlap: a tick is skipped while the previous renewal is
 * still in flight, so a slow database cannot pile up renewals.
 *
 * @internal
 */
export function startLeaseKeepalive(
  lease: NamespaceLease,
  fence: Fence,
  options: LeaseKeepaliveOptions,
): LeaseKeepalive {
  const { intervalMs, onInvalidated } = options;
  if (!Number.isSafeInteger(intervalMs) || intervalMs <= 0) {
    throw new Error('Lease keepalive interval must be positive milliseconds');
  }

  let invalidated = false;
  let stopped = false;
  let inFlight: Promise<void> | undefined;
  const state = {
    timer: undefined as ReturnType<typeof setInterval> | undefined,
  };

  const invalidate = (reason: LeaseInvalidationReason) => {
    if (invalidated) return;
    invalidated = true;
    if (state.timer !== undefined) clearInterval(state.timer);
    try {
      onInvalidated(reason);
    } catch {
      /* A failing subscriber must not keep renewals silently alive. */
    }
  };

  const tick = () => {
    if (stopped || invalidated || inFlight) return;
    inFlight = (async () => {
      try {
        const renewed = await lease.renew(fence);
        if (!renewed && !stopped) invalidate('renewal-rejected');
      } catch {
        if (!stopped) invalidate('renewal-error');
      } finally {
        inFlight = undefined;
      }
    })();
  };

  state.timer = setInterval(tick, intervalMs);
  state.timer.unref?.();

  return {
    get invalidated() {
      return invalidated;
    },
    async stop() {
      stopped = true;
      if (state.timer !== undefined) clearInterval(state.timer);
      await inFlight;
    },
  };
}
