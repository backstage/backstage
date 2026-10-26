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

import { SnapshotSource } from '@backstage/types';

/**
 * Aggregates the sources of a stable extension collection into one cached snapshot.
 * Shared by page and navigation consumers so hooks are never called inside loops.
 * @internal
 */
export function createSnapshotSourceCollection<TKey, TValue>(
  sources: ReadonlyMap<TKey, SnapshotSource<TValue>>,
): SnapshotSource<ReadonlyMap<TKey, TValue>> {
  let snapshot: ReadonlyMap<TKey, TValue> = new Map(
    Array.from(sources, ([key, source]) => [key, source.getSnapshot()]),
  );
  const listeners = new Set<() => void>();
  let disconnect: (() => void) | undefined;

  const connect = () => {
    let active = true;
    const update = () => {
      if (!active) return;
      const next = new Map(
        Array.from(sources, ([key, source]) => [key, source.getSnapshot()]),
      );
      if (
        Array.from(next).some(
          ([key, value]) => !Object.is(value, snapshot.get(key)),
        )
      ) {
        snapshot = next;
        listeners.forEach(listener => listener());
      }
    };
    const stops = Array.from(new Set(sources.values()), source =>
      source.subscribe(update),
    );
    update();
    return () => {
      active = false;
      stops.forEach(stop => stop());
    };
  };

  return {
    getSnapshot: () => snapshot,
    subscribe: onChange => {
      const listener = () => onChange();
      listeners.add(listener);
      if (listeners.size === 1) disconnect = connect();
      return () => {
        if (listeners.delete(listener) && listeners.size === 0) {
          disconnect?.();
          disconnect = undefined;
        }
      };
    },
  };
}
