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
  BackendModuleRegistrationPoints,
  BackendPluginRegistrationPoints,
  BackendFeature,
  ExtensionPoint,
  InternalBackendFeature,
  InternalBackendModuleRegistration,
  InternalBackendPluginRegistration,
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
    $$type: '@backstage/ExtensionPoint',
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
  pluginId: string;
  register(reg: BackendPluginRegistrationPoints): void;
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
  const configCallback = typeof config === 'function' ? config : () => config;
  return (...options: TOptions): InternalBackendFeature => {
    const c = configCallback(...options);

    let registrations: InternalBackendPluginRegistration[];

    return {
      $$type: '@backstage/BackendFeature',
      version: 'v1',
      getRegistrations() {
        if (registrations) {
          return registrations;
        }
        const extensionPoints: InternalBackendPluginRegistration['extensionPoints'] =
          [];
        let init: InternalBackendPluginRegistration['init'] | undefined =
          undefined;

        c.register({
          registerExtensionPoint(ext, impl) {
            if (init) {
              throw new Error(
                'registerExtensionPoint called after registerInit',
              );
            }
            extensionPoints.push([ext, impl]);
          },
          registerInit(regInit) {
            if (init) {
              throw new Error('registerInit must only be called once');
            }
            init = {
              deps: regInit.deps,
              func: regInit.init,
            };
          },
        });

        if (!init) {
          throw new Error(
            `registerInit was not called by register in ${c.pluginId}`,
          );
        }

        registrations = [
          {
            type: 'plugin',
            pluginId: c.pluginId,
            extensionPoints,
            init,
          },
        ];
        return registrations;
      },
    };
  };
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
  register(reg: BackendModuleRegistrationPoints): void;
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
  const configCallback = typeof config === 'function' ? config : () => config;
  return (...options: TOptions): InternalBackendFeature => {
    const c = configCallback(...options);

    let registrations: InternalBackendModuleRegistration[];

    return {
      $$type: '@backstage/BackendFeature',
      version: 'v1',
      getRegistrations() {
        if (registrations) {
          return registrations;
        }
        let init: InternalBackendModuleRegistration['init'] | undefined =
          undefined;

        c.register({
          registerInit(regInit) {
            if (init) {
              throw new Error('registerInit must only be called once');
            }
            init = {
              deps: regInit.deps,
              func: regInit.init,
            };
          },
        });

        if (!init) {
          throw new Error(
            `registerInit was not called by register in ${c.moduleId} module for ${c.pluginId}`,
          );
        }

        registrations = [
          {
            type: 'module',
            pluginId: c.pluginId,
            moduleId: c.moduleId,
            init,
          },
        ];
        return registrations;
      },
    };
  };
}
