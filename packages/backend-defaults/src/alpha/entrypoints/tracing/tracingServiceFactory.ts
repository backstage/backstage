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

import { tracingServiceRef } from '@backstage/backend-plugin-api/alpha';
import {
  coreServices,
  createServiceFactory,
} from '@backstage/backend-plugin-api';
import { DefaultTracingService } from './DefaultTracingService';

/**
 * Service factory for emitting plugin-scoped trace spans.
 *
 * @alpha
 */
export const tracingServiceFactory = createServiceFactory({
  service: tracingServiceRef,
  deps: {
    config: coreServices.rootConfig,
    pluginMetadata: coreServices.pluginMetadata,
    httpAuth: coreServices.httpAuth,
  },
  factory: ({ config, pluginMetadata, httpAuth }) => {
    const pluginId = pluginMetadata.getId();

    const tracerConfig = config.getOptionalConfig(
      `backend.tracing.plugin.${pluginId}.tracer`,
    );
    const scopeName = `backstage-plugin-${pluginId}`;
    const name = tracerConfig?.getOptionalString('name') ?? scopeName;
    const version = tracerConfig?.getOptionalString('version');
    const schemaUrl = tracerConfig?.getOptionalString('schemaUrl');

    const captureEndUser =
      config.getOptionalBoolean('backend.tracing.capture.endUser') ?? false;

    return DefaultTracingService.create({
      name,
      version,
      schemaUrl,
      pluginId,
      captureEndUser,
      httpAuth,
    });
  },
});
