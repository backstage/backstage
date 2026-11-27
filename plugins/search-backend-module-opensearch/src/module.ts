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

import {
  coreServices,
  createBackendModule,
} from '@backstage/backend-plugin-api';
import { searchEngineRegistryExtensionPoint } from '@backstage/plugin-search-backend-node/alpha';
import { opensearchAuthExtensionPoint } from './auth';
import type {
  OpenSearchAuthExtensionPoint,
  OpenSearchAuthProvider,
} from './auth';
import { builtInOpenSearchProviders } from './builtinProviders';
import { OpenSearchSearchEngine } from './engines/OpenSearchSearchEngine';
import { opensearchProviderExtensionPoint } from './providers';
import type {
  OpenSearchProvider,
  OpenSearchProviderContext,
  OpenSearchProviderExtensionPoint,
} from './providers';

export type { OpenSearchAuthExtensionPoint, OpenSearchAuthProvider };
export { opensearchAuthExtensionPoint };
export type {
  OpenSearchProvider,
  OpenSearchProviderContext,
  OpenSearchProviderExtensionPoint,
};
export { opensearchProviderExtensionPoint };

/**
 * Search backend module for the OpenSearch engine.
 *
 * @public
 */
export default createBackendModule({
  pluginId: 'search',
  moduleId: 'opensearch-engine',
  register(env) {
    const providers: Record<string, OpenSearchProvider> = {
      ...builtInOpenSearchProviders,
    };
    const customProviderIds = new Set<string>();
    let authProvider: OpenSearchAuthProvider | undefined;

    env.registerExtensionPoint(opensearchAuthExtensionPoint, {
      setAuthProvider(provider) {
        if (authProvider) {
          throw new Error('OpenSearch auth provider may only be set once');
        }
        authProvider = provider;
      },
    });

    env.registerExtensionPoint(opensearchProviderExtensionPoint, {
      addProvider(provider) {
        if (customProviderIds.has(provider.id)) {
          throw new Error(
            `OpenSearch provider '${provider.id}' was already registered`,
          );
        }
        customProviderIds.add(provider.id);
        providers[provider.id] = provider;
      },
    });

    env.registerInit({
      deps: {
        searchEngineRegistry: searchEngineRegistryExtensionPoint,
        logger: coreServices.logger,
        config: coreServices.rootConfig,
      },
      async init({ searchEngineRegistry, logger, config }) {
        if (!config.getOptional('search.opensearch')) {
          logger.warn(
            'No configuration found under "search.opensearch" key. Skipping search engine initialization.',
          );
          return;
        }

        const indexPrefix = config.getOptionalString(
          'search.opensearch.indexPrefix',
        );
        if (indexPrefix) {
          logger.info(`Index prefix will be used for indices: ${indexPrefix}`);
        }
        if (authProvider) {
          logger.info(
            'Using custom auth provider for OpenSearch authentication.',
          );
        }

        searchEngineRegistry.setSearchEngine(
          await OpenSearchSearchEngine.fromConfig({
            logger,
            config,
            authProvider,
            providers,
            indexPrefix,
          }),
        );
      },
    });
  },
});
