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
  analyticsApiRef,
  configApiRef,
  discoveryApiRef,
  errorApiRef,
  fetchApiRef,
  featureFlagsApiRef,
  identityApiRef,
  storageApiRef,
  translationApiRef,
  type AnalyticsApi,
  type ConfigApi,
  type DiscoveryApi,
  type ErrorApi,
  type FetchApi,
  type IdentityApi,
  type StorageApi,
  type TranslationApi,
} from '@backstage/frontend-plugin-api';
import {
  permissionApiRef,
  type PermissionApi,
} from '@backstage/plugin-permission-react';
import { JsonObject } from '@backstage/types';
import {
  AuthorizeResult,
  EvaluatePermissionRequest,
} from '@backstage/plugin-permission-common';
import { MockAlertApi } from './AlertApi';
import {
  MockFeatureFlagsApi,
  MockFeatureFlagsApiOptions,
} from './FeatureFlagsApi';
import { MockAnalyticsApi } from './AnalyticsApi';
import { MockConfigApi } from './ConfigApi';
import { MockErrorApi, MockErrorApiOptions } from './ErrorApi';
import { MockFetchApi, MockFetchApiOptions } from './FetchApi';
import { MockStorageApi } from './StorageApi';
import { MockPermissionApi } from './PermissionApi';
import { MockTranslationApi } from './TranslationApi';
import {
  mockWithApiFactory,
  type MockWithApiFactory,
} from './MockWithApiFactory';
import { createApiMock } from './createApiMock';

