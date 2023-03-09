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
import { TaskScheduleDefinition } from '@backstage/backend-tasks';
import { loggerToWinstonLogger } from '@backstage/backend-common';
import { searchIndexRegistryExtensionPoint } from '@backstage/plugin-search-backend-node/alpha';

import {
  ToolDocumentCollatorFactory,
  ToolDocumentCollatorFactoryOptions,
} from '@backstage/plugin-search-backend-module-explore';

/**
 * @alpha
 * Options for {@link searchModuleExploreCollator}.
 */
export type SearchModuleExploreCollatorOptions = Omit<
  ToolDocumentCollatorFactoryOptions,
  'logger' | 'discovery'
> & {
  schedule?: TaskScheduleDefinition;
};

/**
 * @alpha
 * Search backend module for the Explore index.
 */
export const searchModuleExploreCollator = createBackendModule(
  (options?: SearchModuleExploreCollatorOptions) => ({
    moduleId: 'exploreCollator',
    pluginId: 'search',
    register(env) {
      env.registerInit({
        deps: {
          config: coreServices.config,
          logger: coreServices.logger,
          discovery: coreServices.discovery,
          scheduler: coreServices.scheduler,
          indexRegistry: searchIndexRegistryExtensionPoint,
        },
        async init({ config, logger, discovery, scheduler, indexRegistry }) {
          const defaultSchedule = {
            frequency: { minutes: 10 },
            timeout: { minutes: 15 },
            initialDelay: { seconds: 3 },
          };

          indexRegistry.addCollator({
            schedule: scheduler.createScheduledTaskRunner(
              options?.schedule ?? defaultSchedule,
            ),
            factory: ToolDocumentCollatorFactory.fromConfig(config, {
              ...options,
              discovery,
              logger: loggerToWinstonLogger(logger),
            }),
          });
        },
      });
    },
  }),
);
