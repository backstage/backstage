/*
 * Copyright 2023 The Backstage Authors
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
  createBackendModule,
} from '@backstage/backend-plugin-api';
import { searchEngineRegistryExtensionPoint } from '@backstage/plugin-search-backend-node/alpha';
import { ElasticSearchSearchEngine } from '@backstage/plugin-search-backend-module-elasticsearch';

/**
 * Search backend module for the Elasticsearch engine.
 *
 * @alpha
 * @remarks
 *
 * If you need to customize the search engine beyond what is supported by the
 * static configuration, you can create a custom module using the `ElasticSearchSearchEngine`.
 *
 * For example, this lets you configure your own query translator:
 *
 * ```ts
 * export const searchModuleElasticsearchEngine = createBackendModule({
 *   moduleId: 'elasticsearchEngine',
 *   pluginId: 'search',
 *   register(env) {
 *     env.registerInit({
 *       deps: {
 *         searchEngineRegistry: searchEngineRegistryExtensionPoint,
 *         logger: coreServices.logger,
 *         config: coreServices.rootConfig,
 *       },
 *       async init({ searchEngineRegistry, logger, config }) {
 *         searchEngineRegistry.setSearchEngine(
 *           await ElasticSearchSearchEngine.fromConfig({
 *             logger,
 *             config,
 *             translator(query) {
 *               return ... // translated query
 *             }
 *           }),
 *         );
 *       },
 *     });
 *   },
 * });
 * ```
 */
export const searchModuleElasticsearchEngine = createBackendModule({
  moduleId: 'elasticsearchEngine',
  pluginId: 'search',
  register(env) {
    env.registerInit({
      deps: {
        searchEngineRegistry: searchEngineRegistryExtensionPoint,
        logger: coreServices.logger,
        config: coreServices.rootConfig,
      },
      async init({ searchEngineRegistry, logger, config }) {
        searchEngineRegistry.setSearchEngine(
          await ElasticSearchSearchEngine.fromConfig({
            logger,
            config,
          }),
        );
      },
    });
  },
});
