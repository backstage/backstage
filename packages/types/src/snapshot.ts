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
 * A synchronously readable snapshot with change notifications.
 *
 * Snapshots must be immutable and retain their identity while unchanged. A source
 * publishes the new snapshot before notifying listeners. Both functions must have
 * stable identities and work when passed without a receiver, allowing direct use
 * with React's `useSyncExternalStore`.
 *
 * Sources own their update, loading, and error policies. Consumers only read and
 * subscribe; no asynchronous work or subscriptions should start during a read.
 *
 * @alpha
 */
export interface SnapshotSource<T> {
  /** Returns the current snapshot, without side effects. */
  readonly getSnapshot: () => T;

  /**
   * Notifies after the snapshot changes. Supports independent listeners and returns
   * an idempotent function that removes this subscription.
   */
  readonly subscribe: (onChange: () => void) => () => void;
}
