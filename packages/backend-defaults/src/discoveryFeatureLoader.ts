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
import { PackageDiscoveryService } from './PackageDiscoveryService';

/**
 * Options for the discovery feature loader.
 *
 * @public
 */
export interface DiscoveryFeatureLoaderOptions {
  /**
   * Packages that should always be excluded from discovery, regardless of configuration.
   */
  alwaysExcludedPackages?: string[];
}

/**
 * Create a discovery feature loader with custom options.
 *
 * @public
 */
export function discoveryFeatureLoaderFactory(
  options?: DiscoveryFeatureLoaderOptions,
) {
  return createBackendFeatureLoader({
    deps: {
      config: coreServices.rootConfig,
      logger: coreServices.rootLogger,
    },
    async loader({ config, logger }) {
      const service = new PackageDiscoveryService(config, logger, options);
      const { features } = await service.getBackendFeatures();
      return features;
    },
  });
}

/**
 * A loader that discovers backend features from the current package.json and its dependencies.
 *
 * @public
 *
 * @example
 * Using the `discoveryFeatureLoader` loader in a backend instance:
 * ```ts
 * //...
 * import { createBackend } from '@backstage/backend-defaults';
 * import { discoveryFeatureLoader } from '@backstage/backend-defaults';
 *
 * const backend = createBackend();
 * backend.add(discoveryFeatureLoader);
 * //...
 * backend.start();
 * ```
 */
export const discoveryFeatureLoader = discoveryFeatureLoaderFactory();
