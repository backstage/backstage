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

import { analyticsApiRef } from './AnalyticsApi';
import { appLanguageApiRef } from './AppLanguageApi';
import { appLifecycleApiRef } from './AppLifecycleApi';
import { appThemeApiRef } from './AppThemeApi';
import { appTreeApiRef } from './AppTreeApi';
import { configApiRef } from './ConfigApi';
import { dialogApiRef } from './DialogApi';
import { discoveryApiRef } from './DiscoveryApi';
import { errorApiRef } from './ErrorApi';
import { featureFlagsApiRef } from './FeatureFlagsApi';
import { fetchApiRef } from './FetchApi';
import { iconsApiRef } from './IconsApi';
import { identityApiRef } from './IdentityApi';
import { oauthRequestApiRef } from './OAuthRequestApi';
import { pluginHeaderActionsApiRef } from './PluginHeaderActionsApi';
import { pluginWrapperApiRef } from './PluginWrapperApi';
import { routeResolutionApiRef } from './RouteResolutionApi';
import { storageApiRef } from './StorageApi';
import { swappableComponentsApiRef } from './SwappableComponentsApi';
import { toastApiRef } from './ToastApi';
import { translationApiRef } from './TranslationApi';

/**
 * References to the core Utility APIs provided by the frontend system.
 *
 * @remarks
 *
 * Use these refs with `useApi` or when declaring API factory dependencies.
 * Provider-specific authentication APIs are exported separately.
 *
 * @public
 */
export namespace coreApis {
  /**
   * The API reference for {@link AnalyticsApi}.
   *
   * @public
   */
  export const analytics: typeof analyticsApiRef = analyticsApiRef;

  /**
   * The API reference for {@link AppLanguageApi}.
   *
   * @public
   */
  export const appLanguage: typeof appLanguageApiRef = appLanguageApiRef;

  /**
   * The API reference for {@link AppLifecycleApi}.
   *
   * @public
   */
  export const appLifecycle: typeof appLifecycleApiRef = appLifecycleApiRef;

  /**
   * The API reference for {@link AppThemeApi}.
   *
   * @public
   */
  export const appTheme: typeof appThemeApiRef = appThemeApiRef;

  /**
   * The API reference for {@link AppTreeApi}.
   *
   * @public
   */
  export const appTree: typeof appTreeApiRef = appTreeApiRef;

  /**
   * The API reference for {@link ConfigApi}.
   *
   * @public
   */
  export const config: typeof configApiRef = configApiRef;

  /**
   * The API reference for {@link DialogApi}.
   *
   * @public
   */
  export const dialog: typeof dialogApiRef = dialogApiRef;

  /**
   * The API reference for {@link DiscoveryApi}.
   *
   * @public
   */
  export const discovery: typeof discoveryApiRef = discoveryApiRef;

  /**
   * The API reference for {@link ErrorApi}.
   *
   * @public
   */
  export const error: typeof errorApiRef = errorApiRef;

  /**
   * The API reference for {@link FeatureFlagsApi}.
   *
   * @public
   */
  export const featureFlags: typeof featureFlagsApiRef = featureFlagsApiRef;

  /**
   * The API reference for {@link FetchApi}.
   *
   * @public
   */
  export const fetch: typeof fetchApiRef = fetchApiRef;

  /**
   * The API reference for {@link IconsApi}.
   *
   * @public
   */
  export const icons: typeof iconsApiRef = iconsApiRef;

  /**
   * The API reference for {@link IdentityApi}.
   *
   * @public
   */
  export const identity: typeof identityApiRef = identityApiRef;

  /**
   * The API reference for {@link OAuthRequestApi}.
   *
   * @public
   */
  export const oauthRequest: typeof oauthRequestApiRef = oauthRequestApiRef;

  /**
   * The API reference for {@link PluginHeaderActionsApi}.
   *
   * @public
   */
  export const pluginHeaderActions: typeof pluginHeaderActionsApiRef =
    pluginHeaderActionsApiRef;

  /**
   * The API reference for {@link PluginWrapperApi}.
   *
   * @public
   */
  export const pluginWrapper: typeof pluginWrapperApiRef = pluginWrapperApiRef;

  /**
   * The API reference for {@link RouteResolutionApi}.
   *
   * @public
   */
  export const routeResolution: typeof routeResolutionApiRef =
    routeResolutionApiRef;

  /**
   * The API reference for {@link StorageApi}.
   *
   * @public
   */
  export const storage: typeof storageApiRef = storageApiRef;

  /**
   * The API reference for {@link SwappableComponentsApi}.
   *
   * @public
   */
  export const swappableComponents: typeof swappableComponentsApiRef =
    swappableComponentsApiRef;

  /**
   * The API reference for {@link ToastApi}.
   *
   * @public
   */
  export const toast: typeof toastApiRef = toastApiRef;

  /**
   * The API reference for {@link TranslationApi}.
   *
   * @public
   */
  export const translation: typeof translationApiRef = translationApiRef;
}
