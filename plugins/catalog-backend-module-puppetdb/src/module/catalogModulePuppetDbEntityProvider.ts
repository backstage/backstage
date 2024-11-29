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
import { catalogProcessingExtensionPoint } from '@backstage/plugin-catalog-node/alpha';
import { PuppetDbEntityProvider } from '../providers/PuppetDbEntityProvider';

/**
 * Registers the `PuppetDbEntityProvider` with the catalog processing extension point.
 *
 * @alpha
 */
export const catalogModulePuppetDbEntityProvider = createBackendModule({
  pluginId: 'catalog',
  moduleId: 'puppetdb-entity-provider',
  register(env) {
    env.registerInit({
      deps: {
        catalog: catalogProcessingExtensionPoint,
        config: coreServices.rootConfig,
        logger: coreServices.logger,
        scheduler: coreServices.scheduler,
      },
      async init({ catalog, config, logger, scheduler }) {
        catalog.addEntityProvider(
          PuppetDbEntityProvider.fromConfig(config, {
            logger,
            scheduler,
          }),
        );
      },
    });
  },
});
