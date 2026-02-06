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
import { getMockApiFactory, type MockWithApiFactory } from './utils';

/**
 * Helper type for representing an API reference paired with a partial implementation.
 * @ignore
 */
export type TestApiProviderPropsApiPair<TApi> = TApi extends infer TImpl
  ? readonly [ApiRef<TApi>, Partial<TImpl>]
  : never;

/**
 * Helper type for representing an array of API reference pairs.
 * @ignore
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
 * Type for entries that can be passed to TestApiProvider.
 * Can be either a traditional [apiRef, implementation] tuple or a mock API instance
 * marked with the mockApiFactorySymbol.
 *
 * @internal
 */
export type TestApiProviderEntry =
  | readonly [ApiRef<any>, any]
  | MockWithApiFactory<any>;

/** @internal */
export function resolveTestApiEntries(
  apis: readonly (TestApiProviderEntry | readonly [ApiRef<any>, any])[],
): ApiHolder {
  const apiMap = new Map<string, unknown>();

  for (const entry of apis) {
    const mockFactory = getMockApiFactory(entry);
    if (mockFactory) {
      apiMap.set(mockFactory.api.id, mockFactory.factory({}));
    } else {
      const [apiRef, impl] = entry as readonly [ApiRef<any>, any];
      apiMap.set(apiRef.id, impl);
    }
  }

  return {
    get: <T,>(ref: ApiRef<T>) => apiMap.get(ref.id) as T | undefined,
  };
}

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
 * import { myCustomApiRef } from '../apis';
 * import { TestApiProvider, mockApis } from '\@backstage/frontend-test-utils';
 *
 * // Mock custom APIs with tuple syntax
 * const myCustomApiMock = { myMethod: jest.fn() };
 * render(
 *   <TestApiProvider
 *     apis={[
 *       [myCustomApiRef, myCustomApiMock]
 *     ]}
 *   >
 *     <MyComponent />
 *   </TestApiProvider>
 * );
 *
 * // Use with built-in mock APIs (no tuples needed)
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
      apis={resolveTestApiEntries(props.apis)}
      children={props.children}
    />
  );
};
