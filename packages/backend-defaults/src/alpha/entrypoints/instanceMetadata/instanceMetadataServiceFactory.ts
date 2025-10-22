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
} from '@backstage/backend-plugin-api';
import { instanceMetadataServiceRef } from '@backstage/backend-plugin-api/alpha';

/**
 * @alpha
 * @deprecated use {@link @backstage/backend-plugin-api#coreServices.rootInstanceMetadata} instead
 */
export const instanceMetadataServiceFactory = createServiceFactory({
  service: instanceMetadataServiceRef,
  deps: {
    instanceMetadata: coreServices.rootInstanceMetadata,
  },
  factory: async ({ instanceMetadata }) => {
    const plugins = await instanceMetadata.getInstalledPlugins();
    const service = {
      getInstalledFeatures: () =>
        plugins.map(e => ({ type: 'plugin' as const, pluginId: e.pluginId })),
    };

    return service;
  },
});
