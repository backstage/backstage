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

import { useState, useCallback, useRef, useSyncExternalStore } from 'react';
import type { Observable } from '@backstage/types';

const UNSET = Symbol('useObservableAsState.unset');

/**
 * Subscribes to a Backstage Observable and returns the latest value as React state.
 *
 * The observable MUST emit synchronously on subscribe (which
 * `AppHistoryApi.location$` does).
 *
 * @internal
 */
export function useObservableAsState<T>(
  observable$: Observable<T>,
  isEqual: (a: T, b: T) => boolean = Object.is,
): T {
  const [initialValue] = useState(() => {
    let initial: T | typeof UNSET = UNSET;
    const sub = observable$.subscribe(val => {
      initial = val;
    });
    sub.unsubscribe();
    if (initial === UNSET) {
      throw new Error(
        'useObservableAsState requires an observable that emits synchronously on subscribe',
      );
    }
    return initial as T;
  });

  const valueRef = useRef<T>(initialValue);

  const subscribe = useCallback(
    (onStoreChange: () => void) => {
      const sub = observable$.subscribe(val => {
        if (!isEqual(valueRef.current, val)) {
          valueRef.current = val;
          onStoreChange();
        }
      });
      return () => sub.unsubscribe();
    },
    [observable$, isEqual],
  );

  const getSnapshot = useCallback(() => valueRef.current, []);

  return useSyncExternalStore(subscribe, getSnapshot);
}

/**
 * Default equality check for FrameworkLocation-shaped objects.
 * @internal
 */
export function frameworkLocationEqual(
  a: { pathname: string; search: string; hash: string; state?: unknown },
  b: { pathname: string; search: string; hash: string; state?: unknown },
): boolean {
  return (
    a.pathname === b.pathname &&
    a.search === b.search &&
    a.hash === b.hash &&
    Object.is(a.state, b.state)
  );
}
