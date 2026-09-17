/*
 * Copyright 2024 The Backstage Authors
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

import { Config } from '@backstage/config';

export type AllowBootFailurePredicate = (
  pluginId: string,
  moduleId?: string,
) => boolean;

/**
 * Creates a predicate function that determines whether a boot failure should be
 * allowed for a given plugin or module based on configuration.
 *
 * @param config - The configuration object to read boot failure settings from
 * @returns A predicate function that accepts a pluginId and optional moduleId,
 *          and returns true if boot failures should be allowed, false otherwise.
 */
export function createAllowBootFailurePredicate(
  config?: Config,
): AllowBootFailurePredicate {
  // Read default values upfront
  const defaultPluginBootFailure =
    config?.getOptionalString('backend.startup.default.onPluginBootFailure') ??
    'abort';
  const defaultModuleBootFailure =
    config?.getOptionalString(
      'backend.startup.default.onPluginModuleBootFailure',
    ) ?? 'abort';

  // Read plugin-specific overrides upfront
  const pluginOverrides = new Map<string, string>();
  const moduleOverrides = new Map<string, Map<string, string>>();

  const pluginsConfig = config?.getOptionalConfig('backend.startup.plugins');
  if (pluginsConfig) {
    for (const pluginId of pluginsConfig.keys()) {
      const pluginConfig = pluginsConfig.getConfig(pluginId);
      const pluginBootFailure = pluginConfig.getOptionalString(
        'onPluginBootFailure',
      );
      if (pluginBootFailure) {
        pluginOverrides.set(pluginId, pluginBootFailure);
      }

      // Read module-specific overrides
      const modulesConfig = pluginConfig.getOptionalConfig('modules');
      if (modulesConfig) {
        const moduleMap = new Map<string, string>();
        for (const moduleId of modulesConfig.keys()) {
          const moduleConfig = modulesConfig.getConfig(moduleId);
          const moduleBootFailure = moduleConfig.getOptionalString(
            'onPluginModuleBootFailure',
          );
          if (moduleBootFailure) {
            moduleMap.set(moduleId, moduleBootFailure);
          }
        }
        if (moduleMap.size > 0) {
          moduleOverrides.set(pluginId, moduleMap);
        }
      }
    }
  }

  return (pluginId: string, moduleId?: string): boolean => {
    if (moduleId !== undefined) {
      // Module-specific boot failure predicate
      const moduleMap = moduleOverrides.get(pluginId);
      const moduleBootFailure =
        moduleMap?.get(moduleId) ?? defaultModuleBootFailure;
      return moduleBootFailure === 'continue';
    }
    // Plugin-specific boot failure predicate
    const pluginBootFailure =
      pluginOverrides.get(pluginId) ?? defaultPluginBootFailure;
    return pluginBootFailure === 'continue';
  };
}
