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
  createBackendModule,
} from '@backstage/backend-plugin-api';
import { catalogProcessingExtensionPoint } from '@backstage/plugin-catalog-node';
import { catalogScmEventsServiceRef } from '@backstage/plugin-catalog-node/alpha';
import { eventsServiceRef } from '@backstage/plugin-events-node';
import {
  AzureBlobStorageEntityProvider,
  AzureDevOpsEntityProvider,
} from '../providers';
import { AzureDevOpsScmEventsBridge } from '../events/AzureDevOpsScmEventsBridge';

/**
 * Registers the AzureDevOpsEntityProvider with the catalog processing extension point.
 *
 * @public
 */
export const catalogModuleAzureEntityProvider = createBackendModule({
  pluginId: 'catalog',
  moduleId: 'azure-providers',
  register(env) {
    env.registerInit({
      deps: {
        config: coreServices.rootConfig,
        catalog: catalogProcessingExtensionPoint,
        logger: coreServices.logger,
        scheduler: coreServices.scheduler,
        events: eventsServiceRef,
        catalogScmEvents: catalogScmEventsServiceRef,
        lifecycle: coreServices.lifecycle,
      },
      async init({
        config,
        catalog,
        logger,
        scheduler,
        events,
        catalogScmEvents,
        lifecycle,
      }) {
        // Check for Azure Blob Storage provider configuration and register it
        if (config.has('catalog.providers.azureBlob')) {
          catalog.addEntityProvider(
            AzureBlobStorageEntityProvider.fromConfig(config, {
              logger,
              scheduler,
            }),
          );
        }

        // Check for Azure DevOps provider configuration and register it
        if (config.has('catalog.providers.azureDevOps')) {
          catalog.addEntityProvider(
            AzureDevOpsEntityProvider.fromConfig(config, {
              logger,
              scheduler,
            }),
          );
        }

        // Only wire up the SCM events bridge when Azure DevOps provider
        // configuration is present — Azure Blob Storage users should not be
        // required to handle Azure DevOps webhook events.
        if (config.has('catalog.providers.azureDevOps')) {
          const bridge = new AzureDevOpsScmEventsBridge({
            logger,
            events,
            catalogScmEvents,
          });
          lifecycle.addStartupHook(async () => {
            await bridge.start();
          });
          lifecycle.addShutdownHook(async () => {
            await bridge.stop();
          });
        }
      },
    });
  },
});
