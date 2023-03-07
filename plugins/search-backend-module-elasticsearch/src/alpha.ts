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
import { loggerToWinstonLogger } from '@backstage/backend-common';
import { searchEngineRegistryExtensionPoint } from '@backstage/plugin-search-backend-node/alpha';

import {
  ElasticSearchHighlightConfig,
  ElasticSearchQueryTranslatorOptions,
  ElasticSearchConcreteQuery,
  ElasticSearchCustomIndexTemplate,
  ElasticSearchCustomIndexTemplateBody,
  ElasticSearchQueryTranslator,
  ElasticSearchSearchEngine,
} from './engines';

/**
 * @alpha
 * Options for {@link searchModuleElasticsearchEngine}.
 */
export type SearchModuleElasticsearchEngineOptions = {
  translator?: ElasticSearchQueryTranslator;
  indexTemplate?: ElasticSearchCustomIndexTemplate;
};

/**
 * @alpha
 * Search backend module for the Elasticsearch engine.
 */
export const searchModuleElasticsearchEngine = createBackendModule(
  (options?: SearchModuleElasticsearchEngineOptions) => ({
    moduleId: 'elasticsearchEngine',
    pluginId: 'search',
    register(env) {
      env.registerInit({
        deps: {
          searchEngineRegistry: searchEngineRegistryExtensionPoint,
          logger: coreServices.logger,
          config: coreServices.config,
        },
        async init({ searchEngineRegistry, logger, config }) {
          const searchEngine = await ElasticSearchSearchEngine.fromConfig({
            logger: loggerToWinstonLogger(logger),
            config: config,
          });

          // set custom translator if available
          if (options?.translator) {
            searchEngine.setTranslator(options.translator);
          }

          // set custom index template if available
          if (options?.indexTemplate) {
            searchEngine.setIndexTemplate(options.indexTemplate);
          }

          searchEngineRegistry.setSearchEngine(searchEngine);
        },
      });
    },
  }),
);

export type {
  ElasticSearchCustomIndexTemplate,
  ElasticSearchCustomIndexTemplateBody,
  ElasticSearchQueryTranslator,
  ElasticSearchQueryTranslatorOptions,
  ElasticSearchHighlightConfig,
  ElasticSearchConcreteQuery,
};
