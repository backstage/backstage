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
  createExtensionPoint,
} from '@backstage/backend-plugin-api';
import {
  GitlabOrgDiscoveryEntityProvider,
  UserTransformer,
  GroupTransformer,
} from '@backstage/plugin-catalog-backend-module-gitlab';
import { catalogProcessingExtensionPoint } from '@backstage/plugin-catalog-node/alpha';
import { eventsServiceRef } from '@backstage/plugin-events-node';

/**
 * Interface for {@link gitlabOrgEntityProviderTransformsExtensionPoint}.
 *
 * @public
 */
export interface GitlabOrgEntityProviderTransformsExtensionPoint {
  /**
   * Set a custom transformer for transforming from GitLab users to catalog
   * entities.
   */
  setUserTransformer(transformer: UserTransformer): void;

  /**
   * Set a custom transformer for transforming from GitLab groups to catalog
   * entities.
   */
  setGroupTransformer(transformer: GroupTransformer): void;
}

/**
 * Extension point for runtime configuration of GitlabOrgDiscoveryEntityProvider.
 *
 * @public
 */
export const gitlabOrgEntityProviderTransformsExtensionPoint =
  createExtensionPoint<GitlabOrgEntityProviderTransformsExtensionPoint>({
    id: 'catalog.gitlabOrgEntityProvider',
  });

/**
 * Registers the GitlabOrgDiscoveryEntityProvider with the catalog processing extension point.
 *
 * @public
 */
export const catalogModuleGitlabOrgDiscoveryEntityProvider =
  createBackendModule({
    pluginId: 'catalog',
    moduleId: 'gitlabOrgDiscoveryEntityProvider',
    register(env) {
      let userTransformer: UserTransformer | undefined;
      let groupTransformer: GroupTransformer | undefined;

      env.registerExtensionPoint(
        gitlabOrgEntityProviderTransformsExtensionPoint,
        {
          setUserTransformer(transformer) {
            if (userTransformer) {
              throw new Error('User transformer may only be set once');
            }
            userTransformer = transformer;
          },
          setGroupTransformer(transformer) {
            if (groupTransformer) {
              throw new Error('Group transformer may only be set once');
            }
            groupTransformer = transformer;
          },
        },
      );

      env.registerInit({
        deps: {
          config: coreServices.rootConfig,
          catalog: catalogProcessingExtensionPoint,
          logger: coreServices.logger,
          scheduler: coreServices.scheduler,
          events: eventsServiceRef,
        },
        async init({ config, catalog, logger, scheduler, events }) {
          const gitlabOrgDiscoveryEntityProvider =
            GitlabOrgDiscoveryEntityProvider.fromConfig(config, {
              logger,
              events,
              scheduler,
              userTransformer,
              groupEntitiesTransformer: groupTransformer,
            });
          catalog.addEntityProvider(gitlabOrgDiscoveryEntityProvider);
        },
      });
    },
  });
