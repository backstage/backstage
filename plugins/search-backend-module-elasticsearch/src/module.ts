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
  createExtensionPoint,
} from '@backstage/backend-plugin-api';
import { searchEngineRegistryExtensionPoint } from '@backstage/plugin-search-backend-node/alpha';
import {
  ElasticSearchQueryTranslator,
  ElasticSearchSearchEngine,
} from './engines/ElasticSearchSearchEngine';
import {
  type ElasticSearchAuthProvider,
  type ElasticSearchAuthExtensionPoint,
  elasticsearchAuthExtensionPoint,
} from './auth';

// Re-export auth types and extension point
export type { ElasticSearchAuthProvider, ElasticSearchAuthExtensionPoint };
export { elasticsearchAuthExtensionPoint };

/** @public */
export interface ElasticSearchQueryTranslatorExtensionPoint {
  setTranslator(translator: ElasticSearchQueryTranslator): void;
}

/**
 * Extension point used to customize the ElasticSearch query translator.
 *
 * @public
 */
export const elasticsearchTranslatorExtensionPoint =
  createExtensionPoint<ElasticSearchQueryTranslatorExtensionPoint>({
    id: 'search.elasticsearchEngine.translator',
  });

/**
 * Search backend module for the Elasticsearch engine.
 *
 * @public
 */
export default createBackendModule({
  pluginId: 'search',
  moduleId: 'elasticsearch-engine',
  register(env) {
    let translator: ElasticSearchQueryTranslator | undefined;
    let authProvider: ElasticSearchAuthProvider | undefined;

    env.registerExtensionPoint(elasticsearchTranslatorExtensionPoint, {
      setTranslator(newTranslator) {
        if (translator) {
          throw new Error(
            'ElasticSearch query translator may only be set once',
          );
        }
        translator = newTranslator;
      },
    });

    env.registerExtensionPoint(elasticsearchAuthExtensionPoint, {
      setAuthProvider(provider) {
        if (authProvider) {
          throw new Error('ElasticSearch auth provider may only be set once');
        }
        authProvider = provider;
      },
    });

    env.registerInit({
      deps: {
        searchEngineRegistry: searchEngineRegistryExtensionPoint,
        logger: coreServices.logger,
        config: coreServices.rootConfig,
      },
      async init({ searchEngineRegistry, logger, config }) {
        const baseKey = 'search.elasticsearch';
        const baseConfig = config.getOptional(baseKey);
        if (!baseConfig) {
          logger.warn(
            'No configuration found under "search.elasticsearch" key.  Skipping search engine initialization.',
          );
          return;
        }
        const indexPrefix = config.getOptionalString(
          'search.elasticsearch.indexPrefix',
        );
        if (indexPrefix) {
          logger.info(`Index prefix will be used for indices: ${indexPrefix}`);
        }
        if (authProvider) {
          logger.info(
            'Using custom auth provider for ElasticSearch authentication.',
          );
        }
        searchEngineRegistry.setSearchEngine(
          await ElasticSearchSearchEngine.fromConfig({
            logger,
            config,
            translator,
            authProvider,
            indexPrefix,
          }),
        );
      },
    });
  },
});
