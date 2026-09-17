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

import { metricsServiceRef } from '@backstage/backend-plugin-api/alpha';
import {
  coreServices,
  createServiceFactory,
} from '@backstage/backend-plugin-api';
import { DefaultMetricsService } from './DefaultMetricsService';

/**
 * Service factory for collecting plugin-scoped metrics.
 *
 * @alpha
 */
export const metricsServiceFactory = createServiceFactory({
  service: metricsServiceRef,
  deps: {
    config: coreServices.rootConfig,
    pluginMetadata: coreServices.pluginMetadata,
  },
  factory: ({ config, pluginMetadata }) => {
    const pluginId = pluginMetadata.getId();

    const meterConfig = config.getOptionalConfig(
      `backend.metrics.plugin.${pluginId}.meter`,
    );
    const scopeName = `backstage-plugin-${pluginId}`;
    const name = meterConfig?.getOptionalString('name') ?? scopeName;
    const version = meterConfig?.getOptionalString('version');
    const schemaUrl = meterConfig?.getOptionalString('schemaUrl');

    return DefaultMetricsService.create({ name, version, schemaUrl });
  },
});
