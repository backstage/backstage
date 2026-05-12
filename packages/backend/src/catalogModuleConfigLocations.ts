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

import {
  createBackendModule,
  coreServices,
} from '@backstage/backend-plugin-api';
import { catalogProcessingExtensionPoint } from '@backstage/plugin-catalog-node';
import {
  ANNOTATION_LOCATION,
  ANNOTATION_ORIGIN_LOCATION,
  LocationEntityV1alpha1,
} from '@backstage/catalog-model';
import { createHash } from 'node:crypto';
import path from 'node:path';

function locationMetadataName(type: string, target: string): string {
  return `generated-${createHash('sha1')
    .update(`${type}:${target}`)
    .digest('hex')}`;
}

// Registers catalog.locations entries from config as Location entities.
// The new createBackend() system does not wire up ConfigLocationEntityProvider
// automatically (it lives only in the legacy CatalogBuilder path), so this
// module bridges that gap.
export default createBackendModule({
  pluginId: 'catalog',
  moduleId: 'configLocations',
  register(reg) {
    reg.registerInit({
      deps: {
        config: coreServices.rootConfig,
        catalog: catalogProcessingExtensionPoint,
      },
      async init({ config, catalog }) {
        const locationConfigs =
          config.getOptionalConfigArray('catalog.locations') ?? [];

        const entities = locationConfigs.map(locationConfig => {
          const type = locationConfig.getString('type');
          const rawTarget = locationConfig.getString('target');
          const target = type === 'file' ? path.resolve(rawTarget) : rawTarget;
          const locationRef = `${type}:${target}`;

          const entity: LocationEntityV1alpha1 = {
            apiVersion: 'backstage.io/v1alpha1',
            kind: 'Location',
            metadata: {
              name: locationMetadataName(type, target),
              annotations: {
                [ANNOTATION_LOCATION]: locationRef,
                [ANNOTATION_ORIGIN_LOCATION]: locationRef,
              },
            },
            spec: { type, target },
          };

          return { entity, locationKey: locationRef };
        });

        catalog.addEntityProvider({
          getProviderName: () => 'ConfigLocationProvider',
          connect: async connection => {
            await connection.applyMutation({ type: 'full', entities });
          },
        });
      },
    });
  },
});
