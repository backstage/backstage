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
import { searchIndexRegistryExtensionPoint } from '@backstage/plugin-search-backend-node/alpha';
import { DefaultCatalogCollatorFactory } from '@backstage/plugin-catalog-backend';
import { DefaultTechDocsCollatorFactory } from '@backstage/plugin-techdocs-backend';
import { ToolDocumentCollatorFactory } from '@backstage/plugin-explore-backend';
import { loggerToWinstonLogger } from '@backstage/backend-common';

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
        logger,
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
            discovery,
            tokenManager,
          }),
        });

        indexRegistry.addCollator({
          schedule,
          factory: DefaultTechDocsCollatorFactory.fromConfig(config, {
            discovery,
            logger: loggerToWinstonLogger(logger),
            tokenManager,
          }),
        });

        indexRegistry.addCollator({
          schedule,
          factory: ToolDocumentCollatorFactory.fromConfig(config, {
            discovery,
            logger: loggerToWinstonLogger(logger),
          }),
        });
      },
    });
  },
});
