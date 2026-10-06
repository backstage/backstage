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
  alertApiRef,
  appHistoryApiRef,
  routeResolutionApiRef,
  type AnalyticsApi,
  type AppHistoryApi,
  type AppNavigateOptions,
  type AppLocation,
  type RouteResolutionApi,
  type ConfigApi,
  type DiscoveryApi,
  type ErrorApi,
  type FetchApi,
  type FeatureFlagState,
  type IdentityApi,
  type StorageApi,
  type TranslationApi,
  type AppLanguageApi,
  type AppLifecycleApi,
  type AppTheme,
  type AppThemeApi,
  type IconsApi,
  type IconElement,
  type OAuthRequestApi,
  type PluginHeaderActionsApi,
  type ToastApi,
  type ToastApiMessage,
} from '@backstage/frontend-plugin-api';
import {
  permissionApiRef,
  type PermissionApi,
} from '@backstage/plugin-permission-react';
import { JSX } from 'react';
import { JsonObject } from '@backstage/types';
import { OAuthRequestManager } from '@backstage/core-app-api';
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
import { createApiMock, type ApiMock } from './createApiMock';
import {
  createMockAppHistory,
  type MockAppHistory,
  type MockAppHistoryOptions,
} from './createMockAppHistory';
import {
  createMockRouteResolutionApi,
  type MockRouteResolutionApi,
  type MockRouteResolutionApiOptions,
} from './createMockRouteResolutionApi';

function createObservableState<T>(initialValue: T) {
  let value = initialValue;
  const listeners = new Set<(nextValue: T) => void>();
  return {
    get: () => value,
    set(nextValue: T) {
      if (value === nextValue) {
        return;
      }
      value = nextValue;
      listeners.forEach(listener => listener(nextValue));
    },
    observable: new Observable<T>(subscriber => {
      const listener = (nextValue: T) => subscriber.next(nextValue);
      listeners.add(listener);
      subscriber.next(value);
      return () => {
        listeners.delete(listener);
      };
    }),
  };
}

