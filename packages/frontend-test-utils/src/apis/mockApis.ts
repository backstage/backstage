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

import {
  alertApiRef,
  createApiFactory,
  featureFlagsApiRef,
} from '@backstage/frontend-plugin-api';
import {
  mockApis as testUtilsMockApis,
  type ApiMock,
} from '@backstage/test-utils';
import { MockAlertApi } from './AlertApi';
import {
  MockFeatureFlagsApi,
  MockFeatureFlagsApiOptions,
} from './FeatureFlagsApi';

/** @internal */
function simpleMock<TApi>(
  ref: any,
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

/** @internal */
function simpleFactory<TApi, TArgs extends unknown[]>(
  ref: any,
  factory: (...args: TArgs) => TApi,
): (...args: TArgs) => any {
  return (...args) =>
    createApiFactory({
      api: ref,
      deps: {},
      factory: () => factory(...args),
    });
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
   * Fake implementation of {@link @backstage/frontend-plugin-api#AlertApi}.
   *
   * @public
   * @example
   *
   * ```tsx
   * const alertApi = mockApis.alert();
   * alertApi.post({ message: 'Test alert' });
   * expect(alertApi.getAlerts()).toHaveLength(1);
   * ```
   */
  export function alert(): MockAlertApi {
    return new MockAlertApi();
  }
  /**
   * Mock helpers for {@link @backstage/frontend-plugin-api#AlertApi}.
   *
   * @see {@link @backstage/frontend-plugin-api#mockApis.alert}
   * @public
   */
  export namespace alert {
    /**
     * Creates a factory for a fake implementation of
     * {@link @backstage/frontend-plugin-api#AlertApi}.
     *
     * @public
     */
    export const factory = simpleFactory(alertApiRef, alert);
    /**
     * Creates a mock implementation of
     * {@link @backstage/frontend-plugin-api#AlertApi}. All methods are
     * replaced with jest mock functions, and you can optionally pass in a
     * subset of methods with an explicit implementation.
     *
     * @public
     */
    export const mock = simpleMock(alertApiRef, () => ({
      post: jest.fn(),
      alert$: jest.fn(),
    }));
  }

  /**
   * Fake implementation of {@link @backstage/frontend-plugin-api#FeatureFlagsApi}.
   *
   * @public
   * @example
   *
   * ```tsx
   * const featureFlagsApi = mockApis.featureFlags({
   *   initialStates: { 'my-feature': FeatureFlagState.Active },
   * });
   * expect(featureFlagsApi.isActive('my-feature')).toBe(true);
   * ```
   */
  export function featureFlags(
    options?: MockFeatureFlagsApiOptions,
  ): MockFeatureFlagsApi {
    return new MockFeatureFlagsApi(options);
  }
  /**
   * Mock helpers for {@link @backstage/frontend-plugin-api#FeatureFlagsApi}.
   *
   * @see {@link @backstage/frontend-plugin-api#mockApis.featureFlags}
   * @public
   */
  export namespace featureFlags {
    /**
     * Creates a factory for a fake implementation of
     * {@link @backstage/frontend-plugin-api#FeatureFlagsApi}.
     *
     * @public
     */
    export const factory = simpleFactory(featureFlagsApiRef, featureFlags);
    /**
     * Creates a mock implementation of
     * {@link @backstage/frontend-plugin-api#FeatureFlagsApi}. All methods are
     * replaced with jest mock functions, and you can optionally pass in a
     * subset of methods with an explicit implementation.
     *
     * @public
     */
    export const mock = simpleMock(featureFlagsApiRef, () => ({
      registerFlag: jest.fn(),
      getRegisteredFlags: jest.fn(),
      isActive: jest.fn(),
      save: jest.fn(),
    }));
  }

  // Re-export all mockApis from test-utils
  export const analytics = testUtilsMockApis.analytics;
  export const config = testUtilsMockApis.config;
  export const discovery = testUtilsMockApis.discovery;
  export const identity = testUtilsMockApis.identity;
  export const permission = testUtilsMockApis.permission;
  export const storage = testUtilsMockApis.storage;
  export const translation = testUtilsMockApis.translation;
}
