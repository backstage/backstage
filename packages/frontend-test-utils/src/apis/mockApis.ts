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
  coreApis,
  type AnalyticsApi,
  type ConfigApi,
  type DiscoveryApi,
  type ErrorApi,
  type FetchApi,
  type FeatureFlagState,
  type IdentityApi,
  type StorageApi,
  type TranslationApi,
  type PendingOAuthRequest,
  type ToastApiMessage,
} from '@backstage/frontend-plugin-api';
import {
  permissionApiRef,
  type PermissionApi,
} from '@backstage/plugin-permission-react';
import { JsonObject } from '@backstage/types';
import Observable from 'zen-observable';
import {
  AuthorizeResult,
  EvaluatePermissionRequest,
} from '@backstage/plugin-permission-common';
import { MockAlertApi } from './AlertApi';
import { MockFeatureFlagsApi } from './FeatureFlagsApi';
import { MockAnalyticsApi } from './AnalyticsApi';
import { MockConfigApi } from './ConfigApi';
import { MockErrorApi } from './ErrorApi';
import { MockFetchApi, MockFetchApiOptions } from './FetchApi';
import { MockStorageApi } from './StorageApi';
import { MockPermissionApi } from './PermissionApi';
import { MockTranslationApi } from './TranslationApi';
import {
  attachMockApiFactory,
  type MockWithApiFactory,
} from './MockWithApiFactory';
import { createApiMock } from './createApiMock';

