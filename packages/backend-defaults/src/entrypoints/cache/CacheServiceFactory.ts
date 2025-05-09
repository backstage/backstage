/*
 * Copyright 2022 The Backstage Authors
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
import { CacheManager } from './CacheManager';

/**
 * Defines the structure of the root context for the CacheService,
 * including the CacheManager instance and an optional shutdown method.
 */
interface CacheManagerRootContext {
  manager: CacheManager;
  shutdown?: () => Promise<void>;
}

/**
 * Key-value store for caching data.
 *
 * See {@link @backstage/code-plugin-api#CacheService}
 * and {@link https://backstage.io/docs/backend-system/core-services/cache | the service docs}
 * for more information.
 *
 * @public
 */
export const cacheServiceFactory = createServiceFactory({
  service: coreServices.cache,
  deps: {
    config: coreServices.rootConfig,
    plugin: coreServices.pluginMetadata,
    logger: coreServices.rootLogger,
  },
  async createRootContext({
    config,
    logger,
  }): Promise<CacheManagerRootContext> {
    const manager = CacheManager.fromConfig(config, { logger });

    if (
      typeof manager.stopInfinispanClient === 'function' &&
      manager.infinispanClientShutdownMethod
    ) {
      logger.info(
        'Infinispan cache store detected, registering shutdown hook for CacheManager.',
      );
      return {
        manager,
        shutdown: async () => {
          logger.info(
            'Executing CacheManager shutdown hook for Infinispan client...',
          );
          await manager.stopInfinispanClient();
        },
      };
    }

    // For other cache stores, or if Infinispan is not configured with a shutdown method,
    // no specific shutdown hook is needed at this level for the CacheManager itself.
    return { manager };
  },
  async factory({ plugin }, rootContext: CacheManagerRootContext) {
    return rootContext.manager.forPlugin(plugin.getId());
  },
});
