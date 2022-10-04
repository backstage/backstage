/*
 * Copyright 2022 The Backstage Authors
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
  BackendRegistrationPoints,
  BackendFeature,
  ExtensionPoint,
} from './types';

/** @public */
export function createExtensionPoint<T>(options: {
  id: string;
}): ExtensionPoint<T> {
  return {
    id: options.id,
    get T(): T {
      throw new Error(`tried to read ExtensionPoint.T of ${this}`);
    },
    toString() {
      return `extensionPoint{${options.id}}`;
    },
    $$ref: 'extension-point', // TODO: declare
  };
}

/** @public */
export interface BackendPluginConfig<TOptions> {
  id: string;
  register(reg: BackendRegistrationPoints, options: TOptions): void;
}

/** @public */
export function createBackendPlugin<
  TOptions extends object | undefined = undefined,
>(config: {
  id: string;
  register(reg: BackendRegistrationPoints, options: TOptions): void;
}): undefined extends TOptions
  ? (options?: TOptions) => BackendFeature
  : (options: TOptions) => BackendFeature {
  return (options?: TOptions) => ({
    id: config.id,
    register(register: BackendRegistrationPoints) {
      return config.register(register, options!);
    },
  });
}

/** @public */
export interface BackendModuleConfig<TOptions> {
  pluginId: string;
  moduleId: string;
  register(
    reg: Omit<BackendRegistrationPoints, 'registerExtensionPoint'>,
    options: TOptions,
  ): void;
}

/**
 * @public
 *
 * Creates a new backend module for a given plugin.
 *
 * The `moduleId` should be equal to the module-specific prefix of the exported name, such
 * that the full name is `moduleId + PluginId + "Module"`. For example, a GitHub entity
 * provider module for the `catalog` plugin might have the module ID `'githubEntityProvider'`,
 * and the full exported name would be `githubEntityProviderCatalogModule`.
 *
 * The `pluginId` should exactly match the `id` of the plugin that the module extends.
 */
export function createBackendModule<
  TOptions extends object | undefined = undefined,
>(
  config: BackendModuleConfig<TOptions>,
): undefined extends TOptions
  ? (options?: TOptions) => BackendFeature
  : (options: TOptions) => BackendFeature {
  return (options?: TOptions) => ({
    id: `${config.pluginId}.${config.moduleId}`,
    register(register: BackendRegistrationPoints) {
      // TODO: Hide registerExtensionPoint
      return config.register(register, options!);
    },
  });
}
