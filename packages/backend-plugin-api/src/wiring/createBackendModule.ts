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

import { BackendFeature } from '../types';
import {
  BackendModuleRegistrationPoints,
  InternalBackendModuleRegistration,
  InternalBackendPluginRegistration,
  InternalBackendRegistrations,
} from './types';

/**
 * The configuration options passed to {@link createBackendModule}.
 *
 * @public
 * @see {@link https://backstage.io/docs/backend-system/architecture/modules | The architecture of modules}
 * @see {@link https://backstage.io/docs/backend-system/architecture/naming-patterns | Recommended naming patterns}
 */
export interface CreateBackendModuleOptions {
  /**
   * Should exactly match the `id` of the plugin that the module extends.
   *
   * @see {@link https://backstage.io/docs/backend-system/architecture/naming-patterns | Recommended naming patterns}
   */
  pluginId: string;

  /**
   * The ID of this module, used to identify the module and ensure that it is not installed twice.
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
export function createBackendModule(
  options: CreateBackendModuleOptions,
): BackendFeature {
  function getRegistrations() {
    const extensionPoints: InternalBackendPluginRegistration['extensionPoints'] =
      [];
    let init: InternalBackendModuleRegistration['init'] | undefined = undefined;

    options.register({
      registerExtensionPoint(ext, impl) {
        if (init) {
          throw new Error('registerExtensionPoint called after registerInit');
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
        `registerInit was not called by register in ${options.moduleId} module for ${options.pluginId}`,
      );
    }

    return [
      {
        type: 'module',
        pluginId: options.pluginId,
        moduleId: options.moduleId,
        extensionPoints,
        init,
      },
    ];
  }

  return {
    $$type: '@backstage/BackendFeature' as const,
    featureType: 'registrations',
    version: 'v1',
    getRegistrations,
  } as InternalBackendRegistrations;
}
