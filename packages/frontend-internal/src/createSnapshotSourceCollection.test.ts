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

import { SnapshotSource } from '@backstage/types/alpha';
import { createSnapshotSourceCollection } from './createSnapshotSourceCollection';

it('caches collection snapshots, shares subscriptions, closes read/subscribe gaps, and cleans up', () => {
  let value = 'Initial';
  const callbacks = new Set<() => void>();
  const stop = jest.fn();
  const subscribe = jest.fn((callback: () => void) => {
    value = 'Changed before subscribing';
    callbacks.add(callback);
    return () => {
      callbacks.delete(callback);
      stop();
    };
  });
  const source: SnapshotSource<string> = {
    getSnapshot: () => value,
    subscribe,
  };
  const middle: SnapshotSource<string> = {
    getSnapshot: () => 'Middle',
    subscribe: () => () => {},
  };
  const collection = createSnapshotSourceCollection([source, middle, source]);
  const initial = collection.getSnapshot();
  expect(collection.getSnapshot()).toBe(initial);
  expect(subscribe).not.toHaveBeenCalled();
  const onChange = jest.fn();
  const unsubscribe = collection.subscribe(onChange);
  const unsubscribeAgain = collection.subscribe(onChange);
  expect(subscribe).toHaveBeenCalledTimes(1);
  expect(collection.getSnapshot()).toEqual([
    'Changed before subscribing',
    'Middle',
    'Changed before subscribing',
  ]);
  const snapshot = collection.getSnapshot();
  callbacks.forEach(callback => callback());
  expect(collection.getSnapshot()).toBe(snapshot);
  expect(onChange).toHaveBeenCalledTimes(1);
  value = 'Next';
  callbacks.forEach(callback => callback());
  expect(onChange).toHaveBeenCalledTimes(3);
  expect(collection.getSnapshot()).not.toBe(snapshot);
  expect(collection.getSnapshot()).toEqual(['Next', 'Middle', 'Next']);
  unsubscribe();
  unsubscribe();
  expect(stop).not.toHaveBeenCalled();
  unsubscribeAgain();
  expect(stop).toHaveBeenCalledTimes(1);
  expect(callbacks.size).toBe(0);
});
