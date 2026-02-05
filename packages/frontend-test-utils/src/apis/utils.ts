/*
 * Copyright 2025 The Backstage Authors
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

import { ApiRef } from '@backstage/frontend-plugin-api';
import { ApiFactory } from '@backstage/frontend-plugin-api';

/**
 * Symbol used to mark mock API instances with their corresponding API factory.
 *
 * @ignore
 */
export const mockApiFactorySymbol = Symbol.for('@backstage/mock-api');

/**
 * Symbol used to mark mock API instances with their corresponding API factory.
 * This allows mock APIs to be passed directly to test utilities without
 * needing to explicitly provide the [apiRef, implementation] tuple.
 *
 * @public
 */
export type MockApiFactorySymbol = typeof mockApiFactorySymbol;

/**
 * Represents a mocked version of an API, where you automatically have access to
 * the mocked versions of all of its methods along with a factory that returns
 * that same mock.
 *
 * @public
 */
export type ApiMock<TApi> = {
  factory: ApiFactory<TApi, TApi, {}>;
  [mockApiFactorySymbol]: ApiFactory<TApi, TApi, {}>;
} & {
  [Key in keyof TApi]: TApi[Key] extends (...args: infer Args) => infer Return
    ? TApi[Key] & jest.MockInstance<Return, Args>
    : TApi[Key];
};

/**
 * Type for an API instance that has been marked as a mock API.
 *
 * @public
 */
export type MockWithApiFactory<TApi> = TApi & {
  [mockApiFactorySymbol]: ApiFactory<TApi, TApi, {}>;
};

/**
 * Helper to attach mock API metadata to an instance.
 *
 * @internal
 */
export function mockWithApiFactory<TApi, TImpl extends TApi = TApi>(
  apiRef: ApiRef<TApi>,
  implementation: TImpl,
): TImpl & { [mockApiFactorySymbol]: ApiFactory<TApi, TApi, {}> } {
  const marked = implementation as TImpl & {
    [mockApiFactorySymbol]: ApiFactory<TApi, TApi, {}>;
  };
  (marked as any)[mockApiFactorySymbol] = {
    api: apiRef,
    deps: {},
    factory: () => implementation,
  };
  return marked;
}

/**
 * Attaches mock API factory metadata to an API instance, allowing it to be
 * passed directly to test utilities without needing to explicitly provide
 * the [apiRef, implementation] tuple.
 *
 * @public
 * @example
 * ```ts
 * const catalogApi = attachMockApiFactory(
 *   catalogApiRef,
 *   new InMemoryCatalogClient()
 * );
 * // Can now be passed directly to TestApiProvider
 * <TestApiProvider apis={[catalogApi]}>
 * ```
 */
export function attachMockApiFactory<TApi, TImpl extends TApi = TApi>(
  apiRef: ApiRef<TApi>,
  implementation: TImpl,
): TImpl & { [mockApiFactorySymbol]: ApiFactory<TApi, TApi, {}> } {
  const marked = implementation as TImpl & {
    [mockApiFactorySymbol]: ApiFactory<TApi, TApi, {}>;
  };
  (marked as any)[mockApiFactorySymbol] = {
    api: apiRef,
    deps: {},
    factory: () => implementation,
  };
  return marked;
}

/**
 * Retrieves the API factory from a mock API instance.
 * Returns undefined if the value is not a mock API instance.
 *
 * @internal
 */
export function getMockApiFactory(
  value: unknown,
): ApiFactory<any, any, {}> | undefined {
  if (
    typeof value === 'object' &&
    value !== null &&
    mockApiFactorySymbol in value &&
    typeof (value as any)[mockApiFactorySymbol] === 'object'
  ) {
    return (value as any)[mockApiFactorySymbol];
  }
  return undefined;
}
