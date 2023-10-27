/*
 * Copyright 2023 The Backstage Authors
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
import { DependencyList, useEffect, useState } from 'react';

/**
 * Subscribe to an observable and return the latest value from it.
 *
 * @remarks
 *
 * This implementation differs in a few important ways from the plain
 * useObservable from the react-use library. That hook does not support a
 * dependencies array, and also it only subscribes once to the initially passed
 * in observable and won't properly react when either initial value or the
 * actual observable changes.
 *
 * This hook will ensure to resubscribe and reconsider the initial value,
 * whenever the dependencies change.
 */
export function useUpdatingObservable<T>(
  value: T,
  observable: Observable<T> | undefined,
  deps: DependencyList,
): T {
  const [snapshot, setSnapshot] = useState(value);

  useEffect(() => {
    setSnapshot(value);

    const subscription = observable?.subscribe({
      next: updatedValue => {
        setSnapshot(updatedValue);
      },
      complete: () => {
        subscription?.unsubscribe();
      },
    });

    return () => {
      subscription?.unsubscribe();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return snapshot;
}
