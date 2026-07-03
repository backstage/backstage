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
  catalogAnalysisExtensionPoint,
  catalogProcessingExtensionPoint,
} from '@backstage/plugin-catalog-node';
import { catalogServiceRef } from '@backstage/plugin-catalog-node';
import { catalogScmEventsServiceRef } from '@backstage/plugin-catalog-node/alpha';
import { eventsServiceRef } from '@backstage/plugin-events-node';
import { GithubEntityProvider } from '../providers/GithubEntityProvider';
import { GithubLocationAnalyzer } from '../analyzers/GithubLocationAnalyzer';
import { GithubScmEventsBridge } from '../events/GithubScmEventsBridge';
import {
  connectionsServiceRef,
  declareConnection,
} from '@backstage/connections';
import { DefaultOctokitProvider } from '../util/octokitProviderService';
import { createGithubCredentialsProvider } from '../util/createGithubCredentialsProvider';

/**
 * Registers all relevant GitHub integration points into the catalog backend.
 *
 * @public
 */
export const githubCatalogModule = createBackendModule({
  pluginId: 'catalog',
  moduleId: 'github',
  register(env) {
    declareConnection(env, {
      type: 'github',
      description: 'Accesses GitHub repositories managed by the catalog',
    });
    env.registerInit({
      deps: {
        catalogAnalyzers: catalogAnalysisExtensionPoint,
        auth: coreServices.auth,
        catalogProcessing: catalogProcessingExtensionPoint,
        config: coreServices.rootConfig,
        events: eventsServiceRef,
        logger: coreServices.logger,
        scheduler: coreServices.scheduler,
        catalog: catalogServiceRef,
        connections: connectionsServiceRef,
        catalogScmEvents: catalogScmEventsServiceRef,
        lifecycle: coreServices.lifecycle,
      },
      async init({
        catalogProcessing,
        config,
        events,
        logger,
        scheduler,
        catalogAnalyzers,
        auth,
        catalog,
        connections,
        catalogScmEvents,
        lifecycle,
      }) {
        const githubCredentialsProvider =
          createGithubCredentialsProvider(connections);

        catalogAnalyzers.addScmLocationAnalyzer(
          new GithubLocationAnalyzer({
            config,
            auth,
            catalog,
            githubCredentialsProvider,
          }),
        );

        catalogProcessing.addEntityProvider(
          GithubEntityProvider.fromConfig(config, {
            events,
            logger,
            scheduler,
            githubCredentialsProvider,
          }),
        );

        const bridge = new GithubScmEventsBridge({
          logger,
          events,
          octokitProvider: new DefaultOctokitProvider(
            config,
            githubCredentialsProvider,
          ),
          catalogScmEvents,
        });
        lifecycle.addStartupHook(async () => {
          await bridge.start();
        });
        lifecycle.addShutdownHook(async () => {
          await bridge.stop();
        });
      },
    });
  },
});
