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

import { appLifecycleApiRef } from './AppLifecycleApi';
import { oauthRequestApiRef } from './OAuthRequestApi';
import { pluginHeaderActionsApiRef } from './PluginHeaderActionsApi';
import { pluginWrapperApiRef } from './PluginWrapperApi';
import { swappableComponentsApiRef } from './SwappableComponentsApi';

/**
 * References to core Utility APIs primarily intended for framework integrations.
 *
 * @remarks
 *
 * These APIs support app initialization, OAuth request coordination, and rendering
 * infrastructure. Most plugins should use the APIs in {@link coreApis} and
 * higher-level abstractions such as {@link PluginWrapperBlueprint},
 * {@link PluginHeaderActionBlueprint}, and {@link createSwappableComponent}.
 * These refs are public exports for integrations that need direct access.
 *
 * @public
 */
export namespace internalCoreApis {
  /**
   * The API reference for {@link AppLifecycleApi}.
   *
   * @public
   */
  export const appLifecycle: typeof appLifecycleApiRef = appLifecycleApiRef;

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
   * The API reference for {@link SwappableComponentsApi}.
   *
   * @public
   */
  export const swappableComponents: typeof swappableComponentsApiRef =
    swappableComponentsApiRef;
}
