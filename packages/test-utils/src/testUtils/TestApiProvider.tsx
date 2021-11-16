/*
 * Copyright 2020 Spotify AB
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

import React, { ReactNode } from 'react';
import { ApiProvider } from '@backstage/core-app-api';
import { ApiRef, ApiHolder } from '@backstage/core-plugin-api';

type TestApiProviderPropsApiPair<TApi> = TApi extends infer TImpl
  ? [ApiRef<TApi>, Partial<TImpl>]
  : never;

/** @ignore */
type TestApiProviderPropsApiPairs<TApiPairs> = {
  [TIndex in keyof TApiPairs]: TestApiProviderPropsApiPair<TApiPairs[TIndex]>;
};

/**
 * Properties for the {@link TestApiProvider} component.
 *
 * @public
 */
export type TestApiProviderProps<TApiPairs extends any[]> = {
  apis: [...TestApiProviderPropsApiPairs<TApiPairs>];
  children: ReactNode;
};

/** @internal */
class TestApiRegistry implements ApiHolder {
  constructor(private readonly apis: Map<string, unknown>) {}

  get<T>(api: ApiRef<T>): T | undefined {
    return this.apis.get(api.id) as T | undefined;
  }
}

/**
 * An API provider that lets you provide any number of API implementations in
 * a test, without necessarily having to implement the full APIs.
 *
 * A migration from `ApiRegistry` and `ApiProvider` might look like this, from:
 *
 * ```tsx
 * renderInTestApp(
 *   <ApiProvider
 *     apis={ApiRegistry.from([
 *       [identityApiRef, mockIdentityApi as unknown as IdentityApi]
 *     ])}
 *   >
 *     {...}
 *   </ApiProvider>
 * )
 * ```
 *
 * To the following:
 *
 * ```tsx
 * renderInTestApp(
 *   <TestApiProvider apis={[[identityApiRef, mockIdentityApi]]}>
 *     {...}
 *   </TestApiProvider>
 * )
 * ```
 *
 * Note that the cast to `IdentityApi` is no longer needed as long as the mock API
 * implements a subset of the `IdentityApi`.
 *
 * @public
 **/
export const TestApiProvider = <T extends any[]>({
  apis,
  children,
}: TestApiProviderProps<T>) => {
  return (
    <ApiProvider
      apis={
        new TestApiRegistry(new Map(apis.map(([api, impl]) => [api.id, impl])))
      }
      children={children}
    />
  );
};
