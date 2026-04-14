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

import {
  coreServices,
  createServiceFactory,
} from '@backstage/backend-plugin-api';
import type { RootInstanceMetadataServicePluginInfo } from '@backstage/backend-plugin-api';
import { OpaqueBackendFeature } from '@internal/backend';
import { deepFreeze } from './helpers';

type InternalRegistrations = typeof OpaqueBackendFeature.TInternal & {
  featureType: 'registrations';
};

export function createRootInstanceMetadataServiceFactory(
  rawRegistrations: InternalRegistrations[],
) {
  const installedPlugins: Map<string, RootInstanceMetadataServicePluginInfo> =
    new Map();
  const registrations = rawRegistrations
    .filter(registration => registration.featureType === 'registrations')
    .flatMap(registration => registration.getRegistrations());
  const plugins = registrations.filter(
    registration =>
      registration.type === 'plugin' || registration.type === 'plugin-v1.1',
  );
  const modules = registrations.filter(
    registration =>
      registration.type === 'module' || registration.type === 'module-v1.1',
  );
  for (const plugin of plugins) {
    const { pluginId } = plugin;
    if (!installedPlugins.get(pluginId)) {
      installedPlugins.set(pluginId, {
        pluginId,
        modules: [],
      });
    }
  }
  for (const module of modules) {
    const { pluginId, moduleId } = module;
    const installedPlugin = installedPlugins.get(pluginId);
    if (installedPlugin) {
      (installedPlugin.modules as Array<{ moduleId: string }>).push({
        moduleId,
      });
    }
  }

  return createServiceFactory({
    service: coreServices.rootInstanceMetadata,
    deps: {},
    factory: async () => {
      const readonlyInstalledPlugins = deepFreeze([
        ...installedPlugins.values(),
      ]);
      const instanceMetadata = {
        getInstalledPlugins: () => Promise.resolve(readonlyInstalledPlugins),
      };

      return instanceMetadata;
    },
  });
}
