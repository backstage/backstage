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
import { PgSearchEngine } from './PgSearchEngine';

/**
 * @alpha
 * Search backend module for the Postgres engine.
 */
export default createBackendModule({
  pluginId: 'search',
  moduleId: 'postgres-engine',
  register(env) {
    env.registerInit({
      deps: {
        searchEngineRegistry: searchEngineRegistryExtensionPoint,
        database: coreServices.database,
        config: coreServices.rootConfig,
        logger: coreServices.logger,
      },
      async init({ searchEngineRegistry, database, config, logger }) {
        if (await PgSearchEngine.supported(database)) {
          searchEngineRegistry.setSearchEngine(
            await PgSearchEngine.fromConfig(config, {
              database,
              logger,
            }),
          );
        } else {
          logger.warn(
            'Postgres search engine is not supported, skipping registration of search-backend-module-pg',
          );
        }
      },
    });
  },
});
