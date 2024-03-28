/*
 * Copyright 2020 The Backstage Authors
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

/** @ignore */
type TestApiProviderPropsApiPair<TApi> = TApi extends infer TImpl
  ? readonly [ApiRef<TApi>, Partial<TImpl>]
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
  apis: readonly [...TestApiProviderPropsApiPairs<TApiPairs>];
  children: ReactNode;
};

/**
 * The `TestApiRegistry` is an {@link @backstage/core-plugin-api#ApiHolder} implementation
 * that is particularly well suited for development and test environments such as
 * unit tests, storybooks, and isolated plugin development setups.
 *
 * @public
 */
export class TestApiRegistry implements ApiHolder {
  /**
   * Creates a new {@link TestApiRegistry} with a list of API implementation pairs.
   *
   * Similar to the {@link TestApiProvider}, there is no need to provide a full
   * implementation of each API, it's enough to implement the methods that are tested.
   *
   * @example
   * ```ts
   * const apis = TestApiRegistry.from(
   *   [configApiRef, new ConfigReader({})],
   *   [identityApiRef, { getUserId: () => 'tester' }],
   * );
   * ```
   *
   * @public
   * @param apis - A list of pairs mapping an ApiRef to its respective implementation.
   */
  static from<TApiPairs extends any[]>(
    ...apis: readonly [...TestApiProviderPropsApiPairs<TApiPairs>]
  ) {
    return new TestApiRegistry(
      new Map(apis.map(([api, impl]) => [api.id, impl])),
    );
  }

  private constructor(private readonly apis: Map<string, unknown>) {}

  /**
   * Returns an implementation of the API.
   *
   * @public
   */
  get<T>(api: ApiRef<T>): T | undefined {
    return this.apis.get(api.id) as T | undefined;
  }
}

/**
 * The `TestApiProvider` is a Utility API context provider that is particularly
 * well suited for development and test environments such as unit tests, storybooks,
 * and isolated plugin development setups.
 *
 * It lets you provide any number of API implementations, without necessarily
 * having to fully implement each of the APIs.
 *
 * @remarks
 * todo: remove this remark tag and ship in the api-reference. There's some odd formatting going on when this is made into a markdown doc, that there's no line break between
 * the emitted <p> for To the following </p> so what happens is that when parsing in docusaurus, it thinks that the code block is mdx rather than a code
 * snippet. Just omitting this from the report for now until we can work out how to fix later.
 * A migration from `ApiRegistry` and `ApiProvider` might look like this, from:
 *
 * ```tsx
 * renderInTestApp(
 *   <ApiProvider
 *     apis={ApiRegistry.from([
 *       [identityApiRef, mockIdentityApi as unknown as IdentityApi]
 *     ])}
 *   >
 *    ...
 *   </ApiProvider>
 * )
 * ```
 *
 * To the following:
 *
 * ```tsx
 * renderInTestApp(
 *   <TestApiProvider apis={[[identityApiRef, mockIdentityApi]]}>
 *     ...
 *   </TestApiProvider>
 * )
 * ```
 *
 * Note that the cast to `IdentityApi` is no longer needed as long as the mock API
 * implements a subset of the `IdentityApi`.
 *
 * @public
 */
export const TestApiProvider = <T extends any[]>(
  props: TestApiProviderProps<T>,
) => {
  return (
    <ApiProvider
      apis={TestApiRegistry.from(...props.apis)}
      children={props.children}
    />
  );
};
