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
import { GitLabScmEventsBridge } from '../events/GitLabScmEventsBridge';
import { GitlabDiscoveryEntityProvider } from '../providers';
import {
  connectionsServiceRef,
  declareConnection,
} from '@backstage/connections';
import { DefaultGitlabCredentialsProvider } from '@backstage/integration';

/**
 * Registers the GitlabDiscoveryEntityProvider with the catalog processing extension point.
 *
 * @public
 */

export const catalogModuleGitlabDiscoveryEntityProvider = createBackendModule({
  pluginId: 'catalog',
  moduleId: 'gitlab-discovery-entity-provider',
  register(env) {
    declareConnection(env, {
      type: 'gitlab',
      description: 'Accesses GitLab repositories managed by the catalog',
    });
    env.registerInit({
      deps: {
        config: coreServices.rootConfig,
        catalog: catalogProcessingExtensionPoint,
        catalogScmEvents: catalogScmEventsServiceRef,
        logger: coreServices.logger,
        scheduler: coreServices.scheduler,
        events: eventsServiceRef,
        lifecycle: coreServices.lifecycle,
        connections: connectionsServiceRef,
      },
      async init({
        config,
        catalog,
        catalogScmEvents,
        logger,
        scheduler,
        events,
        lifecycle,
        connections,
      }) {
        const gitlabCredentialsProvider =
          DefaultGitlabCredentialsProvider.fromConnections(connections);
        const gitlabDiscoveryEntityProvider =
          GitlabDiscoveryEntityProvider.fromConfig(config, {
            logger,
            events,
            scheduler,
            gitlabCredentialsProvider,
          });
        catalog.addEntityProvider(gitlabDiscoveryEntityProvider);

        const bridge = new GitLabScmEventsBridge({
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
      },
    });
  },
});
