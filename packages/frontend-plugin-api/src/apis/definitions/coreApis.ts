/*
 * Copyright 2026 The Backstage Authors
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
  appHistoryApiRef,
  type AppHistoryApi,
} from '../../routing/AppHistoryApi';
import type { PluginWrapperBlueprint } from '../../blueprints/PluginWrapperBlueprint';
import type { PluginHeaderActionBlueprint } from '../../blueprints/PluginHeaderActionBlueprint';
import type { createSwappableComponent } from '../../components/createSwappableComponent';
import type { ApiRef } from '../system/types';
import { analyticsApiRef, type AnalyticsApi } from './AnalyticsApi';
import { appLanguageApiRef, type AppLanguageApi } from './AppLanguageApi';
import { appLifecycleApiRef, type AppLifecycleApi } from './AppLifecycleApi';
import { appThemeApiRef, type AppThemeApi } from './AppThemeApi';
import { appTreeApiRef, type AppTreeApi } from './AppTreeApi';
import { configApiRef, type ConfigApi } from './ConfigApi';
import { dialogApiRef, type DialogApi } from './DialogApi';
import { discoveryApiRef, type DiscoveryApi } from './DiscoveryApi';
import { errorApiRef, type ErrorApi } from './ErrorApi';
import { featureFlagsApiRef, type FeatureFlagsApi } from './FeatureFlagsApi';
import { fetchApiRef, type FetchApi } from './FetchApi';
import { iconsApiRef, type IconsApi } from './IconsApi';
import { identityApiRef, type IdentityApi } from './IdentityApi';
import { oauthRequestApiRef, type OAuthRequestApi } from './OAuthRequestApi';
import {
  pluginHeaderActionsApiRef,
  type PluginHeaderActionsApi,
} from './PluginHeaderActionsApi';
import { pluginWrapperApiRef, type PluginWrapperApi } from './PluginWrapperApi';
import {
  routeResolutionApiRef,
  type RouteResolutionApi,
} from './RouteResolutionApi';
import { storageApiRef, type StorageApi } from './StorageApi';
import {
  swappableComponentsApiRef,
  type SwappableComponentsApi,
} from './SwappableComponentsApi';
import { toastApiRef, type ToastApi } from './ToastApi';
import { translationApiRef, type TranslationApi } from './TranslationApi';

// Keep documentation-only imports in declarations so editor links can resolve.
export type {
  PluginWrapperBlueprint,
  PluginHeaderActionBlueprint,
  createSwappableComponent,
  AnalyticsApi,
  AppLanguageApi,
  AppLifecycleApi,
  AppThemeApi,
  AppTreeApi,
  ConfigApi,
  DialogApi,
  DiscoveryApi,
  ErrorApi,
  FeatureFlagsApi,
  FetchApi,
  IconsApi,
  IdentityApi,
  OAuthRequestApi,
  PluginHeaderActionsApi,
  PluginWrapperApi,
  RouteResolutionApi,
  StorageApi,
  SwappableComponentsApi,
  ToastApi,
  TranslationApi,
};

// Keep member documentation explicit: editor hovers do not expand @inheritDoc.

/**
 * Core Utility API references provided by the frontend system.
 *
 * @public
 */
export interface CoreApis {
  /**
   * The API reference for {@link AppHistoryApi}.
   *
   * @public
   */
  readonly appHistory: ApiRef<AppHistoryApi>;

  /**
   * The API reference of {@link AnalyticsApi}.
   *
   * @remarks
   *
   * To define a concrete Analytics Implementation, use
   * {@link https://github.com/backstage/backstage/blob/master/plugins/app-react/src/blueprints/AnalyticsImplementationBlueprint.ts | AnalyticsImplementationBlueprint}.
   *
   * @public
   */
  readonly analytics: typeof analyticsApiRef;

  /**
   * The API reference for {@link AppLanguageApi}.
   *
   * @public
   */
  readonly appLanguage: typeof appLanguageApiRef;

  /**
   * The {@link ApiRef} of {@link AppThemeApi}.
   *
   * @public
   */
  readonly appTheme: typeof appThemeApiRef;

  /**
   * The `ApiRef` of {@link AppTreeApi}.
   *
   * @public
   */
  readonly appTree: typeof appTreeApiRef;

  /**
   * The {@link ApiRef} of {@link ConfigApi}.
   *
   * @public
   */
  readonly config: typeof configApiRef;

  /**
   * The `ApiRef` of {@link DialogApi}.
   *
   * @public
   */
  readonly dialog: typeof dialogApiRef;

  /**
   * The {@link ApiRef} of {@link DiscoveryApi}.
   *
   * @public
   */
  readonly discovery: typeof discoveryApiRef;

