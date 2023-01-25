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

import { loggerToWinstonLogger } from '@backstage/backend-common';
import {
  coreServices,
  createServiceFactory,
  createServiceRef,
} from '@backstage/backend-plugin-api';
import { PluginTaskScheduler, TaskScheduler } from './tasks';

/**
 * Deals with the scheduling of distributed tasks, for a given plugin.
 *
 * @public
 */
export const tasksServiceRef = createServiceRef<PluginTaskScheduler>({
  id: 'plugin.tasks.service',
  scope: 'plugin',
  defaultFactory: async service =>
    createServiceFactory({
      service,
      deps: {
        database: coreServices.database,
        logger: coreServices.logger,
        pluginMetadata: coreServices.pluginMetadata,
      },
      factory: ({ database, logger, pluginMetadata }) => {
        return TaskScheduler.forPlugin({
          pluginId: pluginMetadata.getId(),
          databaseManager: database,
          logger: loggerToWinstonLogger(logger).child({
            type: 'taskManager',
          }),
        });
      },
    }),
});
