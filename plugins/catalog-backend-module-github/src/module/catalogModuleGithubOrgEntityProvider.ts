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
  createExtensionPoint,
} from '@backstage/backend-plugin-api';
import {
  readTaskScheduleDefinitionFromConfig,
  TaskScheduleDefinition,
} from '@backstage/backend-tasks';
import { Config } from '@backstage/config';
import {
  GithubMultiOrgEntityProvider,
  TeamTransformer,
  UserTransformer,
} from '@backstage/plugin-catalog-backend-module-github';
import { catalogProcessingExtensionPoint } from '@backstage/plugin-catalog-node/alpha';

/**
 * Interface for {@link githubOrgEntityProviderTransformsExtensionPoint}.
 *
 * @alpha
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
 * Extension point for runtime configuration of {@link catalogModuleGithubOrgEntityProvider}.
 *
 * @alpha
 */
export const githubOrgEntityProviderTransformsExtensionPoint =
  createExtensionPoint<GithubOrgEntityProviderTransformsExtensionPoint>({
    id: 'catalog.githubOrgEntityProvider',
  });

/**
 * Registers the `GithubMultiOrgEntityProvider` with the catalog processing extension point.
 *
 * @alpha
 */
export const catalogModuleGithubOrgEntityProvider = createBackendModule({
  pluginId: 'catalog',
  moduleId: 'githubOrgEntityProvider',
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
        logger: coreServices.logger,
        scheduler: coreServices.scheduler,
      },
      async init({ catalog, config, logger, scheduler }) {
        for (const definition of readDefinitionsFromConfig(config)) {
          catalog.addEntityProvider(
            GithubMultiOrgEntityProvider.fromConfig(config, {
              id: definition.id,
              githubUrl: definition.githubUrl,
              orgs: definition.orgs,
              schedule: scheduler.createScheduledTaskRunner(
                definition.schedule,
              ),
              logger: loggerToWinstonLogger(logger),
              userTransformer,
              teamTransformer,
            }),
          );
        }
      },
    });
  },
});

function readDefinitionsFromConfig(rootConfig: Config): Array<{
  id: string;
  githubUrl: string;
  orgs?: string[];
  schedule: TaskScheduleDefinition;
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
    schedule: readTaskScheduleDefinitionFromConfig(c.getConfig('schedule')),
  }));
}
