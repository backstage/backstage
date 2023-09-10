/*
 * Copyright 2023 The Backstage Authors
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

/**
 * @packageDocumentation
 * A module for the search backend that exports Explore modules.
 */

import {
  coreServices,
  createBackendModule,
} from '@backstage/backend-plugin-api';
import { loggerToWinstonLogger } from '@backstage/backend-common';
import { searchIndexRegistryExtensionPoint } from '@backstage/plugin-search-backend-node/alpha';

import { ToolDocumentCollatorFactory } from '@backstage/plugin-search-backend-module-explore';
import { readTaskScheduleDefinitionFromConfig } from '@backstage/backend-tasks';

/**
 * Search backend module for the Explore index.
 *
 * @alpha
 */
export default createBackendModule({
  moduleId: 'exploreCollator',
  pluginId: 'search',
  register(env) {
    env.registerInit({
      deps: {
        config: coreServices.rootConfig,
        logger: coreServices.logger,
        discovery: coreServices.discovery,
        scheduler: coreServices.scheduler,
        tokenManager: coreServices.tokenManager,
        indexRegistry: searchIndexRegistryExtensionPoint,
      },
      async init({
        config,
        logger,
        discovery,
        scheduler,
        indexRegistry,
        tokenManager,
      }) {
        const defaultSchedule = {
          frequency: { minutes: 10 },
          timeout: { minutes: 15 },
          initialDelay: { seconds: 3 },
        };

        const schedule = config.has('search.collators.explore.schedule')
          ? readTaskScheduleDefinitionFromConfig(
              config.getConfig('search.collators.explore.schedule'),
            )
          : defaultSchedule;

        indexRegistry.addCollator({
          schedule: scheduler.createScheduledTaskRunner(schedule),
          factory: ToolDocumentCollatorFactory.fromConfig(config, {
            discovery,
            logger: loggerToWinstonLogger(logger),
            tokenManager,
          }),
        });
      },
    });
  },
});
