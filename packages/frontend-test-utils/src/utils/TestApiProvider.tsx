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

import { ReactNode } from 'react';
// eslint-disable-next-line @backstage/no-relative-monorepo-imports
import { ApiProvider } from '../../../core-app-api/src/apis/system';
import { ApiHolder, ApiRef } from '@backstage/frontend-plugin-api';
import { getMockApiFactory, type MockWithApiFactory } from '../apis/utils';

/**
 * Helper type for representing an API reference paired with a partial implementation.
 * @public
 */
export type TestApiProviderPropsApiPair<TApi> = TApi extends infer TImpl
  ? readonly [ApiRef<TApi>, Partial<TImpl>]
  : never;

/**
 * Helper type for representing an array of API reference pairs.
 * @public
 */
export type TestApiProviderPropsApiPairs<TApiPairs> = {
  [TIndex in keyof TApiPairs]: TestApiProviderPropsApiPair<TApiPairs[TIndex]>;
};

/**
 * Shorter alias for TestApiProviderPropsApiPairs for use in function signatures.
 * @public
 */
export type TestApiPairs<TApiPairs> = TestApiProviderPropsApiPairs<TApiPairs>;

/**
 * Type for entries that can be passed to TestApiProvider/TestApiRegistry.
 * Can be either a traditional [apiRef, implementation] tuple or a mock API instance
 * marked with the mockApiFactorySymbol.
 *
 * @public
 */
export type TestApiProviderEntry =
  | readonly [ApiRef<any>, any]
  | MockWithApiFactory<any>;

/**
 * Properties for the {@link TestApiProvider} component.
 *
 * @public
 */
export type TestApiProviderProps<TApiPairs extends any[]> = {
  apis: readonly [
    ...(TestApiProviderPropsApiPairs<TApiPairs> | MockWithApiFactory<any>[]),
  ];
  children: ReactNode;
};

/**
 * The `TestApiRegistry` is an {@link @backstage/frontend-plugin-api#ApiHolder} implementation
 * that is particularly well suited for development and test environments such as
 * unit tests, storybooks, and isolated plugin development setups.
 *
 * @remarks
 *
 * For most test scenarios, prefer using the `apis` option in `renderInTestApp` or
 * `createExtensionTester` instead of creating a registry directly.
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
   * import { identityApiRef } from '@backstage/frontend-plugin-api';
   * import { mockApis } from '@backstage/frontend-test-utils';
   *
   * // Traditional tuple syntax
   * const apis1 = TestApiRegistry.from(
   *   [identityApiRef, mockApis.identity({ userEntityRef: 'user:default/guest' })],
   * );
   *
   * // Direct mock API instance (no tuple needed)
   * const apis2 = TestApiRegistry.from(
   *   mockApis.identity({ userEntityRef: 'user:default/guest' }),
   *   mockApis.alert(),
   * );
   * ```
   *
   * @public
   * @param apis - A list of pairs mapping an ApiRef to its respective implementation,
   *               or mock API instances marked with the mockApiSymbol.
   */
  static from(...apis: readonly TestApiProviderEntry[]) {
    const apiMap = new Map<string, unknown>();

    for (const entry of apis) {
      const mockFactory = getMockApiFactory(entry);
      if (mockFactory) {
        // Handle mock API instances marked with the symbol
        const impl = mockFactory.factory({});
        apiMap.set(mockFactory.api.id, impl);
      } else if (Array.isArray(entry)) {
        // Handle traditional [apiRef, impl] tuples
        const [apiRef, impl] = entry;
        apiMap.set(apiRef.id, impl);
      } else {
        throw new Error(
          `Invalid API entry provided to TestApiRegistry.from(). Expected either [apiRef, impl] tuple or a mock API instance.`,
        );
      }
    }

    return new TestApiRegistry(apiMap);
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
 * The `TestApiProvider` is a Utility API context provider for standalone rendering
 * scenarios where you're not using `renderInTestApp` or other test utilities.
 *
 * It lets you provide any number of API implementations, without necessarily
 * having to fully implement each of the APIs.
 *
 * @remarks
 *
 * For most test scenarios, prefer using the `apis` option in `renderInTestApp` or
 * `createExtensionTester` instead of wrapping components with `TestApiProvider`.
 *
 * @example
 * ```tsx
 * import { render } from '\@testing-library/react';
 * import { identityApiRef } from '\@backstage/frontend-plugin-api';
 * import { TestApiProvider, mockApis } from '\@backstage/frontend-test-utils';
 *
 * // Traditional tuple syntax
 * render(
 *   <TestApiProvider
 *     apis={[[identityApiRef, mockApis.identity({ userEntityRef: 'user:default/guest' })]]}
 *   >
 *     <MyComponent />
 *   </TestApiProvider>
 * );
 *
 * // Direct mock API instances (no tuples needed)
 * render(
 *   <TestApiProvider
 *     apis={[
 *       mockApis.identity({ userEntityRef: 'user:default/guest' }),
 *       mockApis.alert(),
 *     ]}
 *   >
 *     <MyComponent />
 *   </TestApiProvider>
 * );
 * ```
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
