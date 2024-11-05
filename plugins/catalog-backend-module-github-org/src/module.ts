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
  SchedulerServiceTaskScheduleDefinition,
  readSchedulerServiceTaskScheduleDefinitionFromConfig,
} from '@backstage/backend-plugin-api';
import { Config } from '@backstage/config';
import {
  GithubMultiOrgEntityProvider,
  TeamTransformer,
  UserTransformer,
  QueryOptions,
} from '@backstage/plugin-catalog-backend-module-github';
import { catalogProcessingExtensionPoint } from '@backstage/plugin-catalog-node/alpha';
import { eventsServiceRef } from '@backstage/plugin-events-node';
import { GithubOrgEntityCleanerProvider } from './GithubOrgEntityCleanerProvider';

/**
 * Interface for {@link githubOrgEntityProviderTransformsExtensionPoint}.
 *
 * @public
 */
export interface GithubOrgEntityProviderTransformsExtensionPoint {
  /**
   * Set a custom transformer for transforming from GitHub users to catalog
   * entities.
   */
  setUserTransformer(transformer: UserTransformer): void;

  /**
   * Set a custom transformer for transforming from GitHub teams to catalog
   * entities.
   */
  setTeamTransformer(transformer: TeamTransformer): void;
}

/**
 * Extension point for runtime configuration of catalogModuleGithubOrgEntityProvider.
 *
 * @public
 */
export const githubOrgEntityProviderTransformsExtensionPoint =
  createExtensionPoint<GithubOrgEntityProviderTransformsExtensionPoint>({
    id: 'catalog.githubOrgEntityProvider',
  });

/**
 * Registers the `GithubMultiOrgEntityProvider` with the catalog processing extension point.
 *
 * @public
 */
export const catalogModuleGithubOrgEntityProvider = createBackendModule({
  pluginId: 'catalog',
  moduleId: 'github-org-entity-provider',
  register(env) {
    let userTransformer: UserTransformer | undefined;
    let teamTransformer: TeamTransformer | undefined;

    env.registerExtensionPoint(
      githubOrgEntityProviderTransformsExtensionPoint,
      {
        setUserTransformer(transformer) {
          if (userTransformer) {
            throw new Error('User transformer may only be set once');
          }
          userTransformer = transformer;
        },
        setTeamTransformer(transformer) {
          if (teamTransformer) {
            throw new Error('Team transformer may only be set once');
          }
          teamTransformer = transformer;
        },
      },
    );

    env.registerInit({
      deps: {
        catalog: catalogProcessingExtensionPoint,
        config: coreServices.rootConfig,
        events: eventsServiceRef,
        logger: coreServices.logger,
        scheduler: coreServices.scheduler,
      },

      async init({ catalog, config, events, logger, scheduler }) {
        const definitions = readDefinitionsFromConfig(config);

        for (const definition of definitions) {
          catalog.addEntityProvider(
            new GithubOrgEntityCleanerProvider({ id: definition.id, logger }),
          );
          catalog.addEntityProvider(
            GithubMultiOrgEntityProvider.fromConfig(config, {
              id: definition.id,
              githubUrl: definition.githubUrl,
              orgs: definition.orgs,
              events,
              schedule: scheduler.createScheduledTaskRunner(
                definition.schedule,
              ),
              logger,
              userTransformer,
              teamTransformer,
              alwaysUseDefaultNamespace:
                definitions.length === 1 && definition.orgs?.length === 1,
              userQueryOptions: definition.userQueryOptions,
              teamQueryOptions: definition.teamQueryOptions,
            }),
          );
        }
      },
    });
  },
});

function readQueryOptionsFromConfig(config?: Config): QueryOptions | undefined {
  if (!config) return undefined;
  return {
    pageSize: config.getOptionalNumber('pageSize'),
    requestDelayMs: config.getOptionalNumber('requestDelayMs'),
  };
}

function readDefinitionsFromConfig(rootConfig: Config): Array<{
  id: string;
  githubUrl: string;
  orgs?: string[];
  schedule: SchedulerServiceTaskScheduleDefinition;
  userQueryOptions?: QueryOptions;
  teamQueryOptions?: QueryOptions;
}> {
  const baseKey = 'catalog.providers.githubOrg';
  const baseConfig = rootConfig.getOptional(baseKey);
  if (!baseConfig) {
    return [];
  }

  const configs = Array.isArray(baseConfig)
    ? rootConfig.getConfigArray(baseKey)
    : [rootConfig.getConfig(baseKey)];

  return configs.map(c => ({
    id: c.getString('id'),
    githubUrl: c.getString('githubUrl'),
    orgs: c.getOptionalStringArray('orgs'),
    schedule: readSchedulerServiceTaskScheduleDefinitionFromConfig(
      c.getConfig('schedule'),
    ),
    userQueryOptions: readQueryOptionsFromConfig(
      c.getOptionalConfig('userQueryOptions'),
    ),
    teamQueryOptions: readQueryOptionsFromConfig(
      c.getOptionalConfig('teamQueryOptions'),
    ),
  }));
}
