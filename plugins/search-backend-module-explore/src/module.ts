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
  readSchedulerServiceTaskScheduleDefinitionFromConfig,
} from '@backstage/backend-plugin-api';
import { searchIndexRegistryExtensionPoint } from '@backstage/plugin-search-backend-node/alpha';
import { ToolDocumentCollatorFactory } from './collators/ToolDocumentCollatorFactory';

/**
 * Search backend module for the Explore index.
 *
 * @public
 */
export default createBackendModule({
  pluginId: 'search',
  moduleId: 'explore-collator',
  register(env) {
    env.registerInit({
      deps: {
        config: coreServices.rootConfig,
        logger: coreServices.logger,
        discovery: coreServices.discovery,
        scheduler: coreServices.scheduler,
        auth: coreServices.auth,
        indexRegistry: searchIndexRegistryExtensionPoint,
      },
      async init({
        config,
        logger,
        discovery,
        scheduler,
        auth,
        indexRegistry,
      }) {
        const defaultSchedule = {
          frequency: { minutes: 10 },
          timeout: { minutes: 15 },
          initialDelay: { seconds: 3 },
        };

        const schedule = config.has('search.collators.explore.schedule')
          ? readSchedulerServiceTaskScheduleDefinitionFromConfig(
              config.getConfig('search.collators.explore.schedule'),
            )
          : defaultSchedule;

        indexRegistry.addCollator({
          schedule: scheduler.createScheduledTaskRunner(schedule),
          factory: ToolDocumentCollatorFactory.fromConfig(config, {
            discovery,
            logger,
            auth,
          }),
        });
      },
    });
  },
});
