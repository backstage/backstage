/*
 * Copyright 2024 The Backstage Authors
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

import { ConfigReader } from '@backstage/config';
import {
  ApiFactory,
  ApiRef,
  ConfigApi,
  configApiRef,
  createApiFactory,
} from '@backstage/core-plugin-api';
import { JsonObject } from '@backstage/types';
import { ApiMock } from './ApiMock';

/** @internal */
function simpleFactory<TApi, TArgs extends unknown[]>(
  ref: ApiRef<TApi>,
  factory: (...args: TArgs) => TApi,
): (...args: TArgs) => ApiFactory<TApi, TApi, {}> {
  return (...args) =>
    createApiFactory({
      api: ref,
      deps: {},
      factory: () => factory(...args),
    });
}

/** @internal */
function simpleMock<TApi>(
  ref: ApiRef<TApi>,
  mockFactory: () => jest.Mocked<TApi>,
): (partialImpl?: Partial<TApi>) => ApiMock<TApi> {
  return partialImpl => {
    const mock = mockFactory();
    if (partialImpl) {
      for (const [key, impl] of Object.entries(partialImpl)) {
        if (typeof impl === 'function') {
          (mock as any)[key].mockImplementation(impl);
        } else {
          (mock as any)[key] = impl;
        }
      }
    }
    return Object.assign(mock, {
      factory: createApiFactory({
        api: ref,
        deps: {},
        factory: () => mock,
      }),
    }) as ApiMock<TApi>;
  };
}

/**
 * Mock implementations of the core utility APIs, to be used in tests.
 *
 * @public
 * @remarks
 *
 * There are some variations among the APIs depending on what needs tests
 * might have, but overall there are three main usage patterns:
 *
 * 1: Creating an actual fake API instance, often with a simplified version
 * of functionality, by calling the mock API itself as a function.
 *
 * ```ts
 * // The function often accepts parameters that control its behavior
 * const foo = mockApis.foo();
 * ```
 *
 * 2: Creating a mock API, where all methods are replaced with jest mocks, by
 * calling the API's `mock` function.
 *
 * ```ts
 * // You can optionally supply a subset of its methods to implement
 * const foo = mockApis.foo.mock({
 *   someMethod: () => 'mocked result',
 * });
 * // After exercising your test, you can make assertions on the mock:
 * expect(foo.someMethod).toHaveBeenCalledTimes(2);
 * expect(foo.otherMethod).toHaveBeenCalledWith(testData);
 * ```
 *
 * 3: Creating an API factory that behaves similarly to the mock as per above.
 *
 * ```ts
 * const factory = mockApis.foo.factory({
 *   someMethod: () => 'mocked result',
 * });
 * ```
 */
export namespace mockApis {
  /**
   * Fake implementation of {@link @backstage/frontend-plugin-api#ConfigApi}
   * with optional data supplied.
   *
   * @public
   * @example
   *
   * ```tsx
   * const config = mockApis.config({
   *   data: { app: { baseUrl: 'https://example.com' } },
   * });
   *
   * const rendered = await renderInTestApp(
   *   <TestApiProvider apis={[[configApiRef, config]]}>
   *     <MyTestedComponent />
   *   </TestApiProvider>,
   * );
   * ```
   */
  export function config(options?: { data?: JsonObject }): ConfigApi {
    return new ConfigReader(options?.data, 'mock-config');
  }
  /**
   * Mock helpers for {@link @backstage/frontend-plugin-api#ConfigApi}.
   *
   * @see {@link @backstage/frontend-plugin-api#mockApis.config}
   * @public
   */
  export namespace config {
    /**
     * Creates a factory for a fake implementation of
     * {@link @backstage/frontend-plugin-api#ConfigApi} with optional
     * configuration data supplied.
     *
     * @public
     */
    export const factory = simpleFactory(configApiRef, config);
    /**
     * Creates a mock implementation of
     * {@link @backstage/frontend-plugin-api#ConfigApi}. All methods are
     * replaced with jest mock functions, and you can optionally pass in a
     * subset of methods with an explicit implementation.
     *
     * @public
     */
    export const mock = simpleMock(configApiRef, () => ({
      has: jest.fn(),
      keys: jest.fn(),
      get: jest.fn(),
      getOptional: jest.fn(),
      getConfig: jest.fn(),
      getOptionalConfig: jest.fn(),
      getConfigArray: jest.fn(),
      getOptionalConfigArray: jest.fn(),
      getNumber: jest.fn(),
      getOptionalNumber: jest.fn(),
      getBoolean: jest.fn(),
      getOptionalBoolean: jest.fn(),
      getString: jest.fn(),
      getOptionalString: jest.fn(),
      getStringArray: jest.fn(),
      getOptionalStringArray: jest.fn(),
    }));
  }
}
