/*
 * Copyright 2021 The Backstage Authors
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

import { createContext, useContext, Context } from 'react';
import { getGlobalSingleton } from './globalObject';
import { createVersionedValueMap, VersionedValue } from './VersionedValue';

/**
 * A hook that simplifies the consumption of a versioned contexts that's
 * stored inside a global singleton.
 *
 * @example
 *
 * ```ts
 * const versionedHolder = useVersionedContext<{ 1: string }>('my-context');
 *
 * const myValue = versionedHolder.atVersion(1);
 *
 * // ...
 * ````
 */
export function useVersionedContext<
  Versions extends { [version in number]: any },
>(key: string): VersionedValue<Versions> {
  const versionedValue = useContext(
    getGlobalSingleton<Context<VersionedValue<Versions>>>(key),
  );
  if (!versionedValue) {
    throw new Error(`No provider available for ${key} context`);
  }
  return versionedValue;
}

/**
 * Creates a helper for writing tests towards multiple different
 * combinations of versions provided from a context.
 *
 * @example
 *
 * ```ts
 * const context = createVersionedContextForTesting('my-context');
 *
 * afterEach(() => {
 *   context.reset();
 * });
 *
 * it('should work when provided with version 1', () => {
 *   context.set({1: 'value-for-version-1'})
 *
 *   // ...
 * })
 * ```
 */
export function createVersionedContextForTesting(key: string) {
  return {
    set(versions: { [version in number]: unknown }) {
      (globalThis as any)[`__@backstage/${key}__`] = createContext(
        createVersionedValueMap(versions),
      );
    },
    reset() {
      delete (globalThis as any)[`__@backstage/${key}__`];
    },
  };
}