/**
 * Mock implementations of the core utility APIs, to be used in tests.
 * Each {@link @backstage/frontend-plugin-api#coreApis} member has a matching
 * `.mock()` helper. Some APIs also provide functional fake instances.
 *
 * @public
 * @remarks
 *
 * Call `.mock()` to create an API whose methods are plain `jest.fn()` stubs
 * without default behavior. Supply partial implementations for methods used
 * by your test, then make assertions using Jest:
 *
 * ```ts
 * const discovery = mockApis.discovery.mock({
 *   getBaseUrl: async pluginId => `http://example.com/api/${pluginId}`,
 * });
 * await discovery.getBaseUrl('catalog');
 * expect(discovery.getBaseUrl).toHaveBeenCalledWith('catalog');
 * ```
 *
 * Some APIs also provide functional fake instances, created by calling the
 * helper directly. These maintain state or provide other useful behavior:
 *
 * ```ts
 * const toast = mockApis.toast();
 * toast.post({ title: 'Saved' });
 * expect(toast.getToasts()).toEqual([{ title: 'Saved' }]);
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
      alertApiRef,
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
   * Creates an in-memory language selector. Defaults to English, emits the
   * current language on subscription, and notifies subscribers when it changes.
   *
   * @public
   */
  export function appLanguage(options?: {
    defaultLanguage?: string;
    availableLanguages?: string[];
  }): MockWithApiFactory<AppLanguageApi> {
    const defaultLanguage = options?.defaultLanguage ?? 'en';
    const languages = [
      ...new Set([defaultLanguage, ...(options?.availableLanguages ?? [])]),
    ];
    const state = createObservableState({ language: defaultLanguage });
    return attachMockApiFactory<AppLanguageApi>(coreApis.appLanguage, {
      getAvailableLanguages: () => ({ languages: [...languages] }),
      getLanguage: () => ({ ...state.get() }),
      setLanguage(language = defaultLanguage) {
        if (!languages.includes(language)) {
          throw new Error(`Language '${language}' is not available`);
        }
        if (language !== state.get().language) {
          state.set({ language });
        }
      },
      language$: () => state.observable,
    });
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
      getAvailableLanguages: jest.fn(),
      setLanguage: jest.fn(),
      getLanguage: jest.fn(),
      language$: jest.fn(),
    }));
  }

  /**
   * Creates an in-memory app lifecycle, finalized by default. Use `setFinalized`
   * to simulate lifecycle changes and notify subscribers.
   *
   * @public
   */
  export function appLifecycle(options?: {
    finalized?: boolean;
  }): MockWithApiFactory<AppLifecycleApi> & {
    setFinalized(finalized: boolean): void;
  } {
    let finalized = options?.finalized ?? true;
    const listeners = new Set<() => void>();
    return attachMockApiFactory<
      AppLifecycleApi,
      AppLifecycleApi & { setFinalized(finalized: boolean): void }
    >(coreApis.appLifecycle, {
      isFinalized: () => finalized,
      subscribe(listener: () => void) {
        listeners.add(listener);
        return () => {
          listeners.delete(listener);
        };
      },
      setFinalized(value: boolean) {
        if (value !== finalized) {
          finalized = value;
          listeners.forEach(listener => listener());
        }
      },
    });
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
      isFinalized: jest.fn(),
      subscribe: jest.fn(),
    }));
  }

  /**
   * Creates an in-memory theme selector with no installed themes or selected
   * theme by default. Changes notify subscribers without using browser storage.
   *
   * @public
   */
  export function appTheme(options?: {
    themes?: AppTheme[];
    activeThemeId?: string;
  }): MockWithApiFactory<AppThemeApi> {
    const themes = [...(options?.themes ?? [])];
    const state = createObservableState<string | undefined>(
      options?.activeThemeId,
    );
    return attachMockApiFactory<AppThemeApi>(coreApis.appTheme, {
      getInstalledThemes: () => [...themes],
      getActiveThemeId: () => state.get(),
      setActiveThemeId: themeId => state.set(themeId),
      activeThemeId$: () => state.observable,
    });
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
      getInstalledThemes: jest.fn(),
      activeThemeId$: jest.fn(),
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
      getNodesByRoutePath: jest.fn(),
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
   * Creates an icon lookup backed by the supplied elements, empty by default.
   * Legacy component lookups return the same component for each key.
   *
   * @public
   */
  export function icons(options?: {
    icons?: Record<string, IconElement>;
  }): MockWithApiFactory<IconsApi> {
    const entries = new Map(
      Object.entries(options?.icons ?? {}).map(([key, element]) => [
        key,
        { element, component: () => element },
      ]),
    );
    return attachMockApiFactory<IconsApi>(coreApis.icons, {
      icon: key => entries.get(key)?.element,
      getIcon: key => entries.get(key)?.component,
      listIconKeys: () => [...entries.keys()],
    });
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
      listIconKeys: jest.fn(),
    }));
  }

  /**
   * Creates an in-memory OAuth request coordinator. Requests remain pending
   * until triggered or rejected through `authRequest$()`.
   *
   * @public
   */
  export function oauthRequest(): MockWithApiFactory<OAuthRequestApi> {
    return attachMockApiFactory(
      coreApis.oauthRequest,
      new OAuthRequestManager(),
    );
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
      authRequest$: jest.fn(),
    }));
  }

  /**
   * Creates a lookup of header actions by plugin ID, empty by default.
   *
   * @public
   */
  export function pluginHeaderActions(options?: {
    actions?: Record<string, Array<JSX.Element | null>>;
  }): MockWithApiFactory<PluginHeaderActionsApi> {
    const actions = new Map(Object.entries(options?.actions ?? {}));
    return attachMockApiFactory<PluginHeaderActionsApi>(
      coreApis.pluginHeaderActions,
      {
        getPluginHeaderActions: pluginId => [...(actions.get(pluginId) ?? [])],
      },
    );
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
      getPluginHeaderActions: jest.fn(),
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
   * Fake implementation of {@link @backstage/frontend-plugin-api#AppHistoryApi}.
   *
   * @public
   */
  export function appHistory(
    options?: MockAppHistoryOptions,
  ): MockAppHistory & MockWithApiFactory<AppHistoryApi> {
    const instance = createMockAppHistory(options);
    return attachMockApiFactory(appHistoryApiRef, instance) as MockAppHistory &
      MockWithApiFactory<AppHistoryApi>;
  }

  /**
   * Mock helpers for {@link @backstage/frontend-plugin-api#AppHistoryApi}.
   * Backed by in-memory history: navigation still validates paths and emits
   * locations even when the call is observed by a Jest mock.
   *
   * @public
   */
  export namespace appHistory {
    export const mock: (
      partialImpl?: Partial<AppHistoryApi> | undefined,
    ) => ApiMock<AppHistoryApi> = partialImpl => {
      // Preserve location updates when observing navigation.
      const { navigate, ...rest } = partialImpl ?? {};
      const instance = createMockAppHistory({ navigate });
      const navigateMock = jest.fn(
        (...args: [path: string, options?: AppNavigateOptions] | [delta: number]) => {
          if (typeof args[0] === 'number') {
            instance.navigate(args[0]);
          } else if (args.length === 1) {
            instance.navigate(args[0]);
          } else {
            instance.navigate(args[0], args[1]);
          }
        },
      ) as unknown as jest.MockedFunction<AppHistoryApi['navigate']>;
      let pinnedLocation: AppLocation | undefined;

      return createApiMock(appHistoryApiRef, () => ({
        get location() {
          return pinnedLocation ?? instance.location;
        },
        set location(value: AppLocation) {
          pinnedLocation = value;
        },
        location$: instance.location$,
        navigate: navigateMock,
        createHref: jest.fn(
          (...args: Parameters<AppHistoryApi['createHref']>) =>
            instance.createHref(...args),
        ),
      }))(rest);
    };
  }

  /**
   * Fake implementation of {@link @backstage/frontend-plugin-api#RouteResolutionApi}.
   *
   * @public
   */
  export function routeResolution(
    options?: MockRouteResolutionApiOptions,
  ): MockRouteResolutionApi & MockWithApiFactory<RouteResolutionApi> {
    const instance = createMockRouteResolutionApi(options);
    return attachMockApiFactory(
      routeResolutionApiRef,
      instance,
    ) as MockRouteResolutionApi & MockWithApiFactory<RouteResolutionApi>;
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
    export const mock = createApiMock(routeResolutionApiRef, () => ({
      resolve: jest.fn(),
      resolveTarget: jest.fn(),
      resolvePath: jest.fn<
        ReturnType<RouteResolutionApi['resolvePath']>,
        Parameters<RouteResolutionApi['resolvePath']>
      >(() => ({ matches: [] })),
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
   * Collects toast notifications without rendering them or scheduling timeouts.
   * `getToasts` returns active messages; closing a handle removes its message.
   *
   * @public
   */
  export function toast(): MockWithApiFactory<ToastApi> & {
    getToasts(): ToastApiMessage[];
  } {
    const toasts = new Set<{ message: ToastApiMessage }>();
    return attachMockApiFactory<
      ToastApi,
      ToastApi & { getToasts(): ToastApiMessage[] }
    >(coreApis.toast, {
      post(message: ToastApiMessage) {
        const entry = { message };
        toasts.add(entry);
        return {
          close: () => {
            toasts.delete(entry);
          },
        };
      },
      getToasts: () => [...toasts].map(entry => entry.message),
    });
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
      post: jest.fn(),
    }));
  }
}
