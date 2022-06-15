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

import { createBackend } from '@backstage/backend-app-api';
import {
  createBackendModule,
  createBackendPlugin,
  createServiceRef,
  loggerServiceRef,
} from '@backstage/backend-plugin-api';
// import { catalogPlugin } from '@backstage/plugin-catalog-backend';
// import { scaffolderPlugin } from '@backstage/plugin-scaffolder-backend';

interface CatalogProcessor {
  process(): void;
}

interface CatalogProcessingInitApi {
  addProcessor(processor: CatalogProcessor): void;
}

export const catalogProcessingInitApiRef =
  createServiceRef<CatalogProcessingInitApi>({
    id: 'catalog.processing',
  });

class CatalogExtensionPointImpl implements CatalogProcessingInitApi {
  #processors = new Array<CatalogProcessor>();

  addProcessor(processor: CatalogProcessor): void {
    this.#processors.push(processor);
  }

  get processors() {
    return this.#processors;
  }
}

export const catalogPlugin = createBackendPlugin({
  id: 'catalog',
  register(env) {
    const processingExtensions = new CatalogExtensionPointImpl();
    // plugins depending on this API will be initialized before this plugins init method is executed.
    env.registerExtensionPoint(
      catalogProcessingInitApiRef,
      processingExtensions,
    );

    env.registerInit({
      deps: {
        logger: loggerServiceRef,
      },
      async init({ logger }) {
        //        const builder = await CatalogBuilder.create(env);
        logger.log('boppp');
        console.log('I HAZ', processingExtensions.processors[0].process());
      },
    });
  },
});

export const scaffolderCatalogExtension = createBackendModule({
  moduleId: 'boop',
  pluginId: 'catalog',
  register(env) {
    env.registerInit({
      deps: {
        catalogProcessingInitApi: catalogProcessingInitApiRef,
      },
      async init({ catalogProcessingInitApi }) {
        catalogProcessingInitApi.addProcessor({
          process() {
            console.log('Running scaffolder processor');
          },
        });
      },
    });
  },
});

const backend = createBackend({
  apis: [],
});

// logger: Logger;
// cache: PluginCacheManager;
// database: PluginDatabaseManager;
// config: Config;
// reader: UrlReader;
// discovery: PluginEndpointDiscovery;
// tokenManager: TokenManager;
// permissions: PermissionEvaluator | PermissionAuthorizer;
// scheduler: PluginTaskScheduler;

// backend.add(scaffolderPlugin());
backend.add(catalogPlugin({}));
backend.add(scaffolderCatalogExtension({}));
backend.start();
