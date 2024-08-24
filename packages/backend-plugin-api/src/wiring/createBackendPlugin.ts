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
  BackendPluginRegistrationPoints,
  InternalBackendPluginRegistration,
  InternalBackendRegistrations,
} from './types';

/**
 * The configuration options passed to {@link createBackendPlugin}.
 *
 * @public
 * @see {@link https://backstage.io/docs/backend-system/architecture/plugins | The architecture of plugins}
 * @see {@link https://backstage.io/docs/backend-system/architecture/naming-patterns | Recommended naming patterns}
 */
export interface CreateBackendPluginOptions {
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
export function createBackendPlugin(
  options: CreateBackendPluginOptions,
): BackendFeature {
  function getRegistrations() {
    const extensionPoints: InternalBackendPluginRegistration['extensionPoints'] =
      [];
    let init: InternalBackendPluginRegistration['init'] | undefined = undefined;

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
        `registerInit was not called by register in ${options.pluginId}`,
      );
    }

    return [
      {
        type: 'plugin',
        pluginId: options.pluginId,
        extensionPoints,
        init,
      },
    ];
  }

  return {
    $$type: '@backstage/BackendFeature' as const,
    version: 'v1',
    featureType: 'registrations',
    getRegistrations,
  } as InternalBackendRegistrations;
}