/**
 * Mock implementations of the core utility APIs, to be used in tests.
 *
 * @public
 * @remarks
 *
 * There are some variations among the APIs depending on what needs tests
 * might have, but overall there are two main usage patterns:
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
  export function alert(): MockWithApiFactory<MockAlertApi> {
    const instance = new MockAlertApi();
    return mockWithApiFactory(
      alertApiRef,
      instance,
    ) as MockWithApiFactory<MockAlertApi>;
  }
  /**
   * Mock helpers for {@link @backstage/frontend-plugin-api#AlertApi}.
   *
   * @see {@link @backstage/frontend-plugin-api#mockApis.alert}
   * @public
   */
  export namespace alert {
    /**
     * Creates a mock implementation of
     * {@link @backstage/frontend-plugin-api#AlertApi}. All methods are
     * replaced with jest mock functions, and you can optionally pass in a
     * subset of methods with an explicit implementation.
     *
     * @public
     */
    export const mock = createApiMock(alertApiRef, () => ({
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
  ): MockWithApiFactory<MockFeatureFlagsApi> {
    const instance = new MockFeatureFlagsApi(options);
    return mockWithApiFactory(
      featureFlagsApiRef,
      instance,
    ) as MockWithApiFactory<MockFeatureFlagsApi>;
  }
  /**
   * Mock helpers for {@link @backstage/frontend-plugin-api#FeatureFlagsApi}.
   *
   * @see {@link @backstage/frontend-plugin-api#mockApis.featureFlags}
   * @public
   */
  export namespace featureFlags {
    /**
     * Creates a mock implementation of
     * {@link @backstage/frontend-plugin-api#FeatureFlagsApi}. All methods are
     * replaced with jest mock functions, and you can optionally pass in a
     * subset of methods with an explicit implementation.
     *
     * @public
     */
    export const mock = createApiMock(featureFlagsApiRef, () => ({
      registerFlag: jest.fn(),
      getRegisteredFlags: jest.fn(),
      isActive: jest.fn(),
      save: jest.fn(),
    }));
  }

  /**
   * Fake implementation of {@link @backstage/core-plugin-api#AnalyticsApi}.
   *
   * @public
   */
  export function analytics(): MockAnalyticsApi &
    MockWithApiFactory<AnalyticsApi> {
    const instance = new MockAnalyticsApi();
    return mockWithApiFactory(analyticsApiRef, instance) as MockAnalyticsApi &
      MockWithApiFactory<AnalyticsApi>;
  }

  /**
   * Mock helpers for {@link @backstage/core-plugin-api#AnalyticsApi}.
   *
   * @public
   */
  export namespace analytics {
    export const mock = createApiMock(analyticsApiRef, () => ({
      captureEvent: jest.fn(),
    }));
  }

  /**
   * Fake implementation of {@link @backstage/core-plugin-api/alpha#TranslationApi}.
   * By default returns the default translation.
   *
   * @public
   */
  export function translation(): MockTranslationApi &
    MockWithApiFactory<TranslationApi> {
    const instance = MockTranslationApi.create();
    return mockWithApiFactory(
      translationApiRef,
      instance,
    ) as MockTranslationApi & MockWithApiFactory<TranslationApi>;
  }

  /**
   * Mock helpers for {@link @backstage/core-plugin-api/alpha#TranslationApi}.
   *
   * @see {@link @backstage/frontend-plugin-api#mockApis.translation}
   * @public
   */
  export namespace translation {
    /**
     * Creates a mock of {@link @backstage/core-plugin-api/alpha#TranslationApi}.
     *
     * @public
     */
    export const mock = createApiMock(translationApiRef, () => ({
      getTranslation: jest.fn(),
      translation$: jest.fn(),
    }));
  }

  /**
   * Fake implementation of {@link @backstage/core-plugin-api#ConfigApi}.
   *
   * @public
   */
  export function config(options?: {
    data?: JsonObject;
  }): MockConfigApi & MockWithApiFactory<ConfigApi> {
    const instance = new MockConfigApi({ data: options?.data ?? {} });
    return mockWithApiFactory(configApiRef, instance) as MockConfigApi &
      MockWithApiFactory<ConfigApi>;
  }

  /**
   * Mock helpers for {@link @backstage/core-plugin-api#ConfigApi}.
   *
   * @public
   */
  export namespace config {
    export const mock = createApiMock(configApiRef, () => ({
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
   * Fake implementation of {@link @backstage/core-plugin-api#DiscoveryApi}.
   *
   * @public
   */
  export function discovery(options?: {
    baseUrl?: string;
  }): DiscoveryApi & MockWithApiFactory<DiscoveryApi> {
    const baseUrl = options?.baseUrl ?? 'http://example.com';
    const instance: DiscoveryApi = {
      async getBaseUrl(pluginId: string) {
        return `${baseUrl}/api/${pluginId}`;
      },
    };
    return mockWithApiFactory(discoveryApiRef, instance) as DiscoveryApi &
      MockWithApiFactory<DiscoveryApi>;
  }

  /**
   * Mock helpers for {@link @backstage/core-plugin-api#DiscoveryApi}.
   *
   * @public
   */
  export namespace discovery {
    export const mock = createApiMock(discoveryApiRef, () => ({
      getBaseUrl: jest.fn(),
    }));
  }

  /**
   * Fake implementation of {@link @backstage/core-plugin-api#IdentityApi}.
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
  }): IdentityApi & MockWithApiFactory<IdentityApi> {
    const {
      userEntityRef = 'user:default/test',
      ownershipEntityRefs = ['user:default/test'],
      token,
      email,
      displayName,
      picture,
    } = options ?? {};
    const instance: IdentityApi = {
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
    return mockWithApiFactory(identityApiRef, instance) as IdentityApi &
      MockWithApiFactory<IdentityApi>;
  }

  /**
   * Mock helpers for {@link @backstage/core-plugin-api#IdentityApi}.
   *
   * @public
   */
  export namespace identity {
    export const mock = createApiMock(identityApiRef, () => ({
      getBackstageIdentity: jest.fn(),
      getCredentials: jest.fn(),
      getProfileInfo: jest.fn(),
      signOut: jest.fn(),
    }));
  }

  /**
   * Fake implementation of {@link @backstage/plugin-permission-react#PermissionApi}.
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
  }): MockPermissionApi & MockWithApiFactory<PermissionApi> {
    const authorizeInput = options?.authorize;
    const handler =
      typeof authorizeInput === 'function'
        ? authorizeInput
        : () => authorizeInput ?? AuthorizeResult.ALLOW;
    const instance = new MockPermissionApi(handler);
    return mockWithApiFactory(permissionApiRef, instance) as MockPermissionApi &
      MockWithApiFactory<PermissionApi>;
  }

  /**
   * Mock helpers for {@link @backstage/plugin-permission-react#PermissionApi}.
   *
   * @public
   */
  export namespace permission {
    export const mock = createApiMock(permissionApiRef, () => ({
      authorize: jest.fn(),
    }));
  }

  /**
   * Fake implementation of {@link @backstage/core-plugin-api#StorageApi}.
   *
   * @public
   */
  export function storage(options?: {
    data?: JsonObject;
  }): MockStorageApi & MockWithApiFactory<StorageApi> {
    const instance = MockStorageApi.create(options?.data);
    return mockWithApiFactory(storageApiRef, instance) as MockStorageApi &
      MockWithApiFactory<StorageApi>;
  }

  /**
   * Mock helpers for {@link @backstage/core-plugin-api#StorageApi}.
   *
   * @public
   */
  export namespace storage {
    export const mock = createApiMock(storageApiRef, () => ({
      forBucket: jest.fn(),
      snapshot: jest.fn(),
      set: jest.fn(),
      remove: jest.fn(),
      observe$: jest.fn(),
    }));
  }

  /**
   * Fake implementation of {@link @backstage/core-plugin-api#ErrorApi}.
   *
   * @public
   */
  export function error(
    options?: MockErrorApiOptions,
  ): MockErrorApi & MockWithApiFactory<ErrorApi> {
    const instance = new MockErrorApi(options);
    return mockWithApiFactory(errorApiRef, instance) as MockErrorApi &
      MockWithApiFactory<ErrorApi>;
  }

  /**
   * Mock helpers for {@link @backstage/core-plugin-api#ErrorApi}.
   *
   * @public
   */
  export namespace error {
    export const mock = createApiMock(errorApiRef, () => ({
      post: jest.fn(),
      error$: jest.fn(),
    }));
  }

  /**
   * Fake implementation of {@link @backstage/core-plugin-api#FetchApi}.
   *
   * @public
   */
  export function fetch(
    options?: MockFetchApiOptions,
  ): MockFetchApi & MockWithApiFactory<FetchApi> {
    const instance = new MockFetchApi(options);
    return mockWithApiFactory(fetchApiRef, instance) as MockFetchApi &
      MockWithApiFactory<FetchApi>;
  }

  /**
   * Mock helpers for {@link @backstage/core-plugin-api#FetchApi}.
   *
   * @public
   */
  export namespace fetch {
    export const mock = createApiMock(fetchApiRef, () => ({
      fetch: jest.fn(),
    }));
  }
}
