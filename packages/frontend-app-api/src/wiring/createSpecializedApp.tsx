/*
 * Copyright 2023 The Backstage Authors
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
  ApiHolder,
  ConfigApi,
  ExtensionFactoryMiddleware,
  FrontendFeature,
} from '@backstage/frontend-plugin-api';
import { CreateAppRouteBinder } from '../routing';
import { FrontendPluginInfoResolver } from './createPluginInfoAttacher';
import {
  createSessionStateFromApis,
  CreateSpecializedAppInternalOptions,
  FinalizedSpecializedApp,
  prepareSpecializedApp,
} from './prepareSpecializedApp';

export type { CreateSpecializedAppInternalOptions };

/**
 * Options for {@link createSpecializedApp}.
 *
 * @deprecated Use `PrepareSpecializedAppOptions` with `prepareSpecializedApp` instead.
 *
 * @public
 */
export type CreateSpecializedAppOptions = {
  /**
   * The list of features to load.
   */
  features?: FrontendFeature[];

  /**
   * The config API implementation to use. For most normal apps, this should be
   * specified.
   *
   * If none is given, a new _empty_ config will be used during startup. In
   * later stages of the app lifecycle, the config API in the API holder will be
   * used.
   */
  config?: ConfigApi;

  /**
   * Allows for the binding of plugins' external route refs within the app.
   */
  bindRoutes?(context: { bind: CreateAppRouteBinder }): void;

  /**
   * Advanced, more rarely used options.
   */
  advanced?: {
    /**
     * APIs to expose to the app during startup.
     */
    apis?: ApiHolder;

    /**
     * Applies one or more middleware on every extension, as they are added to
     * the application.
     *
     * This is an advanced use case for modifying extension data on the fly as
     * it gets emitted by extensions being instantiated.
     */
    extensionFactoryMiddleware?:
      | ExtensionFactoryMiddleware
      | ExtensionFactoryMiddleware[];

    /**
     * Allows for customizing how plugin info is retrieved.
     */
    pluginInfoResolver?: FrontendPluginInfoResolver;
  };
};

/**
 * Creates an empty app without any default features. This is a low-level API is
 * intended for use in tests or specialized setups. Typically you want to use
 * `createApp` from `@backstage/frontend-defaults` instead.
 *
 * @deprecated Use `prepareSpecializedApp` instead.
 *
 * @public
 */
export function createSpecializedApp(
  options?: CreateSpecializedAppOptions,
): FinalizedSpecializedApp {
  const sessionState = options?.advanced?.apis
    ? createSessionStateFromApis(options.advanced.apis)
    : undefined;

  return prepareSpecializedApp({
    features: options?.features,
    config: options?.config,
    bindRoutes: options?.bindRoutes,
    advanced: {
      ...options?.advanced,
      sessionState,
    },
  }).finalize();
}
