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
  coreServices,
} from '@backstage/backend-plugin-api';
import { loggerToWinstonLogger } from '@backstage/backend-common';
import {
  catalogAnalysisExtensionPoint,
  catalogProcessingExtensionPoint,
} from '@backstage/plugin-catalog-node/alpha';
import { eventsServiceRef } from '@backstage/plugin-events-node';
import { GithubEntityProvider } from '../providers/GithubEntityProvider';
import { GithubLocationAnalyzer } from '../analyzers/GithubLocationAnalyzer';

/**
 * Registers the `GithubEntityProvider` with the catalog processing extension point.
 *
 * @alpha
 */
export const githubCatalogModule = createBackendModule({
  pluginId: 'catalog',
  moduleId: 'github',
  register(env) {
    env.registerInit({
      deps: {
        analyzers: catalogAnalysisExtensionPoint,
        auth: coreServices.auth,
        catalog: catalogProcessingExtensionPoint,
        config: coreServices.rootConfig,
        discovery: coreServices.discovery,
        events: eventsServiceRef,
        logger: coreServices.logger,
        scheduler: coreServices.scheduler,
      },
      async init({
        catalog,
        config,
        events,
        logger,
        scheduler,
        analyzers,
        discovery,
        auth,
      }) {
        analyzers.addLocationAnalyzer(
          new GithubLocationAnalyzer({
            discovery,
            config,
            auth,
          }),
        );

        catalog.addEntityProvider(
          GithubEntityProvider.fromConfig(config, {
            events,
            logger: loggerToWinstonLogger(logger),
            scheduler,
          }),
        );
      },
    });
  },
});
