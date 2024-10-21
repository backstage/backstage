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
  coreServices,
  createBackendFeatureLoader,
} from '@backstage/backend-plugin-api';
import {
  DynamicPluginsSchemasOptions,
  dynamicPluginsFrontendSchemas,
  dynamicPluginsRootLoggerServiceFactory,
  dynamicPluginsSchemasServiceFactory,
} from '../schemas';
import {
  DynamicPluginsFactoryOptions,
  dynamicPluginsFeatureDiscoveryLoader,
  dynamicPluginsServiceFactory,
} from '../manager';
import { DynamicPluginsRootLoggerFactoryOptions } from '../schemas';
import { configKey } from '../scanner/plugin-scanner';

/**
 * @public
 */
export type DynamicPluginsFeatureLoaderOptions = DynamicPluginsFactoryOptions &
  DynamicPluginsSchemasOptions &
  DynamicPluginsRootLoggerFactoryOptions;

const dynamicPluginsFeatureLoaderWithOptions = (
  options?: DynamicPluginsFeatureLoaderOptions,
) =>
  createBackendFeatureLoader({
    deps: {
      config: coreServices.rootConfig,
    },
    *loader({ config }) {
      const dynamicPluginsEnabled = config.has(configKey);

      yield* [
        dynamicPluginsSchemasServiceFactory(options),
        dynamicPluginsServiceFactory(options),
      ];
      if (dynamicPluginsEnabled) {
        yield* [
          dynamicPluginsRootLoggerServiceFactory(options),
          dynamicPluginsFrontendSchemas,
          dynamicPluginsFeatureDiscoveryLoader,
        ];
      }
    },
  });

/**
 * A backend feature loader that fully enable backend dynamic plugins.
 * More precisely it:
 * - adds the dynamic plugins root service (typically depended upon by plugins),
 * - adds additional required features to allow supporting dynamic plugins config schemas
 *   in the frontend application and the backend root logger,
 * - uses the dynamic plugins service to discover and expose dynamic plugins as features.
 *
 * @public
 *
 * @example
 * Using the `dynamicPluginsFeatureLoader` loader in a backend instance:
 * ```ts
 * //...
 * import { createBackend } from '@backstage/backend-defaults';
 * import { dynamicPluginsFeatureLoader } from '@backstage/backend-dynamic-feature-service';
 *
 * const backend = createBackend();
 * backend.add(dynamicPluginsFeatureLoader);
 * //...
 * backend.start();
 * ```
 *
 * @example
 * Passing options to the `dynamicPluginsFeatureLoader` loader in a backend instance:
 * ```ts
 * //...
 * import { createBackend } from '@backstage/backend-defaults';
 * import { dynamicPluginsFeatureLoader } from '@backstage/backend-dynamic-feature-service';
 * import { myCustomModuleLoader } from './myCustomModuleLoader';
 * import { myCustomSchemaLocator } from './myCustomSchemaLocator';
 *
 * const backend = createBackend();
 * backend.add(dynamicPluginsFeatureLoader({
 *   moduleLoader: myCustomModuleLoader,
 *   schemaLocator: myCustomSchemaLocator,
 *
 * }));
 * //...
 * backend.start();
 * ```
 */
export const dynamicPluginsFeatureLoader = Object.assign(
  dynamicPluginsFeatureLoaderWithOptions,
  dynamicPluginsFeatureLoaderWithOptions(),
);
