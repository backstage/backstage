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
  ConnectionRegistration,
  ExtensionPoint,
  ExtensionPointFactoryContext,
  InternalBackendPluginRegistrationPoints,
  InternalBackendPluginRegistrationV1_1,
  InternalBackendRegistrations,
} from './types';
import { ID_PATTERN, ID_PATTERN_OLD } from './constants';

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
  if (!ID_PATTERN.test(options.pluginId)) {
    console.warn(
      `WARNING: The pluginId '${options.pluginId}' will be invalid soon, please change it to match the pattern ${ID_PATTERN} (letters, digits, and dashes only, starting with a letter)`,
    );
  }
  if (!ID_PATTERN_OLD.test(options.pluginId)) {
    throw new Error(
      `Invalid pluginId '${options.pluginId}', must match the pattern ${ID_PATTERN} (letters, digits, and dashes only, starting with a letter)`,
    );
  }

  function getRegistrations() {
    const extensionPoints: InternalBackendPluginRegistrationV1_1['extensionPoints'] =
      [];
    const connections: ConnectionRegistration[] = [];
    let init: InternalBackendPluginRegistrationV1_1['init'] | undefined =
      undefined;

    const reg: InternalBackendPluginRegistrationPoints = {
      registerExtensionPoint<TExtensionPoint>(
        extOrOpts:
          | ExtensionPoint<TExtensionPoint>
          | {
              extensionPoint: ExtensionPoint<TExtensionPoint>;
              factory: (
                context: ExtensionPointFactoryContext,
              ) => TExtensionPoint;
            },
        impl?: TExtensionPoint,
      ) {
        if (init) {
          throw new Error('registerExtensionPoint called after registerInit');
        }
        if (
          typeof extOrOpts === 'object' &&
          extOrOpts !== null &&
          'extensionPoint' in extOrOpts
        ) {
          extensionPoints.push({
            extensionPoint: extOrOpts.extensionPoint,
            factory: extOrOpts.factory as (
              context: ExtensionPointFactoryContext,
            ) => unknown,
          });
        } else {
          extensionPoints.push({
            extensionPoint: extOrOpts,
            factory: () => impl,
          });
        }
      },
      registerConnection(registration) {
        if (init) {
          throw new Error('registerConnection called after registerInit');
        }
        if (connections.some(c => c.type === registration.type)) {
          throw new Error(
            `Duplicate connection registration for type '${registration.type}' in plugin '${options.pluginId}'`,
          );
        }
        connections.push({ ...registration });
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
    };
    options.register(reg);

    if (!init) {
      throw new Error(
        `registerInit was not called by register in ${options.pluginId}`,
      );
    }

    return [
      {
        type: 'plugin-v1.1',
        pluginId: options.pluginId,
        extensionPoints,
        connections,
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
