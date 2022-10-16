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
  createBackendModule,
  loggerToWinstonLogger,
  configServiceRef,
  loggerServiceRef,
  schedulerServiceRef,
} from '@backstage/backend-plugin-api';
import { catalogProcessingExtensionPoint } from '@backstage/plugin-catalog-node';
import { GitHubEntityProvider } from '../providers/GitHubEntityProvider';

/**
 * Registers the GitHubEntityProvider with the catalog processing extension point.
 *
 * @alpha
 */
export const githubEntityProviderCatalogModule = createBackendModule({
  pluginId: 'catalog',
  moduleId: 'githubEntityProvider',
  register(env) {
    env.registerInit({
      deps: {
        catalog: catalogProcessingExtensionPoint,
        config: configServiceRef,
        logger: loggerServiceRef,
        scheduler: schedulerServiceRef,
      },
      async init({ catalog, config, logger, scheduler }) {
        catalog.addEntityProvider(
          GitHubEntityProvider.fromConfig(config, {
            logger: loggerToWinstonLogger(logger),
            scheduler,
          }),
        );
      },
    });
  },
});
