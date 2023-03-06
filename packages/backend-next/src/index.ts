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

import { catalogPlugin } from '@backstage/plugin-catalog-backend/alpha';
import { catalogModuleTemplateKind } from '@backstage/plugin-scaffolder-backend/alpha';
import { createBackend } from '@backstage/backend-defaults';
import { appPlugin } from '@backstage/plugin-app-backend/alpha';
import { todoPlugin } from '@backstage/plugin-todo-backend';
import { techdocsPlugin } from '@backstage/plugin-techdocs-backend/alpha';
import { searchPlugin } from '@backstage/plugin-search-backend';
import { elasticSearchEngineModule } from '@backstage/plugin-search-backend-module-elasticsearch';
import {
  coreServices,
  createBackendModule,
} from '@backstage/backend-plugin-api';
import { searchIndexRegistryExtensionPoint } from '@backstage/plugin-search-backend-node';
import { DefaultCatalogCollatorFactory } from '@backstage/plugin-catalog-backend';
// import { pgSearchEngineModule } from '@backstage/plugin-search-backend-module-pg';
// import { lunrSearchEngineModule } from '@backstage/plugin-search-backend-node/';

// TODO: move to search-backend-node?
export const searchIndexRegistry = createBackendModule({
  moduleId: 'searchIndexRegistry',
  pluginId: 'search',
  register(env) {
    env.registerInit({
      deps: {
        indexRegistry: searchIndexRegistryExtensionPoint,
        config: coreServices.config,
        discovery: coreServices.discovery,
        tokenManager: coreServices.tokenManager,
        logger: coreServices.logger,
        scheduler: coreServices.scheduler,
      },
      async init({
        indexRegistry,
        config,
        discovery,
        tokenManager,
        scheduler,
      }) {
        const schedule = scheduler.createScheduledTaskRunner({
          frequency: { minutes: 10 },
          timeout: { minutes: 15 },
          // A 3 second delay gives the backend server a chance to initialize before
          // any collators are executed, which may attempt requests against the API.
          initialDelay: { seconds: 3 },
        });

        indexRegistry.addCollator({
          schedule,
          factory: DefaultCatalogCollatorFactory.fromConfig(config, {
            discovery: discovery,
            tokenManager: tokenManager,
          }),
        });
      },
    });
  },
});

const backend = createBackend();

backend.add(catalogPlugin());
backend.add(catalogModuleTemplateKind());
backend.add(appPlugin({ appPackageName: 'example-app' }));
backend.add(todoPlugin());
backend.add(techdocsPlugin());

backend.add(searchPlugin());
// just as example of search engine module, remove before shipping and use default
backend.add(
  elasticSearchEngineModule({
    indexTemplate: {
      name: 'my-custom-template',
      body: { index_patterns: ['*index*'], template: {} },
    },
  }),
);
backend.add(searchIndexRegistry());

backend.start();
