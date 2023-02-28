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

import { loggerToWinstonLogger } from '@backstage/backend-common';
import {
  coreServices,
  createBackendModule,
} from '@backstage/backend-plugin-api';
import {
  catalogProcessingExtensionPoint,
  catalogServiceRef,
} from '@backstage/plugin-catalog-node/alpha';
import { eventsExtensionPoint } from '@backstage/plugin-events-node/alpha';
import { BitbucketCloudEntityProvider } from '../BitbucketCloudEntityProvider';

/**
 * @alpha
 */
export const bitbucketCloudEntityProviderCatalogModule = createBackendModule({
  pluginId: 'catalog',
  moduleId: 'bitbucketCloudEntityProvider',
  register(env) {
    env.registerInit({
      deps: {
        catalog: catalogProcessingExtensionPoint,
        catalogApi: catalogServiceRef,
        config: coreServices.config,
        // TODO(pjungermann): How to make this optional for those which only want the provider without event support?
        //  Do we even want to support this?
        events: eventsExtensionPoint,
        logger: coreServices.logger,
        scheduler: coreServices.scheduler,
        tokenManager: coreServices.tokenManager,
      },
      async init({
        catalog,
        catalogApi,
        config,
        events,
        logger,
        scheduler,
        tokenManager,
      }) {
        const winstonLogger = loggerToWinstonLogger(logger);
        const providers = BitbucketCloudEntityProvider.fromConfig(config, {
          catalogApi,
          logger: winstonLogger,
          scheduler,
          tokenManager,
        });

        catalog.addEntityProvider(providers);
        events.addSubscribers(providers);
      },
    });
  },
});
