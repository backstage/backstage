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
 * Ownership, fencing and startup recovery of managed AI namespaces.
 *
 * @remarks
 *
 * Private to the package: the lease is not an independently exposed plugin
 * capability, and the managed service wires it internally. Only the Knex
 * adapter is a production implementation; {@link createMemoryNamespaceLease}
 * is a deterministic-clock test seam, not persistence or fencing.
 *
 * @internal
 */

export type { NamespaceLease, PageOfNamespaces } from './types';
export {
  createKnexNamespaceLease,
  KnexNamespaceLease,
  type KnexNamespaceLeaseOptions,
} from './KnexNamespaceLease';
export { startLeaseKeepalive } from './keepalive';
export type {
  LeaseInvalidationReason,
  LeaseKeepalive,
  LeaseKeepaliveOptions,
} from './types';
export {
  createAiRecovery,
  type AiRecovery,
  type AiRecoveryOptions,
  type RecoveryOutcome,
  type RecoveryReport,
  type RecoveryResolution,
  type RecoveryResolver,
  type RecoveryResumeInput,
  type RecoveryStatus,
  type RecoveryStatusRecord,
  type SessionOrigin,
} from './recovery';
export {
  createManualClock,
  createMemoryNamespaceLease,
  type ManualClock,
  type MemoryLeaseRow,
  type MemoryNamespaceLease,
  type MemoryNamespaceLeaseOptions,
} from './testing';
