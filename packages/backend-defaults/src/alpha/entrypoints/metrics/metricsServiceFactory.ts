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
  metricsServiceRef,
  rootMetricsServiceRef,
} from '@backstage/backend-plugin-api/alpha';
import {
  coreServices,
  createServiceFactory,
} from '@backstage/backend-plugin-api';

/**
 * Service for collecting metrics for plugins.
 *
 * @alpha
 */
export const metricsServiceFactory = createServiceFactory({
  service: metricsServiceRef,
  deps: {
    rootConfig: coreServices.rootConfig,
    rootMetricsService: rootMetricsServiceRef,
    pluginMetadata: coreServices.pluginMetadata,
  },
  factory: ({ rootMetricsService, pluginMetadata }) => {
    return rootMetricsService.forPlugin(pluginMetadata.getId());
  },
});
