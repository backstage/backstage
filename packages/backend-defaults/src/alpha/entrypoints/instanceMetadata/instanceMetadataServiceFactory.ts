/*
 * Copyright 2025 The Backstage Authors
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
  createServiceRef,
} from '@backstage/backend-plugin-api';

/*
 * NOTE(freben): We have moved over to coreServices.rootInstanceMetadata. This
 * old alpha implementation is kept around for a little longer for backward
 * compatibility reasons.
 */

/**
 * @internal
 */
export type BackendFeatureMeta =
  | {
      type: 'plugin';
      pluginId: string;
    }
  | {
      type: 'module';
      pluginId: string;
      moduleId: string;
    };

/**
 * @internal
 */
export interface InstanceMetadataService {
  getInstalledFeatures: () => BackendFeatureMeta[];
}

/**
 * @internal
 */
export const instanceMetadataServiceRef =
  createServiceRef<InstanceMetadataService>({
    id: 'core.instanceMetadata',
  });

/**
 * @internal
 */
export const instanceMetadataServiceFactory = createServiceFactory({
  service: instanceMetadataServiceRef,
  deps: {
    instanceMetadata: coreServices.rootInstanceMetadata,
  },
  factory: async ({ instanceMetadata }) => {
    const plugins = await instanceMetadata.getInstalledPlugins();
    const features: BackendFeatureMeta[] = [];
    for (const plugin of plugins) {
      features.push({
        type: 'plugin' as const,
        pluginId: plugin.pluginId,
      });
      for (const module of plugin.modules) {
        features.push({
          type: 'module' as const,
          pluginId: plugin.pluginId,
          moduleId: module.moduleId,
        });
      }
    }
    const service: InstanceMetadataService = {
      getInstalledFeatures: () => features,
    };

    return service;
  },
});
