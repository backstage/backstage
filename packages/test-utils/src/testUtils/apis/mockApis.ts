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
  AnalyticsApi,
  ApiFactory,
  ApiRef,
  ConfigApi,
  DiscoveryApi,
  IdentityApi,
  StorageApi,
  analyticsApiRef,
  configApiRef,
  createApiFactory,
  discoveryApiRef,
  identityApiRef,
  storageApiRef,
} from '@backstage/core-plugin-api';
import {
  TranslationApi,
  translationApiRef,
} from '@backstage/core-plugin-api/alpha';
import {
  AuthorizeResult,
  EvaluatePermissionRequest,
} from '@backstage/plugin-permission-common';
import {
  PermissionApi,
  permissionApiRef,
} from '@backstage/plugin-permission-react';
import { JsonObject } from '@backstage/types';
import { ApiMock } from './ApiMock';
import { MockPermissionApi } from './PermissionApi';
import { MockStorageApi } from './StorageApi';
import { MockTranslationApi } from './TranslationApi';

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
  const analyticsMockSkeleton = (): jest.Mocked<AnalyticsApi> => ({
    captureEvent: jest.fn(),
  });
  /**
   * Mock implementation of {@link @backstage/core-plugin-api#AnalyticsApi}.
   *
   * @public
   */
  export function analytics(): AnalyticsApi {
    return analyticsMockSkeleton();
  }
  /**
   * Mock implementations of {@link @backstage/core-plugin-api#AnalyticsApi}.
   *
   * @public
   */
  export namespace analytics {
    export const factory = simpleFactory(analyticsApiRef, analytics);
    export const mock = simpleMock(analyticsApiRef, analyticsMockSkeleton);
  }

  /**
   * Fake implementation of {@link @backstage/core-plugin-api#ConfigApi}
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
   * await renderInTestApp(
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
   * Mock helpers for {@link @backstage/core-plugin-api#ConfigApi}.
   *
   * @see {@link @backstage/core-plugin-api#mockApis.config}
   * @public
   */
  export namespace config {
    /**
     * Creates a factory for a fake implementation of
     * {@link @backstage/core-plugin-api#ConfigApi} with optional
     * configuration data supplied.
     *
     * @public
     */
    export const factory = simpleFactory(configApiRef, config);
    /**
     * Creates a mock implementation of
     * {@link @backstage/core-plugin-api#ConfigApi}. All methods are
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

  /**
   * Fake implementation of {@link @backstage/core-plugin-api#DiscoveryApi}. By
   * default returns URLs on the form `http://example.com/api/<pluginIs>`.
   *
   * @public
   */
  export function discovery(options?: { baseUrl?: string }): DiscoveryApi {
    const baseUrl = options?.baseUrl ?? 'http://example.com';
    return {
      async getBaseUrl(pluginId: string) {
        return `${baseUrl}/api/${pluginId}`;
      },
    };
  }
  /**
   * Mock implementations of {@link @backstage/core-plugin-api#DiscoveryApi}.
   *
   * @public
   */
  export namespace discovery {
    export const factory = simpleFactory(discoveryApiRef, discovery);
    export const mock = simpleMock(discoveryApiRef, () => ({
      getBaseUrl: jest.fn(),
    }));
  }

  /**
   * Fake implementation of {@link @backstage/core-plugin-api#IdentityApi}. By
   * default returns no token or profile info, and the user `user:default/test`.
   *
   * @public
   */
  export function identity(options?: {
    userEntityRef?: string;
    ownershipEntityRefs?: string[];
    token?: string;
    email?: string;
    displayName?: string;
    picture?: string;
  }): IdentityApi {
    const {
      userEntityRef = 'user:default/test',
      ownershipEntityRefs = ['user:default/test'],
      token,
      email,
      displayName,
      picture,
    } = options ?? {};
    return {
      async getBackstageIdentity() {
        return { type: 'user', ownershipEntityRefs, userEntityRef };
      },
      async getCredentials() {
        return { token };
      },
      async getProfileInfo() {
        return { email, displayName, picture };
      },
      async signOut() {},
    };
  }
  /**
   * Mock implementations of {@link @backstage/core-plugin-api#IdentityApi}.
   *
   * @public
   */
  export namespace identity {
    export const factory = simpleFactory(identityApiRef, identity);
    export const mock = simpleMock(
      identityApiRef,
      (): jest.Mocked<IdentityApi> => ({
        getBackstageIdentity: jest.fn(),
        getCredentials: jest.fn(),
        getProfileInfo: jest.fn(),
        signOut: jest.fn(),
      }),
    );
  }

  /**
   * Fake implementation of
   * {@link @backstage/plugin-permission-react#PermissionApi}. By default allows
   * all actions.
   *
   * @public
   */
  export function permission(options?: {
    authorize?:
      | AuthorizeResult.ALLOW
      | AuthorizeResult.DENY
      | ((
          request: EvaluatePermissionRequest,
        ) => AuthorizeResult.ALLOW | AuthorizeResult.DENY);
  }): PermissionApi {
    const authorizeInput = options?.authorize;
    let authorize: (
      request: EvaluatePermissionRequest,
    ) => AuthorizeResult.ALLOW | AuthorizeResult.DENY;
    if (authorizeInput === undefined) {
      authorize = () => AuthorizeResult.ALLOW;
    } else if (typeof authorizeInput === 'function') {
      authorize = authorizeInput;
    } else {
      authorize = () => authorizeInput;
    }
    return new MockPermissionApi(authorize);
  }
  /**
   * Mock implementation of
   * {@link @backstage/plugin-permission-react#PermissionApi}.
   *
   * @public
   */
  export namespace permission {
    export const factory = simpleFactory(permissionApiRef, permission);
    export const mock = simpleMock(permissionApiRef, () => ({
      authorize: jest.fn(),
    }));
  }

  /**
   * Fake implementation of {@link @backstage/core-plugin-api#StorageApi}.
   * Stores data temporarily in memory.
   *
   * @public
   */
  export function storage(options?: { data?: JsonObject }): StorageApi {
    return MockStorageApi.create(options?.data);
  }
  /**
   * Mock implementations of {@link @backstage/core-plugin-api#StorageApi}.
   *
   * @public
   */
  export namespace storage {
    export const factory = simpleFactory(storageApiRef, storage);
    export const mock = simpleMock(storageApiRef, () => ({
      forBucket: jest.fn(),
      set: jest.fn(),
      remove: jest.fn(),
      observe$: jest.fn(),
      snapshot: jest.fn(),
    }));
  }

  /**
   * Fake implementation of {@link @backstage/core-plugin-api/alpha#TranslationApi}.
   * By default returns the default translation.
   *
   * @public
   */
  export function translation(): TranslationApi {
    return MockTranslationApi.create();
  }
  /**
   * Mock implementations of {@link @backstage/core-plugin-api/alpha#TranslationApi}.
   *
   * @public
   */
  export namespace translation {
    export const factory = simpleFactory(translationApiRef, translation);
    export const mock = simpleMock(translationApiRef, () => ({
      getTranslation: jest.fn(),
      translation$: jest.fn(),
    }));
  }
}
