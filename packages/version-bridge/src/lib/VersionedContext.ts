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
import { getOrCreateGlobalSingleton } from './globalObject';
import { createVersionedValueMap, VersionedValue } from './VersionedValue';

/**
 * Get the existing or create a new versioned React context that's
 * stored inside a global singleton.
 *
 * @param key - A key that uniquely identifies the context.
 * @public
 * @example
 *
 * ```ts
 * const MyContext = createVersionedContext<{ 1: string }>('my-context');
 *
 * const MyContextProvider = ({children}) => (
 *   <MyContext.Provider value={createVersionedValueMap({ 1: 'value-for-version-1' })}>
 *     {children}
 *   <MyContext.Provider>
 * )
 * ```
 */
export function createVersionedContext<
  Versions extends { [version in number]: unknown },
>(key: string): Context<VersionedValue<Versions> | undefined> {
  return getOrCreateGlobalSingleton(key, () =>
    createContext<VersionedValue<Versions> | undefined>(undefined),
  );
}

/**
 * A hook that simplifies the consumption of a versioned contexts that's
 * stored inside a global singleton.
 *
 * @param key - A key that uniquely identifies the context.
 * @public
 * @example
 *
 * ```ts
 * const versionedHolder = useVersionedContext<{ 1: string }>('my-context');
 *
 * if (!versionedHolder) {
 *   throw new Error('My context is not available!')
 * }
 *
 * const myValue = versionedHolder.atVersion(1);
 *
 * // ...
 * ```
 */
export function useVersionedContext<
  Versions extends { [version in number]: unknown },
>(key: string): VersionedValue<Versions> | undefined {
  return useContext(createVersionedContext<Versions>(key));
}

/**
 * Creates a helper for writing tests towards multiple different
 * combinations of versions provided from a context.
 *
 * @param key - A key that uniquely identifies the context.
 * @public
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
