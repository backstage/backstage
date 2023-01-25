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

/**
 * The configuration options passed to {@link createExtensionPoint}.
 *
 * @public
 * @see {@link https://backstage.io/docs/backend-system/architecture/extension-points | The architecture of extension points}
 * @see {@link https://backstage.io/docs/backend-system/architecture/naming-patterns | Recommended naming patterns}
 */
export interface ExtensionPointConfig {
  /**
   * The ID of this extension point.
   *
   * @see {@link https://backstage.io/docs/backend-system/architecture/naming-patterns | Recommended naming patterns}
   */
  id: string;
}

/**
 * Creates a new backend extension point.
 *
 * @public
 * @see {@link https://backstage.io/docs/backend-system/architecture/extension-points | The architecture of extension points}
 */
export function createExtensionPoint<T>(
  config: ExtensionPointConfig,
): ExtensionPoint<T> {
  return {
    id: config.id,
    get T(): T {
      throw new Error(`tried to read ExtensionPoint.T of ${this}`);
    },
    toString() {
      return `extensionPoint{${config.id}}`;
    },
    $$ref: 'extension-point', // TODO: declare
  };
}

/**
 * The configuration options passed to {@link createBackendPlugin}.
 *
 * @public
 * @see {@link https://backstage.io/docs/backend-system/architecture/plugins | The architecture of plugins}
 * @see {@link https://backstage.io/docs/backend-system/architecture/naming-patterns | Recommended naming patterns}
 */
export interface BackendPluginConfig {
  /**
   * The ID of this plugin.
   *
   * @see {@link https://backstage.io/docs/backend-system/architecture/naming-patterns | Recommended naming patterns}
   */
  id: string;
  register(reg: BackendRegistrationPoints): void;
}

/**
 * Creates a new backend plugin.
 *
 * @public
 * @see {@link https://backstage.io/docs/backend-system/architecture/plugins | The architecture of plugins}
 * @see {@link https://backstage.io/docs/backend-system/architecture/naming-patterns | Recommended naming patterns}
 */
export function createBackendPlugin<TOptions extends [options?: object] = []>(
  config: BackendPluginConfig | ((...params: TOptions) => BackendPluginConfig),
): (...params: TOptions) => BackendFeature {
  if (typeof config === 'function') {
    return config;
  }

  return () => config;
}

/**
 * The configuration options passed to {@link createBackendModule}.
 *
 * @public
 * @see {@link https://backstage.io/docs/backend-system/architecture/modules | The architecture of modules}
 * @see {@link https://backstage.io/docs/backend-system/architecture/naming-patterns | Recommended naming patterns}
 */
export interface BackendModuleConfig {
  /**
   * The ID of this plugin.
   *
   * @see {@link https://backstage.io/docs/backend-system/architecture/naming-patterns | Recommended naming patterns}
   */
  pluginId: string;
  /**
   * Should exactly match the `id` of the plugin that the module extends.
   */
  moduleId: string;
  register(
    reg: Omit<BackendRegistrationPoints, 'registerExtensionPoint'>,
  ): void;
}

/**
 * Creates a new backend module for a given plugin.
 *
 * @public
 * @see {@link https://backstage.io/docs/backend-system/architecture/modules | The architecture of modules}
 * @see {@link https://backstage.io/docs/backend-system/architecture/naming-patterns | Recommended naming patterns}
 */
export function createBackendModule<TOptions extends [options?: object] = []>(
  config: BackendModuleConfig | ((...params: TOptions) => BackendModuleConfig),
): (...params: TOptions) => BackendFeature {
  if (typeof config === 'function') {
    return (...options: TOptions) => {
      const c = config(...options);
      return {
        id: `${c.pluginId}.${c.moduleId}`,
        register: c.register,
      };
    };
  }
  return () => ({
    id: `${config.pluginId}.${config.moduleId}`,
    register(register: BackendRegistrationPoints) {
      // TODO: Hide registerExtensionPoint
      return config.register(register);
    },
  });
}