  /**
   * The {@link ApiRef} of {@link ErrorApi}.
   *
   * @public
   */
  readonly error: typeof errorApiRef;

  /**
   * The {@link ApiRef} of {@link FeatureFlagsApi}.
   *
   * @public
   */
  readonly featureFlags: typeof featureFlagsApiRef;

  /**
   * The {@link ApiRef} of {@link FetchApi}.
   *
   * @remarks
   *
   * This is a wrapper for the fetch API, that has additional behaviors such as
   * the ability to automatically inject auth information where necessary.
   *
   * Note that the default behavior of this API (unless overridden by your org),
   * is to require that the user is already signed in so that it has auth
   * information to inject. Therefore, using the default implementation of this
   * utility API e.g. on the `SignInPage` or similar, would cause issues. In
   * special circumstances like those, you can use the regular system `fetch`
   * instead.
   *
   * @public
   */
  readonly fetch: typeof fetchApiRef;

  /**
   * The `ApiRef` of {@link IconsApi}.
   *
   * @public
   */
  readonly icons: typeof iconsApiRef;

  /**
   * The {@link ApiRef} of {@link IdentityApi}.
   *
   * @public
   */
  readonly identity: typeof identityApiRef;

  /**
   * The `ApiRef` of {@link RouteResolutionApi}.
   *
   * @public
   */
  readonly routeResolution: typeof routeResolutionApiRef;

  /**
   * The {@link ApiRef} of {@link StorageApi}.
   *
   * @public
   */
  readonly storage: typeof storageApiRef;

  /**
   * The {@link ApiRef} of {@link ToastApi}.
   *
   * @public
   */
  readonly toast: typeof toastApiRef;

  /**
   * The API reference for {@link TranslationApi}.
   *
   * @public
   */
  readonly translation: typeof translationApiRef;

  /**
   * References to core Utility APIs primarily intended for framework integrations.
   *
   * @remarks
   *
   * These APIs support app initialization, OAuth request coordination, and rendering
   * infrastructure. Most plugins should use higher-level abstractions such as
   * {@link PluginWrapperBlueprint},
   * {@link PluginHeaderActionBlueprint}, and {@link createSwappableComponent}.
   * These refs are public exports for integrations that need direct access.
   *
   * @public
   */
  readonly internal: InternalCoreApis;
}

/**
 * Core Utility API references primarily intended for framework integrations.
 *
 * @public
 */
export interface InternalCoreApis {
  /**
   * The {@link ApiRef} of {@link AppLifecycleApi}.
   *
   * @public
   */
  readonly appLifecycle: typeof appLifecycleApiRef;

  /**
   * The {@link ApiRef} of {@link OAuthRequestApi}.
   *
   * @public
   */
  readonly oauthRequest: typeof oauthRequestApiRef;

  /**
   * The `ApiRef` of {@link PluginHeaderActionsApi}.
   *
   * @public
   */
  readonly pluginHeaderActions: typeof pluginHeaderActionsApiRef;

  /**
   * The API reference of {@link PluginWrapperApi}.
   *
   * @public
   */
  readonly pluginWrapper: typeof pluginWrapperApiRef;

  /**
   * The `ApiRef` of {@link SwappableComponentsApi}.
   *
   * @public
   */
  readonly swappableComponents: typeof swappableComponentsApiRef;
}

/**
 * References to the {@link CoreApis | core Utility APIs} provided by the frontend system.
 *
 * @remarks
 *
 * Use these refs with `useApi` or when declaring API factory dependencies.
 * Framework infrastructure APIs are grouped under {@link CoreApis.internal | coreApis.internal}.
 * Provider-specific authentication APIs are exported separately.
 *
 * @public
 */
export const coreApis: CoreApis = {
  appHistory: appHistoryApiRef,
  analytics: analyticsApiRef,
  appLanguage: appLanguageApiRef,
  appTheme: appThemeApiRef,
  appTree: appTreeApiRef,
  config: configApiRef,
  dialog: dialogApiRef,
  discovery: discoveryApiRef,
  error: errorApiRef,
  featureFlags: featureFlagsApiRef,
  fetch: fetchApiRef,
  icons: iconsApiRef,
  identity: identityApiRef,
  routeResolution: routeResolutionApiRef,
  storage: storageApiRef,
  toast: toastApiRef,
  translation: translationApiRef,
  internal: {
    appLifecycle: appLifecycleApiRef,
    oauthRequest: oauthRequestApiRef,
    pluginHeaderActions: pluginHeaderActionsApiRef,
    pluginWrapper: pluginWrapperApiRef,
    swappableComponents: swappableComponentsApiRef,
  },
};