/**
 * Mock implementations of the core utility APIs, to be used in tests.
 * Each {@link @backstage/frontend-plugin-api#coreApis} member has a matching
 * `.mock()` helper. Some APIs also provide functional fake instances.
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
    return attachMockApiFactory(
      coreApis.alert,
      instance,
    ) as MockWithApiFactory<MockAlertApi>;
  }
  /**
   * Mock helpers for {@link @backstage/frontend-plugin-api#AlertApi}.
   *
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
    export const mock = createApiMock(coreApis.alert, () => ({
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
  export function featureFlags(options?: {
    initialStates?: Record<string, FeatureFlagState>;
  }): MockWithApiFactory<MockFeatureFlagsApi> {
    const instance = new MockFeatureFlagsApi(options);
    return attachMockApiFactory(
      coreApis.featureFlags,
      instance,
    ) as MockWithApiFactory<MockFeatureFlagsApi>;
  }
  /**
   * Mock helpers for {@link @backstage/frontend-plugin-api#FeatureFlagsApi}.
   *
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
    export const mock = createApiMock(coreApis.featureFlags, () => ({
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
    return attachMockApiFactory(
      coreApis.analytics,
      instance,
    ) as MockAnalyticsApi & MockWithApiFactory<AnalyticsApi>;
  }

  /**
   * Mock helpers for {@link @backstage/core-plugin-api#AnalyticsApi}.
   *
   * @public
   */
  export namespace analytics {
    export const mock = createApiMock(coreApis.analytics, () => ({
      captureEvent: jest.fn(),
    }));
  }

  /**
   * Fake implementation of {@link @backstage/frontend-plugin-api#TranslationApi}.
   * By default returns the default translation.
   *
   * @public
   */
  export function translation(): MockTranslationApi &
    MockWithApiFactory<TranslationApi> {
    const instance = MockTranslationApi.create();
    return attachMockApiFactory(
      coreApis.translation,
      instance,
    ) as MockTranslationApi & MockWithApiFactory<TranslationApi>;
  }

  /**
   * Mock helpers for {@link @backstage/frontend-plugin-api#TranslationApi}.
   *
   * @public
   */
  export namespace translation {
    /**
     * Creates a mock of {@link @backstage/frontend-plugin-api#TranslationApi}.
     *
     * @public
     */
    export const mock = createApiMock(coreApis.translation, () => ({
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
    return attachMockApiFactory(coreApis.config, instance) as MockConfigApi &
      MockWithApiFactory<ConfigApi>;
  }

  /**
   * Mock helpers for {@link @backstage/core-plugin-api#ConfigApi}.
   *
   * @public
   */
  export namespace config {
    export const mock = createApiMock(coreApis.config, () => ({
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
    return attachMockApiFactory(coreApis.discovery, instance) as DiscoveryApi &
      MockWithApiFactory<DiscoveryApi>;
  }

  /**
   * Mock helpers for {@link @backstage/core-plugin-api#DiscoveryApi}.
   *
   * @public
   */
  export namespace discovery {
    export const mock = createApiMock(coreApis.discovery, () => ({
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
  }): MockWithApiFactory<IdentityApi> {
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
    return attachMockApiFactory(coreApis.identity, instance) as IdentityApi &
      MockWithApiFactory<IdentityApi>;
  }

  /**
   * Mock helpers for {@link @backstage/core-plugin-api#IdentityApi}.
   *
   * @public
   */
  export namespace identity {
    export const mock = createApiMock(coreApis.identity, () => ({
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
    return attachMockApiFactory(
      permissionApiRef,
      instance,
    ) as MockPermissionApi & MockWithApiFactory<PermissionApi>;
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
    return attachMockApiFactory(coreApis.storage, instance) as MockStorageApi &
      MockWithApiFactory<StorageApi>;
  }

  /**
   * Mock helpers for {@link @backstage/core-plugin-api#StorageApi}.
   *
   * @public
   */
  export namespace storage {
    export const mock = createApiMock(coreApis.storage, () => ({
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
  export function error(options?: {
    collect?: boolean;
  }): MockErrorApi & MockWithApiFactory<ErrorApi> {
    const instance = new MockErrorApi(options);
    return attachMockApiFactory(coreApis.error, instance) as MockErrorApi &
      MockWithApiFactory<ErrorApi>;
  }

  /**
   * Mock helpers for {@link @backstage/core-plugin-api#ErrorApi}.
   *
   * @public
   */
  export namespace error {
    export const mock = createApiMock(coreApis.error, () => ({
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
    return attachMockApiFactory(coreApis.fetch, instance) as MockFetchApi &
      MockWithApiFactory<FetchApi>;
  }

  /**
   * Mock helpers for {@link @backstage/core-plugin-api#FetchApi}.
   *
   * @public
   */
  export namespace fetch {
    export const mock = createApiMock(coreApis.fetch, () => ({
      fetch: jest.fn(),
    }));
  }

  /**
   * Mock helpers for {@link @backstage/frontend-plugin-api#AppLanguageApi}.
   *
   * @public
   */
  export namespace appLanguage {
    /**
     * Creates a mock with jest functions for all methods.
     * Pass partial implementations to customize the behavior.
     *
     * @public
     */
    export const mock = createApiMock(coreApis.appLanguage, () => ({
      getAvailableLanguages: jest.fn(() => ({ languages: ['en'] })),
      setLanguage: jest.fn(),
      getLanguage: jest.fn(() => ({ language: 'en' })),
      language$: jest.fn(() => Observable.of({ language: 'en' })),
    }));
  }

  /**
   * Mock helpers for {@link @backstage/frontend-plugin-api#AppLifecycleApi}.
   *
   * @public
   */
  export namespace appLifecycle {
    /**
     * Creates a mock with jest functions for all methods.
     * Pass partial implementations to customize the behavior.
     *
     * @public
     */
    export const mock = createApiMock(coreApis.appLifecycle, () => ({
      isFinalized: jest.fn(() => true),
      subscribe: jest.fn((_listener: () => void) => () => {}),
    }));
  }

  /**
   * Mock helpers for {@link @backstage/frontend-plugin-api#AppThemeApi}.
   *
   * @public
   */
  export namespace appTheme {
    /**
     * Creates a mock with jest functions for all methods.
     * Pass partial implementations to customize the behavior.
     *
     * @public
     */
    export const mock = createApiMock(coreApis.appTheme, () => ({
      getInstalledThemes: jest.fn(() => []),
      activeThemeId$: jest.fn(() =>
        Observable.of<string | undefined>(undefined),
      ),
      getActiveThemeId: jest.fn(),
      setActiveThemeId: jest.fn(),
    }));
  }

  /**
   * Mock helpers for {@link @backstage/frontend-plugin-api#AppTreeApi}.
   *
   * @public
   */
  export namespace appTree {
    /**
     * Creates a mock with jest functions for all methods.
     * Pass partial implementations to customize the behavior.
     *
     * @public
     */
    export const mock = createApiMock(coreApis.appTree, () => ({
      getTree: jest.fn(),
      getNodesByRoutePath: jest.fn((_routePath: string) => ({ nodes: [] })),
    }));
  }

  /**
   * Mock helpers for {@link @backstage/frontend-plugin-api#DialogApi}.
   *
   * @public
   */
  export namespace dialog {
    /**
     * Creates a mock with jest functions for all methods.
     * Pass partial implementations to customize the behavior.
     *
     * @public
     */
    export const mock = createApiMock(coreApis.dialog, () => ({
      open: jest.fn(),
      show: jest.fn(),
      showModal: jest.fn(),
    }));
  }

  /**
   * Mock helpers for {@link @backstage/frontend-plugin-api#IconsApi}.
   *
   * @public
   */
  export namespace icons {
    /**
     * Creates a mock with jest functions for all methods.
     * Pass partial implementations to customize the behavior.
     *
     * @public
     */
    export const mock = createApiMock(coreApis.icons, () => ({
      icon: jest.fn(),
      getIcon: jest.fn(),
      listIconKeys: jest.fn(() => []),
    }));
  }

  /**
   * Mock helpers for {@link @backstage/frontend-plugin-api#OAuthRequestApi}.
   *
   * @public
   */
  export namespace oauthRequest {
    /**
     * Creates a mock with jest functions for all methods.
     * Pass partial implementations to customize the behavior.
     *
     * @public
     */
    export const mock = createApiMock(coreApis.oauthRequest, () => ({
      createAuthRequester: jest.fn(),
      authRequest$: jest.fn(() => Observable.of<PendingOAuthRequest[]>([])),
    }));
  }

  /**
   * Mock helpers for {@link @backstage/frontend-plugin-api#PluginHeaderActionsApi}.
   *
   * @public
   */
  export namespace pluginHeaderActions {
    /**
     * Creates a mock with jest functions for all methods.
     * Pass partial implementations to customize the behavior.
     *
     * @public
     */
    export const mock = createApiMock(coreApis.pluginHeaderActions, () => ({
      getPluginHeaderActions: jest.fn((_pluginId: string) => []),
    }));
  }

  /**
   * Mock helpers for {@link @backstage/frontend-plugin-api#PluginWrapperApi}.
   *
   * @public
   */
  export namespace pluginWrapper {
    /**
     * Creates a mock with jest functions for all methods.
     * Pass partial implementations to customize the behavior.
     *
     * @public
     */
    export const mock = createApiMock(coreApis.pluginWrapper, () => ({
      getRootWrapper: jest.fn(),
      getPluginWrapper: jest.fn(),
    }));
  }

  /**
   * Mock helpers for {@link @backstage/frontend-plugin-api#RouteResolutionApi}.
   *
   * @public
   */
  export namespace routeResolution {
    /**
     * Creates a mock with jest functions for all methods.
     * Pass partial implementations to customize the behavior.
     *
     * @public
     */
    export const mock = createApiMock(coreApis.routeResolution, () => ({
      resolve: jest.fn(),
    }));
  }

  /**
   * Mock helpers for {@link @backstage/frontend-plugin-api#SwappableComponentsApi}.
   *
   * @public
   */
  export namespace swappableComponents {
    /**
     * Creates a mock with jest functions for all methods.
     * Pass partial implementations to customize the behavior.
     *
     * @public
     */
    export const mock = createApiMock(coreApis.swappableComponents, () => ({
      getComponent: jest.fn(),
    }));
  }

  /**
   * Mock helpers for {@link @backstage/frontend-plugin-api#ToastApi}.
   *
   * @public
   */
  export namespace toast {
    /**
     * Creates a mock with jest functions for all methods.
     * Pass partial implementations to customize the behavior.
     *
     * @public
     */
    export const mock = createApiMock(coreApis.toast, () => ({
      post: jest.fn((_toast: ToastApiMessage) => ({ close: jest.fn() })),
    }));
  }
}
