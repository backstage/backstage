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
import {
  catalogProcessingExtensionPoint,
  catalogServiceRef,
} from '@backstage/plugin-catalog-node/alpha';
import { eventsServiceRef } from '@backstage/plugin-events-node';
import { BitbucketServerEntityProvider } from '../providers/BitbucketServerEntityProvider';

/**
 * @public
 */
export const catalogModuleBitbucketServerEntityProvider = createBackendModule({
  pluginId: 'catalog',
  moduleId: 'bitbucket-server-entity-provider',
  register(env) {
    env.registerInit({
      deps: {
        catalog: catalogProcessingExtensionPoint,
        catalogApi: catalogServiceRef,
        config: coreServices.rootConfig,
        events: eventsServiceRef,
        logger: coreServices.logger,
        scheduler: coreServices.scheduler,
      },
      async init({ catalog, catalogApi, config, events, logger, scheduler }) {
        const providers = BitbucketServerEntityProvider.fromConfig(config, {
          catalogApi,
          events,
          logger,
          scheduler,
        });

        catalog.addEntityProvider(providers);
      },
    });
  },
});
